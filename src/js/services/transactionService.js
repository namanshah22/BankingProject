export async function getAllTransactions() {
  const res = await fetch('http://localhost:8080/api/transactions');
  return res.json();
}

export async function getTransactionById(id) {
  const res = await fetch(`http://localhost:8080/api/transactions/${id}`);
  return res.json();
}

export async function addTransaction(transaction) {
  const res = await fetch('http://localhost:8080/api/transactions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(transaction)
  });
  return res.json();
} 