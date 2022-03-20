// importing the firebase
import firebase from 'firebase';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDOGT3hh83xTp-sRjJxpNhSiJcxo9u1DAA",
    authDomain: "instagrampage-e6333.firebaseapp.com",
    projectId: "instagrampage-e6333",
    storageBucket: "instagrampage-e6333.appspot.com",
    messagingSenderId: "868490867225",
    appId: "1:868490867225:web:8d3879ab9a66402ef93088",
    measurementId: "G-BGX7QYGRL2"  
})

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {db, auth, storage};
