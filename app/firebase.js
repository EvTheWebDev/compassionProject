// NOTE: Assume you have initialized and configured your Firebase app elsewhere (e.g., firebase-config.js)
import { db } from '../firebase.config.js'; 
import { collection, getDocs } from "firebase/firestore";

const EVENTS_COLLECTION = "events"; // Your Firebase Collection Name

/**
 * Fetches event data from Firestore, ensuring all required fields are handled.
 * @param {function} callback - Function to execute after data is successfully retrieved.
 */
export async function fetchAndDisplayEvents(callback) {
    const eventsArray = [];
    const eventContainerId = 'event-cards-container';
    
    // Check if the target DOM element exists before proceeding
    const targetElement = document.getElementById(eventContainerId);
    if (!targetElement) {
        console.error("Target container not found. DOM injection may not be complete.");
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
                    title: data.title || 'Untitled Event',
                    description: data.description || '',
                    image: data.image || 'assets/img/default-event.jpg'
                 });
            } else {
                console.warn(`Skipping event with ID: ${data.id || 'N/A'} due to missing required fields.`);
            }
        });
        
        // 🔑 Success: Execute the callback function with the data array and the target element
        if (eventsArray.length > 0) {
            callback(eventsArray, targetElement);
        } else {
             targetElement.innerHTML = `<p>No upcoming events at this time.</p>`;
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
    let html = '';
    
    events.sort((a, b) => a.id - b.id); // Sort by auto-incrementing ID

    events.forEach(event => {
        // Simple HTML template for an event card
        html += `
            <div class="event-card">
                <img src="${event.image}" alt="${event.title}" class="event-image">
                <h4>${event.title}</h4>
                <p>${event.description}</p>
                <a href="#events/${event.id}" class="btn btn-small">Details</a>
            </div>
        `;
    });
    
    // Inject the final HTML array into the DOM
    containerElement.innerHTML = html;
}