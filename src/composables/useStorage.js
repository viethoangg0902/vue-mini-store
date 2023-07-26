import { ref } from "vue";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { useUser } from "../composables/useUser";

const storage = getStorage();
const { getUser } = useUser();
const { user } = getUser();

const useStorage = (name) => {
    const error = ref(null)
    const filePath = ref(null);
    const url = ref(user.value.photoURL);

    async function uploadFile(file) {
        if (!file) return url.value = file;
        filePath.value = `${name}/${user.value.uid}/${file.name}`;
        const fileRef = storageRef(storage, filePath.value);
        try {
            const reponse = await uploadBytes(fileRef, file).then((snapshot) => snapshot)
            url.value = await getDownloadURL(reponse.ref).then((_url) => _url);
            return url.value;
        } catch (err) {
            error.value = err.massage;
        }
    }

    async function onUploadFile(files, urlFoder) {
        let newFiles = [];
        for (const file of files) {
            if (file.blob) {
                const fileRef = storageRef(storage, `${name}/${urlFoder}/${file.blob.name}`);
                const reponse = await uploadBytes(fileRef, file.blob).then((snapshot) => snapshot)
                const url = await getDownloadURL(reponse.ref).then((_url) => _url);
                newFiles = [...newFiles, url]
            } else {
                newFiles = [...newFiles, file]
            }
        }
        return newFiles;
    }

    return { error, filePath, url, uploadFile, onUploadFile}
}



export default useStorage;