import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyAWy-eWulGRphDQJn8r8sGXrIqUP6snLMI",
  authDomain: "vue-project-67d3d.firebaseapp.com",
  projectId: "vue-project-67d3d",
  storageBucket: "vue-project-67d3d.appspot.com",
  messagingSenderId: "300000228101",
  appId: "1:300000228101:web:5375350a663df944b4fd6c"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const projectAuth = getAuth(app);
export const projectFirestore = getFirestore();

export default app;
// firebase.initializeApp(firebaseConfig);
// const projectAuth = firebase.auth();
// const projectFirestore = firebase.firestore();
// const timestamp = firebase.firestore.FieldValue.serverTimestamp;
// export { projectAuth, projectFirestore, timestamp }

