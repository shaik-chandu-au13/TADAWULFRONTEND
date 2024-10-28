// document.addEventListener('DOMContentLoaded', function() {
//     const button = document.getElementById('myButton');
//     button.addEventListener('click', function() {
//         button.classList.add('clicked');
//     });
// });

//     $(document).ready(function () {
//         // Add a click event handler to the scroll-to-top button
//         $("#scroll-to-top").click(function () {
//             // Animate scrolling to the top of the page
//             $("html, body").animate({ scrollTop: 0 }, "slow");
//             return false; // Prevent default behavior of the anchor tag
//         });
//     });
//     document.addEventListener("DOMContentLoaded", function() {
//         const navLinks = document.querySelectorAll(".nav.navbar-nav li a");
    
//         navLinks.forEach(link => {
//             link.addEventListener("click", function() {
//                 // Remove the 'active' class from all links
//                 navLinks.forEach(link => link.classList.remove("active"));
                
//                 // Add the 'active' class to the clicked link
//                 this.classList.add("active");
//             });
//         });
//     });
   
function changeColor(link) {
    const navLinks = document.querySelectorAll(".nav-link");

        navLinks.forEach(navLink => {
            navLink.style.color = "black"; // Reset all links to black
        });

        link.style.color = "red"; // Change the color of the clicked link to red
}

        