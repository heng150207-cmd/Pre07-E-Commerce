// ---------------- PRODUCT DATA ----------------
const PRODUCTS = [
  // Kitchen
  { id: 1,  category: "Kitchen",     name: "Stainless Steel Cookware Set", price: "$89.99",   rating: "4.7", img: "https://images.unsplash.com/photo-1584990347449-a5d9f800a783?w=400&q=80" },
  { id: 2,  category: "Kitchen",     name: "Electric Rice Cooker",         price: "$54.99",   rating: "4.6", img: "https://loremflickr.com/400/400/ricecooker?lock=2" },
  { id: 3,  category: "Kitchen",     name: "Non-Stick Frying Pan",         price: "$24.99",   rating: "4.5", img: "https://loremflickr.com/400/400/fryingpan?lock=3" },
  { id: 4,  category: "Kitchen",     name: "Glass Stovetop Kettle",        price: "$34.99",   rating: "4.4", img: "https://loremflickr.com/400/400/kettle?lock=4" },
  { id: 101,category: "Kitchen",     name: "Chef's Knife Set",             price: "$64.99",   rating: "4.7", img: "https://loremflickr.com/400/400/kitchenknife?lock=101" },
  { id: 102,category: "Kitchen",     name: "Digital Air Fryer",            price: "$119.00",  rating: "4.8", img: "https://loremflickr.com/400/400/airfryer?lock=102" },
  { id: 103,category: "Kitchen",     name: "Bamboo Cutting Board",         price: "$18.99",   rating: "4.5", img: "https://loremflickr.com/400/400/cuttingboard?lock=103" },
  { id: 104,category: "Kitchen",     name: "Espresso Maker",               price: "$149.00",  rating: "4.6", img: "https://loremflickr.com/400/400/espressomachine?lock=104" },

  // Electronic > Laptop
  { id: 5,  category: "Laptop",      name: "ASUS VivoBook 15",             price: "$1200.32", rating: "5.0", img: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&q=80" },
  { id: 201,category: "Laptop",      name: "MacBook Air 13",               price: "$1099.00", rating: "4.9", img: "https://loremflickr.com/400/400/macbook?lock=201" },
  { id: 202,category: "Laptop",      name: "Dell XPS 14",                  price: "$1399.00", rating: "4.8", img: "https://loremflickr.com/400/400/laptop,dell?lock=202" },
  { id: 203,category: "Laptop",      name: "Lenovo ThinkPad X1",           price: "$1299.00", rating: "4.7", img: "https://loremflickr.com/400/400/laptop,thinkpad?lock=203" },
  { id: 204,category: "Laptop",      name: "HP Pavilion 15",               price: "$799.99",  rating: "4.5", img: "https://loremflickr.com/400/400/laptop,hp?lock=204" },
  { id: 205,category: "Laptop",      name: "Acer Swift 3",                 price: "$699.00",  rating: "4.4", img: "https://loremflickr.com/400/400/laptop,acer?lock=205" },
  { id: 206,category: "Laptop",      name: "MSI Gaming Laptop",            price: "$1599.00", rating: "4.8", img: "https://loremflickr.com/400/400/gaminglaptop?lock=206" },
  { id: 207,category: "Laptop",      name: "Microsoft Surface Laptop",     price: "$1199.00", rating: "4.6", img: "https://loremflickr.com/400/400/laptop,surface?lock=207" },

  // Electronic > Mobile
  { id: 6,  category: "Mobile",      name: "Galaxy Nova X",                price: "$649.99",  rating: "4.5", img: "https://loremflickr.com/400/400/smartphone?lock=6" },
  { id: 211,category: "Mobile",      name: "iPhone 15",                    price: "$799.00",  rating: "4.9", img: "https://loremflickr.com/400/400/iphone?lock=211" },
  { id: 212,category: "Mobile",      name: "Pixel 9",                      price: "$699.00",  rating: "4.7", img: "https://loremflickr.com/400/400/smartphone,android?lock=212" },
  { id: 213,category: "Mobile",      name: "OnePlus 12",                   price: "$599.00",  rating: "4.6", img: "https://loremflickr.com/400/400/smartphone?lock=213" },
  { id: 214,category: "Mobile",      name: "Xiaomi 14",                    price: "$549.00",  rating: "4.5", img: "https://loremflickr.com/400/400/smartphone,android?lock=214" },
  { id: 215,category: "Mobile",      name: "Galaxy Z Flip",                price: "$999.00",  rating: "4.6", img: "https://loremflickr.com/400/400/foldablephone?lock=215" },
  { id: 216,category: "Mobile",      name: "Nothing Phone 2",              price: "$449.00",  rating: "4.4", img: "https://loremflickr.com/400/400/smartphone?lock=216" },
  { id: 217,category: "Mobile",      name: "Motorola Edge 40",             price: "$399.00",  rating: "4.3", img: "https://loremflickr.com/400/400/smartphone?lock=217" },

  // Electronic > HeadPhone
  { id: 7,  category: "HeadPhone",   name: "Urbanista Miami Headphones",   price: "$79.99",   rating: "4.6", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80" },
  { id: 221,category: "HeadPhone",   name: "Sony WH-1000XM5",              price: "$349.00",  rating: "4.9", img: "https://loremflickr.com/400/400/headphones?lock=221" },
  { id: 222,category: "HeadPhone",   name: "Bose QuietComfort",            price: "$299.00",  rating: "4.8", img: "https://loremflickr.com/400/400/headphones?lock=222" },
  { id: 223,category: "HeadPhone",   name: "Apple AirPods Max",            price: "$449.00",  rating: "4.7", img: "https://loremflickr.com/400/400/headphones?lock=223" },
  { id: 224,category: "HeadPhone",   name: "JBL Tune 760NC",               price: "$99.00",   rating: "4.4", img: "https://loremflickr.com/400/400/headphones?lock=224" },
  { id: 225,category: "HeadPhone",   name: "Sennheiser Momentum 4",        price: "$379.00",  rating: "4.8", img: "https://loremflickr.com/400/400/headphones?lock=225" },
  { id: 226,category: "HeadPhone",   name: "Beats Studio Pro",             price: "$349.00",  rating: "4.6", img: "https://loremflickr.com/400/400/headphones?lock=226" },
  { id: 227,category: "HeadPhone",   name: "Anker Soundcore Q45",          price: "$129.00",  rating: "4.5", img: "https://loremflickr.com/400/400/headphones?lock=227" },

  // Electronic > Tablet
  { id: 8,  category: "Tablet",      name: "Apple iPad Pro 11",            price: "$799.00",  rating: "4.9", img: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80" },
  { id: 231,category: "Tablet",      name: "Samsung Galaxy Tab S9",        price: "$649.00",  rating: "4.7", img: "https://loremflickr.com/400/400/tablet?lock=231" },
  { id: 232,category: "Tablet",      name: "iPad Air",                     price: "$599.00",  rating: "4.8", img: "https://loremflickr.com/400/400/ipad?lock=232" },
  { id: 233,category: "Tablet",      name: "Lenovo Tab P12",               price: "$399.00",  rating: "4.4", img: "https://loremflickr.com/400/400/tablet?lock=233" },
  { id: 234,category: "Tablet",      name: "Microsoft Surface Pro",        price: "$999.00",  rating: "4.6", img: "https://loremflickr.com/400/400/tablet,surface?lock=234" },
  { id: 235,category: "Tablet",      name: "Amazon Fire HD 10",            price: "$149.00",  rating: "4.2", img: "https://loremflickr.com/400/400/tablet?lock=235" },
  { id: 236,category: "Tablet",      name: "Xiaomi Pad 6",                 price: "$349.00",  rating: "4.5", img: "https://loremflickr.com/400/400/tablet?lock=236" },
  { id: 237,category: "Tablet",      name: "Huawei MatePad",               price: "$329.00",  rating: "4.3", img: "https://loremflickr.com/400/400/tablet?lock=237" },

  // Electronic > Controller
  { id: 9,  category: "Controller",  name: "DualSense PS5 Controller",     price: "$69.99",   rating: "4.8", img: "https://images.unsplash.com/photo-1622297845775-5ff3fef71d13?w=400&q=80" },
  { id: 241,category: "Controller",  name: "Xbox Wireless Controller",     price: "$59.99",   rating: "4.7", img: "https://loremflickr.com/400/400/gamepad,xbox?lock=241" },
  { id: 242,category: "Controller",  name: "Nintendo Switch Pro",          price: "$69.99",   rating: "4.8", img: "https://loremflickr.com/400/400/gamepad,nintendo?lock=242" },
  { id: 243,category: "Controller",  name: "8BitDo Pro 2",                 price: "$49.99",   rating: "4.6", img: "https://loremflickr.com/400/400/gamepad?lock=243" },
  { id: 244,category: "Controller",  name: "SteelSeries Stratus",          price: "$54.99",   rating: "4.5", img: "https://loremflickr.com/400/400/gamepad?lock=244" },
  { id: 245,category: "Controller",  name: "Razer Wolverine V2",           price: "$99.99",   rating: "4.7", img: "https://loremflickr.com/400/400/gamepad?lock=245" },
  { id: 246,category: "Controller",  name: "PowerA Fusion Pro",            price: "$44.99",   rating: "4.3", img: "https://loremflickr.com/400/400/gamepad?lock=246" },
  { id: 247,category: "Controller",  name: "GameSir T4 Pro",               price: "$34.99",   rating: "4.2", img: "https://loremflickr.com/400/400/gamepad?lock=247" },

  // Fashion > Men's
  { id: 10, category: "MenFashion",   name: "Denim Jacket",                price: "$59.99",   rating: "4.4", img: "https://loremflickr.com/400/400/denimjacket?lock=10" },
  { id: 11, category: "MenFashion",   name: "Canvas Sneakers",             price: "$44.99",   rating: "4.3", img: "https://loremflickr.com/400/400/sneakers?lock=11" },
  { id: 251,category: "MenFashion",   name: "Slim Fit Chinos",             price: "$39.99",   rating: "4.4", img: "https://loremflickr.com/400/400/chinos?lock=251" },
  { id: 252,category: "MenFashion",   name: "Oxford Dress Shirt",          price: "$34.99",   rating: "4.5", img: "https://loremflickr.com/400/400/dressshirt?lock=252" },
  { id: 253,category: "MenFashion",   name: "Leather Belt",                price: "$24.99",   rating: "4.6", img: "https://loremflickr.com/400/400/leatherbelt?lock=253" },
  { id: 254,category: "MenFashion",   name: "Wool Blend Sweater",          price: "$49.99",   rating: "4.5", img: "https://loremflickr.com/400/400/sweater?lock=254" },
  { id: 255,category: "MenFashion",   name: "Classic Baseball Cap",        price: "$19.99",   rating: "4.2", img: "https://loremflickr.com/400/400/baseballcap?lock=255" },
  { id: 256,category: "MenFashion",   name: "Bomber Jacket",               price: "$69.99",   rating: "4.7", img: "https://loremflickr.com/400/400/bomberjacket?lock=256" },

  // Fashion > Women's
  { id: 12, category: "WomenFashion", name: "Classic Cardigan Coat",       price: "$46.99",   rating: "4.5", img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80" },
  { id: 13, category: "WomenFashion", name: "Aviator Sunglasses",          price: "$29.99",   rating: "4.6", img: "https://loremflickr.com/400/400/sunglasses?lock=13" },
  { id: 261,category: "WomenFashion", name: "Floral Summer Dress",         price: "$54.99",   rating: "4.6", img: "https://loremflickr.com/400/400/summerdress?lock=261" },
  { id: 262,category: "WomenFashion", name: "High-Waist Jeans",            price: "$44.99",   rating: "4.5", img: "https://loremflickr.com/400/400/jeans,women?lock=262" },
  { id: 263,category: "WomenFashion", name: "Leather Tote Bag",            price: "$79.99",   rating: "4.7", img: "https://loremflickr.com/400/400/totebag?lock=263" },
  { id: 264,category: "WomenFashion", name: "Ankle Boots",                 price: "$64.99",   rating: "4.6", img: "https://loremflickr.com/400/400/ankleboots?lock=264" },
  { id: 265,category: "WomenFashion", name: "Silk Scarf",                  price: "$22.99",   rating: "4.4", img: "https://loremflickr.com/400/400/silkscarf?lock=265" },
  { id: 266,category: "WomenFashion", name: "Wide Brim Sun Hat",           price: "$27.99",   rating: "4.3", img: "https://loremflickr.com/400/400/sunhat?lock=266" },

  // Furniture
  { id: 14, category: "Furniture",   name: "Modern Lounge Chair",          price: "$349.00",  rating: "4.8", img: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&q=80" },
  { id: 15, category: "Furniture",   name: "Wooden Coffee Table",          price: "$189.00",  rating: "4.5", img: "https://loremflickr.com/400/400/coffeetable?lock=15" },
  { id: 16, category: "Furniture",   name: "Minimalist Floor Lamp",        price: "$79.00",   rating: "4.4", img: "https://loremflickr.com/400/400/floorlamp?lock=16" },
  { id: 17, category: "Furniture",   name: "Compact Sofa Set",             price: "$549.00",  rating: "4.7", img: "https://loremflickr.com/400/400/sofa?lock=17" },
  { id: 271,category: "Furniture",   name: "Oak Bookshelf",                price: "$229.00",  rating: "4.6", img: "https://loremflickr.com/400/400/bookshelf?lock=271" },
  { id: 272,category: "Furniture",   name: "Queen Bed Frame",              price: "$399.00",  rating: "4.7", img: "https://loremflickr.com/400/400/bedframe?lock=272" },
  { id: 273,category: "Furniture",   name: "Rattan Accent Chair",          price: "$159.00",  rating: "4.5", img: "https://loremflickr.com/400/400/rattanchair?lock=273" },
  { id: 274,category: "Furniture",   name: "TV Stand Console",             price: "$129.00",  rating: "4.4", img: "https://loremflickr.com/400/400/tvstand?lock=274" }
];

const byId = (id) => PRODUCTS.find(p => p.id === id);

// ---------------- CARD TEMPLATE (matches reference card style) ----------------
function starRow(rating) {
  const full = Math.round(parseFloat(rating));
  let stars = "";
  for (let i = 0; i < 5; i++) {
    stars += `<svg width="14" height="14" class="${i < full ? 'text-yellow-400' : 'text-gray-300'}"><use href="#ico-star"/></svg>`;
  }
  return stars;
}

function productCard(p) {
  return `
    <div class="product-card bg-white rounded-2xl p-4 border border-black/5 hover:shadow-soft hover:-translate-y-1.5 transition-all duration-200">
      <div class="relative bg-gray-100 rounded-xl h-36 md:h-40 flex items-center justify-center mb-3.5 overflow-hidden">
        <img src="${p.img}" alt="${p.name}" class="w-full h-full object-contain p-3" loading="lazy">
        <button class="wish absolute top-2.5 right-2.5 w-9 h-9 rounded-full bg-violet-100 shadow flex items-center justify-center text-violet-600 hover:bg-violet-200 transition">
          <svg width="16" height="16"><use href="#ico-heart"/></svg>
        </button>
      </div>
      <div class="font-bold text-[15px] text-gray-900 mb-1 truncate">${p.name}</div>
      <div class="flex items-center justify-between mb-3">
        <span class="text-lg font-bold text-gray-800">${p.price}</span>
        <span class="flex items-center gap-1">
          <span class="flex items-center gap-0.5">${starRow(p.rating)}</span>
          <span class="text-[11px] font-semibold bg-yellow-100 text-yellow-800 rounded px-1.5 py-0.5 ml-1">${p.rating}</span>
        </span>
      </div>
      <button class="add-cart w-full bg-brandorange hover:bg-brandorangedark text-white rounded-full py-3 text-sm font-semibold flex items-center justify-center gap-2 transition">
        <svg width="15" height="15"><use href="#ico-cart"/></svg> Add to Cart
      </button>
    </div>`;
}

function renderGrid(el, products) {
  if (!el) return;
  el.innerHTML = products.map(productCard).join('');
}

// ---------------- STATIC GRIDS ----------------
renderGrid(document.getElementById('popular-grid'), [byId(5), byId(8), byId(12), byId(14)]);
renderGrid(document.getElementById('bestseller-grid-1'), PRODUCTS.slice(0, 4));
renderGrid(document.getElementById('bestseller-grid-2'), PRODUCTS.slice(4, 9));
renderGrid(document.getElementById('recommend-grid'), PRODUCTS.slice(9, 14));

// pagination just swaps which slice of products shows in grid 1
document.querySelectorAll('.page-btn[data-page]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.page-btn[data-page]').forEach(b => {
      b.classList.remove('bg-brandorange','text-white','border-brandorange');
      b.classList.add('bg-white','border-black/10');
    });
    btn.classList.add('bg-brandorange','text-white','border-brandorange');
    btn.classList.remove('bg-white','border-black/10');
    const page = parseInt(btn.dataset.page, 10);
    const start = (page - 1) * 4 % PRODUCTS.length;
    renderGrid(document.getElementById('bestseller-grid-1'), PRODUCTS.slice(start, start + 4));
  });
});

// ---------------- CATEGORY FILTER (New Arrivals) ----------------
const arrivalsGrid = document.getElementById('arrivals-grid');
const arrivalsEmpty = document.getElementById('arrivals-empty');
const arrivalsTitle = document.getElementById('arrivalsSectionTitle');
let activeCategory = "Kitchen";

function showCategory(cat, label) {
  activeCategory = cat;
  const items = PRODUCTS.filter(p => p.category === cat).slice(0, 8);
  arrivalsTitle.textContent = label || cat;
  renderGrid(arrivalsGrid, items);
  arrivalsGrid.classList.toggle('hidden', items.length === 0);
  arrivalsEmpty.classList.toggle('hidden', items.length !== 0);
}
showCategory("Kitchen", "Kitchen");

document.querySelectorAll('.cat-item[data-category]').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.cat-item').forEach(i => i.classList.remove('bg-brandpurpledeep','text-white'));
    item.classList.add('bg-brandpurpledeep','text-white');
    const label = item.textContent.trim();
    showCategory(item.dataset.category, label);
    document.getElementById('arrivals-search').value = "";
  });
});

// expandable Electronic / Fashion submenus
document.querySelectorAll('.cat-item[data-parent]').forEach(parent => {
  parent.addEventListener('click', () => {
    const sub = document.querySelector(`.sub-list[data-sublist-for="${parent.dataset.parent}"]`);
    const chev = parent.querySelector('.chev');
    const isOpen = sub.style.display === 'flex';
    sub.style.display = isOpen ? 'none' : 'flex';
    if (chev) chev.style.transform = isOpen ? '' : 'rotate(180deg)';
  });
});
// start collapsed
document.querySelectorAll('.sub-list').forEach(s => s.style.display = 'none');

// ---------------- SEARCH (arrivals search box: live filter across ALL products) ----------------
const arrivalsSearchInput = document.getElementById('arrivals-search');
arrivalsSearchInput.addEventListener('input', () => {
  const q = arrivalsSearchInput.value.trim().toLowerCase();
  if (!q) {
    showCategory(activeCategory, activeCategory);
    return;
  }
  const matches = PRODUCTS.filter(p => p.name.toLowerCase().includes(q)).slice(0, 8);
  arrivalsTitle.textContent = `Search results for "${arrivalsSearchInput.value.trim()}"`;
  renderGrid(arrivalsGrid, matches);
  arrivalsGrid.classList.toggle('hidden', matches.length === 0);
  arrivalsEmpty.classList.toggle('hidden', matches.length !== 0);
});

// ---------------- SEARCH (header search box: live dropdown of matches) ----------------
const headerSearchInput = document.getElementById('header-search');
const headerSearchResults = document.getElementById('header-search-results');

function headerResultRow(p) {
  return `
    <a href="#popular" class="header-result flex items-center gap-3 px-4 py-2.5 hover:bg-cream transition" data-id="${p.id}">
      <img src="${p.img}" alt="${p.name}" class="w-10 h-10 rounded-lg object-cover bg-gray-100">
      <span class="flex-1 min-w-0">
        <span class="block text-sm font-semibold truncate">${p.name}</span>
        <span class="block text-xs text-brandnavy/50">${p.price}</span>
      </span>
    </a>`;
}

headerSearchInput.addEventListener('input', () => {
  const q = headerSearchInput.value.trim().toLowerCase();
  if (!q) { headerSearchResults.classList.add('hidden'); return; }
  const matches = PRODUCTS.filter(p => p.name.toLowerCase().includes(q)).slice(0, 6);
  headerSearchResults.innerHTML = matches.length
    ? matches.map(headerResultRow).join('')
    : `<div class="px-4 py-3 text-sm text-brandnavy/50">No products found.</div>`;
  headerSearchResults.classList.remove('hidden');
});

headerSearchResults.addEventListener('click', (e) => {
  const row = e.target.closest('.header-result');
  if (!row) return;
  const p = byId(parseInt(row.dataset.id, 10));
  if (!p) return;
  // jump to arrivals section and show this product's category filtered results
  showCategory(p.category, p.category);
  headerSearchResults.classList.add('hidden');
  headerSearchInput.value = "";
  document.getElementById('arrivalsSectionTitle').scrollIntoView({ behavior: 'smooth', block: 'center' });
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('#header-search') && !e.target.closest('#header-search-results')) {
    headerSearchResults.classList.add('hidden');
  }
});

// ---------------- ADD TO CART / WISHLIST TOAST ----------------
const toast = document.getElementById('toast');
document.addEventListener('click', (e) => {
  if (e.target.closest('.add-cart')) {
    toast.classList.add('show');
    toast.style.opacity = '1';
    clearTimeout(window._toastTimer);
    window._toastTimer = setTimeout(() => {
      toast.classList.remove('show');
      toast.style.opacity = '0';
    }, 1600);
  }
  const wish = e.target.closest('.wish');
  if (wish) {
    const use = wish.querySelector('use');
    const liked = wish.classList.toggle('liked');
    if (liked) {
      wish.classList.remove('bg-violet-100', 'hover:bg-violet-200', 'text-violet-600');
      wish.classList.add('bg-violet-600', 'text-red-500');
      use.setAttribute('href', '#ico-heart-filled');
    } else {
      wish.classList.remove('bg-violet-600', 'text-red-500');
      wish.classList.add('bg-violet-100', 'hover:bg-violet-200', 'text-violet-600');
      use.setAttribute('href', '#ico-heart');
    }
  }
});

// ---------------- MOBILE NAV ----------------
document.getElementById('burger').addEventListener('click', () => {
  const nav = document.getElementById('mobile-nav');
  nav.classList.toggle('hidden');
  nav.classList.toggle('flex');
});
