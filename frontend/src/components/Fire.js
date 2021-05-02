import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "APIKEY",
    authDomain: "AUTHDOMAIN",
    databaseURL: "DBURL",
    projectId: "PROJECTID",
    storageBucket: "STORAGEBUCKET",
    messagingSenderId: "MID",
    appId: "APPID",
    measurementId: "MEASUREMENTID"
  };

  const fire= firebase.initializeApp(firebaseConfig);

  export default fire;
