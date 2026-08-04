"use strict";

// ================================================================
// product-detail.js
// Fetch a product by UUID, render its details, manage gallery,
// quantity, wishlist, Add to Cart and Buy Now.
//
// api.js must be loaded before this file.
// ================================================================

const WISHLIST_STORAGE_KEY = "cartoraWishlist";

let currentProduct = null;
let currentProductUuid = null;
let selectedQuantity = 1;
let messageTimer = null;

document.addEventListener("DOMContentLoaded", () => {
  initProductDetailPage();
});

/* ================================================================
   INITIALIZATION
================================================================ */

async function initProductDetailPage() {
  currentProductUuid = getProductUuidFromUrl();

  if (!currentProductUuid) {
    showActionMessage(
      "Product UUID is missing from the URL.",
      "error"
    );

    disableProductActions();
    return;
  }

  initColorSelector();
  initQuantitySelector();
  initProductActions();
  initMobileMenu();

  await loadProductDetail(currentProductUuid);
}

function getProductUuidFromUrl() {
  const params = new URLSearchParams(
    window.location.search
  );

  return params.get("uuid")?.trim() || null;
}

/* ================================================================
   FETCH PRODUCT
================================================================ */

async function loadProductDetail(productUuid) {
  setProductLoading(true);

  try {
    const response = await apiRequest(
      `/products/${encodeURIComponent(productUuid)}`,
      {
        method: "GET",
      }
    );

    console.log(
      "Product detail API response:",
      response
    );

    const product = response?.data || response;

    if (
      !product ||
      typeof product !== "object" ||
      !product.uuid
    ) {
      throw new Error(
        "The product data returned by the server is invalid."
      );
    }

    currentProduct = product;

    renderProductDetail(product);
    restoreWishlistState();
  } catch (error) {
    console.error(
      "Unable to load product detail:",
      error
    );

    showActionMessage(
      error.message ||
        "Unable to load this product.",
      "error"
    );

    disableProductActions();
  } finally {
    setProductLoading(false);
  }
}

/* ================================================================
   RENDER PRODUCT
================================================================ */

function renderProductDetail(product) {
  const titleElement =
    document.getElementById("product-title");

  const mainImage =
    document.getElementById("main-product-image");

  const thumbnailsContainer =
    document.getElementById("product-thumbnails");

  const infoContainer =
    titleElement?.parentElement || null;

  const categoryLabel =
    titleElement?.previousElementSibling || null;

  const priceElement =
    titleElement?.nextElementSibling || null;

  const ratingContainer =
    priceElement?.nextElementSibling || null;

  const descriptionElement =
    ratingContainer?.nextElementSibling || null;

  const detailsList =
    infoContainer?.querySelector("dl");

  const detailValues =
    detailsList?.querySelectorAll("dd") || [];

  const name =
    product?.name || "Unnamed product";

  const price = normalizePrice(
    product?.price
  );

  const stock = normalizeStock(
    product?.stock
  );

  const description =
    product?.description ||
    "No description is available for this product.";

  const images = getProductImages(product);

  document.title = `${name} - CARTORA`;

  if (titleElement) {
    titleElement.textContent = name;
  }

  if (priceElement) {
    priceElement.textContent =
      formatCurrency(price);
  }

  if (descriptionElement) {
    descriptionElement.textContent =
      description;
  }

  if (categoryLabel) {
    categoryLabel.textContent =
      product?.category?.name ||
      product?.categoryName ||
      "Product";
  }

  if (mainImage) {
    mainImage.src =
      images[0] ||
      "../images/logo-cartora.png";

    mainImage.alt = name;

    mainImage.onerror = () => {
      mainImage.onerror = null;
      mainImage.src =
        "../images/logo-cartora.png";
    };
  }

  renderProductThumbnails(
    thumbnailsContainer,
    images,
    name
  );

  updateAvailability(stock);

  if (detailValues.length >= 1) {
    detailValues[0].textContent =
      stock > 0
        ? `In stock (${stock} available)`
        : "Out of stock";

    detailValues[0].classList.toggle(
      "text-green-600",
      stock > 0
    );

    detailValues[0].classList.toggle(
      "text-red-600",
      stock <= 0
    );
  }

  if (detailValues.length >= 2) {
    detailValues[1].textContent =
      product?.category?.name ||
      product?.categoryName ||
      "Product";
  }

  configureQuantityForStock(stock);
  configureActionButtons(stock);
}

function getProductImages(product) {
  const images = [];

  if (product?.thumbnail) {
    images.push(product.thumbnail);
  }

  if (Array.isArray(product?.images)) {
    product.images.forEach((image) => {
      if (
        typeof image === "string" &&
        image.trim()
      ) {
        images.push(image.trim());
      }
    });
  }

  const uniqueImages = [
    ...new Set(images),
  ];

  return uniqueImages.length > 0
    ? uniqueImages
    : ["../images/logo-cartora.png"];
}

function renderProductThumbnails(
  container,
  images,
  productName
) {
  if (!container) {
    return;
  }

  container.innerHTML = images
    .map((image, index) => {
      const safeImage = escapeHtml(image);
      const safeName = escapeHtml(productName);
      const isFirst = index === 0;

      return `
        <button
          type="button"
          class="product-thumbnail rounded-xl border-2
                 ${
                   isFirst
                     ? "border-(--primary)"
                     : "border-transparent"
                 }
                 bg-white p-2 shadow-sm transition
                 hover:border-(--primary)"
          data-image="${safeImage}"
          data-alt="${safeName} image ${index + 1}"
          aria-label="Show product image ${index + 1}"
          aria-pressed="${isFirst}"
        >
          <img
            src="${safeImage}"
            alt=""
            class="h-20 w-full object-contain sm:h-24"
            loading="lazy"
            onerror="
              this.onerror = null;
              this.src = '../images/logo-cartora.png';
            "
          >
        </button>
      `;
    })
    .join("");

  initProductGallery();
}

function updateAvailability(stock) {
  const quantityInput =
    document.getElementById("product-quantity");

  if (quantityInput) {
    quantityInput.max = String(
      Math.max(stock, 1)
    );
  }
}

/* ================================================================
   PRODUCT GALLERY
================================================================ */

function initProductGallery() {
  const mainImage =
    document.getElementById("main-product-image");

  const thumbnailsContainer =
    document.getElementById("product-thumbnails");

  if (!mainImage || !thumbnailsContainer) {
    return;
  }

  thumbnailsContainer.onclick = (event) => {
    const thumbnailButton =
      event.target.closest(
        "button.product-thumbnail"
      );

    if (!thumbnailButton) {
      return;
    }

    const imageSource =
      thumbnailButton.dataset.image;

    const imageAlt =
      thumbnailButton.dataset.alt ||
      "Selected product image";

    if (!imageSource) {
      return;
    }

    thumbnailsContainer
      .querySelectorAll(".product-thumbnail")
      .forEach((button) => {
        button.classList.remove(
          "border-(--primary)"
        );

        button.classList.add(
          "border-transparent"
        );

        button.setAttribute(
          "aria-pressed",
          "false"
        );
      });

    thumbnailButton.classList.remove(
      "border-transparent"
    );

    thumbnailButton.classList.add(
      "border-(--primary)"
    );

    thumbnailButton.setAttribute(
      "aria-pressed",
      "true"
    );

    mainImage.classList.add(
      "opacity-0",
      "scale-95"
    );

    window.setTimeout(() => {
      mainImage.src = imageSource;
      mainImage.alt = imageAlt;

      mainImage.classList.remove(
        "opacity-0",
        "scale-95"
      );
    }, 150);
  };
}

/* ================================================================
   COLOR SELECTOR
================================================================ */

function initColorSelector() {
  const colorButtons =
    document.querySelectorAll(".product-color");

  const selectedColorName =
    document.getElementById(
      "selected-color-name"
    );

  if (
    colorButtons.length === 0 ||
    !selectedColorName
  ) {
    return;
  }

  colorButtons.forEach((colorButton) => {
    colorButton.addEventListener(
      "click",
      () => {
        const colorName =
          colorButton.dataset.color ||
          "Selected color";

        colorButtons.forEach((button) => {
          button.classList.remove(
            "ring-slate-800"
          );

          button.classList.add(
            "ring-transparent"
          );

          button.setAttribute(
            "aria-pressed",
            "false"
          );
        });

        colorButton.classList.remove(
          "ring-transparent"
        );

        colorButton.classList.add(
          "ring-slate-800"
        );

        colorButton.setAttribute(
          "aria-pressed",
          "true"
        );

        selectedColorName.textContent =
          colorName;
      }
    );
  });
}

/* ================================================================
   QUANTITY
================================================================ */

function initQuantitySelector() {
  const quantityInput =
    document.getElementById("product-quantity");

  const decreaseButton =
    document.getElementById(
      "decrease-quantity"
    );

  const increaseButton =
    document.getElementById(
      "increase-quantity"
    );

  if (
    !quantityInput ||
    !decreaseButton ||
    !increaseButton
  ) {
    return;
  }

  decreaseButton.addEventListener(
    "click",
    () => {
      setSelectedQuantity(
        getSelectedQuantity() - 1
      );
    }
  );

  increaseButton.addEventListener(
    "click",
    () => {
      setSelectedQuantity(
        getSelectedQuantity() + 1
      );
    }
  );

  quantityInput.addEventListener(
    "input",
    () => {
      setSelectedQuantity(
        getSelectedQuantity()
      );
    }
  );

  quantityInput.addEventListener(
    "blur",
    () => {
      setSelectedQuantity(
        getSelectedQuantity()
      );
    }
  );

  setSelectedQuantity(1);
}

function getSelectedQuantity() {
  const quantityInput =
    document.getElementById("product-quantity");

  const parsedQuantity = Number.parseInt(
    quantityInput?.value || "1",
    10
  );

  if (!Number.isInteger(parsedQuantity)) {
    return 1;
  }

  return parsedQuantity;
}

function setSelectedQuantity(quantity) {
  const quantityInput =
    document.getElementById("product-quantity");

  const decreaseButton =
    document.getElementById(
      "decrease-quantity"
    );

  const increaseButton =
    document.getElementById(
      "increase-quantity"
    );

  const stock = normalizeStock(
    currentProduct?.stock
  );

  const maximum =
    stock > 0 ? stock : 1;

  selectedQuantity = Math.min(
    Math.max(
      Number.parseInt(quantity, 10) || 1,
      1
    ),
    maximum
  );

  if (quantityInput) {
    quantityInput.value =
      String(selectedQuantity);

    quantityInput.max =
      String(maximum);
  }

  if (decreaseButton) {
    const disabled =
      selectedQuantity <= 1;

    decreaseButton.disabled = disabled;

    decreaseButton.classList.toggle(
      "cursor-not-allowed",
      disabled
    );

    decreaseButton.classList.toggle(
      "opacity-40",
      disabled
    );
  }

  if (increaseButton) {
    const disabled =
      stock <= 0 ||
      selectedQuantity >= maximum;

    increaseButton.disabled = disabled;

    increaseButton.classList.toggle(
      "cursor-not-allowed",
      disabled
    );

    increaseButton.classList.toggle(
      "opacity-40",
      disabled
    );
  }
}

function configureQuantityForStock(stock) {
  const quantityInput =
    document.getElementById("product-quantity");

  if (quantityInput) {
    quantityInput.disabled = stock <= 0;
  }

  setSelectedQuantity(1);
}

/* ================================================================
   PRODUCT ACTIONS
================================================================ */

function initProductActions() {
  document
    .getElementById("add-to-cart-button")
    ?.addEventListener(
      "click",
      () => addCurrentProductToCart(false)
    );

  document
    .getElementById("wishlist-button")
    ?.addEventListener(
      "click",
      toggleCurrentProductWishlist
    );

  document
    .getElementById("buy-now-button")
    ?.addEventListener(
      "click",
      () => addCurrentProductToCart(true)
    );
}

async function addCurrentProductToCart(
  redirectToCart
) {
  if (
    !currentProduct ||
    !currentProductUuid
  ) {
    showActionMessage(
      "Product information is not ready.",
      "error"
    );

    return;
  }

  const stock = normalizeStock(
    currentProduct.stock
  );

  if (stock <= 0) {
    showActionMessage(
      "This product is out of stock.",
      "error"
    );

    return;
  }

  const token = getAccessToken();

  if (!token) {
    window.location.href = "login.html";
    return;
  }

  const storedUser = getStoredUser();
  const userUuid = getUserUuid(storedUser);

  if (!userUuid) {
    showActionMessage(
      "Your user information is missing. Please sign in again.",
      "error"
    );

    clearAuthStorage();

    window.setTimeout(() => {
      window.location.href = "login.html";
    }, 900);

    return;
  }

  const actionButton = redirectToCart
    ? document.getElementById(
        "buy-now-button"
      )
    : document.getElementById(
        "add-to-cart-button"
      );

  const originalText =
    actionButton?.textContent.trim() ||
    (redirectToCart
      ? "Buy Now"
      : "Add to Cart");

  setActionButtonLoading(
    actionButton,
    true,
    redirectToCart
      ? "Processing..."
      : "Adding..."
  );

  try {
    const response = await apiRequest(
      "/carts/add-item-to-cart",
      {
        method: "POST",

        body: JSON.stringify({
          userUuid,
          productUuid:
            currentProductUuid,
          sugarLevel: "NONE",
          qty: selectedQuantity,
        }),
      }
    );

    console.log(
      "Product detail add-to-cart response:",
      response
    );

    showActionMessage(
      `${selectedQuantity} item(s) added to your cart.`,
      "success"
    );

    if (actionButton) {
      actionButton.textContent =
        "Added ✓";
    }

    if (redirectToCart) {
      window.setTimeout(() => {
        window.location.href = "cart.html";
      }, 600);

      return;
    }

    window.setTimeout(() => {
      setActionButtonLoading(
        actionButton,
        false,
        originalText
      );
    }, 1200);
  } catch (error) {
    console.error(
      "Unable to add product to cart:",
      error
    );

    showActionMessage(
      error.message ||
        "Unable to add this product to your cart.",
      "error"
    );

    setActionButtonLoading(
      actionButton,
      false,
      originalText
    );
  }
}

function configureActionButtons(stock) {
  const addButton =
    document.getElementById(
      "add-to-cart-button"
    );

  const buyNowButton =
    document.getElementById(
      "buy-now-button"
    );

  const isUnavailable = stock <= 0;

  if (addButton) {
    addButton.disabled = isUnavailable;

    addButton.classList.toggle(
      "cursor-not-allowed",
      isUnavailable
    );

    addButton.classList.toggle(
      "opacity-50",
      isUnavailable
    );

    addButton.lastChild.textContent =
      isUnavailable
        ? " Out of Stock"
        : " Add to Cart";
  }

  if (buyNowButton) {
    buyNowButton.disabled =
      isUnavailable;

    buyNowButton.classList.toggle(
      "cursor-not-allowed",
      isUnavailable
    );

    buyNowButton.classList.toggle(
      "opacity-50",
      isUnavailable
    );

    buyNowButton.textContent =
      isUnavailable
        ? "Out of Stock"
        : "Buy Now";
  }
}

function disableProductActions() {
  [
    "add-to-cart-button",
    "wishlist-button",
    "buy-now-button",
    "decrease-quantity",
    "increase-quantity",
    "product-quantity",
  ].forEach((id) => {
    const element =
      document.getElementById(id);

    if (element) {
      element.disabled = true;
      element.classList.add(
        "cursor-not-allowed",
        "opacity-50"
      );
    }
  });
}

function setActionButtonLoading(
  button,
  loading,
  text
) {
  if (!button) {
    return;
  }

  button.disabled = loading;
  button.textContent = text;
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

function toggleCurrentProductWishlist() {
  if (!currentProductUuid) {
    return;
  }

  const wishlist = getWishlist();

  const exists = wishlist.includes(
    currentProductUuid
  );

  const nextWishlist = exists
    ? wishlist.filter(
        (uuid) =>
          uuid !== currentProductUuid
      )
    : [
        ...wishlist,
        currentProductUuid,
      ];

  localStorage.setItem(
    WISHLIST_STORAGE_KEY,
    JSON.stringify(nextWishlist)
  );

  updateWishlistButton(!exists);

  showActionMessage(
    exists
      ? "Product removed from wishlist."
      : "Product added to wishlist.",
    "success"
  );
}

function restoreWishlistState() {
  const wishlist = getWishlist();

  updateWishlistButton(
    wishlist.includes(currentProductUuid)
  );
}

function updateWishlistButton(isActive) {
  const button =
    document.getElementById(
      "wishlist-button"
    );

  if (!button) {
    return;
  }

  button.setAttribute(
    "aria-pressed",
    String(isActive)
  );

  button.classList.toggle(
    "bg-gray-200",
    !isActive
  );

  button.classList.toggle(
    "text-gray-700",
    !isActive
  );

  button.classList.toggle(
    "bg-rose-100",
    isActive
  );

  button.classList.toggle(
    "text-rose-600",
    isActive
  );
}

/* ================================================================
   STATUS MESSAGES
================================================================ */

function showActionMessage(
  message,
  type = "success"
) {
  const actionMessage =
    document.getElementById(
      "product-action-message"
    );

  if (!actionMessage) {
    return;
  }

  window.clearTimeout(messageTimer);

  actionMessage.textContent = message;

  actionMessage.classList.remove(
    "hidden",
    "text-green-600",
    "text-red-600"
  );

  actionMessage.classList.add(
    type === "error"
      ? "text-red-600"
      : "text-green-600"
  );

  messageTimer = window.setTimeout(() => {
    actionMessage.classList.add("hidden");
  }, 3500);
}

/* ================================================================
   LOADING STATE
================================================================ */

function setProductLoading(isLoading) {
  const title =
    document.getElementById("product-title");

  const mainImage =
    document.getElementById(
      "main-product-image"
    );

  if (isLoading) {
    if (title) {
      title.textContent =
        "Loading product...";
    }

    if (mainImage) {
      mainImage.classList.add(
        "opacity-50"
      );
    }

    return;
  }

  mainImage?.classList.remove(
    "opacity-50"
  );
}

/* ================================================================
   MOBILE MENU
================================================================ */

function initMobileMenu() {
  const menuToggle =
    document.getElementById("menuToggle");

  const mobileMenu =
    document.getElementById("mobileMenu");

  if (!menuToggle || !mobileMenu) {
    return;
  }

  menuToggle.addEventListener(
    "click",
    () => {
      const isHidden =
        mobileMenu.classList.toggle(
          "hidden"
        );

      menuToggle.setAttribute(
        "aria-expanded",
        String(!isHidden)
      );
    }
  );
}

/* ================================================================
   UTILITIES
================================================================ */

function getUserUuid(userData) {
  return (
    userData?.uuid ||
    userData?.data?.uuid ||
    userData?.user?.uuid ||
    userData?.data?.user?.uuid ||
    userData?.payload?.uuid ||
    userData?.payload?.user?.uuid ||
    null
  );
}

function normalizePrice(value) {
  const price = Number(value);

  return Number.isFinite(price)
    ? Math.max(price, 0)
    : 0;
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

function formatCurrency(value) {
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
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}