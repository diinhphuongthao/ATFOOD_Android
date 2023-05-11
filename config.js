import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD7xUH40Hi6akpra5TatPqPqNhdCZ9j5Qc",
  authDomain: "fooddelivery-844c4.firebaseapp.com",
  projectId: "fooddelivery-844c4",
  storageBucket: "fooddelivery-844c4.appspot.com",
  messagingSenderId: "500642089956",
  appId: "1:500642089956:web:e661510dd5d69ad2de55f1",
  measurementId: "G-HLWG164XL1"
};
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();
export { firebase };
export { firebaseConfig };
export { auth }