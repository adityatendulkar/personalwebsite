document.addEventListener("DOMContentLoaded", function () {
  // Dynamic year
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Wheel-to-section: one scroll = one full section (no partial scrolling)
  var sections = Array.from(document.querySelectorAll(".section[id]"));
  var hasScrollableSections = sections.length > 0;
  var currentIndex = 0;
  var isScrolling = false;
  var cooldown = 700;
  var nav = document.querySelector(".nav");
  var navToggle = document.querySelector(".nav-toggle");
  var navMenu = document.querySelector(".nav-links");

  function closeMenu() {
    if (!nav || !navToggle) return;
    nav.classList.remove("nav-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
    document.body.classList.remove("menu-open");
  }

  function openMenu() {
    if (!nav || !navToggle) return;
    nav.classList.add("nav-open");
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Close menu");
    document.body.classList.add("menu-open");
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      if (nav.classList.contains("nav-open")) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    navMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        closeMenu();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 640) {
        closeMenu();
      }
    });
  }

  function setNavSection(index) {
    if (nav && sections[index]) {
      nav.setAttribute("data-section", sections[index].id);
    }
  }

  function getSectionTop(index) {
    if (!sections[index]) return 0;
    return sections[index].offsetTop;
  }

  function syncFromScroll() {
    var marker = window.scrollY + (window.innerHeight * 0.35);
    var idx = 0;

    sections.forEach(function (section, index) {
      if (section.offsetTop <= marker) {
        idx = index;
      }
    });

    currentIndex = idx;
    setNavSection(idx);
  }

  function goToSection(index) {
    if (index < 0 || index >= sections.length) return;
    currentIndex = index;
    setNavSection(index);
    window.scrollTo({ top: getSectionTop(index), behavior: "smooth" });
  }

  if (hasScrollableSections) {
    document.addEventListener("wheel", function (e) {
      e.preventDefault();
      if (isScrolling) return;

      if (e.deltaY > 10) {
        if (currentIndex < sections.length - 1) {
          isScrolling = true;
          goToSection(currentIndex + 1);
          setTimeout(function () { isScrolling = false; }, cooldown);
        }
      } else if (e.deltaY < -10) {
        if (currentIndex > 0) {
          isScrolling = true;
          goToSection(currentIndex - 1);
          setTimeout(function () { isScrolling = false; }, cooldown);
        }
      }
    }, { passive: false });

    window.addEventListener("scroll", syncFromScroll);
    syncFromScroll();
  }

  // Scroll progress bar
  var progressBar = document.querySelector(".scroll-progress");

  function updateProgress() {
    if (!progressBar) return;
    var scrollTop = window.scrollY;
    var scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    var percent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    progressBar.style.width = percent + "%";
  }

  window.addEventListener("scroll", updateProgress);
  updateProgress();

  // Anchor links: jump to section (respects wheel-to-section)
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var id = this.getAttribute("href");
      if (id === "#") return;
      var targetId = id.slice(1);
      var idx = sections.findIndex(function (s) { return s.id === targetId; });
      if (idx >= 0) {
        e.preventDefault();
        closeMenu();
        isScrolling = true;
        goToSection(idx);
        setTimeout(function () { isScrolling = false; }, cooldown);
      }
    });
  });
});
