import firebase from 'firebase/app';
import 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyD07qokHHU042NcvUffEPaEm5Af8q8bDCc",
  authDomain: "man-city-8f7ff.firebaseapp.com",
  databaseURL: "https://man-city-8f7ff.firebaseio.com",
  projectId: "man-city-8f7ff",
  storageBucket: "man-city-8f7ff.appspot.com",
  messagingSenderId: "15538862359",
  appId: "1:15538862359:web:234dfd0079cedfcc3b5f52",
  measurementId: "G-6GF1S9Y3R9"
};

firebase.initializeApp(firebaseConfig);

const firebaseDB = firebase.database();
const firebaseMatches = firebaseDB.ref('matches');
const firebasePlayers = firebaseDB.ref('players');
const firebasePromotions = firebaseDB.ref('promotions');
const firebaseTeams = firebaseDB.ref('teams');

export {
  firebase,
  firebaseDB,
  firebaseMatches,
  firebasePlayers,
  firebasePromotions,
  firebaseTeams
}