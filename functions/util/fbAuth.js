const { admin, db } = require('./admin');


//getting the access token and checking whether it was firebase authenticated
module.exports = (req, res, next) => {
    let idToken;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer ')) {
        idToken = req.headers.authorization.split('Bearer ')[1];
    }
    else {
        console.error('No token found');
        return res.status(403).json({ error: 'Unauthoized' });
    }

    admin.auth().verifyIdToken(idToken)
        .then(decodedToken => {
            req.user = decodedToken;
            return db.collection('users')
                .where('userId', '==', req.user.uid)
                .limit(1)
                .get();
        })
        .then(data => {
            req.user.email = data.docs[0].data().email;
            req.user.imageUrl = data.docs[0].data().imageUrl;
            return next();
        })
        .catch(err => {
            console.error('Error while verifying token ', err);
            return res.status(403).json(err);
        })
}