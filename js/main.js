"use strict";

// ================================================================
// main.js
// Homepage API products while preserving the existing card design.
// api.js and auth-ui.js must load before this file.
// ================================================================

const HOME_WISHLIST_KEY = "cartoraWishlist";
const HOME_FALLBACK_IMAGE = "./images/logo-cartora.png";

let homeProducts = [];

document.addEventListener("DOMContentLoaded", initHomePage);

async function initHomePage() {
  // Dark mode and mobile menu are already handled inside index.html.
  // Do not bind them again here, otherwise one click fires twice.
  initRevealAnimation();
  bindProductActions();

  await loadHomeProducts();
}

/* ================================================================
   LOAD PRODUCTS
================================================================ */

async function loadHomeProducts() {
  showAllHomePagesLoading();

  try {
    const response = await apiRequest(
  "/products/public?page=0&size=100",
  { method: "GET" }
);

    console.log("Homepage products API response:", response);

    homeProducts = getUniqueProducts(extractProducts(response));

    if (homeProducts.length === 0) {
      throw new Error("No products are available.");
    }

    renderNewArrivalPages(homeProducts);
    renderBestSellerPages(homeProducts);

    initCarousel({
      pageIds: ["page1", "page2", "page3"],
      prevBtnId: "prevBtn",
      nextBtnId: "nextBtn",
    });

    initCarousel({
      pageIds: ["bspage1", "bspage2", "bspage3"],
      prevBtnId: "prevBtn2",
      nextBtnId: "nextBtn2",
    });
  } catch (error) {
    console.error("Unable to load homepage products:", error);

    showAllHomePagesError(
      error.message || "Unable to load products."
    );
  }
}

function extractProducts(response) {
  if (Array.isArray(response)) return response;

  if (Array.isArray(response?.data?.content)) {
    return response.data.content;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.content)) {
    return response.content;
  }

  if (Array.isArray(response?.products)) {
    return response.products;
  }

  if (Array.isArray(response?.data?.products)) {
    return response.data.products;
  }

  return [];
}

function getUniqueProducts(products) {
  const seen = new Set();

  return products.filter((product) => {
    const uuid = String(product?.uuid || "").trim();

    if (!uuid || seen.has(uuid)) {
      return false;
    }

    seen.add(uuid);
    return true;
  });
}

/* ================================================================
   PRODUCT PAGE GROUPS
================================================================ */

function renderNewArrivalPages(products) {
  const newArrivals = [...products].slice(0, 12);

  renderProductPage("page1", newArrivals.slice(0, 4));
  renderProductPage("page2", newArrivals.slice(4, 8));
  renderProductPage("page3", newArrivals.slice(8, 12));
}

function renderBestSellerPages(products) {
  const markedBestSellers = products.filter(
    (product) => product?.isMostOrdered === true
  );

  const source =
    markedBestSellers.length >= 5
      ? markedBestSellers
      : [...products].sort(
          (first, second) =>
            normalizeStock(second?.stock) -
            normalizeStock(first?.stock)
        );

  const bestSellers = fillProducts(
    source,
    products,
    15
  );

  renderProductPage(
    "bspage1",
    bestSellers.slice(0, 5)
  );

  renderProductPage(
    "bspage2",
    bestSellers.slice(5, 10)
  );

  renderProductPage(
    "bspage3",
    bestSellers.slice(10, 15)
  );
}

function fillProducts(primary, allProducts, count) {
  const result = [];
  const used = new Set();

  [...primary, ...allProducts].forEach((product) => {
    const uuid = String(product?.uuid || "");

    if (
      !uuid ||
      used.has(uuid) ||
      result.length >= count
    ) {
      return;
    }

    used.add(uuid);
    result.push(product);
  });

  return result;
}

function renderProductPage(pageId, products) {
  const container =
    document.getElementById(pageId);

  if (!container) {
    return;
  }

  if (!products.length) {
    container.innerHTML = `
      <p class="col-span-full py-10 text-center text-gray-500">
        No products are available.
      </p>
    `;

    return;
  }

  container.innerHTML = products
    .map(createHomeProductCard)
    .join("");
}

/* ================================================================
   CARD MARKUP — SAME HOMEPAGE STYLE
================================================================ */

function createHomeProductCard(product) {
  const uuid = String(product?.uuid || "");
  const encodedUuid = encodeURIComponent(uuid);

  const name = escapeHtml(
    product?.name || "Unnamed product"
  );

  const image = escapeHtml(
    getProductImage(product)
  );

  const price = formatPrice(product?.price);
  const stock = normalizeStock(product?.stock);
  const outOfStock = stock <= 0;
  const inWishlist = getWishlist().includes(uuid);

  return `
    <div
      class="relative flex w-full flex-col overflow-hidden
             rounded-lg border border-gray-100 bg-white shadow-md"
      data-product-uuid="${encodedUuid}"
    >
      <a
        class="relative mx-3 mt-3 flex h-60 items-center
               justify-center overflow-hidden rounded-xl
               bg-gray-100 p-4"
        href="./html/product-detail.html?uuid=${encodedUuid}"
      >
        <img
          class="max-h-full max-w-full object-contain"
          src="${image}"
          alt="${name}"
          loading="lazy"
          onerror="
            this.onerror = null;
            this.src = '${HOME_FALLBACK_IMAGE}';
          "
        >

        <button
          type="button"
          data-home-action="wishlist"
          data-uuid="${encodedUuid}"
          class="absolute right-3 top-3 z-10 rounded-full
                 bg-white/80 p-2
                 ${inWishlist ? "text-red-500" : "text-gray-500"}
                 backdrop-blur-sm transition-colors
                 hover:text-red-500"
          aria-label="Add ${name} to wishlist"
          aria-pressed="${inWishlist}"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="${inWishlist ? "currentColor" : "none"}"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.8"
              d="M4.318 6.318a4.5 4.5 0 016.364 0
                 L12 7.636l1.318-1.318a4.5 4.5 0
                 116.364 6.364L12 21.364l-7.682-8.682
                 a4.5 4.5 0 010-6.364z"
            ></path>
          </svg>
        </button>
      </a>

      <div class="mt-4 px-5 pb-5">
        <a href="./html/product-detail.html?uuid=${encodedUuid}">
          <h5 class="line-clamp-2 text-xl tracking-tight text-slate-900">
            ${name}
          </h5>
        </a>

        <div class="mb-5 mt-2 flex items-center justify-between gap-3">
          <p>
            <span class="text-3xl font-bold text-slate-900">
              ${price}
            </span>
          </p>

          <div class="flex items-center">
            <svg
              aria-hidden="true"
              class="h-5 w-5 text-yellow-300"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="M9.049 2.927c.3-.921 1.603-.921
                   1.902 0l1.07 3.292a1 1 0 00.95.69
                   h3.462c.969 0 1.371 1.24.588 1.81
                   l-2.8 2.034a1 1 0 00-.364 1.118
                   l1.07 3.292c.3.921-.755 1.688-1.54
                   1.118l-2.8-2.034a1 1 0 00-1.175 0
                   l-2.8 2.034c-.784.57-1.838-.197-1.539
                   -1.118l1.07-3.292a1 1 0 00-.364-1.118
                   L2.98 8.72c-.783-.57-.38-1.81.588-1.81
                   h3.461a1 1 0 00.951-.69l1.07-3.292z"
              ></path>
            </svg>

            <span
              class="ml-3 mr-2 rounded px-2.5 py-0.5
                     text-xs font-semibold
                     ${
                       outOfStock
                         ? "bg-red-100 text-red-600"
                         : "bg-yellow-200 text-gray-900"
                     }"
            >
              ${outOfStock ? "Out" : `${stock} left`}
            </span>
          </div>
        </div>

        <button
          type="button"
          data-home-action="add-to-cart"
          data-uuid="${encodedUuid}"
          ${outOfStock ? "disabled" : ""}
          class="flex w-full items-center justify-center rounded-md
                 bg-orange-500 px-5 py-2.5 text-center
                 text-sm font-medium text-white transition-colors
                 hover:bg-orange-600 focus:outline-none
                 focus:ring-4 focus:ring-orange-300
                 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="mr-2 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4
                 M7 13L5.4 5M7 13l-2.293 2.293
                 c-.63.63-.184 1.707.707 1.707H17
                 m0 0a2 2 0 100 4 2 2 0 000-4
                 zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            ></path>
          </svg>

          ${outOfStock ? "Out of Stock" : "Add to cart"}
        </button>
      </div>
    </div>
  `;
}

/* ================================================================
   PRODUCT ACTIONS
================================================================ */

function bindProductActions() {
  document.addEventListener("click", (event) => {
    const button = event.target.closest(
      "button[data-home-action]"
    );

    if (!button) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const action =
      button.dataset.homeAction;

    const uuid =
      decodeURIComponent(
        button.dataset.uuid || ""
      );

    if (!uuid) {
      return;
    }

    if (action === "wishlist") {
      toggleWishlist(uuid);
      return;
    }

    if (action === "add-to-cart") {
      addHomeProductToCart(
        uuid,
        button
      );
    }
  });
}

async function addHomeProductToCart(
  productUuid,
  button
) {
  if (
    typeof requireLogin === "function" &&
    !requireLogin()
  ) {
    return;
  }

  if (!getAccessToken()) {
    saveReturnUrl();

    window.location.href =
      "./html/login.html";

    return;
  }

  const userUuid =
    getUserUuid(
      getStoredUser()
    );

  if (!userUuid) {
    clearAuthStorage();
    saveReturnUrl();

    window.location.href =
      "./html/login.html";

    return;
  }

  const originalHtml =
    button.innerHTML;

  button.disabled = true;
  button.textContent = "Adding...";

  try {
    await apiRequest(
      "/carts/add-item-to-cart",
      {
        method: "POST",
        body: JSON.stringify({
          userUuid,
          productUuid,
          sugarLevel: "NONE",
          qty: 1,
        }),
      }
    );

    button.textContent = "Added ✓";

    window.setTimeout(() => {
      button.disabled = false;
      button.innerHTML = originalHtml;
    }, 900);
  } catch (error) {
    console.error(
      "Homepage add-to-cart error:",
      error
    );

    alert(
      error.message ||
        "Unable to add product to cart."
    );

    button.disabled = false;
    button.innerHTML = originalHtml;
  }
}

function saveReturnUrl() {
  sessionStorage.setItem(
    "cartoraReturnUrl",
    location.pathname +
      location.search +
      location.hash
  );
}

/* ================================================================
   WISHLIST
================================================================ */

function getWishlist() {
  try {
    const value = JSON.parse(
      localStorage.getItem(
        HOME_WISHLIST_KEY
      ) || "[]"
    );

    return Array.isArray(value)
      ? value
      : [];
  } catch {
    return [];
  }
}

function toggleWishlist(productUuid) {
  const wishlist = getWishlist();

  const active =
    wishlist.includes(
      productUuid
    );

  const next =
    active
      ? wishlist.filter(
          (uuid) =>
            uuid !== productUuid
        )
      : [
          ...wishlist,
          productUuid,
        ];

  localStorage.setItem(
    HOME_WISHLIST_KEY,
    JSON.stringify(next)
  );

  updateWishlistButtons(
    productUuid,
    !active
  );
}

function updateWishlistButtons(
  productUuid,
  active
) {
  const encodedUuid =
    encodeURIComponent(
      productUuid
    );

  document
    .querySelectorAll(
      `button[data-home-action="wishlist"][data-uuid="${encodedUuid}"]`
    )
    .forEach((button) => {
      button.setAttribute(
        "aria-pressed",
        String(active)
      );

      button.classList.toggle(
        "text-red-500",
        active
      );

      button.classList.toggle(
        "text-gray-500",
        !active
      );

      const icon =
        button.querySelector(
          "svg"
        );

      if (icon) {
        icon.setAttribute(
          "fill",
          active
            ? "currentColor"
            : "none"
        );
      }
    });
}

/* ================================================================
   IMAGE / FORMAT
================================================================ */

function getProductImage(product) {
  const candidates = [];

  candidates.push(
    product?.thumbnail,
    product?.image,
    product?.imageUrl
  );

  if (Array.isArray(product?.images)) {
    candidates.push(...product.images);
  }

  if (Array.isArray(product?.imageUrls)) {
    candidates.push(...product.imageUrls);
  }

  if (Array.isArray(product?.medias)) {
    product.medias.forEach((media) => {
      if (typeof media === "string") {
        candidates.push(media);
      } else {
        candidates.push(
          media?.url,
          media?.uri
        );
      }
    });
  }

  const validImage = candidates.find((value) => {
    if (typeof value !== "string") {
      return false;
    }

    const imageUrl = value.trim();

    if (
      !imageUrl ||
      imageUrl.toLowerCase() === "string"
    ) {
      return false;
    }

    return (
      imageUrl.startsWith("http://") ||
      imageUrl.startsWith("https://") ||
      imageUrl.startsWith("./") ||
      imageUrl.startsWith("../") ||
      imageUrl.startsWith("/")
    );
  });

  return validImage?.trim() || HOME_FALLBACK_IMAGE;
}
function normalizeStock(value) {
  const stock = Number(value);

  return Number.isFinite(stock)
    ? Math.max(
        Math.floor(stock),
        0
      )
    : 0;
}

function formatPrice(value) {
  const price = Number(value);

  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency: "USD",
    }
  ).format(
    Number.isFinite(price)
      ? Math.max(price, 0)
      : 0
  );
}

function getUserUuid(userData) {
  return (
    userData?.uuid ||
    userData?.userUuid ||
    userData?.data?.uuid ||
    userData?.data?.userUuid ||
    userData?.user?.uuid ||
    userData?.data?.user?.uuid ||
    userData?.payload?.uuid ||
    userData?.payload?.user?.uuid ||
    null
  );
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* ================================================================
   CAROUSEL
================================================================ */

function initCarousel({
  pageIds,
  prevBtnId,
  nextBtnId,
}) {
  const pages = pageIds
    .map((id) =>
      document.getElementById(id)
    )
    .filter(Boolean);

  const prevBtn =
    document.getElementById(
      prevBtnId
    );

  const nextBtn =
    document.getElementById(
      nextBtnId
    );

  if (
    !pages.length ||
    !prevBtn ||
    !nextBtn
  ) {
    return;
  }

  let currentPage = 0;

  function showPage(index) {
    pages.forEach(
      (
        page,
        pageIndex
      ) => {
        page.classList.toggle(
          "hidden",
          pageIndex !== index
        );
      }
    );
  }

  nextBtn.onclick = () => {
    currentPage =
      (currentPage + 1) %
      pages.length;

    showPage(currentPage);
  };

  prevBtn.onclick = () => {
    currentPage =
      (
        currentPage -
        1 +
        pages.length
      ) %
      pages.length;

    showPage(currentPage);
  };

  showPage(0);
}

/* ================================================================
   LOADING / ERROR
================================================================ */

function showAllHomePagesLoading() {
  [
    "page1",
    "page2",
    "page3",
    "bspage1",
    "bspage2",
    "bspage3",
  ].forEach((id) => {
    const page =
      document.getElementById(id);

    if (!page) {
      return;
    }

    page.innerHTML = `
      <div class="col-span-full py-12 text-center">
        <div
          class="mx-auto h-10 w-10 animate-spin rounded-full
                 border-4 border-gray-200 border-t-violet-600"
        ></div>

        <p class="mt-4 text-sm font-medium text-gray-500">
          Loading products...
        </p>
      </div>
    `;
  });
}

function showAllHomePagesError(message) {
  [
    "page1",
    "page2",
    "page3",
    "bspage1",
    "bspage2",
    "bspage3",
  ].forEach((id) => {
    const page =
      document.getElementById(id);

    if (page) {
      page.innerHTML = `
        <p class="col-span-full py-10 text-center font-medium text-red-600">
          ${escapeHtml(message)}
        </p>
      `;
    }
  });
}

/* ================================================================
   SCROLL REVEAL
================================================================ */

function initRevealAnimation() {
  const revealElements =
    document.querySelectorAll(
      "[data-reveal]"
    );

  if (
    !(
      "IntersectionObserver" in
      window
    )
  ) {
    revealElements.forEach(
      showRevealElement
    );

    return;
  }

  const observer =
    new IntersectionObserver(
      (entries) => {
        entries.forEach(
          (entry) => {
            if (
              !entry.isIntersecting
            ) {
              return;
            }

            showRevealElement(
              entry.target
            );

            observer.unobserve(
              entry.target
            );
          }
        );
      },
      {
        threshold: 0.08,
      }
    );

  revealElements.forEach(
    (element) => {
      observer.observe(
        element
      );
    }
  );
}

function showRevealElement(element) {
  element.classList.remove(
    "opacity-0",
    "translate-y-10",
    "translate-y-12",
    "translate-y-6"
  );

  element.classList.add(
    "opacity-100",
    "translate-y-0"
  );
}