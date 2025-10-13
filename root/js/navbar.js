const hamburgerMenu = document.querySelector("#hamburger-menu");
const overlay = document.querySelector("#overlay");

// Get nav items dynamically from the overlay (works with any number of items)
function getNavItems() {
  if (!overlay) return [];
  return Array.from(overlay.querySelectorAll("nav ul li"));
}

// Control Navigation Animation: use generic classes and stagger via inline delay
function navAnimation(direction) {
  const items = getNavItems();
  items.forEach((nav, i) => {
    // clear both classes first
    nav.classList.remove("slide-in", "slide-out");
    // set delay so items animate in sequence
    nav.style.animationDelay = `${i * 0.08}s`;
    if (direction === "in") {
      nav.classList.add("slide-in");
    } else {
      nav.classList.add("slide-out");
    }
  });
}

function toggleNav() {
  if (!hamburgerMenu || !overlay) return;

  // Toggle: Hamburger Open/Close
  hamburgerMenu.classList.toggle("active");

  // Toggle overlay active
  overlay.classList.toggle("overlay-active");

  if (overlay.classList.contains("overlay-active")) {
    // Animate In - Overlay
    overlay.classList.replace("overlay-slide-left", "overlay-slide-right");
    // Animate In - Nav Items
    navAnimation("in");
  } else {
    // Animate Out - Overlay
    overlay.classList.replace("overlay-slide-right", "overlay-slide-left");
    // Animate Out - Nav Items
    navAnimation("out");
  }
}

// Attach events
if (hamburgerMenu) hamburgerMenu.addEventListener("click", toggleNav);
getNavItems().forEach((nav) => {
  nav.addEventListener("click", toggleNav);
});

