import firebase from 'firebase';

// eslint-disable-next-line
const firebaseApp = firebase.initializeApp({
    apiKey: 'AIzaSyA6MsmnLtqT4b11r-j15wwreRypO3AodcA',
    authDomain: 'gamebrary-8c736.firebaseapp.com',
    databaseURL: 'https://gamebrary-8c736.firebaseio.com',
    projectId: 'gamebrary-8c736',
    storageBucket: 'gamebrary-8c736.appspot.com',
    messagingSenderId: '324529217902',
});

// eslint-disable-next-line
export const GoogleAuth = new firebase.auth.GoogleAuthProvider();
