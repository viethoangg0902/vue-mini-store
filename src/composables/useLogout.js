import { ref } from "vue";
import { getAuth, signOut } from "firebase/auth";

const error = ref(null);
const auth = getAuth();

async function logOut() {
  error.value = null;
  try {
    const response = await signOut(auth);
    return response;
  } catch (err) {
    console.log("err", err.code);
    error.value = err.message;
  } 
}

export function useLogout() {
  return {
    error,
    logOut,
  };
}
