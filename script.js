

const today = new Date();

const dateString = today.toISOString().split('T')[0];

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const dayName = dayNames[today.getDay()];

const todayDateID = document.getElementById("today-date")
const todayID = document.getElementById("today")

todayDateID.innerHTML = dateString
todayID.innerHTML = dayName


window.onload = function() {
  const userDocId = localStorage.getItem("userDocId");
  
  if (userDocId) {
    console.log(userDocId);
    window.location.href = "logged.html";
  }
  else{
    console.log("not found")
  }
};
