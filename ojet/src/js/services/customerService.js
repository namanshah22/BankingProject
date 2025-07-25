export async function getAllCustomers() {
  const res = await fetch('http://localhost:8080/customers');
  return res.json();
}

export async function addCustomer(customer) {
  const res = await fetch('http://localhost:8080/customers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(customer)
  });
  return res.json();
}

export async function deleteCustomer(aadhaar) {
  await fetch(`http://localhost:8080/customers/${aadhaar}`, { method: 'DELETE' });
}

export async function updateCustomer(aadhaar, customer) {
  const res = await fetch(`http://localhost:8080/customers/${aadhaar}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(customer)
  });
  return res.json();
}

export async function login(aadhaar, password) {
  const res = await fetch('http://localhost:8080/customers/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ aadhaar, password })
  });
  if (res.status === 200) return res.json();
  throw new Error('Unauthorized');
} 