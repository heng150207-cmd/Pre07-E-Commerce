"use strict";

// ================================================================
// cart.js
// Fetch cart, product details, update quantity and clear cart.
// api.js must be loaded before this file.
// ================================================================

let cartItems = [];
let cartUuid = null;
let userUuid = null;

document.addEventListener("DOMContentLoaded", () => {
  initCartPage();
});

/* ================================================================
   INITIALIZE
================================================================ */

async function initCartPage() {
  const cartContainer =
    document.getElementById("cart-items");

  if (!cartContainer) {
    console.error("Cart items container was not found.");
    return;
  }

  if (!getAccessToken()) {
    window.location.href = "login.html";
    return;
  }

  const storedUser = getStoredUser();

  userUuid = getUserUuid(storedUser);

  if (!userUuid) {
    console.error("Stored user data:", storedUser);

    alert(
      "Your user information is missing. Please sign in again."
    );

    clearAuthStorage();

    window.location.href = "login.html";
    return;
  }

  cartContainer.addEventListener(
    "click",
    handleCartAction
  );

  document
    .getElementById("clear-cart-btn")
    ?.addEventListener("click", clearEntireCart);

  await loadCart();
}

/* ================================================================
   LOAD CART
================================================================ */

async function loadCart() {
  const cartContainer =
    document.getElementById("cart-items");

  if (!cartContainer) {
    return;
  }

  showCartLoading(cartContainer);

  try {
    const response = await apiRequest(
      `/carts/${encodeURIComponent(
        userUuid
      )}/user-cart`,
      {
        method: "GET",
      }
    );

    console.log("User cart response:", response);

    const cartData =
      response?.data || response;

    cartUuid =
      cartData?.uuid || null;

    const rawCartItems = Array.isArray(
      cartData?.cartItems
    )
      ? cartData.cartItems
      : [];

    if (rawCartItems.length === 0) {
      cartItems = [];
      renderCart();
      return;
    }

    cartItems = await loadCartProductDetails(
      rawCartItems
    );

    renderCart();
  } catch (error) {
    console.error(
      "Failed to load cart:",
      error
    );

    showCartError(
      cartContainer,
      error.message ||
        "Unable to load your cart."
    );
  }
}

/* ================================================================
   LOAD PRODUCT DETAILS
================================================================ */

async function loadCartProductDetails(
  rawCartItems
) {
  const requests = rawCartItems.map(
    async (cartItem) => {
      const productUuid =
        cartItem?.productUuid;

      if (!productUuid) {
        return null;
      }

      try {
        const response = await apiRequest(
          `/products/${encodeURIComponent(
            productUuid
          )}`,
          {
            method: "GET",
          }
        );

        const product =
          response?.data || response;

        return {
          cartItemUuid:
            cartItem?.uuid || "",

          productUuid,

          quantity: normalizeQuantity(
            cartItem?.qty
          ),

          name:
            product?.name ||
            "Unnamed product",

          description:
            product?.description || "",

          price: normalizePrice(
            product?.price
          ),

          stock: normalizeStock(
            product?.stock
          ),

          image: getProductImage(product),
        };
      } catch (error) {
        console.error(
          `Unable to load product ${productUuid}:`,
          error
        );

        return {
          cartItemUuid:
            cartItem?.uuid || "",

          productUuid,

          quantity: normalizeQuantity(
            cartItem?.qty
          ),

          name: "Product unavailable",
          description: "",
          price: 0,
          stock: 0,
          image:
            "../images/logo-cartora.png",
        };
      }
    }
  );

  const resolvedItems =
    await Promise.all(requests);

  return resolvedItems.filter(Boolean);
}

/* ================================================================
   RENDER CART
================================================================ */

function renderCart() {
  const cartContainer =
    document.getElementById("cart-items");

  if (!cartContainer) {
    return;
  }

  if (cartItems.length === 0) {
    cartContainer.innerHTML = `
      <div class="py-12 text-center">
        <p class="text-lg text-gray-500">
          Your cart is empty.
        </p>

        <a
          href="product-page.html"
          class="mt-4 inline-block rounded-lg
                 bg-[#F06A22] px-6 py-2.5
                 font-medium text-white
                 transition-colors
                 hover:bg-orange-600"
        >
          Continue Shopping
        </a>
      </div>
    `;

    updateSummary();
    return;
  }

  cartContainer.innerHTML = cartItems
    .map(createCartItemMarkup)
    .join("");

  updateSummary();
}

function createCartItemMarkup(item) {
  const subtotal =
    item.price * item.quantity;

  const productUuid =
    encodeURIComponent(
      item.productUuid
    );

  const name =
    escapeHtml(item.name);

  const image =
    escapeHtml(item.image);

  const cannotIncrease =
    item.stock > 0 &&
    item.quantity >= item.stock;

  return `
    <article
      class="grid grid-cols-1 gap-4 py-5
             sm:grid-cols-[1fr_90px_140px_90px]
             sm:items-center"
      data-product-uuid="${productUuid}"
    >
      <div class="flex items-center gap-4">
        <a
          href="product-detail.html?uuid=${productUuid}"
          class="flex h-24 w-24 shrink-0
                 items-center justify-center
                 overflow-hidden rounded-lg
                 border border-gray-200
                 bg-white p-2 shadow-sm"
        >
          <img
            src="${image}"
            alt="${name}"
            class="max-h-full max-w-full
                   object-contain"
            onerror="
              this.onerror = null;
              this.src = '../images/logo-cartora.png';
            "
          >
        </a>

        <div>
          <a
            href="product-detail.html?uuid=${productUuid}"
          >
            <h3
              class="font-medium
                     text-green-900"
            >
              ${name}
            </h3>
          </a>

          <p
            class="mt-1 text-sm
                   text-gray-500 sm:hidden"
          >
            ${formatCurrency(item.price)}
          </p>

          ${
            item.stock > 0
              ? `
                <p
                  class="mt-1 text-xs
                         text-gray-400"
                >
                  ${item.stock} available
                </p>
              `
              : `
                <p
                  class="mt-1 text-xs
                         text-red-500"
                >
                  Out of stock
                </p>
              `
          }
        </div>
      </div>

      <div
        class="hidden text-center
               text-sm text-gray-600
               sm:block"
      >
        ${formatCurrency(item.price)}
      </div>

      <div
        class="flex items-center gap-3
               sm:justify-center"
      >
        <div
          class="inline-flex items-center
                 overflow-hidden rounded-full
                 border border-gray-300
                 bg-white"
        >
          <button
            type="button"
            data-action="decrease"
            data-product-uuid="${productUuid}"
            class="flex h-8 w-9 items-center
                   justify-center text-gray-500
                   transition hover:bg-gray-100
                   disabled:cursor-not-allowed
                   disabled:opacity-40"
            aria-label="Decrease quantity"
            ${item.quantity <= 1
              ? "disabled"
              : ""}
          >
            −
          </button>

          <span
            class="flex h-8 min-w-8
                   items-center justify-center
                   text-sm"
          >
            ${item.quantity}
          </span>

          <button
            type="button"
            data-action="increase"
            data-product-uuid="${productUuid}"
            class="flex h-8 w-9 items-center
                   justify-center text-gray-500
                   transition hover:bg-gray-100
                   disabled:cursor-not-allowed
                   disabled:opacity-40"
            aria-label="Increase quantity"
            ${cannotIncrease
              ? "disabled"
              : ""}
          >
            +
          </button>
        </div>

        <button
          type="button"
          data-action="remove"
          data-product-uuid="${productUuid}"
          class="flex h-8 w-8 items-center
                 justify-center rounded-full
                 border border-red-400
                 text-red-500 transition
                 hover:bg-red-50"
          aria-label="Clear cart"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path
              d="M19 7l-.867 12.142A2 2 0
                 0116.138 21H7.862A2 2 0
                 015.867 19.142L5 7"
            ></path>

            <path
              d="M10 11v6M14 11v6
                 M9 7V4h6v3M4 7h16"
            ></path>
          </svg>
        </button>
      </div>

      <div
        class="text-right text-sm
               font-medium text-gray-600"
      >
        ${formatCurrency(subtotal)}
      </div>
    </article>
  `;
}

/* ================================================================
   CART ACTIONS
================================================================ */

async function handleCartAction(event) {
  const button = event.target.closest(
    "button[data-action]"
  );

  if (!button) {
    return;
  }

  const action =
    button.dataset.action;

  const productUuid =
    decodeURIComponent(
      button.dataset.productUuid || ""
    );

  if (!productUuid) {
    console.error(
      "Product UUID is missing."
    );
    return;
  }

  const item = cartItems.find(
    (cartItem) =>
      cartItem.productUuid === productUuid
  );

  if (!item) {
    console.error(
      "Cart item was not found."
    );
    return;
  }

  if (action === "increase") {
    const nextQuantity =
      item.quantity + 1;

    if (
      item.stock > 0 &&
      nextQuantity > item.stock
    ) {
      alert(
        "Quantity cannot exceed available stock."
      );
      return;
    }

    await updateCartItemQuantity(
      item,
      nextQuantity,
      button
    );

    return;
  }

  if (action === "decrease") {
    if (item.quantity <= 1) {
      return;
    }

    await updateCartItemQuantity(
      item,
      item.quantity - 1,
      button
    );

    return;
  }

  if (action === "remove") {
    await clearEntireCart(button);
  }
}

/* ================================================================
   UPDATE QUANTITY
================================================================ */

async function updateCartItemQuantity(
  item,
  newQuantity,
  button
) {
  if (
    !Number.isInteger(newQuantity) ||
    newQuantity < 1
  ) {
    console.error(
      "Quantity must be greater than zero."
    );
    return;
  }

  const originalContent =
    button.innerHTML;

  setButtonLoading(button, true);

  try {
    const response = await apiRequest(
      "/carts/update-item-qty",
      {
        method: "PUT",

        body: JSON.stringify({
          userUuid,
          productUuid:
            item.productUuid,
          sugarLevel: "NONE",
          qty: newQuantity,
        }),
      }
    );

    console.log(
      "Update quantity response:",
      response
    );

    item.quantity = newQuantity;

    renderCart();
  } catch (error) {
    console.error(
      "Unable to update quantity:",
      error
    );

    alert(
      error.message ||
        "Unable to update quantity."
    );

    button.innerHTML =
      originalContent;

    button.disabled = false;
  }
}

/* ================================================================
   CLEAR CART
================================================================ */

async function clearEntireCart(button = null) {
  if (!userUuid) {
    alert(
      "User information is missing."
    );
    return;
  }

  const confirmed = window.confirm(
    "The API can only delete the entire cart. Clear all cart items?"
  );

  if (!confirmed) {
    return;
  }

  const originalContent =
    button?.innerHTML || "";

  if (button) {
    setButtonLoading(button, true);
  }

  try {
    const response = await apiRequest(
      `/carts/${encodeURIComponent(
        userUuid
      )}/clear-cart`,
      {
        method: "DELETE",
      }
    );

    console.log(
      "Clear cart response:",
      response
    );

    cartItems = [];
    cartUuid = null;

    renderCart();

    alert(
      "Cart cleared successfully."
    );
  } catch (error) {
    console.error(
      "Unable to clear cart:",
      error
    );

    alert(
      error.message ||
        "Unable to clear the cart."
    );

    if (button) {
      button.innerHTML =
        originalContent;

      button.disabled = false;
    }
  }
}

/* ================================================================
   SUMMARY
================================================================ */

function calculateCartTotal() {
  return cartItems.reduce(
    (total, item) => {
      return (
        total +
        item.price * item.quantity
      );
    },
    0
  );
}

function updateSummary() {
  const subtotalElement =
    document.getElementById(
      "summary-subtotal"
    );

  const totalElement =
    document.getElementById(
      "summary-total"
    );

  const paymentAmount =
    document.getElementById(
      "payment-amount"
    );

  const total =
    calculateCartTotal();

  if (subtotalElement) {
    subtotalElement.textContent =
      formatCurrency(total);
  }

  if (totalElement) {
    totalElement.textContent =
      formatCurrency(total);
  }

  if (paymentAmount) {
    paymentAmount.textContent =
      total.toFixed(2);
  }
}

/* ================================================================
   UI STATES
================================================================ */

function showCartLoading(container) {
  container.innerHTML = `
    <div class="py-12 text-center">
      <div
        class="mx-auto h-10 w-10
               animate-spin rounded-full
               border-4 border-gray-200
               border-t-violet-500"
      ></div>

      <p class="mt-4 text-sm text-gray-500">
        Loading your cart...
      </p>
    </div>
  `;
}

function showCartError(
  container,
  message
) {
  container.innerHTML = `
    <div class="py-12 text-center">
      <p class="font-medium text-red-600">
        ${escapeHtml(message)}
      </p>

      <button
        type="button"
        id="retry-cart-button"
        class="mt-4 rounded-lg
               bg-[#F06A22] px-5
               py-2.5 text-sm
               font-medium text-white
               hover:bg-orange-600"
      >
        Try Again
      </button>
    </div>
  `;

  document
    .getElementById(
      "retry-cart-button"
    )
    ?.addEventListener(
      "click",
      loadCart
    );
}

function setButtonLoading(
  button,
  loading
) {
  if (!button) {
    return;
  }

  button.disabled = loading;

  if (loading) {
    button.innerHTML = `
      <span
        class="h-4 w-4 animate-spin
               rounded-full border-2
               border-gray-300
               border-t-gray-700"
      ></span>
    `;
  }
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

function getProductImage(product) {
  return (
    product?.thumbnail ||
    product?.images?.[0] ||
    product?.image ||
    product?.imageUrl ||
    "../images/logo-cartora.png"
  );
}

function normalizeQuantity(value) {
  const quantity =
    Number(value);

  if (!Number.isFinite(quantity)) {
    return 1;
  }

  return Math.max(
    1,
    Math.floor(quantity)
  );
}

function normalizePrice(value) {
  const price =
    Number(value);

  return Number.isFinite(price)
    ? Math.max(price, 0)
    : 0;
}

function normalizeStock(value) {
  const stock =
    Number(value);

  return Number.isFinite(stock)
    ? Math.max(stock, 0)
    : 0;
}

function formatCurrency(value) {
  const amount =
    Number(value);

  if (!Number.isFinite(amount)) {
    return "$0.00";
  }

  return `$${amount.toFixed(2)}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}