"use strict"
    // Sample Wishlist State Data
    const baseUrl = "";
    let wishlistItems = [
      { id: 1, name: 'Knit Cocoon Coat', price: 36, quantity: 1, selected: false, image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&auto=format&fit=crop&q=80' },
      { id: 2, name: 'Knit Cocoon Coat', price: 36, quantity: 1, selected: false, image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&auto=format&fit=crop&q=80' },
      { id: 3, name: 'Knit Cocoon Coat', price: 36, quantity: 1, selected: false, image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&auto=format&fit=crop&q=80' },
      { id: 4, name: 'Knit Cocoon Coat', price: 36, quantity: 1, selected: false, image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&auto=format&fit=crop&q=80' },
      { id: 5, name: 'Knit Cocoon Coat', price: 36, quantity: 1, selected: false, image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&auto=format&fit=crop&q=80' }
    ];

    const container = document.getElementById('wishlist-container');
    const emptyState = document.getElementById('empty-state');
    const actionBar = document.getElementById('action-bar');
    const selectAllCheckbox = document.getElementById('select-all');

    // Render Wishlist
    function render() {
      if (wishlistItems.length === 0) {
        container.classList.add('hidden');
        actionBar.classList.add('hidden');
        emptyState.classList.remove('hidden');
        selectAllCheckbox.checked = false;
        return;
      }

      container.classList.remove('hidden');
      actionBar.classList.remove('hidden');
      emptyState.classList.add('hidden');

      container.innerHTML = wishlistItems.map(item => `
        <div class="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-gray-300 transition-all duration-200 font-['Poppins']">
          
          <!-- Left: Checkbox, Image, Title -->
          <div class="flex items-center gap-4 w-full md:w-auto">
            <input type="checkbox" ${item.selected ? 'checked' : ''} 
              onchange="toggleSelect(${item.id})"
              class="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary primacursor-pointer accent-(--primary)" />
            
            <div class="w-24 h-24 sm:w-28 sm:h-28 bg-white p-2 rounded-xl shadow-md border border-gray-100 flex-shrink-0 flex items-center justify-center">
              <img src="${item.image}" alt="${item.name}" class="max-h-full max-w-full object-contain rounded-lg" />
            </div>

            <div class="font-heading font-medium text-lg sm:text-xl text-[#2C523B] text-[16px] sm:text-[20px] md:text-[20px] lg:text-[24px]">${item.name}</div>
          </div>

          <!-- Right: Price, Quantity, Actions -->
          <div class="flex items-center lg:items-center justify-between sm:justify-end  md:gap-4 lg:gap-4 sm:gap-8 w-full md:w-auto">
            <span class="font-semibold text-[16px] sm:text-[16px] md:text-[16px] lg:text-lg text-text-main">$${item.price * item.quantity}</span>
        <div class="flex items-center gap-4">
            <!-- Add to Cart Button -->
            <button onclick="addToCart('${item.name}')" class="bg-(--primary) hover:bg-orange-400 text-white font-heading font-medium px-5 py-2.5 sm:px-5 sm:py-2.5 md:px-5 md:py-2.5 lg:px-5 lg:py-2.5 rounded-lg shadow-sm transition-colors text-[12px] sm:text-[18px] md:text-[12px] lg:text-sm">
             <a href=""> Add To Cart </a>
            </button>
            <!-- Delete Icon -->
            <button onclick="removeItem(${item.id})" class="text-red-500 hover:text-red-600 p-1 rounded-full border border-red-500/30 hover:bg-red-50 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
        </div>
          </div>
        </div>
      `).join('');

      updateCalculations();
    }

    function toggleSelect(id) {
      wishlistItems = wishlistItems.map(item => 
        item.id === id ? { ...item, selected: !item.selected } : item
      );
      render();
    }

    function removeItem(id) {
      wishlistItems = wishlistItems.filter(item => item.id !== id);
      render();
    }

    // Event Listeners
    selectAllCheckbox.addEventListener('change', (e) => {
      const isChecked = e.target.checked;
      wishlistItems = wishlistItems.map(item => ({ ...item, selected: isChecked }));
      render();
    });

    document.getElementById('add-all-btn').addEventListener('click', () => {
      const selectedItems = wishlistItems.filter(i => i.selected);
      if (selectedItems.length === 0) {to
        alert('Please select at least one item.');
        return;
      }
      alert(`Added ${selectedItems.length} item(s) to your cart!`);
    });

    function addToCart(name) {
      alert(`Added "${name}" to your cart!`);
    }

    // Initial Load
    render();