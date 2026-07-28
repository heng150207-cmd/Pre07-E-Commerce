import { createFormComponent } from "../components/products/create-form.js";
import { createData } from "../store/create-data.js";

// define form container
const fromContainer = document.getElementById("form-cotainer");

// add form to form container
fromContainer.innerHTML = createFormComponent();

// select atual form
const atualForm = document.getElementById("create-form");

// function get form data/value
function getFormValue() {
  return {
    title: document.getElementById("title").value.trim(),
    price: document.getElementById("price").value.trim(),
    description: document.getElementById("description").value.trim(),
    categoryId: document.getElementById("categoryId").value.trim(),
    images: [document.getElementById("image").value.trim()],
  };
}

// when user subdata
atualForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const productValue = await getFormValue();

  console.log("form value : ", productValue);

  const createProduct = await createData("/products", productValue);
});
