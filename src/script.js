/* ---------------- PRODUCT CATALOGUE ---------------- */
/* Leaf categories match the sidebar exactly: Kitchen and Furniture are
   standalone; Electronic and Fashion are groups whose real filterable
   values are their children (Laptop/Mobile/... and Men's/Women's Fashion). */
const PRODUCTS = [
  // Kitchen
  { id: 1,  category: "Kitchen",     name: "Stainless Steel Cookware Set", price: "$89.99",   rating: "4.7", img: "https://loremflickr.com/400/400/cookware?lock=1" },
  { id: 2,  category: "Kitchen",     name: "Electric Rice Cooker",         price: "$54.99",   rating: "4.6", img: "https://loremflickr.com/400/400/ricecooker?lock=2" },
  { id: 3,  category: "Kitchen",     name: "Non-Stick Frying Pan",         price: "$24.99",   rating: "4.5", img: "https://loremflickr.com/400/400/fryingpan?lock=3" },
  { id: 4,  category: "Kitchen",     name: "Glass Stovetop Kettle",        price: "$34.99",   rating: "4.4", img: "https://loremflickr.com/400/400/kettle?lock=4" },
  { id: 101,category: "Kitchen",     name: "Chef's Knife Set",             price: "$64.99",   rating: "4.7", img: "https://loremflickr.com/400/400/kitchenknife?lock=101" },
  { id: 102,category: "Kitchen",     name: "Digital Air Fryer",            price: "$119.00",  rating: "4.8", img: "https://loremflickr.com/400/400/airfryer?lock=102" },
  { id: 103,category: "Kitchen",     name: "Bamboo Cutting Board",         price: "$18.99",   rating: "4.5", img: "https://loremflickr.com/400/400/cuttingboard?lock=103" },
  { id: 104,category: "Kitchen",     name: "Espresso Maker",               price: "$149.00",  rating: "4.6", img: "https://loremflickr.com/400/400/espressomachine?lock=104" },

  // Electronic > Laptop / Mobile / HeadPhone / Tablet / Controller
  { id: 5,  category: "Laptop",      name: "ASUS VivoBook 15",             price: "$1200.32", rating: "5.0", img: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&q=80" },
  { id: 201,category: "Laptop",      name: "MacBook Air 13",               price: "$1099.00", rating: "4.9", img: "https://loremflickr.com/400/400/macbook?lock=201" },
  { id: 202,category: "Laptop",      name: "Dell XPS 14",                  price: "$1399.00", rating: "4.8", img: "https://loremflickr.com/400/400/laptop,dell?lock=202" },
  { id: 203,category: "Laptop",      name: "Lenovo ThinkPad X1",           price: "$1299.00", rating: "4.7", img: "https://loremflickr.com/400/400/laptop,thinkpad?lock=203" },
  { id: 204,category: "Laptop",      name: "HP Pavilion 15",               price: "$799.99",  rating: "4.5", img: "https://loremflickr.com/400/400/laptop,hp?lock=204" },
  { id: 205,category: "Laptop",      name: "Acer Swift 3",                 price: "$699.00",  rating: "4.4", img: "https://loremflickr.com/400/400/laptop,acer?lock=205" },
  { id: 206,category: "Laptop",      name: "MSI Gaming Laptop",            price: "$1599.00", rating: "4.8", img: "https://loremflickr.com/400/400/gaminglaptop?lock=206" },
  { id: 207,category: "Laptop",      name: "Microsoft Surface Laptop",     price: "$1199.00", rating: "4.6", img: "https://loremflickr.com/400/400/laptop,surface?lock=207" },

  { id: 6,  category: "Mobile",      name: "Galaxy Nova X",                price: "$649.99",  rating: "4.5", img: "https://loremflickr.com/400/400/smartphone?lock=6" },
  { id: 211,category: "Mobile",      name: "iPhone 15",                    price: "$799.00",  rating: "4.9", img: "https://loremflickr.com/400/400/iphone?lock=211" },
  { id: 212,category: "Mobile",      name: "Pixel 9",                      price: "$699.00",  rating: "4.7", img: "https://loremflickr.com/400/400/smartphone,android?lock=212" },
  { id: 213,category: "Mobile",      name: "OnePlus 12",                   price: "$599.00",  rating: "4.6", img: "https://loremflickr.com/400/400/smartphone?lock=213" },
  { id: 214,category: "Mobile",      name: "Xiaomi 14",                    price: "$549.00",  rating: "4.5", img: "https://loremflickr.com/400/400/smartphone,android?lock=214" },
  { id: 215,category: "Mobile",      name: "Galaxy Z Flip",                price: "$999.00",  rating: "4.6", img: "https://loremflickr.com/400/400/foldablephone?lock=215" },
  { id: 216,category: "Mobile",      name: "Nothing Phone 2",              price: "$449.00",  rating: "4.4", img: "https://loremflickr.com/400/400/smartphone?lock=216" },
  { id: 217,category: "Mobile",      name: "Motorola Edge 40",             price: "$399.00",  rating: "4.3", img: "https://loremflickr.com/400/400/smartphone?lock=217" },

  { id: 7,  category: "HeadPhone",   name: "Urbanista Miami Headphones",   price: "$79.99",   rating: "4.6", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80" },
  { id: 221,category: "HeadPhone",   name: "Sony WH-1000XM5",              price: "$349.00",  rating: "4.9", img: "https://loremflickr.com/400/400/headphones?lock=221" },
  { id: 222,category: "HeadPhone",   name: "Bose QuietComfort",            price: "$299.00",  rating: "4.8", img: "https://loremflickr.com/400/400/headphones?lock=222" },
  { id: 223,category: "HeadPhone",   name: "Apple AirPods Max",            price: "$449.00",  rating: "4.7", img: "https://loremflickr.com/400/400/headphones?lock=223" },
  { id: 224,category: "HeadPhone",   name: "JBL Tune 760NC",               price: "$99.00",   rating: "4.4", img: "https://loremflickr.com/400/400/headphones?lock=224" },
  { id: 225,category: "HeadPhone",   name: "Sennheiser Momentum 4",        price: "$379.00",  rating: "4.8", img: "https://loremflickr.com/400/400/headphones?lock=225" },
  { id: 226,category: "HeadPhone",   name: "Beats Studio Pro",             price: "$349.00",  rating: "4.6", img: "https://loremflickr.com/400/400/headphones?lock=226" },
  { id: 227,category: "HeadPhone",   name: "Anker Soundcore Q45",          price: "$129.00",  rating: "4.5", img: "https://loremflickr.com/400/400/headphones?lock=227" },

  { id: 8,  category: "Tablet",      name: "Apple iPad Pro 11",            price: "$799.00",  rating: "4.9", img: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80" },
  { id: 231,category: "Tablet",      name: "Samsung Galaxy Tab S9",        price: "$649.00",  rating: "4.7", img: "https://loremflickr.com/400/400/tablet?lock=231" },
  { id: 232,category: "Tablet",      name: "iPad Air",                     price: "$599.00",  rating: "4.8", img: "https://loremflickr.com/400/400/ipad?lock=232" },
  { id: 233,category: "Tablet",      name: "Lenovo Tab P12",               price: "$399.00",  rating: "4.4", img: "https://loremflickr.com/400/400/tablet?lock=233" },
  { id: 234,category: "Tablet",      name: "Microsoft Surface Pro",        price: "$999.00",  rating: "4.6", img: "https://loremflickr.com/400/400/tablet,surface?lock=234" },
  { id: 235,category: "Tablet",      name: "Amazon Fire HD 10",            price: "$149.00",  rating: "4.2", img: "https://loremflickr.com/400/400/tablet?lock=235" },
  { id: 236,category: "Tablet",      name: "Xiaomi Pad 6",                 price: "$349.00",  rating: "4.5", img: "https://loremflickr.com/400/400/tablet?lock=236" },
  { id: 237,category: "Tablet",      name: "Huawei MatePad",               price: "$329.00",  rating: "4.3", img: "https://loremflickr.com/400/400/tablet?lock=237" },

  { id: 9,  category: "Controller",  name: "DualSense PS5 Controller",     price: "$69.99",   rating: "4.8", img: "https://images.unsplash.com/photo-1622297845775-5ff3fef71d13?w=400&q=80" },
  { id: 241,category: "Controller",  name: "Xbox Wireless Controller",     price: "$59.99",   rating: "4.7", img: "https://loremflickr.com/400/400/gamepad,xbox?lock=241" },
  { id: 242,category: "Controller",  name: "Nintendo Switch Pro",          price: "$69.99",   rating: "4.8", img: "https://loremflickr.com/400/400/gamepad,nintendo?lock=242" },
  { id: 243,category: "Controller",  name: "8BitDo Pro 2",                 price: "$49.99",   rating: "4.6", img: "https://loremflickr.com/400/400/gamepad?lock=243" },
  { id: 244,category: "Controller",  name: "SteelSeries Stratus",          price: "$54.99",   rating: "4.5", img: "https://loremflickr.com/400/400/gamepad?lock=244" },
  { id: 245,category: "Controller",  name: "Razer Wolverine V2",           price: "$99.99",   rating: "4.7", img: "https://loremflickr.com/400/400/gamepad?lock=245" },
  { id: 246,category: "Controller",  name: "PowerA Fusion Pro",            price: "$44.99",   rating: "4.3", img: "https://loremflickr.com/400/400/gamepad?lock=246" },
  { id: 247,category: "Controller",  name: "GameSir T4 Pro",               price: "$34.99",   rating: "4.2", img: "https://loremflickr.com/400/400/gamepad?lock=247" },

  // Fashion > Men's / Women's
  { id: 10, category: "MenFashion",   name: "Denim Jacket",                price: "$59.99",   rating: "4.4", img: "https://loremflickr.com/400/400/denimjacket?lock=10" },
  { id: 11, category: "MenFashion",   name: "Canvas Sneakers",             price: "$44.99",   rating: "4.3", img: "https://loremflickr.com/400/400/sneakers?lock=11" },
  { id: 251,category: "MenFashion",   name: "Slim Fit Chinos",             price: "$39.99",   rating: "4.4", img: "https://loremflickr.com/400/400/chinos?lock=251" },
  { id: 252,category: "MenFashion",   name: "Oxford Dress Shirt",          price: "$34.99",   rating: "4.5", img: "https://loremflickr.com/400/400/dressshirt?lock=252" },
  { id: 253,category: "MenFashion",   name: "Leather Belt",                price: "$24.99",   rating: "4.6", img: "https://loremflickr.com/400/400/leatherbelt?lock=253" },
  { id: 254,category: "MenFashion",   name: "Wool Blend Sweater",          price: "$49.99",   rating: "4.5", img: "https://loremflickr.com/400/400/sweater?lock=254" },
  { id: 255,category: "MenFashion",   name: "Classic Baseball Cap",        price: "$19.99",   rating: "4.2", img: "https://loremflickr.com/400/400/baseballcap?lock=255" },
  { id: 256,category: "MenFashion",   name: "Bomber Jacket",               price: "$69.99",   rating: "4.7", img: "https://loremflickr.com/400/400/bomberjacket?lock=256" },

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

/* Friendly labels used for the "New Arrivals" title when a leaf is picked */
const CATEGORY_LABELS = {
  Kitchen: "Kitchen", Laptop: "Laptop", Mobile: "Mobile", HeadPhone: "HeadPhone",
  Tablet: "Tablet", Controller: "Controller", MenFashion: "Men's Fashion",
  WomenFashion: "Women's Fashion", Furniture: "Furniture"
};

function productCard(p){
  return `
    <div class="product-card" data-id="${p.id}">
      <div class="product-thumb">
        <img src="${p.img}" alt="${p.name}" loading="lazy">
        <div class="wish" data-wish="${p.id}"><svg width="14" height="14"><use href="#ico-heart"/></svg></div>
      </div>
      <div class="product-name">${p.name}</div>
      <div class="product-meta">
        <span class="price">${p.price}</span>
        <span class="rating"><svg width="13" height="13"><use href="#ico-star"/></svg> ${p.rating}</span>
      </div>
      <button class="add-cart" data-add="${p.id}"><svg width="14" height="14"><use href="#ico-cart"/></svg> Add to Cart</button>
    </div>`;
}

function fillGrid(id, products){
  const el = document.getElementById(id);
  if(!el) return;
  el.innerHTML = products.map(productCard).join('');
}

/* Static rows: mix products across categories so each section has variety */
fillGrid('popular-grid',      [5, 12, 13, 1].map(byId));
fillGrid('bestseller-grid-2', [5, 9, 7, 10, 14].map(byId));
fillGrid('recommend-grid',    [8, 11, 15, 4, 16].map(byId));

/* ---------------- CATEGORIES -> NEW ARRIVALS ---------------- */
let activeCategory = "All";
let searchTerm = "";

function renderArrivals(){
  const grid = document.getElementById('arrivals-grid');
  const empty = document.getElementById('arrivals-empty');
  if(!grid) return;

  let items = activeCategory === "All" ? PRODUCTS.slice() : PRODUCTS.filter(p => p.category === activeCategory);
  if(searchTerm.trim()){
    const q = searchTerm.trim().toLowerCase();
    items = items.filter(p => p.name.toLowerCase().includes(q));
  }

  grid.innerHTML = items.map(productCard).join('');
  if(empty) empty.style.display = items.length ? 'none' : 'block';
}

function selectCategory(btn, categoryName){
  document.querySelectorAll('.cat-item, .cat-group-title').forEach(el => el.classList.remove('active', 'active-group'));
  if(btn.classList.contains('cat-item')){
    btn.classList.add('active');
  } else {
    btn.classList.add('active-group');
  }
  activeCategory = categoryName;

  const title = document.getElementById('arrivalsSectionTitle');
  if(title) title.textContent = CATEGORY_LABELS[categoryName] || 'New Arrivals';

  renderArrivals();

  // Scroll the New Arrivals panel into view so the change is obvious on mobile
  const panel = document.querySelector('.cat-arrivals-grid');
  if(panel && window.innerWidth <= 860){
    panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/* Leaf items (Laptop, Mobile, ... , Men's/Women's Fashion) */
document.querySelectorAll('.cat-item').forEach(btn => {
  btn.addEventListener('click', () => selectCategory(btn, btn.dataset.category));
});

/* Standalone top-level groups that filter directly (Kitchen, Furniture) */
document.querySelectorAll('.cat-group-title[data-category]').forEach(btn => {
  btn.addEventListener('click', () => selectCategory(btn, btn.dataset.category));
});

/* Expandable groups (Electronic, Fashion) — toggle only, no data-category */
function setupExpandableGroup(toggleId, listId, chevronId){
  const toggle = document.getElementById(toggleId);
  const list = document.getElementById(listId);
  const chevron = document.getElementById(chevronId);
  if(!toggle || !list || !chevron) return;
  let open = true;
  toggle.addEventListener('click', () => {
    open = !open;
    list.classList.toggle('collapsed', !open);
    chevron.classList.toggle('rotated', !open);
  });
}
setupExpandableGroup('electronicToggle', 'electronicList', 'electronicChevron');
setupExpandableGroup('fashionToggle', 'fashionList', 'fashionChevron');

const itemSearch = document.getElementById('item-search');
if(itemSearch){
  itemSearch.addEventListener('input', (e) => {
    searchTerm = e.target.value;
    renderArrivals();
  });
}

renderArrivals(); // initial paint — shows every category until one is picked

/* Static "Best Seller" grid (paginated, but content stays illustrative) */
const BEST_SELLER_PAGES = {
  1: [5, 14, 12, 1].map(byId),
  2: [7, 10, 15, 3].map(byId),
  3: [9, 11, 16, 2].map(byId)
};
fillGrid('bestseller-grid-1', BEST_SELLER_PAGES[1]);

/* ---------------- Add-to-cart / wishlist feedback ---------------- */
const toast = document.getElementById('toast');
document.addEventListener('click', (e) => {
  if(e.target.closest('.add-cart')){
    toast.classList.add('show');
    clearTimeout(window._toastTimer);
    window._toastTimer = setTimeout(() => toast.classList.remove('show'), 1600);
  }
  const wish = e.target.closest('.wish');
  if(wish){
    wish.style.color = wish.style.color === 'rgb(245, 132, 31)' ? '' : '#F5841F';
  }
});

/* ---------------- Pagination interaction (Best Seller, grid 1) ---------------- */
document.querySelectorAll('.page-btn[data-page]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.page-btn[data-page]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    fillGrid('bestseller-grid-1', BEST_SELLER_PAGES[btn.dataset.page] || BEST_SELLER_PAGES[1]);
  });
});
document.getElementById('page-prev')?.addEventListener('click', () => {
  const active = document.querySelector('.page-btn[data-page].active');
  const prev = active?.previousElementSibling;
  if(prev && prev.dataset.page) prev.click();
});
document.getElementById('page-next')?.addEventListener('click', () => {
  const active = document.querySelector('.page-btn[data-page].active');
  const next = active?.nextElementSibling;
  if(next && next.dataset.page) next.click();
});

/* ---------------- Mobile burger toggle (simple nav reveal) ---------------- */
const burger = document.querySelector('.burger');
burger.addEventListener('click', () => {
  const links = document.querySelector('.nav-links');
  const isOpen = links.style.display === 'flex';
  links.style.display = isOpen ? 'none' : 'flex';
  links.style.position = 'absolute';
  links.style.top = '64px';
  links.style.left = '0';
  links.style.right = '0';
  links.style.background = '#fff';
  links.style.flexDirection = 'column';
  links.style.padding = '18px 32px';
  links.style.borderBottom = '1px solid var(--line)';
});
