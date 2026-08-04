"use strict";

// ================================================================
// product-detail.js
// UI interactions only — no API requests yet
// ================================================================

document.addEventListener("DOMContentLoaded", () => {
  initProductGallery();
  initColorSelector();
  initQuantitySelector();
  initProductActions();
});

function initProductGallery() {
  const mainImage = document.getElementById("main-product-image");
  const thumbnailButtons =
    document.querySelectorAll(".product-thumbnail");

  if (!mainImage || thumbnailButtons.length === 0) {
    return;
  }

  thumbnailButtons.forEach((thumbnailButton) => {
    thumbnailButton.addEventListener("click", () => {
      const imageSource = thumbnailButton.dataset.image;
      const imageAlt =
        thumbnailButton.dataset.alt || "Selected product image";

      if (!imageSource) {
        return;
      }

      thumbnailButtons.forEach((button) => {
        button.classList.remove("border-(--primary)");
        button.classList.add("border-transparent");
        button.setAttribute("aria-pressed", "false");
      });

      thumbnailButton.classList.remove("border-transparent");
      thumbnailButton.classList.add("border-(--primary)");
      thumbnailButton.setAttribute("aria-pressed", "true");

      mainImage.classList.add("opacity-0", "scale-95");

      setTimeout(() => {
        mainImage.src = imageSource;
        mainImage.alt = imageAlt;
        mainImage.classList.remove("opacity-0", "scale-95");
      }, 150);
    });
  });
}

function initColorSelector() {
  const colorButtons =
    document.querySelectorAll(".product-color");

  const selectedColorName =
    document.getElementById("selected-color-name");

  if (colorButtons.length === 0 || !selectedColorName) {
    return;
  }

  colorButtons.forEach((colorButton) => {
    colorButton.addEventListener("click", () => {
      const colorName =
        colorButton.dataset.color || "Selected color";

      colorButtons.forEach((button) => {
        button.classList.remove("ring-slate-800");
        button.classList.add("ring-transparent");
        button.setAttribute("aria-pressed", "false");
      });

      colorButton.classList.remove("ring-transparent");
      colorButton.classList.add("ring-slate-800");
      colorButton.setAttribute("aria-pressed", "true");

      selectedColorName.textContent = colorName;
    });
  });
}

function initQuantitySelector() {
  const quantityInput =
    document.getElementById("product-quantity");

  const decreaseButton =
    document.getElementById("decrease-quantity");

  const increaseButton =
    document.getElementById("increase-quantity");

  if (!quantityInput || !decreaseButton || !increaseButton) {
    return;
  }

  function getQuantity() {
    const quantity = Number.parseInt(quantityInput.value, 10);

    if (!Number.isInteger(quantity)) {
      return 1;
    }

    return Math.min(Math.max(quantity, 1), 99);
  }

  function setQuantity(quantity) {
    const safeQuantity = Math.min(
      Math.max(quantity, 1),
      99
    );

    quantityInput.value = String(safeQuantity);

    decreaseButton.disabled = safeQuantity <= 1;

    decreaseButton.classList.toggle(
      "cursor-not-allowed",
      safeQuantity <= 1
    );

    decreaseButton.classList.toggle(
      "opacity-40",
      safeQuantity <= 1
    );
  }

  decreaseButton.addEventListener("click", () => {
    setQuantity(getQuantity() - 1);
  });

  increaseButton.addEventListener("click", () => {
    setQuantity(getQuantity() + 1);
  });

  quantityInput.addEventListener("change", () => {
    setQuantity(getQuantity());
  });

  setQuantity(getQuantity());
}

function initProductActions() {
  const addToCartButton =
    document.getElementById("add-to-cart-button");

  const wishlistButton =
    document.getElementById("wishlist-button");

  const buyNowButton =
    document.getElementById("buy-now-button");

  const quantityInput =
    document.getElementById("product-quantity");

  const actionMessage =
    document.getElementById("product-action-message");

  let messageTimer;

  function getSelectedQuantity() {
    const quantity = Number.parseInt(
      quantityInput?.value || "1",
      10
    );

    return Number.isInteger(quantity) && quantity > 0
      ? quantity
      : 1;
  }

  function showActionMessage(message, type = "success") {
    if (!actionMessage) {
      return;
    }

    clearTimeout(messageTimer);

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

    messageTimer = setTimeout(() => {
      actionMessage.classList.add("hidden");
    }, 3000);
  }

  addToCartButton?.addEventListener("click", () => {
    const quantity = getSelectedQuantity();

    showActionMessage(
      `${quantity} item(s) added to cart successfully.`
    );
  });

  wishlistButton?.addEventListener("click", () => {
    const isInWishlist =
      wishlistButton.getAttribute("aria-pressed") === "true";

    const nextState = !isInWishlist;

    wishlistButton.setAttribute(
      "aria-pressed",
      String(nextState)
    );

    wishlistButton.classList.toggle(
      "bg-gray-200",
      !nextState
    );

    wishlistButton.classList.toggle(
      "text-gray-700",
      !nextState
    );

    wishlistButton.classList.toggle(
      "bg-rose-100",
      nextState
    );

    wishlistButton.classList.toggle(
      "text-rose-600",
      nextState
    );

    showActionMessage(
      nextState
        ? "Product added to wishlist."
        : "Product removed from wishlist."
    );
  });

  buyNowButton?.addEventListener("click", () => {
    const quantity = getSelectedQuantity();

    showActionMessage(
      `Ready to buy ${quantity} item(s).`
    );
  });
}