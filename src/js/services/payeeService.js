export async function getAllPayees() {
  const res = await fetch('http://localhost:8080/payees');
  return res.json();
}

export async function getPayeeById(id) {
  const res = await fetch(`http://localhost:8080/payees/${id}`);
  return res.json();
}

export async function getPayeesByAccNo(accNo) {
  const res = await fetch(`http://localhost:8080/payees/account/${accNo}`);
  return res.json();
}

export async function addPayee(payee) {
  const res = await fetch('http://localhost:8080/payees', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payee)
  });
  return res.json();
}

export async function deletePayee(id) {
  await fetch(`http://localhost:8080/payees/${id}`, { method: 'DELETE' });
} 