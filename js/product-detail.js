"use strict";

const WISHLIST_STORAGE_KEY = "cartoraWishlist";
const FALLBACK_IMAGE = "../images/logo-cartora.png";

let currentProduct = null;
let currentProductUuid = null;
let selectedQuantity = 1;
let messageTimer = null;

document.addEventListener("DOMContentLoaded", initProductDetailPage);

async function initProductDetailPage() {
  initMobileMenu();
  initQuantitySelector();
  initActions();

  currentProductUuid =
    new URLSearchParams(location.search).get("uuid")?.trim() || null;

  if (!currentProductUuid) {
    showMessage("Product UUID is missing from the URL.", "error");
    disableActions();
    renderRelated([]);
    return;
  }

  await loadProduct(currentProductUuid);
}

async function loadProduct(uuid) {
  setLoading(true);

  try {
    const product = await fetchProduct(uuid);

    if (!product?.uuid) {
      throw new Error("Product not found.");
    }

    currentProduct = product;
    currentProductUuid = product.uuid;

    renderProduct(product);
    restoreWishlist();
    await loadRelated(product);
  } catch (error) {
    console.error("Product detail error:", error);

    showMessage(
      error.message || "Unable to load product.",
      "error"
    );

    disableActions();
    renderRelated([]);
  } finally {
    setLoading(false);
  }
}

async function fetchProduct(uuid) {
  try {
    const response = await apiRequest(
      `/products/${encodeURIComponent(uuid)}`,
      {
        method: "GET",
      }
    );

    const product =
      response?.data?.data ||
      response?.data ||
      response?.product ||
      response;

    if (product?.uuid) {
      console.log(
        "Product detail API response:",
        response
      );

      return product;
    }
  } catch (error) {
    console.warn(
      "Single product endpoint failed; using public list.",
      error
    );
  }

  const response = await apiRequest(
    "/products/public",
    {
      method: "GET",
    }
  );

  const products = extractProducts(response);

  return (
    products.find(
      (product) =>
        String(product?.uuid) ===
        String(uuid)
    ) || null
  );
}

function renderProduct(product) {
  const name =
    product?.name ||
    "Unnamed product";

  const price =
    toPrice(product?.price);

  const stock =
    toStock(product?.stock);

  const description =
    product?.description ||
    "No description is available.";

  const category =
    getCategoryName(product);

  const images =
    getImages(product);

  document.title =
    `${name} - CARTORA`;

  setText("product-title", name);
  setText(
    "product-price",
    formatMoney(price)
  );
  setText(
    "product-description",
    description
  );
  setText(
    "product-category-label",
    category
  );
  setText(
    "product-category-value",
    category
  );
  setText(
    "product-availability",
    stock > 0
      ? `In stock (${stock} available)`
      : "Out of stock"
  );

  const availability =
    document.getElementById(
      "product-availability"
    );

  availability?.classList.toggle(
    "text-green-600",
    stock > 0
  );

  availability?.classList.toggle(
    "text-red-600",
    stock <= 0
  );

  renderMainImage(
    images[0],
    name
  );

  renderThumbnails(
    images,
    name
  );

  configureStock(stock);
}

function setText(id, value) {
  const element =
    document.getElementById(id);

  if (element) {
    element.textContent = value;
  }
}

function getCategoryName(product) {
  if (
    typeof product?.category ===
      "string" &&
    product.category.trim()
  ) {
    return product.category.trim();
  }

  return (
    product?.category?.name ||
    product?.categoryName ||
    "Product"
  );
}

function getCategoryUuid(product) {
  return (
    product?.category?.uuid ||
    product?.categoryUuid ||
    null
  );
}

function getImages(product) {
  const candidates = [
    product?.thumbnail,
    product?.image,
    product?.imageUrl,
  ];

  if (
    Array.isArray(
      product?.images
    )
  ) {
    candidates.push(
      ...product.images
    );
  }

  if (
    Array.isArray(
      product?.imageUrls
    )
  ) {
    candidates.push(
      ...product.imageUrls
    );
  }

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

  const unique = [
    ...new Set(
      candidates
        .filter(
          (value) =>
            typeof value ===
              "string" &&
            value.trim()
        )
        .map(
          (value) =>
            value.trim()
        )
    ),
  ];

  return unique.length
    ? unique
    : [FALLBACK_IMAGE];
}

function renderMainImage(
  src,
  name
) {
  const image =
    document.getElementById(
      "main-product-image"
    );

  if (!image) {
    return;
  }

  image.src =
    src ||
    FALLBACK_IMAGE;

  image.alt =
    name;

  image.classList.remove(
    "opacity-50"
  );

  image.onerror = () => {
    image.onerror = null;
    image.src =
      FALLBACK_IMAGE;
  };
}

function renderThumbnails(
  images,
  name
) {
  const container =
    document.getElementById(
      "product-thumbnails"
    );

  if (!container) {
    return;
  }

  container.innerHTML =
    images
      .map(
        (src, index) => `
    <button
      type="button"
      class="product-thumbnail rounded-xl border-2
             ${
               index === 0
                 ? "border-orange-500"
                 : "border-transparent"
             }
             bg-white p-2 shadow-sm transition
             hover:border-orange-500"
      data-image="${escapeHtml(src)}"
      data-alt="${escapeHtml(name)} image ${index + 1}"
      aria-pressed="${index === 0}"
    >
      <img
        src="${escapeHtml(src)}"
        alt=""
        class="h-20 w-full object-contain sm:h-24"
        loading="lazy"
        onerror="
          this.onerror = null;
          this.src = '${FALLBACK_IMAGE}';
        "
      >
    </button>
  `
      )
      .join("");

  container.onclick = (
    event
  ) => {
    const button =
      event.target.closest(
        ".product-thumbnail"
      );

    if (!button) {
      return;
    }

    container
      .querySelectorAll(
        ".product-thumbnail"
      )
      .forEach((item) => {
        item.classList.remove(
          "border-orange-500"
        );

        item.classList.add(
          "border-transparent"
        );

        item.setAttribute(
          "aria-pressed",
          "false"
        );
      });

    button.classList.remove(
      "border-transparent"
    );

    button.classList.add(
      "border-orange-500"
    );

    button.setAttribute(
      "aria-pressed",
      "true"
    );

    renderMainImage(
      button.dataset.image,
      button.dataset.alt ||
        name
    );
  };
}

async function loadRelated(
  selectedProduct
) {
  showRelatedLoading();

  try {
    const response =
      await apiRequest(
        "/products/public",
        {
          method: "GET",
        }
      );

    const all =
      extractProducts(
        response
      );

    const categoryUuid =
      getCategoryUuid(
        selectedProduct
      );

    let related =
      all.filter(
        (product) => {
          if (
            !product?.uuid ||
            product.uuid ===
              selectedProduct.uuid
          ) {
            return false;
          }

          return categoryUuid
            ? getCategoryUuid(
                product
              ) ===
                categoryUuid
            : true;
        }
      );

    if (
      related.length < 4
    ) {
      const used =
        new Set(
          related.map(
            (product) =>
              product.uuid
          )
        );

      all.forEach(
        (product) => {
          if (
            related.length >=
              4 ||
            !product?.uuid ||
            product.uuid ===
              selectedProduct.uuid ||
            used.has(
              product.uuid
            )
          ) {
            return;
          }

          related.push(
            product
          );

          used.add(
            product.uuid
          );
        }
      );
    }

    renderRelated(
      related.slice(
        0,
        4
      )
    );
  } catch (error) {
    console.error(
      "Related products error:",
      error
    );

    renderRelated([]);
  }
}

function extractProducts(
  response
) {
  if (
    Array.isArray(
      response
    )
  ) {
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
    Array.isArray(
      response?.data
    )
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

function showRelatedLoading() {
  const container =
    document.getElementById(
      "related-products-container"
    );

  if (!container) {
    return;
  }

  container.innerHTML = `
    <div class="col-span-full py-10 text-center">
      <div
        class="mx-auto h-9 w-9 animate-spin rounded-full
               border-4 border-gray-200 border-t-orange-500"
      ></div>

      <p class="mt-3 text-sm text-gray-500">
        Loading related products...
      </p>
    </div>
  `;
}

function renderRelated(
  products
) {
  const container =
    document.getElementById(
      "related-products-container"
    );

  if (!container) {
    return;
  }

  if (!products.length) {
    container.innerHTML = `
      <p class="col-span-full py-10 text-center text-gray-500">
        No related products are available.
      </p>
    `;

    return;
  }

  container.innerHTML =
    products
      .map(
        createRelatedCard
      )
      .join("");
}

function createRelatedCard(
  product
) {
  const uuid =
    encodeURIComponent(
      String(
        product?.uuid ||
          ""
      )
    );

  const name =
    escapeHtml(
      product?.name ||
        "Unnamed product"
    );

  const price =
    formatMoney(
      toPrice(
        product?.price
      )
    );

  const stock =
    toStock(
      product?.stock
    );

  const image =
    escapeHtml(
      getImages(
        product
      )[0]
    );

  const unavailable =
    stock <= 0;

  return `
    <article
      class="group flex flex-col overflow-hidden rounded-2xl
             border border-gray-100 bg-white p-3 shadow-sm
             transition hover:-translate-y-1 hover:shadow-lg"
    >
      <a
        href="product-detail.html?uuid=${uuid}"
        class="flex h-52 items-center justify-center
               overflow-hidden rounded-xl bg-gray-100 p-4"
      >
        <img
          src="${image}"
          alt="${name}"
          class="max-h-full max-w-full object-contain transition
                 duration-300 group-hover:scale-105"
          loading="lazy"
          onerror="
            this.onerror = null;
            this.src = '${FALLBACK_IMAGE}';
          "
        >
      </a>

      <div
        class="flex flex-1 flex-col px-1 pb-1 pt-4"
      >
        <a
          href="product-detail.html?uuid=${uuid}"
        >
          <h3
            class="line-clamp-2 font-semibold text-gray-900"
          >
            ${name}
          </h3>
        </a>

        <div
          class="mt-2 flex items-center justify-between gap-3"
        >
          <span
            class="font-bold text-gray-800"
          >
            ${price}
          </span>

          <span
            class="text-xs font-medium
                   ${
                     unavailable
                       ? "text-red-500"
                       : "text-green-600"
                   }"
          >
            ${
              unavailable
                ? "Out of stock"
                : `${stock} available`
            }
          </span>
        </div>

        <button
          type="button"
          data-related-add="${uuid}"
          ${
            unavailable
              ? "disabled"
              : ""
          }
          class="mt-4 rounded-lg bg-orange-500 px-4 py-2.5
                 text-sm font-semibold text-white transition
                 hover:bg-orange-600 disabled:cursor-not-allowed
                 disabled:bg-gray-400"
        >
          ${
            unavailable
              ? "Out of Stock"
              : "Add to Cart"
          }
        </button>
      </div>
    </article>
  `;
}

function initQuantitySelector() {
  document
    .getElementById(
      "decrease-quantity"
    )
    ?.addEventListener(
      "click",
      () => {
        setQuantity(
          getQuantity() - 1
        );
      }
    );

  document
    .getElementById(
      "increase-quantity"
    )
    ?.addEventListener(
      "click",
      () => {
        setQuantity(
          getQuantity() + 1
        );
      }
    );

  document
    .getElementById(
      "product-quantity"
    )
    ?.addEventListener(
      "input",
      () => {
        setQuantity(
          getQuantity()
        );
      }
    );
}

function getQuantity() {
  const value =
    Number.parseInt(
      document
        .getElementById(
          "product-quantity"
        )
        ?.value ||
        "1",
      10
    );

  return Number.isInteger(
    value
  )
    ? value
    : 1;
}

function setQuantity(
  quantity
) {
  const input =
    document.getElementById(
      "product-quantity"
    );

  const decrease =
    document.getElementById(
      "decrease-quantity"
    );

  const increase =
    document.getElementById(
      "increase-quantity"
    );

  const stock =
    toStock(
      currentProduct?.stock
    );

  const max =
    stock > 0
      ? stock
      : 1;

  selectedQuantity =
    Math.min(
      Math.max(
        Number.parseInt(
          quantity,
          10
        ) || 1,
        1
      ),
      max
    );

  if (input) {
    input.value =
      String(
        selectedQuantity
      );

    input.max =
      String(max);
  }

  if (decrease) {
    decrease.disabled =
      selectedQuantity <= 1;
  }

  if (increase) {
    increase.disabled =
      stock <= 0 ||
      selectedQuantity >=
        max;
  }
}

function configureStock(
  stock
) {
  const input =
    document.getElementById(
      "product-quantity"
    );

  if (input) {
    input.disabled =
      stock <= 0;
  }

  setQuantity(1);

  const add =
    document.getElementById(
      "add-to-cart-button"
    );

  const buy =
    document.getElementById(
      "buy-now-button"
    );

  const unavailable =
    stock <= 0;

  if (add) {
    add.disabled =
      unavailable;

    add.classList.toggle(
      "opacity-50",
      unavailable
    );

    const label =
      add.querySelector(
        "[data-button-label]"
      );

    if (label) {
      label.textContent =
        unavailable
          ? "Out of Stock"
          : "Add to Cart";
    }
  }

  if (buy) {
    buy.disabled =
      unavailable;

    buy.classList.toggle(
      "opacity-50",
      unavailable
    );

    buy.textContent =
      unavailable
        ? "Out of Stock"
        : "Buy Now";
  }
}

function initActions() {
  document
    .getElementById(
      "add-to-cart-button"
    )
    ?.addEventListener(
      "click",
      () => {
        addCurrentProduct(
          false
        );
      }
    );

  document
    .getElementById(
      "buy-now-button"
    )
    ?.addEventListener(
      "click",
      () => {
        addCurrentProduct(
          true
        );
      }
    );

  document
    .getElementById(
      "wishlist-button"
    )
    ?.addEventListener(
      "click",
      toggleWishlist
    );

  document
    .getElementById(
      "related-products-container"
    )
    ?.addEventListener(
      "click",
      async (
        event
      ) => {
        const button =
          event.target.closest(
            "button[data-related-add]"
          );

        if (!button) {
          return;
        }

        const uuid =
          decodeURIComponent(
            button.dataset
              .relatedAdd ||
              ""
          );

        if (uuid) {
          await addToCart(
            uuid,
            1,
            button
          );
        }
      }
    );
}

async function addCurrentProduct(
  redirectToCart
) {
  if (
    !currentProduct ||
    !currentProductUuid
  ) {
    showMessage(
      "Product information is not ready.",
      "error"
    );

    return;
  }

  if (
    toStock(
      currentProduct.stock
    ) <= 0
  ) {
    showMessage(
      "This product is out of stock.",
      "error"
    );

    return;
  }

  const button =
    redirectToCart
      ? document.getElementById(
          "buy-now-button"
        )
      : document.getElementById(
          "add-to-cart-button"
        );

  const added =
    await addToCart(
      currentProductUuid,
      selectedQuantity,
      button
    );

  if (
    added &&
    redirectToCart
  ) {
    setTimeout(() => {
      location.href =
        "cart.html";
    }, 500);
  }
}

async function addToCart(
  productUuid,
  quantity,
  button
) {
  if (!getAccessToken()) {
    saveReturnUrl();

    location.href =
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

    location.href =
      "login.html";

    return false;
  }

  const originalHtml =
    button?.innerHTML ||
    "";

  const qty =
    Math.max(
      1,
      Number(quantity) ||
        1
    );

  if (button) {
    button.disabled =
      true;

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
          qty,
        }),
      }
    );

    showMessage(
      `${qty} item(s) added to your cart.`,
      "success"
    );

    if (button) {
      button.textContent =
        "Added ✓";

      setTimeout(() => {
        button.disabled =
          false;

        button.innerHTML =
          originalHtml;
      }, 900);
    }

    return true;
  } catch (error) {
    console.error(
      "Add to cart error:",
      error
    );

    showMessage(
      error.message ||
        "Unable to add product.",
      "error"
    );

    if (button) {
      button.disabled =
        false;

      button.innerHTML =
        originalHtml;
    }

    return false;
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

function getWishlist() {
  try {
    const value =
      JSON.parse(
        localStorage.getItem(
          WISHLIST_STORAGE_KEY
        ) || "[]"
      );

    return Array.isArray(
      value
    )
      ? value
      : [];
  } catch {
    return [];
  }
}

function toggleWishlist() {
  if (!currentProductUuid) {
    return;
  }

  const wishlist =
    getWishlist();

  const exists =
    wishlist.includes(
      currentProductUuid
    );

  const next =
    exists
      ? wishlist.filter(
          (uuid) =>
            uuid !==
            currentProductUuid
        )
      : [
          ...wishlist,
          currentProductUuid,
        ];

  localStorage.setItem(
    WISHLIST_STORAGE_KEY,
    JSON.stringify(next)
  );

  updateWishlistButton(
    !exists
  );

  showMessage(
    exists
      ? "Product removed from wishlist."
      : "Product added to wishlist.",
    "success"
  );
}

function restoreWishlist() {
  updateWishlistButton(
    getWishlist().includes(
      currentProductUuid
    )
  );
}

function updateWishlistButton(
  active
) {
  const button =
    document.getElementById(
      "wishlist-button"
    );

  if (!button) {
    return;
  }

  button.setAttribute(
    "aria-pressed",
    String(active)
  );

  button.classList.toggle(
    "bg-gray-200",
    !active
  );

  button.classList.toggle(
    "text-gray-700",
    !active
  );

  button.classList.toggle(
    "bg-rose-100",
    active
  );

  button.classList.toggle(
    "text-rose-600",
    active
  );
}

function showMessage(
  message,
  type = "success"
) {
  const element =
    document.getElementById(
      "product-action-message"
    );

  if (!element) {
    return;
  }

  clearTimeout(
    messageTimer
  );

  element.textContent =
    message;

  element.classList.remove(
    "hidden",
    "text-green-600",
    "text-red-600"
  );

  element.classList.add(
    type === "error"
      ? "text-red-600"
      : "text-green-600"
  );

  messageTimer =
    setTimeout(() => {
      element.classList.add(
        "hidden"
      );
    }, 3500);
}

function setLoading(
  loading
) {
  const title =
    document.getElementById(
      "product-title"
    );

  const image =
    document.getElementById(
      "main-product-image"
    );

  if (loading) {
    if (title) {
      title.textContent =
        "Loading product...";
    }

    image?.classList.add(
      "opacity-50"
    );
  } else {
    image?.classList.remove(
      "opacity-50"
    );
  }
}

function disableActions() {
  [
    "add-to-cart-button",
    "wishlist-button",
    "buy-now-button",
    "decrease-quantity",
    "increase-quantity",
    "product-quantity",
  ].forEach((id) => {
    const element =
      document.getElementById(
        id
      );

    if (element) {
      element.disabled =
        true;

      element.classList.add(
        "opacity-50"
      );
    }
  });
}

function initMobileMenu() {
  const toggle =
    document.getElementById(
      "menuToggle"
    );

  const menu =
    document.getElementById(
      "mobileMenu"
    );

  toggle?.addEventListener(
    "click",
    () => {
      const hidden =
        menu?.classList.toggle(
          "hidden"
        ) ?? true;

      toggle.setAttribute(
        "aria-expanded",
        String(!hidden)
      );
    }
  );
}

function getUserUuid(user) {
  return (
    user?.uuid ||
    user?.userUuid ||
    user?.data?.uuid ||
    user?.data?.userUuid ||
    user?.user?.uuid ||
    user?.data?.user?.uuid ||
    user?.payload?.uuid ||
    user?.payload?.user?.uuid ||
    null
  );
}

function toPrice(value) {
  const number =
    Number(value);

  return Number.isFinite(
    number
  )
    ? Math.max(
        number,
        0
      )
    : 0;
}

function toStock(value) {
  const number =
    Number(value);

  return Number.isFinite(
    number
  )
    ? Math.max(
        Math.floor(number),
        0
      )
    : 0;
}

function formatMoney(value) {
  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency: "USD",
    }
  ).format(value);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll(
      "&",
      "&amp;"
    )
    .replaceAll(
      "<",
      "&lt;"
    )
    .replaceAll(
      ">",
      "&gt;"
    )
    .replaceAll(
      '"',
      "&quot;"
    )
    .replaceAll(
      "'",
      "&#039;"
    );
}