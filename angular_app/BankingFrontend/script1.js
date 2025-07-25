// ==================== GLOBAL VARIABLES ====================
const BASE_URLS = {
    account: "http://localhost:8084",
    customer: "http://localhost:8074",
    payee: "http://localhost:8083",
    transaction: "http://localhost:9010",
    nominee: "http://localhost:8001"
};

let beneficiaries = [];
let isLoggedIn = false;
let currentUser = null;

// ==================== FETCH HELPER WITH LOGS ====================
async function fetchWithLogs(url, options = {}) {
    console.log(`🔍 [FETCH]: ${options.method || "GET"} ${url}`);
    if (options.body) {
        console.log("📦 [Request Body]:", JSON.parse(options.body));
    }
    try {
        const response = await fetch(url, options);
        console.log("✅ [Response Status]:", response.status);
        const data = await response.json();
        console.log("📥 [Response Data]:", data);
        return data;
    } catch (error) {
        console.error("❌ [Fetch Error]:", error);
        throw error;
    }
}

// ==================== PAYEES SERVICE ====================
function loadBeneficiaries() {
    fetchWithLogs(`${BASE_URLS.payee}/payees`)
        .then(data => {
            beneficiaries = data;
            populateBeneficiaryDropdowns();
            updateBeneficiaryList();
        })
        .catch(console.error);
}

function addBeneficiary() {
    const name = document.getElementById("beneficiaryName").value.trim();
    const accountNumber = document.getElementById("beneficiaryAccount").value.trim();
    const confirmAccount = document.getElementById("confirmAccount").value.trim();
    const messageDiv = document.getElementById("beneficiary-message");

    if (!name || !accountNumber || accountNumber !== confirmAccount) {
        showMessage(messageDiv, "Invalid beneficiary details!", "error");
        return;
    }

    fetchWithLogs(`${BASE_URLS.payee}/payees`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, accountNumber })
    })
        .then(() => {
            showMessage(messageDiv, "Beneficiary added!", "success");
            loadBeneficiaries();
            clearBeneficiaryForm();
        })
        .catch(() => showMessage(messageDiv, "Error adding beneficiary!", "error"));
}

function deleteBeneficiary(id) {
    if (!id || id === "undefined") {
        console.warn("⚠️ Skipped delete: Beneficiary ID is undefined.");
        return;
    }

    if (!confirm("Are you sure you want to delete this beneficiary?")) return;
    fetchWithLogs(`${BASE_URLS.payee}/payees/${id}`, { method: "DELETE" })
        .then(() => {
            loadBeneficiaries();
            alert("Beneficiary deleted.");
        })
        .catch(() => alert("Failed to delete."));
}

// ==================== ACCOUNT SERVICE ====================
function loadAccounts() {
    fetchWithLogs(`${BASE_URLS.account}/accounts`)
        .then(accounts => {
            const dropdown = document.getElementById("fromAccountSelect");
            if (!dropdown) return;
            dropdown.innerHTML = "";
            accounts.forEach(acc => {
                const opt = document.createElement("option");
                opt.value = acc.accountNo;
                opt.textContent = `${acc.accountNo} - Balance ₹${acc.balance}`;
                dropdown.appendChild(opt);
            });
        })
        .catch(console.error);
}

// ==================== TRANSACTION SERVICE ====================
function loadTransactions() {
    fetchWithLogs(`${BASE_URLS.transaction}/api/transactions`)
        .then(transactions => {
            const tbody = document.getElementById("transactionTableBody");
            if (!tbody) return;
            tbody.innerHTML = "";
            transactions.forEach(txn => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${txn.transactionId}</td>
                    <td>${txn.fromAccount}</td>
                    <td>${txn.toAccount}</td>
                    <td>${txn.amount}</td>
                    <td>${txn.date}</td>`;
                tbody.appendChild(row);
            });
        })
        .catch(console.error);
}

// ==================== CUSTOMER SERVICE ====================
function loadCustomers() {
    fetchWithLogs(`${BASE_URLS.customer}/customers`)
        .then(customers => {
            const list = document.getElementById("customerList");
            if (!list) return;
            list.innerHTML = "";
            customers.forEach(c => {
                const li = document.createElement("li");
                li.textContent = `${c.name} (Aadhaar: ${c.aadhaar})`;
                list.appendChild(li);
            });
        })
        .catch(console.error);
}

// ==================== NOMINEE SERVICE ====================
function loadNominees() {
    fetchWithLogs(`${BASE_URLS.nominee}/nominees`)
        .then(nominees => {
            const list = document.getElementById("nomineeList");
            if (!list) return;
            list.innerHTML = "";
            nominees.forEach(n => {
                const li = document.createElement("li");
                li.textContent = `${n.name} - ${n.relation}`;
                list.appendChild(li);
            });
        })
        .catch(console.error);
}

// ==================== REUSABLE HELPERS ====================
function showMessage(element, text, type) {
    element.textContent = text;
    element.className = `message ${type}`;
    element.classList.remove("hidden");
    setTimeout(() => element.classList.add("hidden"), 3000);
}

function clearBeneficiaryForm() {
    document.getElementById("beneficiaryName").value = "";
    document.getElementById("beneficiaryAccount").value = "";
    document.getElementById("confirmAccount").value = "";
}

function populateBeneficiaryDropdowns() {
    const dropdowns = ["dashboardToAccount", "transferToAccount"];
    dropdowns.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.innerHTML = '<option value="">-- Select Beneficiary --</option>';
        beneficiaries.forEach(b => {
            const o = document.createElement("option");
            o.value = b.accountNumber;
            o.textContent = `${b.name} - ${b.accountNumber}`;
            el.appendChild(o);
        });
    });
}

function updateBeneficiaryList() {
    const listDiv = document.getElementById("beneficiaryList");
    const container = document.getElementById("beneficiaryListContainer");
    if (!beneficiaries.length) {
        container.style.display = "none";
        return;
    }
    container.style.display = "block";
    listDiv.innerHTML = "";
    beneficiaries.forEach(b => {
        if (!b.id) return;
        const div = document.createElement("div");
        div.className = "beneficiary-item";
        div.innerHTML = `
            <div>
                <h4>${b.name}</h4>
                <p>Account: ${b.accountNumber}</p>
            </div>
            <button onclick="deleteBeneficiary(${b.id})">Delete</button>`;
        listDiv.appendChild(div);
    });
}

// ==================== INITIALIZE ALL ON LOAD ====================
document.addEventListener("DOMContentLoaded", () => {
    console.log("🚀 Initializing Dashboard Data...");
    loadBeneficiaries();
    loadAccounts();
    loadTransactions();
    loadCustomers();
    loadNominees();
});
