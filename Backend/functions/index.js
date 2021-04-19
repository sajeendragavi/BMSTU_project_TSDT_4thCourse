const functions = require('firebase-functions');

const app = require('express')();


//Authentication middleware
const FBAuth = require('./util/fbAuth');


const {
    getAllCourses,
    addCourses,
    likeCourses,
    getLikedCourses,
    unLikeCourses
} = require('./handlers/courses');

const {
    signup,
    login,
    uploadImage,
    addUserDetails,
    getAuthenticatedUser,
    sendEmail,
    signInGoogle,
    signUpGoogle,
    signInFacebook,
    signUpFacebook
} = require('./handlers/users');

const {
    likeJobs,
    unLikeJobs
} = require('./handlers/jobs');



//courses routes
app.get('/courses', getAllCourses);   //Getting course data from database 
app.post('/course', addCourses);   //Adding course data to database 

app.post('/course/like',FBAuth, likeCourses);   //like a course 
app.post('/course/unlike',FBAuth, unLikeCourses);   //unlike a course 
app.get('/courses/like', getLikedCourses);   //Getting liked course data from database 


//job routes
app.post('/job/like', FBAuth, likeJobs);   //like a job 
app.post('/job/unlike', FBAuth, unLikeJobs);   //unlike a job 



//users routes
app.post('/signup', signup);   //sign up
app.post('/login', login);     //login
app.post('/signUpGoogle', signUpGoogle); //sign up with Google
app.post('/signInGoogle', signInGoogle); //sign in with Google
app.post('/signUpFacebook',signUpFacebook); //sign up with Facebook
app.post('/signInFacebook',signInFacebook); //sign in with Facebook


app.post('/user/image', FBAuth, uploadImage)   //upload user image
app.post('/user', FBAuth, addUserDetails)   //add user info to the profile
app.get('/user', FBAuth, getAuthenticatedUser)   //get verified user info to add to the profile
app.post('/user/emailus', FBAuth, sendEmail)   //get user feedback through emails





//https://baseurl.com/api/
exports.api = functions.https.onRequest(app);


