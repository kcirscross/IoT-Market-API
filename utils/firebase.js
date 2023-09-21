// Import the functions you need from the SDKs you need
import admin from 'firebase-admin';
const serviceAccount = JSON.parse(process.env.serviceAccount);
// const firebaseConfig = {
//   apiKey: 'AIzaSyBefMdiNUpDMsCuNpKFZT82noo0Tfl3ge4',
//   authDomain: 'iotmarket-10501.firebaseapp.com',
//   projectId: 'iotmarket-10501',
//   storageBucket: 'iotmarket-10501.appspot.com',
//   messagingSenderId: '550636790404',
//   appId: '1:550636790404:web:820c966e5f3085df5e98d1',
//   measurementId: 'G-JQR6GDQHSE',
// };
// Initialize Firebase
const firebaseAdmin = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
export default firebaseAdmin;
