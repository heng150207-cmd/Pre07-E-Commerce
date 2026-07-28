import { productCardComponents } from "../components/products/product-card.js";
import { getData } from "../store/get-data.js";

const products = await getData("product");
console.log(products);

const categories = await getData("categories");
console.log(categories);

const renderArea = document.getElementById("render-area");

products.forEach((product) => {
  renderArea.innerHTML += productCardComponents(product);
});

products.forEach((product) => {
  const card = document.getElementById(`${product.id}`);
  card.addEventListener("click", () => {
    window.location.href = `../html/product-detail.html?id=${product.id}`;
  });
});
