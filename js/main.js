// ================================================================
// main.js — all page behaviour in one file
//   1) New Arrivals carousel
//   2) Best Seller carousel
//   3) Scroll reveal animation
// ================================================================

document.addEventListener("DOMContentLoaded", () => {
  /* ---------- Generic carousel factory ---------- */
  function initCarousel({ pageIds, prevBtnId, nextBtnId }) {
    const pages = pageIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    const prevBtn = document.getElementById(prevBtnId);
    const nextBtn = document.getElementById(nextBtnId);

    if (!pages.length || !prevBtn || !nextBtn) {
      return;
    }

    let currentPage = 0;

    function showPage(index) {
      pages.forEach((page) => {
        page.classList.add("hidden");
      });

      pages[index].classList.remove("hidden");
    }

    nextBtn.addEventListener("click", () => {
      currentPage = (currentPage + 1) % pages.length;
      showPage(currentPage);
    });

    prevBtn.addEventListener("click", () => {
      currentPage =
        (currentPage - 1 + pages.length) % pages.length;

      showPage(currentPage);
    });

    showPage(currentPage);
  }

  /* ---------- New Arrivals carousel ---------- */
  initCarousel({
    pageIds: ["page1", "page2", "page3"],
    prevBtnId: "prevBtn",
    nextBtnId: "nextBtn",
  });

  /* ---------- Best Seller carousel ---------- */
  initCarousel({
    pageIds: ["bspage1", "bspage2", "bspage3"],
    prevBtnId: "prevBtn2",
    nextBtnId: "nextBtn2",
  });

  /* ---------- Scroll reveal animation ---------- */
  const revealElements =
    document.querySelectorAll("[data-reveal]");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.remove(
          "opacity-0",
          "translate-y-10",
          "translate-y-12",
          "translate-y-6"
        );

        entry.target.classList.add(
          "opacity-100",
          "translate-y-0"
        );

        revealObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.1,
    }
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
});