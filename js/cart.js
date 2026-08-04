"use strict";

// ================================================================
// cart.js
// Cart and payment UI only — no API requests yet
// ================================================================

let cartItems = [
  {
    id: 1,
    name: "Knit Cocoon Coat",
    price: 36,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&auto=format&fit=crop&q=80",
  },
  {
    id: 2,
    name: "Knit Cocoon Coat",
    price: 36,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&auto=format&fit=crop&q=80",
  },
  {
    id: 3,
    name: "Knit Cocoon Coat",
    price: 36,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&auto=format&fit=crop&q=80",
  },
];

document.addEventListener("DOMContentLoaded", () => {
  initCartPage();
});

function initCartPage() {
  const cartContainer = document.getElementById("cart-items");

  if (!cartContainer) {
    return;
  }

  cartContainer.addEventListener("click", handleCartAction);

  renderCart();
}

function formatCurrency(value) {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "$0.00";
  }

  return `$${amount.toFixed(2)}`;
}

function renderCart() {
  const cartContainer = document.getElementById("cart-items");

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
          class="mt-4 inline-block rounded-lg bg-(--primary)
                 px-6 py-2.5 font-medium text-white
                 transition-colors hover:bg-orange-400"
        >
          Continue Shopping
        </a>
      </div>
    `;

    updateSummary();
    return;
  }

  cartContainer.innerHTML = cartItems
    .map((item) => {
      const subtotal = item.price * item.quantity;

      return `
        <article
          class="grid grid-cols-1 gap-4 py-5
                 sm:grid-cols-[1fr_90px_120px_90px]
                 sm:items-center"
          data-cart-id="${item.id}"
        >
          <div class="flex items-center gap-4">
            <div
              class="flex h-24 w-24 shrink-0 items-center
                     justify-center overflow-hidden rounded-lg
                     border border-gray-200 bg-white p-2 shadow-sm"
            >
              <img
                src="${item.image}"
                alt="${item.name}"
                class="max-h-full max-w-full object-contain"
              >
            </div>

            <div>
              <h3 class="font-medium text-green-900">
                ${item.name}
              </h3>

              <p class="mt-1 text-sm text-gray-500 sm:hidden">
                ${formatCurrency(item.price)}
              </p>
            </div>
          </div>

          <div class="hidden text-center text-sm text-gray-600 sm:block">
            ${formatCurrency(item.price)}
          </div>

          <div class="flex items-center gap-3 sm:justify-center">
            <div
              class="inline-flex items-center overflow-hidden
                     rounded-full border border-gray-300 bg-white"
            >
              <button
                type="button"
                data-action="decrease"
                data-id="${item.id}"
                class="flex h-8 w-9 items-center justify-center
                       text-gray-500 transition hover:bg-gray-100
                       disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Decrease quantity"
                ${item.quantity <= 1 ? "disabled" : ""}
              >
                −
              </button>

              <span
                class="flex h-8 min-w-8 items-center
                       justify-center text-sm"
              >
                ${item.quantity}
              </span>

              <button
                type="button"
                data-action="increase"
                data-id="${item.id}"
                class="flex h-8 w-9 items-center justify-center
                       text-gray-500 transition hover:bg-gray-100"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <button
              type="button"
              data-action="remove"
              data-id="${item.id}"
              class="flex h-8 w-8 items-center justify-center
                     rounded-full border border-red-400 text-red-500
                     transition hover:bg-red-50"
              aria-label="Remove ${item.name}"
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

                <path d="M10 11v6M14 11v6M9 7V4h6v3M4 7h16"></path>
              </svg>
            </button>
          </div>

          <div class="text-right text-sm font-medium text-gray-600">
            ${formatCurrency(subtotal)}
          </div>
        </article>
      `;
    })
    .join("");

  updateSummary();
}

function handleCartAction(event) {
  const actionButton = event.target.closest(
    "button[data-action]"
  );

  if (!actionButton) {
    return;
  }

  const itemId = Number(actionButton.dataset.id);
  const action = actionButton.dataset.action;

  if (!Number.isInteger(itemId)) {
    return;
  }

  const item = cartItems.find(
    (cartItem) => cartItem.id === itemId
  );

  if (!item) {
    return;
  }

  if (action === "increase") {
    item.quantity += 1;
  }

  if (action === "decrease" && item.quantity > 1) {
    item.quantity -= 1;
  }

  if (action === "remove") {
    cartItems = cartItems.filter(
      (cartItem) => cartItem.id !== itemId
    );
  }

  renderCart();
}

function calculateCartTotal() {
  return cartItems.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
}

function updateSummary() {
  const subtotalElement =
    document.getElementById("summary-subtotal");

  const totalElement =
    document.getElementById("summary-total");

  const paymentAmount =
    document.getElementById("payment-amount");

  const total = calculateCartTotal();

  if (subtotalElement) {
    subtotalElement.textContent = formatCurrency(total);
  }

  if (totalElement) {
    totalElement.textContent = formatCurrency(total);
  }

  if (paymentAmount) {
    paymentAmount.textContent = total.toFixed(2);
  }
}