import '../css/styles.css';

import $ from "jquery";

import { fetchAndDisplayEvents, renderEventCards } from "./firebase.js";

const STATIC_TEST_EVENTS = [
    {
        id: 1,
        title: "Winter Coat Drive",
        description: "Collecting warm coats and blankets for neighbors experiencing cold weather hardship.",
        image: "assets/img/event-coats.jpg"
    },
    {
        id: 2,
        title: "Annual Gala Fundraiser",
        description: "Our biggest fundraising event of the year, featuring dinner, auction, and inspiring speeches.",
        image: "assets/img/event-gala.jpg"
    },
    {
        id: 3,
        title: "Community Cleanup Day",
        description: "Helping to beautify local parks and community spaces in Central Indiana.",
        image: "assets/img/event-cleanup.jpg"
    },
    {
        // Minimal data test case (Should still render)
        id: 4,
        title: "Board Meeting (Private)" 
    }
];

function testAndInjectEvents() {
    const eventContainerId = 'event-cards-container';
    const targetElement = document.getElementById(eventContainerId);

    if (!targetElement) {
        // Log an error if the element isn't found, which helps debug timing
        console.error("Target event container (#event-cards-container) not found for static injection.");
        return; 
    }
    
    console.log("SUCCESS: Event container found. Injecting static test cards...");
    
    // Call the rendering function with the static data and the found element
    renderEventCards(STATIC_TEST_EVENTS, targetElement);
}

function changeRoute() {
  let hashTag = window.location.hash;
  let pageID = hashTag.replace("#", "");
  //   console.log(hashTag + ' ' + pageID);

  if (pageID != "") {
    $.get(`pages/${pageID}.html`, function (data) {
      // console.log("data " + data);
      $("#app").html(data);
    });
  } else {
    $.get(`pages/home.html`, function (data) {
      // console.log('data ' + data);
      $("#app").html(data);
    });
  }

  if (pageID === 'home' || pageID === '') {
    // fetchAndDisplayEvents(renderEventCards);
    testAndInjectEvents();

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
