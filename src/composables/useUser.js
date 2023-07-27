import { ref } from "vue";
import { projectAuth } from "../firebase";
import app from "../firebase";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const user = ref(projectAuth.currentUser);
let image = ref(null);
let uidData = ref(null);
let uidUser = ref(null);
let collapsedWidth = [
  {
    collapsed: false, 
    width: 210
  }
]
let language = "vi";

projectAuth.onAuthStateChanged(function (_user) {
  // console.log('+_user', user)
  if (_user) {
    user.value = _user;
    getData(_user.uid);
    uidData = "Users/" + _user.uid + "/";
    uidUser = _user.uid;

    if(!window.localStorage.getItem('collapsed')) {
      window.localStorage.setItem('collapsed', JSON.stringify(collapsedWidth))
    }
    
    if(!window.localStorage.getItem('locale')) {
      window.localStorage.setItem('locale', language)
    }
  }
});

const db = getFirestore(app);
const q = collection(db, "Users");
async function getData(uid) {
  const data = await getDocs(q);
  const tasks = data.docs.find((doc) => doc.id == uid)
  if(tasks._document.data.value.mapValue.fields.photoURL) {
    image = tasks._document.data.value.mapValue.fields.photoURL.stringValue;
  } else {
    image = tasks._document.data.value.mapValue.fields.userDB.mapValue.fields.photoURL.stringValue
  }
  window.localStorage.setItem('imageAvt', image.split('?')[0])
}

function getUser() {
  return { user, image, uidData, uidUser };
}

export function useUser() {
  return {
    getUser,
  };
}


