

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
