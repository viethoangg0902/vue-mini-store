import { ref } from "vue";
import {
  toastNotification,
} from "../components/Notification/index.js";

import { projectAuth } from "../firebase";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const error = ref(null);
const isPending = ref(false);
const auth = getAuth();

async function signIn(email, password) {
  error.value = null;
  isPending.value = true;
  try {
    const response = await signInWithEmailAndPassword(auth, email, password);

    toastNotification('success', 'Thông báo', 'Đăng nhập người dùng thành công');

    return response;
  } catch (err) {
    console.log("err", err.code);
    error.value = err.message;
    switch (err.code) {
      case "auth/user-not-found":
        toastNotification(
          "error",
          "Không tìm thấy email",
          "Email có vẻ như sai hoặc chưa đăng ký, vui lòng thử lại !"
        );
        break;
      case "auth/wrong-password":
        toastNotification(
          "error",
          "Sai mật khẩu",
          "Mật khẩu của bạn chưa đúng, vui lòng thử lại"
        );
        break;
      default:
        toastNotification(
          "error",
          "Email hoặc mật khẩu không đúng",
          "Email hoặc mật khẩu của bạn chưa đúng, vui lòng thử lại"
        );
    }
  } finally {
    isPending.value = false;
  }
}

export function useSignIn() {
  return {
    error,
    isPending,
    signIn,
  };
}
