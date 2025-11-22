// import { db } from "../firebase.config.js";
// import { auth } from "../firebase.config.js";
import {
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
    measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

import { initializeApp } from "firebase/app"; 
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

if (!firebaseConfig.apiKey) {
    console.error("Firebase Configuration is missing. Check Vercel Environment Variables.");
    throw new Error("Missing Firebase Config");
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); 
export const db = getFirestore(app);

const EVENTS_COLLECTION = "events"; // Your Firebase Collection Name

/**
 * Fetches event data from Firestore, ensuring all required fields are handled.
 * @param {function} callback - Function to execute after data is successfully retrieved.
 */
export async function fetchAndDisplayEvents(callback) {
  const eventsArray = [];
  const eventContainerId = "eventCards";

  // Check if the target DOM element exists before proceeding
  const targetElement = document.getElementById(eventContainerId);
  if (!targetElement) {
    console.error(
      "Target container not found. DOM injection may not be complete."
    );
    return;
  }

  try {
    const querySnapshot = await getDocs(collection(db, EVENTS_COLLECTION));

    querySnapshot.forEach((doc) => {
      const data = doc.data();

      // 🔑 Data Validation Logic (ID is required, at least one other field is required)
      if (data.id && (data.title || data.description || data.image)) {
        // Build event object with data validation and default values
        eventsArray.push({
          id: data.id,
          title: data.title || "Untitled Event",
          description: data.description || "",
          image: data.image || "assets/img/default-event.jpg",
        });
      } else {
        console.warn(
          `Skipping event with ID: ${
            data.id || "N/A"
          } due to missing required fields.`
        );
      }
    });

    // 🔑 Success: Execute the callback function with the data array and the target element
    if (eventsArray.length > 0) {
      callback(eventsArray, targetElement);
    } else {
      targetElement.innerHTML = `<p>No news or events at this time.</p>`;
    }
  } catch (e) {
    console.error("Error fetching documents from Firebase: ", e);
    targetElement.innerHTML = `<p>Error loading events. Please try again later.</p>`;
  }
}

/**
 * Renders the HTML for the event cards. This is the callback function.
 */
export function renderEventCards(events, containerElement) {
  let html = "";

  events.sort((a, b) => a.id - b.id); // Sort by auto-incrementing ID

  events.forEach((event) => {
    // Simple HTML template for an event card
    html += `
            <div class="card" data-event-id="${event.id}">
            <h4 class="title">${event.title}</h4>
            <img src="${event.image}" alt="${event.title}" class="event-image">
            
        `;
    if (event.description !== "") {
      html += `<p>${event.description}</p>`;
    }
    html += `
            </div>
        `;
  });

  // Inject the final HTML array into the DOM
  containerElement.innerHTML = html;
}

//  ------------- ADMIN LOGIN -----------------

async function checkAdminRole(user) {
  const userDocRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(userDocRef);

  if (docSnap.exists() && docSnap.data().role === "admin") {
    // User is logged in AND has the correct role
    window.location.hash = "#admin";
  } else {
    // User is logged in but the role is missing or incorrect
    alert("Access Denied: You do not have permission to view the admin area.");
    auth.signOut(); // Log them out immediately
    window.location.hash = "#login"; // Redirect back to login
  }
}

async function handleFormSubmission(event) {
  // 🔑 Made the function ASYNC
  event.preventDefault();

  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const submitButton = document.querySelector(".btn-submit");

  const email = emailInput.value;
  const password = passwordInput.value;

  console.log("Attempting to login with email and password");

  if (!email || !password) {
    alert("Please enter both email and password.");
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "Logging In...";

  // 🔑 AWAIT the login process directly here:
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    console.log("Authentication successful for user:", user.uid);

    // Success: Proceed to authorization check
    checkAdminRole(user);

    // Note: Button state will be reset once checkAdminRole redirects/fails.
    // We leave the button disabled until the process is complete.
  } catch (error) {
    // Login Failure
    console.error("Login Error:", error.message);
    alert("Login Failed. Please check your credentials.");

    // Reset button state on failure
    submitButton.disabled = false;
    submitButton.textContent = "Login";
  }
}

// 5. Attach the Handler to the Form
document.addEventListener("DOMContentLoaded", () => {
  
});

export function loginListeners() {
const loginForm = document.getElementById("loginForm");
  console.log(loginForm)
  if (loginForm) {
    // Use the submit event listener
    loginForm.addEventListener("submit", handleFormSubmission);
  }
}
