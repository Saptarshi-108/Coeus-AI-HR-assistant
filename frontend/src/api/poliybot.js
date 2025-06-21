// src/api.js
const BASE_URL = "http://localhost:8002"; // Replace with deployed URL later

export async function uploadPolicy(companyName, file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("company_name", companyName);

  const res = await fetch(
    `${BASE_URL}/upload-policy?company_name=${companyName}`,
    {
      method: "POST",
      body: formData,
    }
  );
  return res.json();
}

export async function validateToken(token) {
  const res = await fetch(`${BASE_URL}/validate-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  return res.json();
}

export async function askPolicyQuestion(question, token) {
  const res = await fetch(`${BASE_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, token }),
  });
  return res.json();
}
