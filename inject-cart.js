/* ============================================================
     DATA LAYER — wire this up to your real API.

     Expected shape (adjust to match your backend):

     GET /api/cart  ->
     {
       merchant: "CARTORA",
       currency: "USD",
       qrImageUrl: "https://.../khqr.png",   // or raw KHQR string to render as QR
       items: [
         { id, name, price, quantity, imageUrl }
       ]
     }

     Note: there's no static "amount" field — the payment panel's amount
     is always derived from the live sum of items (see updatePaymentAmount).
     ============================================================ */

const cartItemsEl = document.getElementById("cart-items");
const subtotalEl = document.getElementById("subtotal-value");
const totalEl = document.getElementById("total-value");
const amountValueEl = document.getElementById("amount-value");
const merchantEl = document.getElementById("merchant-name");
const qrBoxEl = document.getElementById("qr-box");

let cart = { items: [] };

// Placeholder icon shown when an item has no imageUrl
const fallbackIconSVG = `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-9 h-9">
      <path d="M9 2L7 4L4 6L4 21H9V12H15V21H20V6L17 4L15 2L12 4L9 2Z"
            stroke="#2b2b33" stroke-width="1.2" stroke-linejoin="round"/>
    </svg>`;

function currency(n) {
  return `$${Number(n).toFixed(2).replace(/\.00$/, "")}`;
}

function renderCart() {
  cartItemsEl.innerHTML = "";

  if (cart.items.length === 0) {
    cartItemsEl.innerHTML = `<p class="text-sm text-textmuted py-6 text-center">Your cart is empty.</p>`;
    subtotalEl.textContent = currency(0);
    totalEl.textContent = currency(0);
    return;
  }

  let subtotal = 0;

  cart.items.forEach((item) => {
    const rowSub = item.price * item.quantity;
    subtotal += rowSub;

    const qtyControlHTML = `
        <div class="flex items-center justify-center gap-2.5">
          <button data-action="dec" data-id="${item.id}"
                  class="w-[26px] h-[26px] rounded-full border border-bordersoft bg-white text-sm leading-none flex items-center justify-center hover:bg-brandpurplelight">
            –
          </button>
          <span class="text-sm min-w-[18px] text-center">${String(item.quantity).padStart(2, "0")}</span>
          <button data-action="inc" data-id="${item.id}"
                  class="w-[26px] h-[26px] rounded-full border border-bordersoft bg-white text-sm leading-none flex items-center justify-center hover:bg-brandpurplelight">
            +
          </button>
        </div>`;

    const photoHTML = (sizeClass) => `
        <div class="${sizeClass} rounded-lg border border-bordersoft bg-[#fafafa] flex items-center justify-center overflow-hidden flex-shrink-0">
          ${
            item.imageUrl
              ? `<img src="${item.imageUrl}" alt="${item.name}" class="w-full h-full object-cover">`
              : fallbackIconSVG
          }
        </div>`;

    const row = document.createElement("div");
    row.className = "py-4 border-t border-bordersoft";
    row.innerHTML = `
        <!-- MOBILE: photo on the left, details stacked on the right -->
        <div class="flex sm:hidden gap-4">
          ${photoHTML("w-24 h-24")}
          <div class="flex-1 flex flex-col gap-2 min-w-0">
            <span class="text-brandgreen font-semibold text-sm truncate">${item.name}</span>
            <div class="flex items-center justify-between text-sm">
              <span class="text-textmuted">Price</span>
              <span>${currency(item.price)}</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-textmuted">Quantity</span>
              ${qtyControlHTML}
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-textmuted">Sub Total</span>
              <span class="flex items-center gap-3">
                <span class="font-semibold">${currency(rowSub)}</span>
                <button data-action="del" data-id="${item.id}"
                        class="w-[26px] h-[26px] rounded-full bg-brandred text-white text-xs flex items-center justify-center hover:opacity-85">
                  🗑
                </button>
              </span>
            </div>
          </div>
        </div>

        <!-- TABLET / LAPTOP: original 4-column grid -->
        <div class="hidden sm:grid grid-cols-[2fr_1fr_1.4fr_1fr] items-center">
          <div class="flex items-center gap-3.5">
            ${photoHTML("w-[60px] h-[60px]")}
            <span class="text-brandgreen font-semibold text-sm">${item.name}</span>
          </div>

          <div class="text-center text-sm">${currency(item.price)}</div>

          ${qtyControlHTML}

          <div class="flex items-center justify-center gap-3.5 text-sm">
            <span>${currency(rowSub)}</span>
            <button data-action="del" data-id="${item.id}"
                    class="w-[26px] h-[26px] rounded-full bg-brandred text-white text-xs flex items-center justify-center hover:opacity-85">
              🗑
            </button>
          </div>
        </div>
      `;
    cartItemsEl.appendChild(row);
  });

  subtotalEl.textContent = currency(subtotal);
  totalEl.textContent = currency(subtotal);

  // Keep the payment panel's amount in sync with the live cart total.
  updatePaymentAmount(subtotal);
}

function renderPayment() {
  merchantEl.textContent = cart.merchant || "CARTORA";

  // If your API gives you a ready-made QR image URL, drop it in here:
  if (cart.qrImageUrl) {
    qrBoxEl.innerHTML = `<img src="${cart.qrImageUrl}" alt="KHQR code" class="w-full h-full object-contain">`;
  }
  // Otherwise qrBoxEl stays as the empty "QR CODE" placeholder box
  // until you render/generate the KHQR code into it.
}

function updatePaymentAmount(total) {
  amountValueEl.textContent = Number(total).toFixed(2);

  // ⚠️ IMPORTANT when you wire up the real Bakong/KHQR API:
  // The amount shown here is just a text label — it does NOT change what's
  // encoded inside the QR image/string above. A KHQR code has the exact
  // amount baked into its data, so if the cart total changes, the QR
  // itself has to be regenerated to match (usually via a call to your
  // backend, which calls Bakong to issue a new QR for the new total).
  // A common pattern is to only do this once, at checkout, after the
  // cart is finalized — rather than on every +/- click.
  //
  // Example:
  // regenerateKhqrCode(total).then(qr => {
  //   qrBoxEl.innerHTML = `<img src="${qr.imageUrl}" class="w-full h-full object-contain">`;
  // });
}

cartItemsEl.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const id = btn.dataset.id;
  const action = btn.dataset.action;
  const item = cart.items.find((i) => String(i.id) === String(id));
  if (!item) return;

  if (action === "inc") item.quantity += 1;
  if (action === "dec") item.quantity = Math.max(1, item.quantity - 1);
  if (action === "del") {
    cart.items = cart.items.filter((i) => String(i.id) !== String(id));
  }
  renderCart();
  // TODO: if the API should persist qty/delete changes, fire your
  // PATCH/DELETE request here too.
});

/* ============================================================
     FETCH — replace the mock below with your real endpoint call.
     ============================================================ */
async function loadCart() {
  try {
    // const res = await fetch('https://your-api.com/api/cart');
    // cart = await res.json();

    // --- mock data (remove once your API is wired up) ---
    cart = {
      merchant: "CARTORA",
      currency: "USD",
      qrImageUrl: null, // set to a real image URL to preview
      items: [
        {
          id: 1,
          name: "Knit Cocoon Coat",
          price: 36,
          quantity: 1,
          imageUrl: null,
        },
        {
          id: 2,
          name: "Knit Cocoon Coat",
          price: 36,
          quantity: 1,
          imageUrl: null,
        },
        {
          id: 3,
          name: "Knit Cocoon Coat",
          price: 36,
          quantity: 1,
          imageUrl: null,
        },
      ],
    };
    // -------------------------------------------------------

    renderCart();
    renderPayment();
  } catch (err) {
    cartItemsEl.innerHTML = `<p class="text-sm text-brandred py-6 text-center">Failed to load cart. ${err.message}</p>`;
    console.error("Failed to load cart:", err);
  }
}

loadCart();
