export function productCardComponents({ id, images, title, price }) {
  return `
  <div id="${id}" class="w-full max-w-sm bg-neutral-primary-soft p-6 border border-default rounded-base shadow-xs">
  
      <a href="#">
          <img
              class="rounded-base mb-6"
              referrerpolicy="no-referrer"
              src="${images[0]}"
              alt="${title}"
          />
      </a>
  
      <div>
  
          <div class="flex items-center space-x-3 mb-6">
              <!-- Your 5 SVG stars stay here -->
              <span class="bg-brand-softer border border-brand-subtle text-fg-brand-strong text-xs font-medium px-1.5 py-0.5 rounded-sm">
                  4.8 out of 5
              </span>
          </div>
  
          <a href="#">
              <h5 class="text-xl text-heading font-semibold tracking-tight">
                  ${title}
              </h5>
          </a>
  
          <div class="flex items-center justify-between mt-6">
  
              <span class="text-3xl font-extrabold text-heading">
                  $${price}
              </span>
  
              <button
                  type="button"
                  class="inline-flex items-center text-white bg-brand hover:bg-brand-strong box-border border border-transparent focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-3 py-2 focus:outline-none">
  
                  <svg class="w-4 h-4 me-1.5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24">
                      <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7H7.312"/>
                  </svg>
  
                  Add to cart
  
              </button>
  
          </div>
  
      </div>
  
  </div>
  `;
}
