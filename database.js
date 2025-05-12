import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, query, where, getDocs, addDoc ,serverTimestamp} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDJhK_sxsZXWiInZsgkKEXO_g_hXupyL6w",
  authDomain: "alcas-team.firebaseapp.com",
  projectId: "alcas-team",
  storageBucket: "alcas-team.firebasestorage.app",
  messagingSenderId: "624815962940",
  appId: "1:624815962940:web:6cbd580ceb223751cbfc39",
  measurementId: "G-2ZH3GYXL95"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const loginbtn = document.getElementById("loginBtn")




async function addLogin(userId,message) {
    const q = query(collection(db, "Alcas-team"), where("userID", "==", userId));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {

        document.getElementById("status").innerText = "❌ User ID not found.";
        return;
    }
      let name = null;
      let documentID = null;
      querySnapshot.forEach((doc) => {
        name = doc.data().Name;
        documentID = doc.id;
      });


      if (name){
        await addDoc(collection(db, "LoggedIn"), {
            Name: name,
            userID: userId,
            loginMessage: message,
            loggedTime: serverTimestamp(),
            userDocId:documentID
        });
        localStorage.setItem("userDocId", documentID);
        window.location.href = "logged.html";
      }
}



loginbtn.addEventListener("click", () => {
    const userId = document.getElementById("userId").value;
    const message = document.getElementById("loginMessage").value;
    if(userId == ""){
        document.getElementById("status").innerText = "User ID is empty";
        return;
    }
    if(message == ""){
        document.getElementById("status").innerText = "Login Reason is Empty";
        return;
    }
    const loginTime = new Date().toISOString();
    // loginWithUserId(userId);
    addLogin(userId,message);
    
})



