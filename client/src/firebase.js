import * as firebase from "firebase/app";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCd_QwHSMhambSSkzEpRBnpXNUynwISYYU",
  authDomain: "dev-set-ups.firebaseapp.com",
  databaseURL: "https://dev-set-ups.firebaseio.com",
  projectId: "dev-set-ups",
  storageBucket: "dev-set-ups.appspot.com",
  messagingSenderId: "78031248228",
  appId: "1:78031248228:web:19a54d46dad61f37dd3871",
  measurementId: "G-858XJR8776",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

export { storage };
