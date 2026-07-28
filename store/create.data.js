const baseUrl = "https://api.escuelajs.co/api/v1";
export async function createData(endpoint, payload) {
    const res = await fetch (`${baseUrl}${endpoint}`,
    {
        method:"POST",
        "Content-type": "application/json",
        body: JSON.stringify(payload),
    });
}