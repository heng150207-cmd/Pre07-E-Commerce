import { productDetailsCardComponent } from "../components/products/product-detail-card.js";
import {getData} from "../store/get-data.js"

const params = new URLSearchParams(window.location.search);

console.log(params.get("id"))

// get all data
const products = await getData("/products")

//id from browser
const id = params.get("id");

//
const product = products.find(pro => String(pro.id) === String(id));
if (product) {
  const productDetails = document.getElementById("detail");
  console.log("product:",product);
  productDetails.innerHTML = 
  productDetailsCardComponent(product);
}

//hander when user wanna to back to products listing page\
window.handleBack = function () {
  window.location.href = "../index.html";
};
