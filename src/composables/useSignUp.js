import { ref } from "vue";
import {
  toastNotification,
} from "../components/Notification/index";

import { projectAuth } from "../firebase";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { setDoc, doc } from 'firebase/firestore';
import { db } from "../firebase";

const error = ref(null);
const isPending = ref(false);
const auth = getAuth();

async function signUp(email, password, fullName) {
  error.value = null;
  isPending.value = true;
  try {
    const response = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    if (!response) throw new Error("Lỗi !!!");
    await updateProfile(auth.currentUser, { 
      displayName: fullName,
      photoURL: "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80"
    });

    await setDoc(doc(db, "Users", `${auth.currentUser.uid}`), {
      displayName: fullName, 
      email: email, 
      phoneNumber: "",
      photoURL: "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80", 
      uid: auth.currentUser.uid 
    });
    toastNotification('success', 'Thông báo', 'Đăng ký người dùng thành công');
    return response;
  } catch (err) {
    console.log("err", err);
    error.value = err.message;
    switch (err.code) {
      case "auth/email-already-in-use":
        toastNotification("error", "Có lỗi", "Email đã tồn tại !");
        break;
      default:
        toastNotification("error", "Có lỗi", "Có lỗi vui lòng thử lại!");
    }
  } finally {
    isPending.value = false;
  }
}

export function useSignUp() {
  return {
    error,
    isPending,
    signUp,
  };
}
