// firebase-config.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

import { GoogleAuthProvider } from 'firebase/auth';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
    apiKey: "AIzaSyD1w5Q5sN1rrwOq8lHPtmVg_pqalwYrLEE",
    authDomain: "echo-fe663.firebaseapp.com",
    projectId: "echo-fe663",
    storageBucket: "echo-fe663.appspot.com",
    messagingSenderId: "242213821849",
    appId: "1:242213821849:web:9061001fa288c50249c708",
    measurementId: "G-22D29K0Y6C"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();


// Get a reference to the auth service
export const auth = getAuth(app, provider);
