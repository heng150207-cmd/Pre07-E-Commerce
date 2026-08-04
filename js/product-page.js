"use strict";

// ================================================================
// product-page.js
// Products, categories, wishlist, login protection and cart API.
// api.js and auth-ui.js must load before this file.
// ================================================================

let allProducts = [];
let currentProducts = [];

const WISHLIST_STORAGE_KEY = "cartoraWishlist";

const PRODUCT_CONTAINER_IDS = [
  "products-container",
  "featured-products-container",
  "best-seller-products-container",
  "more-best-seller-products-container",
  "recommendation-products-container",
];

document.addEventListener("DOMContentLoaded", initProductPage);

/* ================================================================
   INITIALIZATION
================================================================ */

async function initProductPage() {
  bindProductContainers();
  bindPageControls();

  await Promise.all([
    loadProducts(),
    loadCategories(),
  ]);
}

function bindProductContainers() {
  PRODUCT_CONTAINER_IDS.forEach((containerId) => {
    const container =
      document.getElementById(containerId);

    container?.addEventListener(
      "click",
      handleProductAction
    );
  });
}

function bindPageControls() {
  const searchInput =
    document.getElementById("product-search");

  const categoriesContainer =
    document.getElementById(
      "categories-container"
    );

  searchInput?.addEventListener(
    "input",
    handleProductSearch
  );

  categoriesContainer?.addEventListener(
    "click",
    handleCategoryClick
  );
}

/* ================================================================
   LOAD PRODUCTS
================================================================ */

async function loadProducts() {
  showAllProductSectionsLoading();

  try {
    const response = await apiRequest(
      "/products/public",
      {
        method: "GET",
      }
    );

    console.log(
      "Products API response:",
      response
    );

    const apiProducts =
      extractProducts(response);

    allProducts =
      getUniqueProductsByUuid(apiProducts);

    currentProducts = [...allProducts];

    renderAllProductSections();
  } catch (error) {
    console.error(
      "Failed to load products:",
      error
    );

    showAllProductSectionsError(
      error.message ||
        "Unable to load products."
    );
  }
}

function extractProducts(response) {
  if (Array.isArray(response)) {
    return response;
  }

  if (
    Array.isArray(
      response?.data?.content
    )
  ) {
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

  return [];
}

/* ================================================================
   UNIQUE PRODUCTS
================================================================ */

function getUniqueProductsByUuid(products) {
  if (!Array.isArray(products)) {
    return [];
  }

  const seenUuids = new Set();

  return products.filter((product) => {
    const uuid = String(
      product?.uuid || ""
    ).trim();

    if (!uuid) {
      return false;
    }

    if (seenUuids.has(uuid)) {
      return false;
    }

    seenUuids.add(uuid);

    return true;
  });
}

/* ================================================================
   PRODUCT SECTIONS
================================================================ */

function renderAllProductSections() {
  const products = [...allProducts];

  if (products.length === 0) {
    showAllProductSectionsError(
      "No products are available."
    );

    return;
  }

  currentProducts = [...products];

  const featuredProducts =
    products.slice(0, 5);

  const markedBestSellers =
    products.filter(
      (product) =>
        product?.isMostOrdered === true
    );

  const bestSellerSource =
    markedBestSellers.length > 0
      ? markedBestSellers
      : [...products].sort(
          (
            firstProduct,
            secondProduct
          ) => {
            return (
              normalizeStock(
                secondProduct?.stock
              ) -
              normalizeStock(
                firstProduct?.stock
              )
            );
          }
        );

  const bestSellerProducts =
    bestSellerSource.slice(0, 4);

  const featuredUuids = new Set(
    featuredProducts.map(
      (product) => product.uuid
    )
  );

  let moreBestSellerProducts =
    products
      .filter(
        (product) =>
          !featuredUuids.has(
            product.uuid
          )
      )
      .slice(0, 5);

  if (
    moreBestSellerProducts.length === 0
  ) {
    moreBestSellerProducts =
      [...products]
        .reverse()
        .slice(0, 5);
  }

  const usedUuids = new Set([
    ...featuredProducts.map(
      (product) => product.uuid
    ),

    ...moreBestSellerProducts.map(
      (product) => product.uuid
    ),
  ]);

  let recommendationProducts =
    products
      .filter(
        (product) =>
          !usedUuids.has(
            product.uuid
          )
      )
      .slice(0, 5);

  if (
    recommendationProducts.length === 0
  ) {
    recommendationProducts =
      rotateProducts(products, 2)
        .slice(0, 5);
  }

  renderProductSection(
    "products-container",
    currentProducts
  );

  renderProductSection(
    "featured-products-container",
    featuredProducts
  );

  renderProductSection(
    "best-seller-products-container",
    bestSellerProducts
  );

  renderProductSection(
    "more-best-seller-products-container",
    moreBestSellerProducts
  );

  renderProductSection(
    "recommendation-products-container",
    recommendationProducts
  );

  console.log(
    "Product section summary:",
    {
      totalProducts:
        products.length,

      featured:
        featuredProducts.length,

      bestSeller:
        bestSellerProducts.length,

      moreBestSeller:
        moreBestSellerProducts.length,

      recommendations:
        recommendationProducts.length,
    }
  );
}

function rotateProducts(
  products,
  offset
) {
  if (
    !Array.isArray(products) ||
    products.length === 0
  ) {
    return [];
  }

  const safeOffset =
    offset % products.length;

  return [
    ...products.slice(safeOffset),
    ...products.slice(0, safeOffset),
  ];
}

function renderProductSection(
  containerId,
  products
) {
  const container =
    document.getElementById(
      containerId
    );

  if (!container) {
    return;
  }

  if (
    !Array.isArray(products) ||
    products.length === 0
  ) {
    container.innerHTML = `
      <p
        class="col-span-full py-10
               text-center text-gray-500"
      >
        No products are available.
      </p>
    `;

    return;
  }

  container.innerHTML = products
    .map((product, cardIndex) => {
      return createProductCard(
        product,
        cardIndex,
        containerId
      );
    })
    .join("");
}

/* ================================================================
   PRODUCT CARD
================================================================ */

function createProductCard(
  product,
  cardIndex = 0,
  sectionId = ""
) {
  const uuid = String(
    product?.uuid || ""
  );

  const encodedUuid =
    encodeURIComponent(uuid);

  const rawName =
    product?.name ||
    "Unnamed product";

  const rawDescription =
    product?.description ||
    "No description available.";

  const name =
    escapeHtml(rawName);

  const description =
    escapeHtml(rawDescription);

  const image =
    escapeHtml(
      getProductImage(
        product,
        cardIndex,
        sectionId
      )
    );

  const price =
    formatPrice(product?.price);

  const stock =
    normalizeStock(
      product?.stock
    );

  const isOutOfStock =
    stock <= 0;

  const isInWishlist =
    getWishlist().includes(uuid);

  return `
    <article
      class="product-card flex flex-col
             justify-between rounded-2xl
             border border-gray-100 bg-white
             p-3 shadow-sm transition
             duration-300 hover:-translate-y-1
             hover:shadow-lg"
      data-product-uuid="${encodedUuid}"
      data-product-name="${escapeHtml(
        rawName.toLowerCase()
      )}"
      data-product-description="${escapeHtml(
        rawDescription.toLowerCase()
      )}"
    >
      <div
        class="relative flex h-52
               items-center justify-center
               overflow-hidden rounded-xl
               bg-gray-100 p-4"
      >
        <a
          href="product-detail.html?uuid=${encodedUuid}"
          class="flex h-full w-full
                 items-center justify-center"
          aria-label="View ${name}"
        >
          <img
            src="${image}"
            alt="${name}"
            class="max-h-full max-w-full
                   object-contain transition
                   duration-300 hover:scale-105"
            loading="lazy"
            onerror="
              this.onerror = null;
              this.src = '../images/logo-cartora.png';
            "
          >
        </a>

        <button
          type="button"
          data-action="wishlist"
          data-uuid="${encodedUuid}"
          class="absolute right-3 top-3
                 flex h-8 w-8 items-center
                 justify-center rounded-full
                 ${
                   isInWishlist
                     ? "bg-red-500"
                     : "bg-[#8B5CF6]"
                 }
                 text-white shadow-sm
                 transition hover:scale-105"
          aria-label="Toggle ${name} wishlist"
          aria-pressed="${isInWishlist}"
        >
          ${isInWishlist ? "♥" : "♡"}
        </button>
      </div>

      <div class="space-y-2 px-1 pb-1 pt-4">
        <a
          href="product-detail.html?uuid=${encodedUuid}"
          class="block"
        >
          <h3
            class="line-clamp-2 text-base
                   font-bold text-gray-900
                   transition-colors
                   hover:text-[#F06A22]"
          >
            ${name}
          </h3>
        </a>

        <p
          class="line-clamp-2 min-h-12
                 text-sm leading-6
                 text-gray-500"
        >
          ${description}
        </p>

        <div
          class="flex items-center
                 justify-between gap-2"
        >
          <span
            class="text-lg font-bold
                   text-gray-800"
          >
            ${price}
          </span>

          <span
            class="rounded-full px-2.5 py-1
                   text-xs font-semibold
                   ${
                     isOutOfStock
                       ? "bg-red-100 text-red-600"
                       : "bg-green-100 text-green-700"
                   }"
          >
            ${
              isOutOfStock
                ? "Out of stock"
                : `${stock} in stock`
            }
          </span>
        </div>

        <button
          type="button"
          data-action="add-to-cart"
          data-uuid="${encodedUuid}"
          ${isOutOfStock
            ? "disabled"
            : ""}
          class="mt-3 flex w-full
                 items-center justify-center
                 rounded-lg bg-[#F06A22]
                 px-4 py-2.5 text-sm
                 font-semibold text-white
                 transition hover:bg-[#d85813]
                 disabled:cursor-not-allowed
                 disabled:bg-gray-400"
        >
          ${
            isOutOfStock
              ? "Out of Stock"
              : "Add to Cart"
          }
        </button>
      </div>
    </article>
  `;
}

/* ================================================================
   DIFFERENT API PRODUCT IMAGES
================================================================ */

function getProductImage(
  product,
  cardIndex = 0,
  sectionId = ""
) {
  const imageCandidates = [];

  if (
    Array.isArray(product?.images)
  ) {
    imageCandidates.push(
      ...product.images
    );
  }

  if (product?.thumbnail) {
    imageCandidates.push(
      product.thumbnail
    );
  }

  if (product?.image) {
    imageCandidates.push(
      product.image
    );
  }

  if (product?.imageUrl) {
    imageCandidates.push(
      product.imageUrl
    );
  }

  if (
    Array.isArray(product?.medias)
  ) {
    product.medias.forEach(
      (media) => {
        if (media?.url) {
          imageCandidates.push(
            media.url
          );
        }
      }
    );
  }

  const uniqueImages = [
    ...new Set(
      imageCandidates.filter(
        (image) =>
          typeof image === "string" &&
          image.trim() !== ""
      )
    ),
  ];

  if (uniqueImages.length === 0) {
    return "../images/logo-cartora.png";
  }

  const uuidOffset =
    getStableImageIndex(
      product?.uuid,
      uniqueImages.length
    );

  const sectionOffset =
    getSectionImageOffset(
      sectionId
    );

  const finalIndex =
    (
      uuidOffset +
      cardIndex +
      sectionOffset
    ) % uniqueImages.length;

  return uniqueImages[finalIndex];
}

function getSectionImageOffset(
  sectionId
) {
  const offsets = {
    "products-container": 0,
    "featured-products-container": 1,
    "best-seller-products-container": 2,
    "more-best-seller-products-container": 3,
    "recommendation-products-container": 4,
  };

  return offsets[sectionId] || 0;
}

function getStableImageIndex(
  productUuid,
  imageCount
) {
  if (
    !productUuid ||
    imageCount <= 1
  ) {
    return 0;
  }

  const uuid = String(
    productUuid
  );

  let hash = 0;

  for (
    let index = 0;
    index < uuid.length;
    index += 1
  ) {
    hash =
      (
        hash * 31 +
        uuid.charCodeAt(index)
      ) >>> 0;
  }

  return hash % imageCount;
}

/* ================================================================
   LOAD CATEGORIES
================================================================ */

async function loadCategories() {
  const container =
    document.getElementById(
      "categories-container"
    );

  if (!container) {
    return;
  }

  try {
    const response = await apiRequest(
      "/categories",
      {
        method: "GET",
      }
    );

    console.log(
      "Categories API response:",
      response
    );

    const categories =
      extractCategories(response);

    renderCategories(
      container,
      categories
    );
  } catch (error) {
    console.error(
      "Failed to load categories:",
      error
    );

    container.innerHTML = `
      <p
        class="py-5 text-center
               text-sm text-red-600"
      >
        ${escapeHtml(
          error.message ||
            "Unable to load categories."
        )}
      </p>
    `;
  }
}

function extractCategories(response) {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (
    Array.isArray(
      response?.data?.content
    )
  ) {
    return response.data.content;
  }

  if (Array.isArray(response?.content)) {
    return response.content;
  }

  return [];
}

function renderCategories(
  container,
  categories
) {
  const categoryButtons =
    categories
      .filter(
        (category) =>
          category?.uuid
      )
      .map((category) => {
        const uuid =
          escapeHtml(category.uuid);

        const name =
          escapeHtml(
            category?.name ||
              "Unnamed category"
          );

        return `
          <button
            type="button"
            data-category-uuid="${uuid}"
            class="category-button
                   rounded-xl px-4 py-3
                   text-left font-semibold
                   text-gray-800 transition
                   hover:bg-orange-50
                   hover:text-[#F06A22]"
          >
            ${name}
          </button>
        `;
      })
      .join("");

  container.innerHTML = `
    <h3
      class="mb-2 text-xl
             font-bold text-gray-900"
    >
      Categories
    </h3>

    <button
      type="button"
      data-category-uuid="all"
      class="category-button
             rounded-xl bg-[#F06A22]
             px-4 py-3 text-left
             font-semibold text-white"
    >
      All Products
    </button>

    ${
      categoryButtons ||
      `
        <p
          class="py-4 text-center
                 text-sm text-gray-500"
        >
          No categories found.
        </p>
      `
    }
  `;
}

/* ================================================================
   CATEGORY FILTER
================================================================ */

async function handleCategoryClick(event) {
  const button =
    event.target.closest(
      "button[data-category-uuid]"
    );

  if (!button) {
    return;
  }

  const categoryUuid =
    button.dataset.categoryUuid;

  if (!categoryUuid) {
    return;
  }

  setActiveCategoryButton(button);
  clearProductSearch();

  if (categoryUuid === "all") {
    currentProducts =
      [...allProducts];

    renderProductSection(
      "products-container",
      currentProducts
    );

    return;
  }

  const productContainer =
    document.getElementById(
      "products-container"
    );

  showSectionLoading(
    productContainer
  );

  try {
    const response = await apiRequest(
      `/products/get-by-category/${encodeURIComponent(
        categoryUuid
      )}`,
      {
        method: "GET",
      }
    );

    console.log(
      "Products by category response:",
      response
    );

    currentProducts =
      getUniqueProductsByUuid(
        extractProducts(response)
      );

    renderProductSection(
      "products-container",
      currentProducts
    );
  } catch (error) {
    console.error(
      "Failed to load category products:",
      error
    );

    showSectionError(
      productContainer,
      error.message ||
        "Unable to load category products."
    );
  }
}

function setActiveCategoryButton(
  activeButton
) {
  document
    .querySelectorAll(
      ".category-button"
    )
    .forEach((button) => {
      button.classList.remove(
        "bg-[#F06A22]",
        "text-white"
      );

      button.classList.add(
        "text-gray-800"
      );
    });

  activeButton.classList.remove(
    "text-gray-800"
  );

  activeButton.classList.add(
    "bg-[#F06A22]",
    "text-white"
  );
}

function clearProductSearch() {
  const searchInput =
    document.getElementById(
      "product-search"
    );

  if (searchInput) {
    searchInput.value = "";
  }

  document
    .getElementById(
      "search-empty-message"
    )
    ?.remove();
}

/* ================================================================
   PRODUCT SEARCH
================================================================ */

function handleProductSearch(event) {
  filterRenderedProducts(
    event.target.value
  );
}

function filterRenderedProducts(
  searchValue
) {
  const query = String(
    searchValue || ""
  )
    .trim()
    .toLowerCase();

  const productCards =
    document.querySelectorAll(
      "#products-container .product-card"
    );

  let visibleCount = 0;

  productCards.forEach((card) => {
    const name =
      card.dataset.productName || "";

    const description =
      card.dataset
        .productDescription || "";

    const shouldShow =
      name.includes(query) ||
      description.includes(query);

    card.classList.toggle(
      "hidden",
      !shouldShow
    );

    if (shouldShow) {
      visibleCount += 1;
    }
  });

  updateSearchEmptyMessage(
    visibleCount,
    query
  );
}

function updateSearchEmptyMessage(
  visibleCount,
  query
) {
  const container =
    document.getElementById(
      "products-container"
    );

  const existingMessage =
    document.getElementById(
      "search-empty-message"
    );

  if (!container) {
    return;
  }

  if (
    !query ||
    visibleCount > 0
  ) {
    existingMessage?.remove();
    return;
  }

  if (existingMessage) {
    return;
  }

  container.insertAdjacentHTML(
    "beforeend",
    `
      <p
        id="search-empty-message"
        class="col-span-full py-10
               text-center text-gray-500"
      >
        No matching products found.
      </p>
    `
  );
}

/* ================================================================
   PRODUCT ACTIONS
================================================================ */

function handleProductAction(event) {
  const button =
    event.target.closest(
      "button[data-action]"
    );

  if (!button) {
    return;
  }

  const action =
    button.dataset.action;

  const productUuid =
    decodeURIComponent(
      button.dataset.uuid || ""
    );

  if (!productUuid) {
    console.error(
      "Product UUID is missing."
    );

    return;
  }

  if (action === "wishlist") {
    toggleWishlist(
      productUuid
    );

    return;
  }

  if (action === "add-to-cart") {
    handleAddToCart(
      productUuid,
      button
    );
  }
}

/* ================================================================
   ADD TO CART
================================================================ */

async function handleAddToCart(
  productUuid,
  button
) {
  if (
    typeof requireLogin === "function" &&
    !requireLogin()
  ) {
    return;
  }

  const token =
    getAccessToken();

  if (!token) {
    saveCurrentPageForLogin();

    window.location.href =
      "login.html";

    return;
  }

  const userUuid =
    getProductPageUserUuid(
      getStoredUser()
    );

  if (!userUuid) {
    clearAuthStorage();
    saveCurrentPageForLogin();

    window.location.href =
      "login.html";

    return;
  }

  const originalText =
    button?.textContent.trim() ||
    "Add to Cart";

  if (button) {
    button.disabled = true;
    button.textContent =
      "Adding...";
  }

  try {
    const response = await apiRequest(
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

    console.log(
      "Add to cart response:",
      response
    );

    updateMatchingCartButtons(
      productUuid,
      "Added ✓",
      true
    );

    window.setTimeout(() => {
      window.location.href =
        "cart.html";
    }, 700);
  } catch (error) {
    console.error(
      "Add to cart failed:",
      error
    );

    alert(
      error.message ||
        "Unable to add product to cart."
    );

    if (button) {
      button.disabled = false;
      button.textContent =
        originalText;
    }
  }
}

function saveCurrentPageForLogin() {
  const currentUrl =
    window.location.pathname +
    window.location.search +
    window.location.hash;

  sessionStorage.setItem(
    "cartoraReturnUrl",
    currentUrl
  );
}

function updateMatchingCartButtons(
  productUuid,
  text,
  disabled
) {
  const encodedUuid =
    encodeURIComponent(
      productUuid
    );

  document
    .querySelectorAll(
      `button[data-action="add-to-cart"][data-uuid="${encodedUuid}"]`
    )
    .forEach((button) => {
      button.textContent = text;
      button.disabled = disabled;
    });
}

/* ================================================================
   WISHLIST
================================================================ */

function getWishlist() {
  try {
    const wishlist = JSON.parse(
      localStorage.getItem(
        WISHLIST_STORAGE_KEY
      ) || "[]"
    );

    return Array.isArray(wishlist)
      ? wishlist
      : [];
  } catch (error) {
    console.error(
      "Unable to read wishlist:",
      error
    );

    return [];
  }
}

function saveWishlist(wishlist) {
  localStorage.setItem(
    WISHLIST_STORAGE_KEY,
    JSON.stringify(wishlist)
  );
}

function toggleWishlist(productUuid) {
  const wishlist =
    getWishlist();

  const exists =
    wishlist.includes(productUuid);

  const updatedWishlist =
    exists
      ? wishlist.filter(
          (uuid) =>
            uuid !== productUuid
        )
      : [
          ...wishlist,
          productUuid,
        ];

  saveWishlist(updatedWishlist);

  updateMatchingWishlistButtons(
    productUuid,
    !exists
  );
}

function updateMatchingWishlistButtons(
  productUuid,
  isActive
) {
  const encodedUuid =
    encodeURIComponent(
      productUuid
    );

  document
    .querySelectorAll(
      `button[data-action="wishlist"][data-uuid="${encodedUuid}"]`
    )
    .forEach((button) => {
      button.setAttribute(
        "aria-pressed",
        String(isActive)
      );

      button.textContent =
        isActive ? "♥" : "♡";

      button.classList.toggle(
        "bg-red-500",
        isActive
      );

      button.classList.toggle(
        "bg-[#8B5CF6]",
        !isActive
      );
    });
}

/* ================================================================
   LOADING AND ERROR STATES
================================================================ */

function showAllProductSectionsLoading() {
  PRODUCT_CONTAINER_IDS.forEach(
    (containerId) => {
      showSectionLoading(
        document.getElementById(
          containerId
        )
      );
    }
  );
}

function showAllProductSectionsError(
  message
) {
  PRODUCT_CONTAINER_IDS.forEach(
    (containerId) => {
      showSectionError(
        document.getElementById(
          containerId
        ),
        message
      );
    }
  );
}

function showSectionLoading(container) {
  if (!container) {
    return;
  }

  container.innerHTML = `
    <div
      class="col-span-full py-10
             text-center"
    >
      <div
        class="mx-auto h-9 w-9
               animate-spin rounded-full
               border-4 border-gray-200
               border-t-[#F06A22]"
        aria-hidden="true"
      ></div>

      <p
        class="mt-3 text-sm
               text-gray-500"
      >
        Loading products...
      </p>
    </div>
  `;
}

function showSectionError(
  container,
  message
) {
  if (!container) {
    return;
  }

  container.innerHTML = `
    <p
      class="col-span-full py-10
             text-center font-medium
             text-red-600"
    >
      ${escapeHtml(message)}
    </p>
  `;
}

/* ================================================================
   UTILITIES
================================================================ */

function normalizeStock(value) {
  const stock = Number(value);

  if (!Number.isFinite(stock)) {
    return 0;
  }

  return Math.max(
    0,
    Math.floor(stock)
  );
}

function formatPrice(value) {
  const price = Number(value);

  if (!Number.isFinite(price)) {
    return "$0.00";
  }

  return `$${price.toFixed(2)}`;
}

function getProductPageUserUuid(
  userData
) {
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