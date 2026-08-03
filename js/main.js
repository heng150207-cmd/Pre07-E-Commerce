// ================================================================
// main.js — all page behaviour in one file
//   1) "New Arrivals" carousel (3 pages)
//   2) "Best Seller" carousel (3 pages)
//   3) Scroll-triggered reveal animation for [data-reveal] elements
// ================================================================

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- Generic carousel factory ---------- */
  function initCarousel({ pageIds, prevBtnId, nextBtnId }) {
    const pages = pageIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    const prevBtn = document.getElementById(prevBtnId);
    const nextBtn = document.getElementById(nextBtnId);

    if (!pages.length || !prevBtn || !nextBtn) return;

    let currentPage = 0;

    function showPage(index) {
      pages.forEach((page) => page.classList.add("hidden"));
      pages[index].classList.remove("hidden");
    }

    nextBtn.addEventListener("click", () => {
      currentPage = (currentPage + 1) % pages.length;
      showPage(currentPage);
    });

    prevBtn.addEventListener("click", () => {
      currentPage = (currentPage - 1 + pages.length) % pages.length;
      showPage(currentPage);
    });

    showPage(0);
  }

  // New Arrivals carousel
  initCarousel({
    pageIds: ["page1", "page2", "page3"],
    prevBtnId: "prevBtn",
    nextBtnId: "nextBtn",
  });

  // Best Seller carousel
  initCarousel({
    pageIds: ["bspage1", "bspage2", "bspage3"],
    prevBtnId: "prevBtn2",
    nextBtnId: "nextBtn2",
  });

  /* ---------- Scroll reveal animation ---------- */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove(
            "opacity-0",
            "translate-y-10",
            "translate-y-12",
            "translate-y-6"
          );
          entry.target.classList.add("opacity-100", "translate-y-0");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll("[data-reveal]").forEach((el) => observer.observe(el));
});


document.addEventListener("DOMContentLoaded", function () {
  const revealEls = document.querySelectorAll('[data-reveal]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('opacity-0', 'translate-y-10');
        entry.target.classList.add('opacity-100', 'translate-y-0');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealEls.forEach(el => observer.observe(el));
});