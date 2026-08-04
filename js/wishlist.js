"use strict";

// ================================================================
// wishlist.js
// Dynamic wishlist using:
//   localStorage: cartoraWishlist
//   GET  /products/public
//   POST /carts/add-item-to-cart
//
// api.js must load before this file.
// ================================================================

const WISHLIST_STORAGE_KEY = "cartoraWishlist";
const WISHLIST_FALLBACK_IMAGE = "../images/logo-cartora.png";

let wishlistItems = [];

document.addEventListener(
  "DOMContentLoaded",
  initWishlistPage
);

/* ================================================================
   INITIALIZATION
================================================================ */

async function initWishlistPage() {
  bindWishlistEvents();
  await loadWishlistProducts();
}

function bindWishlistEvents() {
  const {
    container,
    selectAllCheckbox,
    addAllButton,
  } = getWishlistElements();

  container?.addEventListener(
    "click",
    handleWishlistClick
  );

  container?.addEventListener(
    "change",
    handleWishlistChange
  );

  selectAllCheckbox?.addEventListener(
    "change",
    handleSelectAll
  );

  addAllButton?.addEventListener(
    "click",
    handleAddSelectedItems
  );
}

/* ================================================================
   LOAD WISHLIST PRODUCTS
================================================================ */

async function loadWishlistProducts() {
  showWishlistLoading();

  const wishlistUuids =
    getStoredWishlistUuids();

  if (wishlistUuids.length === 0) {
    wishlistItems = [];
    renderWishlist();
    return;
  }

  try {
    const response = await apiRequest(
      "/products/public",
      {
        method: "GET",
      }
    );

    console.log(
      "Wishlist products API response:",
      response
    );

    const allProducts =
      extractProducts(response);

    const wishlistUuidSet =
      new Set(wishlistUuids);

    wishlistItems = allProducts
      .filter((product) => {
        return (
          product?.uuid &&
          wishlistUuidSet.has(
            String(product.uuid)
          )
        );
      })
      .map((product) => {
        return {
          ...product,
          selected: false,
        };
      });

    /*
      Remove stale UUIDs from localStorage
      when products no longer exist in API.
    */
    saveStoredWishlistUuids(
      wishlistItems.map(
        (product) =>
          String(product.uuid)
      )
    );

    renderWishlist();
  } catch (error) {
    console.error(
      "Unable to load wishlist:",
      error
    );

    showWishlistError(
      error.message ||
        "Unable to load your wishlist."
    );
  }
}

/* ================================================================
   STORAGE
================================================================ */

function getStoredWishlistUuids() {
  try {
    const value = JSON.parse(
      localStorage.getItem(
        WISHLIST_STORAGE_KEY
      ) || "[]"
    );

    if (!Array.isArray(value)) {
      return [];
    }

    return [
      ...new Set(
        value
          .map((uuid) =>
            String(uuid || "").trim()
          )
          .filter(Boolean)
      ),
    ];
  } catch (error) {
    console.error(
      "Unable to read wishlist storage:",
      error
    );

    return [];
  }
}

function saveStoredWishlistUuids(
  uuids
) {
  localStorage.setItem(
    WISHLIST_STORAGE_KEY,
    JSON.stringify(uuids)
  );
}

/* ================================================================
   API RESPONSE
================================================================ */

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

  if (
    Array.isArray(response?.data)
  ) {
    return response.data;
  }

  if (
    Array.isArray(
      response?.content
    )
  ) {
    return response.content;
  }

  if (
    Array.isArray(
      response?.products
    )
  ) {
    return response.products;
  }

  if (
    Array.isArray(
      response?.data?.products
    )
  ) {
    return response.data.products;
  }

  return [];
}

/* ================================================================
   ELEMENTS
================================================================ */

function getWishlistElements() {
  return {
    container:
      document.getElementById(
        "wishlist-container"
      ),

    emptyState:
      document.getElementById(
        "empty-state"
      ),

    actionBar:
      document.getElementById(
        "action-bar"
      ),

    selectAllCheckbox:
      document.getElementById(
        "select-all"
      ),

    addAllButton:
      document.getElementById(
        "add-all-btn"
      ),

    selectAllControl:
      document.getElementById(
        "select-all-control"
      ),
  };
}

/* ================================================================
   RENDER
================================================================ */

function renderWishlist() {
  const {
    container,
    emptyState,
    actionBar,
    selectAllCheckbox,
    addAllButton,
    selectAllControl,
  } = getWishlistElements();

  if (
    !container ||
    !emptyState ||
    !actionBar ||
    !selectAllCheckbox
  ) {
    console.error(
      "Wishlist page elements are missing."
    );

    return;
  }

  if (wishlistItems.length === 0) {
    container.innerHTML = "";
    container.classList.add("hidden");

    actionBar.classList.add(
      "hidden"
    );

    emptyState.classList.remove(
      "hidden"
    );

    selectAllControl?.classList.add(
      "hidden"
    );

    selectAllCheckbox.checked =
      false;

    selectAllCheckbox.indeterminate =
      false;

    if (addAllButton) {
      addAllButton.disabled = true;
    }

    return;
  }

  container.classList.remove(
    "hidden"
  );

  actionBar.classList.remove(
    "hidden"
  );

  emptyState.classList.add(
    "hidden"
  );

  selectAllControl?.classList.remove(
    "hidden"
  );

  container.innerHTML =
    wishlistItems
      .map(createWishlistItemMarkup)
      .join("");

  updateSelectAllState();
  updateAddSelectedButton();
}

function createWishlistItemMarkup(
  item
) {
  const uuid =
    String(item?.uuid || "");

  const encodedUuid =
    encodeURIComponent(uuid);

  const name =
    escapeHtml(
      item?.name ||
        "Unnamed product"
    );

  const image =
    escapeHtml(
      getProductImage(item)
    );

  const price =
    formatPrice(item?.price);

  const stock =
    normalizeStock(
      item?.stock
    );

  const outOfStock =
    stock <= 0;

  return `
    <article
      class="flex flex-col items-center justify-between gap-4
             border-b border-gray-300 pb-6
             transition-all duration-200
             md:flex-row"
      data-product-uuid="${encodedUuid}"
    >
      <div
        class="flex w-full items-center gap-4 md:w-auto"
      >
        <input
          type="checkbox"
          class="wishlist-checkbox h-5 w-5 cursor-pointer
                 rounded border-gray-300
                 text-orange-500 focus:ring-orange-500"
          data-action="toggle-select"
          data-uuid="${encodedUuid}"
          ${item.selected ? "checked" : ""}
          aria-label="Select ${name}"
        >

        <a
          href="product-detail.html?uuid=${encodedUuid}"
          class="flex h-24 w-24 flex-shrink-0
                 items-center justify-center rounded-xl
                 border border-gray-100 bg-white p-2
                 shadow-md sm:h-28 sm:w-28"
        >
          <img
            src="${image}"
            alt="${name}"
            class="max-h-full max-w-full rounded-lg
                   object-contain"
            loading="lazy"
            onerror="
              this.onerror = null;
              this.src =
                '${WISHLIST_FALLBACK_IMAGE}';
            "
          >
        </a>

        <div>
          <a
            href="product-detail.html?uuid=${encodedUuid}"
            class="text-base font-semibold
                   text-gray-900 transition
                   hover:text-orange-500
                   sm:text-xl"
          >
            ${name}
          </a>

          <p
            class="mt-2 text-sm text-gray-500"
          >
            ${
              outOfStock
                ? "Out of stock"
                : `${stock} in stock`
            }
          </p>
        </div>
      </div>

      <div
        class="flex w-full items-center justify-between
               gap-4 md:w-auto md:justify-end md:gap-8"
      >
        <span
          class="text-base font-semibold
                 text-gray-900 lg:text-lg"
        >
          ${price}
        </span>

        <div
          class="flex items-center gap-4"
        >
          <button
            type="button"
            data-action="add-to-cart"
            data-uuid="${encodedUuid}"
            ${outOfStock
              ? "disabled"
              : ""}
            class="rounded-lg bg-orange-500
                   px-5 py-2.5 text-sm
                   font-medium text-white shadow-sm
                   transition hover:bg-orange-600
                   disabled:cursor-not-allowed
                   disabled:bg-gray-400"
          >
            ${
              outOfStock
                ? "Out of Stock"
                : "Add To Cart"
            }
          </button>

          <button
            type="button"
            data-action="remove"
            data-uuid="${encodedUuid}"
            class="rounded-full border
                   border-red-500/30 p-2
                   text-red-500 transition
                   hover:bg-red-50
                   hover:text-red-600"
            aria-label="Remove ${name} from wishlist"
          >
            <i
              class="fa-solid fa-trash"
              aria-hidden="true"
            ></i>
          </button>
        </div>
      </div>
    </article>
  `;
}

/* ================================================================
   IMAGE
================================================================ */

function getProductImage(product) {
  const candidates = [];

  if (
    Array.isArray(
      product?.images
    )
  ) {
    candidates.push(
      ...product.images
    );
  }

  candidates.push(
    product?.thumbnail,
    product?.image,
    product?.imageUrl
  );

  if (
    Array.isArray(
      product?.medias
    )
  ) {
    product.medias.forEach(
      (media) => {
        if (
          typeof media === "string"
        ) {
          candidates.push(media);
        } else if (media?.url) {
          candidates.push(
            media.url
          );
        }
      }
    );
  }

  const image =
    candidates.find(
      (value) =>
        typeof value ===
          "string" &&
        value.trim()
    );

  return (
    image?.trim() ||
    WISHLIST_FALLBACK_IMAGE
  );
}

/* ================================================================
   SELECT
================================================================ */

function toggleSelect(
  productUuid
) {
  wishlistItems =
    wishlistItems.map(
      (item) => {
        return String(item.uuid) ===
          String(productUuid)
          ? {
              ...item,
              selected:
                !item.selected,
            }
          : item;
      }
    );

  renderWishlist();
}

function handleSelectAll(event) {
  const checked =
    event.target.checked;

  wishlistItems =
    wishlistItems.map(
      (item) => ({
        ...item,
        selected: checked,
      })
    );

  renderWishlist();
}

function updateSelectAllState() {
  const {
    selectAllCheckbox,
  } = getWishlistElements();

  if (!selectAllCheckbox) {
    return;
  }

  const selectedCount =
    wishlistItems.filter(
      (item) =>
        item.selected
    ).length;

  selectAllCheckbox.checked =
    wishlistItems.length > 0 &&
    selectedCount ===
      wishlistItems.length;

  selectAllCheckbox.indeterminate =
    selectedCount > 0 &&
    selectedCount <
      wishlistItems.length;
}

function updateAddSelectedButton() {
  const {
    addAllButton,
  } = getWishlistElements();

  if (!addAllButton) {
    return;
  }

  addAllButton.disabled =
    !wishlistItems.some(
      (item) =>
        item.selected &&
        normalizeStock(
          item.stock
        ) > 0
    );
}

/* ================================================================
   REMOVE
================================================================ */

function removeWishlistItem(
  productUuid
) {
  wishlistItems =
    wishlistItems.filter(
      (item) =>
        String(item.uuid) !==
        String(productUuid)
    );

  saveStoredWishlistUuids(
    wishlistItems.map(
      (item) =>
        String(item.uuid)
    )
  );

  renderWishlist();
}

/* ================================================================
   ADD TO CART
================================================================ */

async function addWishlistProductToCart(
  productUuid,
  button
) {
  if (
    typeof requireLogin ===
      "function" &&
    !requireLogin()
  ) {
    return false;
  }

  const token =
    getAccessToken();

  if (!token) {
    saveReturnUrl();
    window.location.href =
      "login.html";

    return false;
  }

  const userUuid =
    getUserUuid(
      getStoredUser()
    );

  if (!userUuid) {
    clearAuthStorage();
    saveReturnUrl();

    window.location.href =
      "login.html";

    return false;
  }

  const originalText =
    button?.textContent
      ?.trim() ||
    "Add To Cart";

  if (button) {
    button.disabled = true;
    button.textContent =
      "Adding...";
  }

  try {
    await apiRequest(
      "/carts/add-item-to-cart",
      {
        method: "POST",

        body: JSON.stringify({
          userUuid,
          productUuid,
          sugarLevel:
            "NONE",
          qty: 1,
        }),
      }
    );

    if (button) {
      button.textContent =
        "Added ✓";

      window.setTimeout(() => {
        button.disabled = false;
        button.textContent =
          originalText;
      }, 900);
    }

    return true;
  } catch (error) {
    console.error(
      "Unable to add wishlist product:",
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

    return false;
  }
}

async function handleAddSelectedItems() {
  const selectedItems =
    wishlistItems.filter(
      (item) =>
        item.selected &&
        normalizeStock(
          item.stock
        ) > 0
    );

  if (
    selectedItems.length === 0
  ) {
    alert(
      "Please select at least one available product."
    );

    return;
  }

  const {
    addAllButton,
  } = getWishlistElements();

  const originalText =
    addAllButton?.textContent
      ?.trim() ||
    "Add Selected To Cart";

  if (addAllButton) {
    addAllButton.disabled =
      true;

    addAllButton.textContent =
      "Adding...";
  }

  let addedCount = 0;

  for (
    const item of selectedItems
  ) {
    const added =
      await addWishlistProductToCart(
        item.uuid,
        null
      );

    if (added) {
      addedCount += 1;
    }
  }

  if (addAllButton) {
    addAllButton.textContent =
      addedCount > 0
        ? `Added ${addedCount} ✓`
        : originalText;

    window.setTimeout(() => {
      addAllButton.textContent =
        originalText;

      updateAddSelectedButton();
    }, 1000);
  }
}

function saveReturnUrl() {
  sessionStorage.setItem(
    "cartoraReturnUrl",
    window.location.pathname +
      window.location.search +
      window.location.hash
  );
}

/* ================================================================
   EVENTS
================================================================ */

function handleWishlistClick(event) {
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
      button.dataset.uuid ||
        ""
    );

  if (!productUuid) {
    return;
  }

  if (action === "remove") {
    removeWishlistItem(
      productUuid
    );

    return;
  }

  if (
    action ===
    "add-to-cart"
  ) {
    addWishlistProductToCart(
      productUuid,
      button
    );
  }
}

function handleWishlistChange(event) {
  const checkbox =
    event.target.closest(
      'input[data-action="toggle-select"]'
    );

  if (!checkbox) {
    return;
  }

  const productUuid =
    decodeURIComponent(
      checkbox.dataset.uuid ||
        ""
    );

  if (!productUuid) {
    return;
  }

  toggleSelect(
    productUuid
  );
}

/* ================================================================
   LOADING / ERROR
================================================================ */

function showWishlistLoading() {
  const {
    container,
    emptyState,
    actionBar,
  } = getWishlistElements();

  if (!container) {
    return;
  }

  emptyState?.classList.add(
    "hidden"
  );

  actionBar?.classList.add(
    "hidden"
  );

  container.classList.remove(
    "hidden"
  );

  container.innerHTML = `
    <div class="py-12 text-center">
      <div
        class="mx-auto h-10 w-10 animate-spin
               rounded-full border-4
               border-gray-200
               border-t-orange-500"
      ></div>

      <p
        class="mt-4 text-sm
               text-gray-500"
      >
        Loading your wishlist...
      </p>
    </div>
  `;
}

function showWishlistError(
  message
) {
  const {
    container,
    actionBar,
  } = getWishlistElements();

  if (!container) {
    return;
  }

  actionBar?.classList.add(
    "hidden"
  );

  container.innerHTML = `
    <p
      class="py-12 text-center
             font-medium text-red-600"
    >
      ${escapeHtml(message)}
    </p>
  `;
}

/* ================================================================
   UTILITIES
================================================================ */

function normalizeStock(value) {
  const stock =
    Number(value);

  return Number.isFinite(
    stock
  )
    ? Math.max(
        Math.floor(stock),
        0
      )
    : 0;
}

function formatPrice(value) {
  const price =
    Number(value);

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