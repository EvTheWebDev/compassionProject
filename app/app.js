function changeRoute() {
let hashTag = window.location.hash;
 let pageID = hashTag.replace('#', '');
//   console.log(hashTag + ' ' + pageID);

if (pageID != '') {
$.get(`pages/${pageID}.html`, function (data) {
 console.log('data ' + data);
 $('#app').html(data);
});
} else {
$.get(`pages/home.html`, function (data) {
console.log('data ' + data);
 $('#app').html(data);
});
}
// Bottom of changeRoute
}

function initURLListener() {
$(window).on('hashchange', changeRoute);
changeRoute();
// Bottom of initURLListener
}

function initListeners() {

    // Bottom of initListeners
}

$(document).ready(function () {
initURLListener();
initListeners();
// Bottom of document.ready
});

