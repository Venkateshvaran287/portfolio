/* =========================================================================
   V. VENKATESH VARAN — PORTFOLIO SCRIPT
   Handles: loader, typing animation, scroll progress, cursor glow,
   sticky nav + active link highlighting, mobile menu, scroll reveal,
   animated counters & skill bars, back-to-top.
   ========================================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------------------------------------------------------------------
     1. LOADING SCREEN
     Hide once the page has finished loading (with a small minimum delay
     so the animation is actually perceivable, not just a flash).
  --------------------------------------------------------------------- */
  const loader = document.getElementById("loader");
  window.addEventListener("load", () => {
    setTimeout(() => loader.classList.add("hidden"), 500);
  });

  /* ---------------------------------------------------------------------
     2. TYPING ANIMATION (Hero role rotator)
  --------------------------------------------------------------------- */
  const roles = [
    "Aspiring Python Developer",
    "Web Developer",
    "AI & Machine Learning Enthusiast",
    "Data Analyst"
  ];
  const typingEl = document.getElementById("typingText");
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeLoop() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      charIndex--;
    } else {
      charIndex++;
    }

    typingEl.textContent = currentRole.substring(0, charIndex);

    let speed = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === currentRole.length) {
      speed = 1800; // pause at full word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      speed = 300; // pause before typing next word
    }

    setTimeout(typeLoop, speed);
  }
  typeLoop();

  /* ---------------------------------------------------------------------
     3. SCROLL PROGRESS BAR
  --------------------------------------------------------------------- */
  const scrollProgress = document.getElementById("scrollProgress");

  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = progress + "%";
  }

  /* ---------------------------------------------------------------------
     4. CURSOR GLOW (desktop / fine-pointer devices only)
  --------------------------------------------------------------------- */
  const cursorGlow = document.getElementById("cursorGlow");
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.addEventListener("mousemove", (e) => {
      cursorGlow.style.left = e.clientX + "px";
      cursorGlow.style.top = e.clientY + "px";
    });
  }

  /* ---------------------------------------------------------------------
     5. STICKY NAVBAR + ACTIVE LINK HIGHLIGHTING
  --------------------------------------------------------------------- */
  const navbar = document.getElementById("navbar");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section[id]");
  const backToTop = document.getElementById("backToTop");

  function onScroll() {
    updateScrollProgress();

    // Navbar background once scrolled
    navbar.classList.toggle("scrolled", window.scrollY > 40);

    // Back-to-top button visibility
    backToTop.classList.toggle("visible", window.scrollY > 500);

    // Determine which section is currently in view
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle("active", link.dataset.section === current);
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll(); // run once on load

  /* ---------------------------------------------------------------------
     6. MOBILE NAV TOGGLE
  --------------------------------------------------------------------- */
  const navToggle = document.getElementById("navToggle");
  const navLinksList = document.getElementById("navLinks");

  navToggle.addEventListener("click", () => {
    const isOpen = navLinksList.classList.toggle("open");
    navToggle.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", isOpen);
  });

  // Close mobile menu after tapping a link
  navLinksList.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinksList.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------------------------------------------------------------------
     7. BACK TO TOP
  --------------------------------------------------------------------- */
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------------------------------------------------------------------
     8. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
     Also triggers animated counters, skill bars, and the CGPA bar the
     first time their containing section enters the viewport.
  --------------------------------------------------------------------- */
  const revealEls = document.querySelectorAll(".reveal-up");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );
  revealEls.forEach((el) => revealObserver.observe(el));

  /* ---- Animated stat counters ---- */
  const statNumbers = document.querySelectorAll(".stat-number");

  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const isDecimal = el.dataset.decimal === "true";
    const duration = 1400;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      // Ease-out for a natural deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = isDecimal ? value.toFixed(2) : Math.round(value);
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = isDecimal ? target.toFixed(2) : target;
    }
    requestAnimationFrame(tick);
  }

  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          statsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  statNumbers.forEach((el) => statsObserver.observe(el));

  /* ---- Skill progress bars ---- */
  const barFills = document.querySelectorAll(".bar-fill");
  const barObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.style.setProperty("--target", el.dataset.level + "%");
          el.classList.add("animated");
          barObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.3 }
  );
  barFills.forEach((el) => barObserver.observe(el));

  /* ---- CGPA bar (Education section) ---- */
  const cgpaFill = document.querySelector(".cgpa-fill");
  if (cgpaFill) {
    const cgpaObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animated");
            cgpaObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    cgpaObserver.observe(cgpaFill);
  }

});