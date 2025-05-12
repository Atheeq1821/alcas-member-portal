const today = new Date();

const dateString = today.toISOString().split('T')[0];

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const dayName = dayNames[today.getDay()];

const todayDateID = document.getElementById("today-date")
const todayID = document.getElementById("today")

todayDateID.innerHTML = dateString
todayID.innerHTML = dayName


import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, query, where, getDocs, addDoc ,serverTimestamp , updateDoc} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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
const logoutBtn = document.getElementById("logoutBtn")
const userName = document.getElementById("username")
const userDocId = localStorage.getItem("userDocId");


window.onload =async function() {
    
    if (!userDocId) {
        console.error("No userdocument_id found in localStorage");
        window.location.href = "index.html"
        return;
    }
    const q = query(collection(db, "LoggedIn"), where("userDocId", "==", userDocId));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
        console.log(userDocId)
        console.error("No matching document found in loggedIN collection");
        return;
    }
    const docData = querySnapshot.docs[0].data();
    const loggedInTime = docData.loggedTime?.toDate();
    const currUser = docData.Name
    userName.innerHTML = currUser
    const timer = document.getElementById("worked")
    if (loggedInTime) {
        const now = new Date();
        const diffMs = now - loggedInTime;

        const diffMins = Math.floor(diffMs / 60000);
        const hours = Math.floor(diffMins / 60);
        const minutes = diffMins % 60;
        timer.innerHTML = `${hours}h : ${minutes}m`
        console.log(`Logged in for: ${hours} hour(s) and ${minutes} minute(s)`);
    }
    else {
        console.error("loggedin_time is missing or invalid");
    }
}


const logoutM = document.getElementById("logoutMessage")
const status = document.getElementById("status")
logoutBtn.addEventListener("click", async() => {
    if(logoutM.value.trim() === ""){
        status.innerHTML ="Logout message should not be empty"
        return;
    }
    if (!userDocId) {
        console.error("No userdocument_id found in localStorage");
        return;
    }
    const q = query(collection(db, "LoggedIn"), where("userDocId", "==", userDocId));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
        console.log(userDocId)
        console.error("No matching document found in loggedIN collection");
        return;
    }
    
    const docRef = querySnapshot.docs[0].ref;
    await updateDoc(docRef, {
    logoutTime: serverTimestamp(),
    logoutMessage: logoutM.value.trim()
  });
  const updatedSnapshot = await getDocs(q);
  const docData = updatedSnapshot.docs[0].data();
  const username = docData.Name; 
  const logdate = docData.loggedTime.toDate().toISOString().split('T')[0];
  const logtime = docData.loggedTime.toDate().toLocaleTimeString('en-IN', {
    hour12: false,
    timeZone: 'Asia/Kolkata'
});
const outtime = docData.logoutTime.toDate().toLocaleTimeString('en-IN', {
    hour12: false,
    timeZone: 'Asia/Kolkata'
});
  const totalWorked = calculateWorkedTime(docData.loggedTime, docData.logoutTime);
  const formUrl = "https://docs.google.com/forms/d/e/1FAIpQLSdSZYEsBM9Kx3UXpO4jIY6eXytWGagXZc8_DLMGElrtflk7_w/formResponse";
    const formData = new FormData();
    formData.append("entry.1206080067", logdate);     
    formData.append("entry.1393975586",  username); 
    formData.append("entry.74689058", logtime);  
    formData.append("entry.1724462785", docData.loginMessage);  
    formData.append("entry.1508550651", outtime); 
    formData.append("entry.1668298442", docData.logoutMessage);    
    formData.append("entry.2131986135", totalWorked); 
    fetch(formUrl, {
    method: "POST",
    mode: "no-cors",
    body: formData
    }).then(() => {
        console.log("Logged to Google Sheet via Form");
    }).catch(console.error);
    
    localStorage.removeItem("userDocId");
    window.location.href = "index.html"
})



function calculateWorkedTime(loggedinTime, logoutTime) {
  const diffMs = logoutTime.toDate() - loggedinTime.toDate();
  const totalMinutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours} hours ${minutes} minutes`;
}
