import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, onAuthStateChanged ,signOut } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";


const firebaseConfig = {
    apiKey: "AIzaSyCZMuQBnw-q4OF1BGwPcTZ2FCsla3UFZ_4",
    authDomain: "e-studenthub.firebaseapp.com",
    projectId: "e-studenthub",
    storageBucket: "e-studenthub.firebasestorage.app",
    messagingSenderId: "166779772457",
    appId: "1:166779772457:web:4bc3c3b88a84fde2390638"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

//get user detail slots



onAuthStateChanged(auth, (user) => {
    if (user) {
        //get user details
        const uid = user.uid;

        const email = document.getElementById('userEmail');
        const username = document.getElementById('userName');
        const profile = document.getElementById('profileImage');
        const time = document.getElementById('lastSeen');
        const pointsValue = document.getElementById('pointsValue');
        //append user details
        email.innerText = user.email;
        username.innerText = user.displayName;
        profile.src = "https://lh3.googleusercontent.com/a/ACg8ocLKnJjfskBaCFPsLm8YN2vuXzWCE8iyF0WiKA5XoAqC2w=s96-c"
        console.log(user)

        // Example: Fetch user points from your database (this is a placeholder)
        const userPoints = 100; // Replace with actual points from your database
        pointsValue.innerText = userPoints;

    } else {
        alert("logged out...")
        window.location.href = "index.html"
    }
});

const logout = document.getElementById("logout");
logout.addEventListener("click" , function(){
    signOut(auth).then(() => {
       alert("logging out...");
       window.location.href = "index.html"
      }).catch((error) => {
        // An error happened.
      });
})