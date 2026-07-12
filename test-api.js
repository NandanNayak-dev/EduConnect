async function testRegistration() {
  try {
    const res = await fetch('http://localhost:3000/api/users/registration', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Test User',
        email: 'test' + Date.now() + '@example.com',
        password: 'Password@123'
      })
    });
    const data = await res.json();
    console.log("Status:", res.status);
    console.log("Data:", data);
  } catch (err) {
    console.error("Error:", err.message);
  }
}

testRegistration();
