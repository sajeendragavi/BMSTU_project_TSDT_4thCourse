const { admin, db } = require('../util/admin');

const config = require('../util/config');

const { uuid } = require("uuidv4");

const firebase = require('firebase');
firebase.initializeApp(config);

//checking for empty input fields
const isEmpty = (str) => {
    if (str.trim() === '') return true
    else return false;
}

const { validateSignupData, validateLoginData } = require('../util/validators');

//user signup
exports.signup = (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
    };

    const { valid, errors } = validateSignupData(newUser);

    if (!valid) return res.status(400).json(errors);

    const noImg = 'blank-img.png'

    let token, userId;
    db.doc(`/users/${newUser.email}`).get()
        .then(doc => {
            if (doc.exists) {
                return res.status(400).json({ email: 'this email is already taken' })
            }
            else {
                return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password);
            }
        })
        .then((data) => {
            userId = data.user.uid;
            return data.user.getIdToken()
        })
        .then((idToken) => {
            token = idToken;
            const userCredentials = {
                email: newUser.email,
                createdAt: new Date().toISOString(),
                imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
                userId,
                name:'',
                phoneNumber:9677885757,
                bio:'',
                location:''
            };

            db.doc(`/users/${newUser.email}`).set(userCredentials);
        })
        .then(() => {
            res.status(201).json({ token });

        })
        .catch(err => {
            console.error(err);
            if (err.code === 'auth/email-already-in-use') {
                return res.status(400).json({ email: 'Email is already in use!' })
            }
            else {
                return res.status(500).json({ general: 'Something went wrong, please try again' });
            }
        })
}

//user login
exports.login = (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password,
    };

    const { valid, errors } = validateLoginData(user);

    if (!valid) return res.status(400).json(errors);

    firebase
        .auth()
        .signInWithEmailAndPassword(user.email, user.password)
        .then(data => {
            return data.user.getIdToken();
        })
        .then(token => {
            return res.json({ token });
        })
        .catch(err => {
            console.error(err);
            return res.status(403)
                .json({ general: 'Wrong password, please try again!' })

        })
};

//Add user details
exports.addUserDetails = (req, res) => {

    let userDetails = {};

    userDetails.bio = req.body.bio;
    userDetails.location = req.body.location;
    userDetails.name = req.body.name;
    userDetails.phoneNumber = req.body.phoneNumber;


    db.doc(`/users/${req.user.email}`).update(userDetails)
        .then(() => {
            return res.json({ message: 'Details added successfully' });
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        })
};

//get user profile info
exports.getAuthenticatedUser = (req, res) => {

    var favJob = db.collection('favJobs').where('userEmail', '==', req.user.email)

    let userData = {};
    db.doc(`/users/${req.user.email}`)
        .get()
        .then(doc => {
            if (doc.exists) {
                userData.credentials = doc.data();

                userData.favJobs = [];
                favJob
                .get()
                .then((inf)=>{
                    inf.forEach(doc => {
                        userData.favJobs.push(doc.data());
                    });
                });
                
                return db
                    .collection('favorites')
                    .where('userEmail', '==', req.user.email)
                    .get();
            }
        })
        .then(data => {
            userData.favorites = [];
            data.forEach(doc => {
                userData.favorites.push(doc.data());
            });
            return res.json(userData);
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};


//Upload user profile pic 
exports.uploadImage = (req, res) => {
    const BusBoy = require("busboy");
  const path = require("path");
  const os = require("os");
  const fs = require("fs");

  const busboy = new BusBoy({ headers: req.headers });

  let imageToBeUploaded = {};
  let imageFileName;
  // String for image token
  let generatedToken = uuid();

  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    console.log(fieldname, file, filename, encoding, mimetype);
    if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
      return res.status(400).json({ error: "Wrong file type submitted" });
    }
    // my.image.png => ['my', 'image', 'png']
    const imageExtension = filename.split(".")[filename.split(".").length - 1];
    // 32756238461724837.png
    imageFileName = `${Math.round(
      Math.random() * 1000000000000
    ).toString()}.${imageExtension}`;
    const filepath = path.join(os.tmpdir(), imageFileName);
    imageToBeUploaded = { filepath, mimetype };
    file.pipe(fs.createWriteStream(filepath));
  });
  busboy.on("finish", () => {
    admin
      .storage()
      .bucket()
      .upload(imageToBeUploaded.filepath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageToBeUploaded.mimetype,
            //Generate token to be appended to imageUrl
            firebaseStorageDownloadTokens: generatedToken,
          },
        },
      })
      .then(() => {
        // Append token to url
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media&token=${generatedToken}`;
        return db.doc(`/users/${req.user.email}`).update({ imageUrl });
      })
      .then(() => {
        return res.json({ message: "image uploaded successfully" });
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: "something went wrong" });
      });
  });
  busboy.end(req.rawBody);
};



//get user suggestions through emails courses 
exports.sendEmail = (req, res) => {
    const emailUs = {
        message: req.body.message,
        createdAt: new Date().toISOString(),
        name: req.body.name,
        userEmail: req.body.userEmail,
    };
    db
        .collection('emails')
        .add(emailUs)
        .then((doc) => {
            res.json({ message: `email ${doc.id} sent successfully` });
        })
        .catch((err) => {
            res.status(500).json({ error: 'something went wrong' });
            console.error(err);
        });

}


//user signup with Google
exports.signUpGoogle = (req, res) => {

    let token, userId;

    const newUser = {
        email: req.body.email,
        photo: req.body.photoURL,
        id: req.body.userId,
        userToken:req.body.token
    };


    db.doc(`/users/${newUser.email}`).get()
        .then(doc => {
            if (doc.exists) {
                return res.status(400).json({ email: 'this email is already taken' })
            }
            else {
                return newUser;
            }
        })
        .then((data) => {
            userId = data.id;
            return data.userToken;
        })
        .then((idToken) => {
            token = idToken;
            const userCredentials = {
                email: newUser.email,
                createdAt: new Date().toISOString(),
                imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${newUser.photo}?alt=media`,
                userId
            };

            db.doc(`/users/${newUser.email}`).set(userCredentials);
        })
        .then(() => {
            res.status(201).json({ token });

        })

};

//user signIn with Google 
exports.signInGoogle = (req, res) => {

    const user = {
        email: req.body.email,
        id: req.body.userId,
        userToken:req.body.token
    };

    db.doc(`/users/${user.email}`).get()
        .then(doc => {
            if (!doc.exists) {
                return res.status(400).json({ email: 'You are not registered' })
            }
            else {
                return user.userToken;
            }
        })
        .then(token => {
            return res.json({ token });
        })
        .catch(err => {
            console.error(err);
            return res.status(403)
                .json({ general: 'Something went wrong, please try again!' })

        })

};

//user signup with Facebook
exports.signUpFacebook = (req, res) => {

    let token, userId;

    const newUser = {
        email: req.body.email,
        photo: req.body.photoURL,
        id: req.body.userId,
        userToken:req.body.token
    };


    db.doc(`/users/${newUser.email}`).get()
        .then(doc => {
            if (doc.exists) {
                return res.status(400).json({ email: 'this email is already taken' })
            }
            else {
                return newUser;
            }
        })
        .then((data) => {
            userId = data.id;
            return data.userToken;
        })
        .then((idToken) => {
            token = idToken;
            const userCredentials = {
                email: newUser.email,
                createdAt: new Date().toISOString(),
                imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${newUser.photo}?alt=media`,
                userId
            };

            db.doc(`/users/${newUser.email}`).set(userCredentials);
        })
        .then(() => {
            res.status(201).json({ token });

        })

};

//user signIn with Facebook 
exports.signInFacebook = (req, res) => {

    const user = {
        email: req.body.email,
        id: req.body.userId,
        userToken:req.body.token
    };

    db.doc(`/users/${user.email}`).get()
        .then(doc => {
            if (!doc.exists) {
                return res.status(400).json({ email: 'You are not registered' })
            }
            else {
                return user.userToken;
            }
        })
        .then(token => {
            return res.json({ token });
        })
        .catch(err => {
            console.error(err);
            return res.status(403)
                .json({ general: 'Something went wrong, please try again!' })

        })

};
