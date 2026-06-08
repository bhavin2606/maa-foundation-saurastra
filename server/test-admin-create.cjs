const http = require('http');

async function test() {
  const loginRes = await fetch("http://localhost:4000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "admin", password: "password123" }) 
  });
  
  if (!loginRes.ok) {
    console.log("Login failed");
    console.log(await loginRes.text());
    return;
  }
  
  const token = (await loginRes.json()).token;
  console.log("Got token");
  
  const res = await fetch("http://localhost:4000/api/donations/admin-create", {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ donorName: "Test", donorEmail: "test@test.com", amount: 100 })
  });
  
  console.log("Status:", res.status);
  console.log(await res.text());
}
test();
