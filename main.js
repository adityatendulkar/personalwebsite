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

  function setNavSection(index) {
    if (nav && sections[index]) {
      nav.setAttribute("data-section", sections[index].id);
    }
  }

  function goToSection(index) {
    if (index < 0 || index >= sections.length) return;
    currentIndex = index;
    setNavSection(index);
    window.scrollTo({ top: index * window.innerHeight, behavior: "smooth" });
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

    // Sync currentIndex and nav when scroll finishes (e.g. nav click, hash load)
    function syncFromScroll() {
      var scrollTop = window.scrollY;
      var vh = window.innerHeight;
      var idx = Math.min(sections.length - 1, Math.max(0, Math.round(scrollTop / vh)));
      currentIndex = idx;
      setNavSection(idx);
    }

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
        isScrolling = true;
        goToSection(idx);
        setTimeout(function () { isScrolling = false; }, cooldown);
      }
    });
  });
});
