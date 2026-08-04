"use strict";

// ================================================================
// wishlist.js
// Local wishlist demo — API integration will be added later
// ================================================================

let wishlistItems = [
  {
    id: 1,
    name: "Knit Cocoon Coat",
    price: 36,
    quantity: 1,
    selected: false,
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&auto=format&fit=crop&q=80",
  },
  {
    id: 2,
    name: "Knit Cocoon Coat",
    price: 36,
    quantity: 1,
    selected: false,
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&auto=format&fit=crop&q=80",
  },
  {
    id: 3,
    name: "Knit Cocoon Coat",
    price: 36,
    quantity: 1,
    selected: false,
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&auto=format&fit=crop&q=80",
  },
  {
    id: 4,
    name: "Knit Cocoon Coat",
    price: 36,
    quantity: 1,
    selected: false,
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&auto=format&fit=crop&q=80",
  },
  {
    id: 5,
    name: "Knit Cocoon Coat",
    price: 36,
    quantity: 1,
    selected: false,
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&auto=format&fit=crop&q=80",
  },
];

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatPrice(value) {
  const price = Number(value);

  if (!Number.isFinite(price)) {
    return "0.00";
  }

  return price.toFixed(2);
}

function getWishlistElements() {
  return {
    container: document.getElementById("wishlist-container"),
    emptyState: document.getElementById("empty-state"),
    actionBar: document.getElementById("action-bar"),
    selectAllCheckbox: document.getElementById("select-all"),
    addAllButton: document.getElementById("add-all-btn"),
  };
}

function renderWishlist() {
  const {
    container,
    emptyState,
    actionBar,
    selectAllCheckbox,
  } = getWishlistElements();

  if (
    !container ||
    !emptyState ||
    !actionBar ||
    !selectAllCheckbox
  ) {
    console.error("Wishlist page elements are missing.");
    return;
  }

  if (wishlistItems.length === 0) {
    container.innerHTML = "";
    container.classList.add("hidden");
    actionBar.classList.add("hidden");
    emptyState.classList.remove("hidden");

    selectAllCheckbox.checked = false;
    selectAllCheckbox.indeterminate = false;
    return;
  }

  container.classList.remove("hidden");
  actionBar.classList.remove("hidden");
  emptyState.classList.add("hidden");

  container.innerHTML = wishlistItems
    .map((item) => {
      const safeName = escapeHtml(item.name);
      const safeImage = escapeHtml(item.image);
      const totalPrice =
        Number(item.price) * Number(item.quantity);

      return `
        <div
          class="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-gray-300 transition-all duration-200 font-['Poppins']"
          data-item-id="${item.id}"
        >
          <div class="flex items-center gap-4 w-full md:w-auto">
            <input
              type="checkbox"
              class="wishlist-checkbox w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
              data-action="toggle-select"
              data-id="${item.id}"
              ${item.selected ? "checked" : ""}
              aria-label="Select ${safeName}"
            >

            <div class="w-24 h-24 sm:w-28 sm:h-28 bg-white p-2 rounded-xl shadow-md border border-gray-100 flex-shrink-0 flex items-center justify-center">
              <img
                src="${safeImage}"
                alt="${safeName}"
                class="max-h-full max-w-full object-contain rounded-lg"
                loading="lazy"
              >
            </div>

            <div class="font-heading font-medium text-[#2C523B] text-[16px] sm:text-[20px] lg:text-[24px]">
              ${safeName}
            </div>
          </div>

          <div class="flex items-center justify-between sm:justify-end gap-4 sm:gap-8 w-full md:w-auto">
            <span class="font-semibold text-[16px] lg:text-lg text-text-main">
              $${formatPrice(totalPrice)}
            </span>

            <div class="flex items-center gap-4">
              <button
                type="button"
                data-action="add-to-cart"
                data-id="${item.id}"
                class="bg-(--primary) hover:bg-orange-400 text-white font-heading font-medium px-5 py-2.5 rounded-lg shadow-sm transition-colors text-[12px] sm:text-[18px] md:text-[12px] lg:text-sm"
              >
                Add To Cart
              </button>

              <button
                type="button"
                data-action="remove"
                data-id="${item.id}"
                class="text-red-500 hover:text-red-600 p-1 rounded-full border border-red-500/30 hover:bg-red-50 transition-all"
                aria-label="Remove ${safeName} from wishlist"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.8"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      `;
    })
    .join("");

  updateSelectAllState();
}

function toggleSelect(id) {
  wishlistItems = wishlistItems.map((item) =>
    item.id === id
      ? { ...item, selected: !item.selected }
      : item
  );

  renderWishlist();
}

function removeItem(id) {
  wishlistItems = wishlistItems.filter(
    (item) => item.id !== id
  );

  renderWishlist();
}

function addToCart(id) {
  const item = wishlistItems.find(
    (wishlistItem) => wishlistItem.id === id
  );

  if (!item) {
    alert("Product was not found.");
    return;
  }

  alert(`Added "${item.name}" to your cart!`);
}

function updateSelectAllState() {
  const { selectAllCheckbox } = getWishlistElements();

  if (!selectAllCheckbox) {
    return;
  }

  const selectedCount = wishlistItems.filter(
    (item) => item.selected
  ).length;

  selectAllCheckbox.checked =
    wishlistItems.length > 0 &&
    selectedCount === wishlistItems.length;

  selectAllCheckbox.indeterminate =
    selectedCount > 0 &&
    selectedCount < wishlistItems.length;
}

function handleSelectAll(event) {
  const isChecked = event.target.checked;

  wishlistItems = wishlistItems.map((item) => ({
    ...item,
    selected: isChecked,
  }));

  renderWishlist();
}

function handleAddSelectedItems() {
  const selectedItems = wishlistItems.filter(
    (item) => item.selected
  );

  if (selectedItems.length === 0) {
    alert("Please select at least one item.");
    return;
  }

  alert(
    `Added ${selectedItems.length} item(s) to your cart!`
  );
}

function handleWishlistClick(event) {
  const button = event.target.closest(
    "button[data-action]"
  );

  if (!button) {
    return;
  }

  const action = button.dataset.action;
  const id = Number(button.dataset.id);

  if (!Number.isInteger(id)) {
    return;
  }

  if (action === "remove") {
    removeItem(id);
  }

  if (action === "add-to-cart") {
    addToCart(id);
  }
}

function handleWishlistChange(event) {
  const checkbox = event.target.closest(
    'input[data-action="toggle-select"]'
  );

  if (!checkbox) {
    return;
  }

  const id = Number(checkbox.dataset.id);

  if (!Number.isInteger(id)) {
    return;
  }

  toggleSelect(id);
}

function initWishlistPage() {
  const {
    container,
    selectAllCheckbox,
    addAllButton,
  } = getWishlistElements();

  if (!container) {
    return;
  }

  container.addEventListener(
    "click",
    handleWishlistClick
  );

  container.addEventListener(
    "change",
    handleWishlistChange
  );

  if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener(
      "change",
      handleSelectAll
    );
  }

  if (addAllButton) {
    addAllButton.addEventListener(
      "click",
      handleAddSelectedItems
    );
  }

  renderWishlist();
}

document.addEventListener(
  "DOMContentLoaded",
  initWishlistPage
);