import { fetchAndDisplayEvents, renderEventCards, loginListeners } from "./firebase.js";
import { auth, db } from './firebase.js'; 


const STATIC_TEST_EVENTS = [
    {
        id: 1,
        title: "Shop For a Cause",
        description: `Sweet Things is teaming up with The Compassion Project Inc. to turn your purchases into kindness in action, helping us provide meals and care packages to those in need this Thanksgiving.`,
        image: "../assets/img/shopWithACauseFlyer.png",
        date: "10/15/2024",
        time: "11:00 AM - 5:00 PM"
    },
];


// MODAL FUNCTIONALITY

const EVENT_DATA_SOURCE = STATIC_TEST_EVENTS; // Or your Firebase array

function initModalFunctionality() {
    const modal = document.getElementById('siteModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const closeBtn = modal.querySelector('.close-btn');
    const eventContainer = document.getElementById('eventContainer'); 

    // ---------------------------------
    // 1. EVENT DELEGATION (Click to OPEN Modal)
    // ---------------------------------
    eventContainer.addEventListener('click', function(e) {
        // Find the closest ancestor that is an event card
        const card = e.target.closest('.card'); 
        console.log(card);
        if (card) {
          console.log("Card clicked:", card);
            // Get the event ID stored in a data attribute (must be added in rendering step!)
            const eventId = card.getAttribute('data-event-id'); 

            console.log("Event ID:", eventId);
            
            if (eventId) {
                const event = EVENT_DATA_SOURCE.find(e => e.id == eventId);
                if (event) {
                    populateModal(event);
                    openModal();
                }
            }
        }
    });

    // ---------------------------------
    // 2. CLOSE LISTENERS
    // ---------------------------------
    // Close via 'X' button
    closeBtn.addEventListener('click', closeModal);

    // Close by clicking outside the modal wrapper
    modalOverlay.addEventListener('click', function(e) {
            closeModal();
    });

    // Close via ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === "Escape" && modal.classList.contains('is-visible')) {
            closeModal();
        }
    });
}

// ---------------------------------
// 3. CORE MODAL FUNCTIONS
// ---------------------------------
function openModal() {
  console.log("Opening modal...");
    document.getElementById('siteModal').classList.add('is-visible');
    document.body.style.overflow = 'hidden'; 
}

function closeModal() {
    document.getElementById('siteModal').classList.remove('is-visible');
    document.body.style.overflow = 'auto'; 
}

function populateModal(event) {
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modalCta = document.getElementById('modal-cta-button');

    modalTitle.textContent = event.title;
    
    modalBody.innerHTML = `
        <img src="${event.image || 'assets/img/default.jpg'}" alt="${event.title}" class="modal-image">
        <p>${event.description || ''}</p>
        <p><strong>Date:</strong> ${event.date || ''}</p>
        <p><strong>Time:</strong> ${event.time || ''}</p>
    `;
}



// Event Injection Script

function testAndInjectEvents() {
    const eventContainerId = 'eventCards';
    const targetElement = document.getElementById("eventCards");

    if (!targetElement) {
        // Log an error if the element isn't found, which helps debug timing
        console.error("Target event container (#eventCards) not found for static injection.");
        return; 
    }
    
    // console.log("SUCCESS: Event container found. Injecting static test cards...");
    
    // Call the rendering function with the static data and the found element
    renderEventCards(STATIC_TEST_EVENTS, targetElement);
}



// Routing
function changeRoute() {
  let hashTag = window.location.hash;
  let pageID = hashTag.replace("#", "");

  if (pageID != "") {
    $.get(`pages/${pageID}.html`, function (data) {
      $("#app").html(data);
      
      if (pageID === 'admin') {
        // Check if a user is currently logged in
        const user = auth.currentUser; 
        
        if (!user) {
            // User is NOT logged in. Redirect to login page.
            window.location.hash = '#login';
            return;
        }
      }
      
    });
  } 
  
  else {
    $.get(`pages/home.html`, function (data) {
      $("#app").html(data);
      
      testAndInjectEvents();
      initModalFunctionality()
    });
  }

  setTimeout(() => {
    window.scrollTo(0, 0); 
  }, 100);
  // Bottom of changeRoute
}

function initURLListener() {
  $(window).on("hashchange", changeRoute);
  changeRoute();
  // Bottom of initURLListener
}

function initListeners() {
  let hamburgerIcon = document.getElementById("hamburgerIcon");
  let rippleEffect = document.getElementById("mobileOverlay");
  let mobileNav = document.getElementById("mobileNav");

  hamburgerIcon.addEventListener("click", function () {
    if (mobileNav.style.display === "block") {
      mobileNav.style.display = "none";
      rippleEffect.style.display = "none";
    } else {
      mobileNav.style.display = "block";
      rippleEffect.style.display = "block";
    }
  });

  rippleEffect.addEventListener("click", function () {
    mobileNav.style.display = "none";
    rippleEffect.style.display = "none";
  });

// Hide mobileNav and rippleEffect when any mobileNav link is clicked
mobileNav.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function () {
        mobileNav.style.display = "none";
        rippleEffect.style.display = "none";
    });
});

  // Bottom of initListeners
}

$(document).ready(function () {
  initURLListener();
  initListeners();
  // Bottom of document.ready
});
