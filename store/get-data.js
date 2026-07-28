const baseUrl = "https://api.escuelajs.co/api/v1";
export async function getData() {
  const res = await fetch(`${baseUrl}/products`);
  const data = await res.json();
  console.log("products data : ", data);
  return data;
}
getData()
// create
// update