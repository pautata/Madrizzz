// components/FirebaseConfig.js
import { initializeApp }    from "firebase/app";
import { getAuth }          from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const FirebaseConfig = {
  apiKey:            "AIzaSyDYF27EcO-xNC5O9EVKQie6sujToLBiauo",
  authDomain:        "madrizzz.firebaseapp.com",
  projectId:         "madrizzz",
  storageBucket:     "madrizzz.appspot.com",
  messagingSenderId: "938450749179",
  appId:             "1:938450749179:web:573c7c34781eee2507d25e"
};

const app  = initializeApp(FirebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);