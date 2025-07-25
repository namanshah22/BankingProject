// Fetch data from microservice
// Authentication state
let currentUser = null;
let isLoggedIn = false;

// Global Variables
let currentSection = "home";
let isTransitioning = false;
let beneficiaries = 
  JSON.parse(localStorage.getItem("djokovic-bank-beneficiaries")) || [];

// Utility function to mask account numbers (show ****1234 format)
function maskAccountNumber(accountNumber) {
  if (!accountNumber || accountNumber.length < 4) return "****";
  const visibleDigits = accountNumber.slice(-4);
  const maskedPart = "****";
  return maskedPart + visibleDigits;
}

// Authentication Functions
// function handleLogin() {
//   const userId = document.getElementById("userId").value.trim();
//   const password = document.getElementById("password").value.trim();
//   const button = document.querySelector("#login .form-button");
//   const loginText = document.getElementById("loginText");
//   const messageDiv = document.getElementById("login-message");

//   if (!userId || !password) {
//     showMessage(messageDiv, "Please fill all fields!", "error");
//     return;
//   }

//   // Show loading state
//   button.disabled = true;
//   loginText.innerHTML = '<span class="loading"></span>Accessing...';

//   // Simulate login process
//   setTimeout(() => {
//     button.disabled = false;
//     loginText.textContent = "Access Account";

//     // Check credentials
//     if (userId === "admin" && password === "admin123") {
//       // Admin login
//       currentUser = { userId: "admin", role: "admin", name: "Administrator" };
//       isLoggedIn = true;
//       localStorage.setItem("currentUser", JSON.stringify(currentUser));

//       showSuccessModal("🎉 Admin login successful! Welcome to Admin Panel.");
//       setTimeout(() => {
//         hideSuccessModal();
//         showSection("admin-dashboard");
//       }, 2000);
//     } else if (userId === "user" && password === "password123") {
//       // Regular user login
//       currentUser = { userId: "user", role: "user", name: "John Doe" };
//       isLoggedIn = true;
//       localStorage.setItem("currentUser", JSON.stringify(currentUser));

//       showSuccessModal("🎉 Login successful! Welcome to Djokovic Bank.");
//       setTimeout(() => {
//         hideSuccessModal();
//         showSection("dashboard");
//       }, 2000);
//     } else {
//       // Invalid credentials
//       showMessage(
//         messageDiv,
//         "Invalid credentials! Please try again.",
//         "error"
//       );
//       // Clear password field
//       document.getElementById("password").value = "";
//     }
//   }, 2000);
// }

// function handleLogin() {
//   const aadhaar = document.getElementById("userId").value;
//   const password = document.getElementById("password").value;

//   // Optional: validate Aadhaar or password pattern here
//   if (aadhaar === "admin" && password === "admin123") {
//     sessionStorage.setItem("role", "admin");
//     sessionStorage.setItem("username", "admin");
//     showSection("admin-dashboard");
//     return; // Exit function
//   }

//   fetch(`http://localhost:8074/customers/${aadhaar}`)
//     .then(res => {
//       if (!res.ok) throw new Error("Invalid Aadhaar");
//       return res.json();
//     })
//     .then(data => {
//       // Save Aadhaar locally for session use
//       sessionStorage.setItem("aadhaar", data.aadhaar);
//       sessionStorage.setItem("customerName", data.customerName);

//       // Show dashboard with personalized info
//       document.getElementById("login-message").innerHTML = "Login successful!";
//       showSection('dashboard');

//       // Optional: update UI with user details
//       loadCustomerDetails(data);
//     })
//     .catch(err => {
//       document.getElementById("login-message").innerHTML = "Login failed. Please check Aadhaar.";
//       document.getElementById("login-message").classList.remove("hidden");
//     });
// }

function handleLogin() {
  const aadhaar = document.getElementById("userId").value.trim();
  const password = document.getElementById("password").value.trim();

  // Admin login logic
  if (aadhaar === "admin" && password === "admin123") {
    sessionStorage.setItem("role", "admin");
    sessionStorage.setItem("username", "admin");
    showSection("admin-dashboard");
    return;
  }

  // Regular user login via Aadhaar
  fetch(`http://localhost:8074/customers/${aadhaar}`)
    .then(res => {
      if (!res.ok) throw new Error("Invalid Aadhaar");
      return res.json();
    })
    .then(customer => {
      currentUser = {
        userId: customer.aadhaar,
        role: "user",
        name: customer.customerName
      };
      isLoggedIn = true;
    
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      sessionStorage.setItem("aadhaar", customer.aadhaar);
      sessionStorage.setItem("customerName", customer.customerName);
      sessionStorage.setItem("role", "user");
    
      showSuccessModal("🎉 Login successful! Welcome to Djokovic Bank.");
      setTimeout(() => {
        hideSuccessModal();
        showSection("dashboard");
        loadDashboardData(customer.aadhaar);
      }, 1500);
    });    
}



function loadCustomerDetails(customer) {
  const dashboard = document.getElementById("account-details");
  dashboard.innerHTML = `
    <h2 class="card-title">Welcome, ${customer.customerName}</h2>
    <div class="card">
      <p><strong>Aadhaar:</strong> ${customer.aadhaar}</p>
      <p><strong>Email:</strong> ${customer.email}</p>
      <p><strong>Mobile:</strong> ${customer.mobile}</p>
      <p><strong>Address:</strong> ${customer.address}</p>
      <p><strong>DOB:</strong> ${customer.dob}</p>
      <p><strong>Gender:</strong> ${customer.gender}</p>
      <p><strong>Marital Status:</strong> ${customer.maritalStatus}</p>
      <p><strong>Occupation:</strong> ${customer.occupation}</p>
      <p><strong>PAN:</strong> ${customer.pan}</p>
    </div>
  `;
}

// function loadDashboardData(aadhaar) {
//   fetch(`http://localhost:8074/customers/${aadhaar}`)
//     .then(res => res.json())
//     .then(customer => {
//       sessionStorage.setItem("accountNo", customer.accountNo); // Ensure this is set
//       fetchCustomerDetails(customer.aadhaar);
//       fetchPayees(customer.aadhaar);
//       fetchTransactionsByAadhaar(customer.accountNo);  // ✅ Call updated fetch function
//     });
// }

function loadDashboardData(aadhaar) {
  sessionStorage.setItem("aadhaar", aadhaar); // just in case

  fetchCustomerDetails(aadhaar);
  fetchPayees(aadhaar);
  fetchTransactionsByAadhaar(aadhaar); // ✅ This line
}


function logout() {
  if (confirm("Are you sure you want to logout?")) {
    currentUser = null;
    isLoggedIn = false;
    localStorage.removeItem("currentUser");

    showSuccessModal("👋 Logged out successfully!");
    setTimeout(() => {
      hideSuccessModal();
      showSection("home");
    }, 1500);
  }
}

function fetchCustomerDetails(aadhaar) {
  fetch(`http://localhost:8074/customers/${aadhaar}`)
    .then(res => res.json())
    .then(customer => {
      const div = document.getElementById("account-details");
      div.innerHTML = `
        <h2 class="card-title">Welcome, ${customer.customerName}</h2>
        <div class="card">
          <p><strong>Aadhaar:</strong> ${customer.aadhaar}</p>
          <p><strong>Email:</strong> ${customer.email}</p>
          <p><strong>Mobile:</strong> ${customer.mobile}</p>
          <p><strong>Address:</strong> ${customer.address}</p>
          <p><strong>DOB:</strong> ${customer.dob}</p>
          <p><strong>Gender:</strong> ${customer.gender}</p>
          <p><strong>Marital Status:</strong> ${customer.maritalStatus}</p>
          <p><strong>Occupation:</strong> ${customer.occupation}</p>
          <p><strong>PAN:</strong> ${customer.pan}</p>
        </div>
      `;
    });
}

function fetchTransactionsByAadhaar(aadhaar) {
  fetch(`http://localhost:8084/accounts/aadhaar/${aadhaar}`)
    .then(res => res.json())
    .then(accounts => {
      if (!accounts || accounts.length === 0) {
        console.warn("No account found for Aadhaar:", aadhaar);
        return;
      }

      const accNo = accounts[0].accountNo;
      return fetch(`http://localhost:9010/api/transactions/account/${accNo}`);
    })
    .then(res => res?.json())
    .then(transactions => {
      if (!transactions) return;

      // Build table rows
      const rows = transactions.map(txn => `
        <tr>
          <td>${new Date(txn.transDate).toISOString().split("T")[0]}</td>
          <td>${txn.transType} via ${txn.transactionMode}</td>
          <td style="color: ${txn.transType === "CREDIT" ? 'var(--green-500)' : 'var(--red-500)'};">
            ${txn.transType === "CREDIT" ? '+' : '-'}₹${txn.transAmount.toFixed(2)}
          </td>
          <td>₹${txn.remBalance.toFixed(2)}</td>
        </tr>
      `).join('');

      // Inject into Account Summary table
      const tableBody = document.querySelector("#account-summary .transaction-table tbody");
      if (tableBody) tableBody.innerHTML = rows;

  });
}


function fetchTransactionsByAccountNo(accountNo) {
  fetch(`http://localhost:9010/api/transactions/account/${accountNo}`)
    .then(response => {
      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }
      return response.json();
    })
    .then(transactions => {
      const rows = transactions.map(txn => `
        <tr>
          <td>${new Date(txn.transDate).toISOString().split("T")[0]}</td>
          <td>${txn.transType} via ${txn.transactionMode}</td>
          <td style="color: ${txn.transAmount > 0 ? 'var(--green-400)' : 'var(--red-400)'};">
            ${txn.transType === "CREDIT" ? "+" : "-"}₹${txn.transAmount.toFixed(2)}
          </td>
          <td>₹${txn.remBalance.toFixed(2)}</td>
        </tr>
      `).join('');

      const summaryTable = document.querySelector("#account-summary .transaction-table tbody");
      const statementTable = document.querySelector("#account-statement .transaction-table tbody");

      if (summaryTable) summaryTable.innerHTML = rows;
      if (statementTable) statementTable.innerHTML = rows;
    })
    .catch(error => {
      console.error("Transaction fetch failed:", error);
    });
}


function fetchPayees(aadhaar) {
  fetch(`http://localhost:8081/payees/${aadhaar}`)
    .then(res => res.json())
    .then(payees => {
      const options = payees.map(p => `
        <option value="${p.accNo}">${p.payeeName} - ${p.accNo}</option>
      `).join('');

      // For fund transfer sections
      const dashboardDropdown = document.getElementById("dashboardToAccount");
      const transferDropdown = document.getElementById("transferToAccount");

      if (dashboardDropdown) dashboardDropdown.innerHTML = `<option value="">-- Select Beneficiary --</option>` + options;
      if (transferDropdown) transferDropdown.innerHTML = `<option value="">-- Select Beneficiary --</option>` + options;

      // For showing in Add Payee section
      const listHtml = payees.map(p => `
        <div><strong>${p.payeeName}</strong> - ${p.accNo}</div>
      `).join('');
      const container = document.getElementById("beneficiaryList");
      const wrapper = document.getElementById("beneficiaryListContainer");

      if (container) container.innerHTML = listHtml;
      if (wrapper) wrapper.style.display = "block";
    });
}

// function checkAuthAndShowDashboard() {
//   if (!isLoggedIn) {
//     showSuccessModal("🔒 Please login to access your dashboard.");
//     setTimeout(() => {
//       hideSuccessModal();
//       showSection("login");
//     }, 2000);
//     return;
//   }

//   if (currentUser.role === "admin") {
//     showSection("admin-dashboard");
//   } else {
//     showSection("dashboard");
//   }
// }

// function checkAuthAndShowDashboard() {
//   const aadhaar = sessionStorage.getItem("aadhaar");
//   if (aadhaar) {
//     showSection('dashboard');
//     fetch(`http://localhost:8074/customers/${aadhaar}`)
//       .then(res => res.json())
//       .then(data => loadCustomerDetails(data));
//   } else {
//     alert("Please login first");
//     showSection('login');
//   }
// }

function checkAuthAndShowDashboard() {
  const role = sessionStorage.getItem("role");
  const aadhaar = sessionStorage.getItem("aadhaar");

  if (role === "admin") {
    showSection("admin-dashboard");
  } else if (role === "user" && aadhaar) {
    currentUser = {
      userId: aadhaar,
      role: "user",
      name: sessionStorage.getItem("customerName")
    };
    isLoggedIn = true;
  
    showSection("dashboard");
    loadDashboardData(aadhaar);
  } else {
    showSection("login");
  }
}

function showSection(sectionId) {
  document.querySelectorAll(".page-section").forEach(sec => {
    sec.style.display = "none";
  });
  const target = document.getElementById(sectionId);
  if (target) target.style.display = "block";
}

function showTransferSuccess() {
  document.getElementById("successMessage").textContent = "Transfer completed successfully.";
  document.getElementById("successModal").style.display = "flex";
}

function hideSuccessModal() {
  document.getElementById("successModal").style.display = "none";
}

function checkAuthAndShowSection(sectionId) {
  if (!isLoggedIn) {
    showSuccessModal("🔒 Please login to access this feature.");
    setTimeout(() => {
      hideSuccessModal();
      showSection("login");
    }, 2000);
    return;
  }

  showSection(sectionId);
}

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  // Check for existing session
  const savedUser = localStorage.getItem("currentUser");
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    isLoggedIn = true;

    loadBeneficiaries();
  }

  // Set current date for date inputs
  setCurrentDate();

  // Initialize beneficiary dropdowns
  populateBeneficiaryDropdowns();
  updateBeneficiaryList();

  // Initialize animations
  setTimeout(() => {
    const cards = document.querySelectorAll(".feature-card");
    cards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1}s`;
      card.style.animationPlayState = "running";
    });
  }, 100);

  // Initialize dock interactions
  initializeDockEffects();
});

// Initialize dock hover effects
function initializeDockEffects() {
  const dockItems = document.querySelectorAll(".dock-item");

  dockItems.forEach((item, index) => {
    item.addEventListener("mouseenter", () => {
      const icon = item.querySelector(".dock-icon");
      icon.style.transform = "scale(1.8) translateY(-15px)";

      // Scale adjacent items
      if (dockItems[index - 1]) {
        const prevIcon = dockItems[index - 1].querySelector(".dock-icon");
        prevIcon.style.transform = "scale(1.4) translateY(-8px)";
      }
      if (dockItems[index + 1]) {
        const nextIcon = dockItems[index + 1].querySelector(".dock-icon");
        nextIcon.style.transform = "scale(1.4) translateY(-8px)";
      }
    });

    item.addEventListener("mouseleave", () => {
      // Reset all items
      dockItems.forEach((dockItem) => {
        const icon = dockItem.querySelector(".dock-icon");
        icon.style.transform = "scale(1) translateY(0)";
      });
    });
  });
}
  
// Beneficiary Management Functions
function populateBeneficiaryDropdowns() {
  const dropdowns = ["dashboardToAccount", "transferToAccount"];

  dropdowns.forEach((dropdownId) => {
    const dropdown = document.getElementById(dropdownId);
    if (!dropdown) return;

    // Clear existing options except the default
    dropdown.innerHTML = '<option value="">-- Select Beneficiary --</option>';

    // Add beneficiaries to dropdown with masked account numbers
    beneficiaries.forEach((beneficiary) => {
      const option = document.createElement("option");
      option.value = beneficiary.accountNumber;
      const maskedAccount = maskAccountNumber(beneficiary.accountNumber);
      option.textContent = `${beneficiary.name} - ${maskedAccount}${
        beneficiary.nickname ? ` (${beneficiary.nickname})` : ""
      }`;
      dropdown.appendChild(option);
    });
  });
}

function addBeneficiary() {
  const name = document.getElementById("beneficiaryName").value.trim();
  const accountNumber = document
    .getElementById("beneficiaryAccount")
    .value.trim();
  const confirmAccount = document.getElementById("confirmAccount").value.trim();
  const ifscCode = document.getElementById("ifscCode").value.trim();
  const nickname = document.getElementById("nickname").value.trim();
  const saveBeneficiary = document.getElementById("saveBeneficiary").checked;
  const messageDiv = document.getElementById("beneficiary-message");

  // Validate required fields
  if (!name || !accountNumber || !ifscCode) {
    showMessage(messageDiv, "Please fill all required fields!", "error");
    return;
  }

  // Validate account numbers match
  if (accountNumber !== confirmAccount) {
    showMessage(messageDiv, "Account numbers do not match!", "error");
    return;
  }

  // Check if beneficiary already exists
  const existingBeneficiary = beneficiaries.find(
    (b) => b.accountNumber === accountNumber
  );
  if (existingBeneficiary) {
    showMessage(
      messageDiv,
      "Beneficiary with this account number already exists!",
      "error"
    );
    return;
  }

  if (saveBeneficiary) {
    // Add to beneficiaries array
    const newBeneficiary = {
      id: Date.now().toString(),
      name: name,
      accountNumber: accountNumber,
      ifscCode: ifscCode,
      nickname: nickname,
    };

    beneficiaries.push(newBeneficiary);
    localStorage.setItem(
      "djokovic-bank-beneficiaries",
      JSON.stringify(beneficiaries)
    );

    // Update dropdowns and list
    populateBeneficiaryDropdowns();
    updateBeneficiaryList();

    showMessage(messageDiv, "Beneficiary added successfully!", "success");

    // Clear form
    clearBeneficiaryForm();
  } else {
    showMessage(messageDiv, "Beneficiary processed but not saved!", "success");
    clearBeneficiaryForm();
  }
}
  

function clearBeneficiaryForm() {
  document.getElementById("beneficiaryName").value = "";
  document.getElementById("beneficiaryAccount").value = "";
  document.getElementById("confirmAccount").value = "";
  document.getElementById("ifscCode").value = "";
  document.getElementById("nickname").value = "";
  document.getElementById("saveBeneficiary").checked = true;
}

function updateBeneficiaryList() {
  const listContainer = document.getElementById("beneficiaryListContainer");
  const listDiv = document.getElementById("beneficiaryList");

  if (beneficiaries.length === 0) {
    listContainer.style.display = "none";
    return;
  }

  listContainer.style.display = "block";
  listDiv.innerHTML = "";

  beneficiaries.forEach((beneficiary) => {
    const beneficiaryItem = document.createElement("div");
    beneficiaryItem.className = "beneficiary-item";
    const maskedAccount = maskAccountNumber(beneficiary.accountNumber);
    beneficiaryItem.innerHTML = `
      <div class="beneficiary-info">
        <h4>${beneficiary.name}${
      beneficiary.nickname ? ` (${beneficiary.nickname})` : ""
    }</h4>
        <p>Account: ${maskedAccount} | IFSC: ${beneficiary.ifscCode}</p>
      </div>
      <div class="beneficiary-actions">
        <button class="btn-small btn-danger" onclick="deleteBeneficiary('${
          beneficiary.id
        }')">Delete</button>
      </div>
    `;
    listDiv.appendChild(beneficiaryItem);
  });
}

function deleteBeneficiary(id) {
  if (confirm("Are you sure you want to delete this beneficiary?")) {
    beneficiaries = beneficiaries.filter((b) => b.id !== id);
    localStorage.setItem(
      "djokovic-bank-beneficiaries",
      JSON.stringify(beneficiaries)
    );

    // Update dropdowns and list
    populateBeneficiaryDropdowns();
    updateBeneficiaryList();

    showSuccessModal("Beneficiary deleted successfully!");
  }
}

function showMessage(element, text, type) {
  element.textContent = text;
  element.className = `message ${type}`;
  element.classList.remove("hidden");

  setTimeout(() => {
    element.classList.add("hidden");
  }, 3000);
}

// Enhanced 3D Page Transitions
function showSection(sectionId) {
  if (isTransitioning || currentSection === sectionId) return;

  isTransitioning = true;
  const overlay = document.getElementById("transitionOverlay");

  // Start transition
  overlay.classList.add("active");

  setTimeout(() => {
    // Hide all sections
    const sections = document.querySelectorAll(".page-section");
    sections.forEach((section) => {
      section.classList.remove("active");
      section.classList.add("transitioning-out");
    });

    // Handle landing page
    const landing = document.getElementById("landing");
    if (sectionId === "landing") {
      landing.style.display = "flex";
      overlay.classList.remove("active");
      isTransitioning = false;
      return;
    } else {
      landing.style.display = "none";
    }

    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      setTimeout(() => {
        sections.forEach((section) => {
          section.classList.remove("transitioning-out");
        });

        targetSection.classList.add("active");
        currentSection = sectionId;

        // Update beneficiary dropdowns when showing transfer sections
        if (sectionId === "transfer" || sectionId === "dashboard") {
          populateBeneficiaryDropdowns();
        }

        // Update beneficiary list when showing add-payee
        if (sectionId === "add-payee") {
          updateBeneficiaryList();
        }

        // Show random quote for dashboard
        if (sectionId === "dashboard" || sectionId === "admin-dashboard") {
          showRandomQuote();
        }

        // End transition
        overlay.classList.remove("active");
        isTransitioning = false;

        // Scroll to top
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
    }
  }, 400);
}

// Navigation Functions
function scrollToHome() {
  document.getElementById("landing").style.display = "none";
  showSection("home");
}

// Dashboard Functions
function showDashboardContent(contentId) {
  // Hide all dashboard content
  const contents = document.querySelectorAll(".dashboard-content");
  contents.forEach((content) => {
    content.classList.remove("active");
  });

  // Remove active class from all menu items
  const menuItems = document.querySelectorAll(".sidebar-menu a");
  menuItems.forEach((item) => {
    item.classList.remove("active");
  });

  // Show selected content
  const targetContent = document.getElementById(contentId);
  if (targetContent) {
    targetContent.classList.add("active");
  }

  // Add active class to clicked menu item
  event.target.classList.add("active");

  // Update beneficiary dropdown if funds-transfer is selected
  if (contentId === "funds-transfer") {
    populateBeneficiaryDropdowns();
  }
}

// Admin Dashboard Functions
function showAdminContent(contentId) {
  // Hide all dashboard content
  const contents = document.querySelectorAll(".dashboard-content");
  contents.forEach((content) => {
    content.classList.remove("active");
  });

  // Remove active class from all menu items
  const menuItems = document.querySelectorAll(".sidebar-menu a");
  menuItems.forEach((item) => {
    item.classList.remove("active");
  });

  // Show selected content
  const targetContent = document.getElementById(contentId);
  if (targetContent) {
    targetContent.classList.add("active");
  }

  // Add active class to clicked menu item
  event.target.classList.add("active");
}

// Form Functions
function setCurrentDate() {
  const dateInputs = document.querySelectorAll('input[type="date"]');
  const today = new Date().toISOString().split("T")[0];

  dateInputs.forEach((input) => {
    // Set today as the value
    input.value = today;
    // Set min and max to today to prevent past/future date selection
    input.min = today;
    input.max = today;
    // Make it readonly to prevent manual editing
    input.readOnly = true;
  });
}

// Toggle chatbot visibility
function toggleChatbot() {
  const chatbot = document.getElementById("chatbotContainer");
  chatbot.classList.toggle("hidden");
}

// Send message
function sendChatMessage() {
  const input = document.getElementById("chatbotInput");
  const message = input.value.trim();
  if (!message) return;

  appendChatMessage(message, "user");
  input.value = "";

  // Simulated bot reply
  setTimeout(() => {
    appendChatMessage(getBotResponse(message), "bot");
  }, 800);
}

// Append message to chat
function appendChatMessage(text, sender) {
  const messagesDiv = document.getElementById("chatbotMessages");
  const msg = document.createElement("div");
  msg.className = "chatbot-message " + sender;
  msg.textContent = text;
  messagesDiv.appendChild(msg);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Enhanced bot response with authentication awareness
function getBotResponse(userMsg) {
  const msg = userMsg.toLowerCase();

  // Authentication-related responses
  if (!isLoggedIn) {
    if (/(login|access|dashboard)/.test(msg)) {
      return "🔒 You need to login first to access your account. Click on the Login icon in the dock.";
    }
    if (/(balance|transfer|account)/.test(msg)) {
      return "🔐 Please login to view your account information and perform transactions.";
    }
  }

  // Greetings
  if (/(hello|hi|hey)/.test(msg)) {
    const greeting = isLoggedIn ? `👋 Hello ${currentUser.name}!` : "👋 Hello!";
    return `${greeting} How can I assist you with your banking today?`;
  }

  // Balance Inquiry
  if (/balance/.test(msg)) {
    if (!isLoggedIn) return "🔒 Please login to check your balance.";
    return "💰 Your current balance is ₹25,847.50 in your Championship Savings account.";
  }

  // Transfers
  if (/(transfer|send money|funds)/.test(msg)) {
    if (!isLoggedIn) return "🔒 Please login to make transfers.";
    return "🔄 You can transfer funds by visiting the Transfer section in the menu.";
  }

  // Admin-specific responses
  if (isLoggedIn && currentUser.role === "admin") {
    if (/(user|manage|admin)/.test(msg)) {
      return "👑 As an admin, you can manage users, monitor transactions, and configure system settings from your admin panel.";
    }
  }

  // Forgot Password
  if (/(forgot|reset).*password/.test(msg)) {
    return "🔐 To reset your password, go to the Login section and click 'Forgot Password'.";
  }

  // Help
  if (/help|assist|support/.test(msg)) {
    return "📝 I can help you with login, balance inquiries, transfers, and general banking questions. What do you need assistance with?";
  }

  // Fallback
  return "❓ I'm sorry, I didn't understand that. Try asking about login, balance, transfers, or general help.";
}

// Theme toggle
function toggleTheme() {
  const html = document.documentElement;
  const toggleBtn = document.getElementById("themeToggle");

  if (html.classList.contains("light-theme")) {
    html.classList.remove("light-theme");
    toggleBtn.textContent = "🌞";
    localStorage.setItem("theme", "dark");
  } else {
    html.classList.add("light-theme");
    toggleBtn.textContent = "🌙";
    localStorage.setItem("theme", "light");
  }
}

// Initialize theme on load
document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  const html = document.documentElement;
  const toggleBtn = document.getElementById("themeToggle");

  if (savedTheme === "light") {
    html.classList.add("light-theme");
    toggleBtn.textContent = "🌙";
  } else {
    toggleBtn.textContent = "🌞";
  }
});

function validateTransactionDate(dateInput) {
  const today = new Date().toISOString().split("T")[0];
  const selectedDate = dateInput.value;

  if (selectedDate !== today) {
    dateInput.value = today;
    showSuccessModal(
      "⚠️ For security reasons, transactions can only be made on the current date."
    );
    return false;
  }
  return true;
}

// Transfer confirmation function
function showTransferConfirmation() {
  const fromAccount =
    document.querySelector("#transfer select").value ||
    document.querySelector("#funds-transfer select").value;
  const toAccountSelect =
    document.querySelector("#transferToAccount") ||
    document.querySelector("#dashboardToAccount");
  const toAccountValue = toAccountSelect.value;
  const amount =
    document.querySelector('#transfer input[type="number"]').value ||
    document.querySelector('#funds-transfer input[type="number"]').value;
  const remarks =
    document.querySelector('#transfer input[type="text"]').value ||
    document.querySelector('#funds-transfer input[type="text"]').value;

  if (!toAccountValue || !amount) {
    showSuccessModal("⚠️ Please fill all required fields!");
    return;
  }

  // Find the selected beneficiary
  const selectedBeneficiary = beneficiaries.find(
    (b) => b.accountNumber === toAccountValue
  );

  if (!selectedBeneficiary) {
    showSuccessModal("⚠️ Please select a valid beneficiary!");
    return;
  }

  // Create confirmation modal content
  const confirmationContent = `
    <div style="text-align: left; margin: 1rem 0;">
      <h3 style="color: var(--purple-400); margin-bottom: 1rem;">🔍 Confirm Transfer Details</h3>
      
      <div style="background: var(--card-secondary); padding: 1rem; border-radius: 10px; margin-bottom: 1rem;">
        <p><strong>From Account:</strong> Championship Savings - ****1234</p>
        <p><strong>To Account:</strong> ${selectedBeneficiary.accountNumber}</p>
        <p><strong>Beneficiary:</strong> ${selectedBeneficiary.name}${
    selectedBeneficiary.nickname ? ` (${selectedBeneficiary.nickname})` : ""
  }</p>
        <p><strong>IFSC Code:</strong> ${selectedBeneficiary.ifscCode}</p>
        <p><strong>Amount:</strong> ₹${amount}</p>
        <p><strong>Remarks:</strong> ${remarks || "N/A"}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
      </div>
      
      <div style="background: rgba(251, 191, 36, 0.2); padding: 0.8rem; border-radius: 8px; border: 1px solid var(--gold-400); margin-bottom: 1rem;">
        <p style="color: var(--gold-400); font-size: 0.9rem; margin: 0;">
          ⚠️ Please verify the account number carefully. This transaction cannot be reversed.
        </p>
      </div>
      
      <div style="display: flex; gap: 1rem; justify-content: center;">
        <button onclick="hideSuccessModal()" style="padding: 0.8rem 1.5rem; background: var(--red-500); color: white; border: none; border-radius: 8px; cursor: pointer;">Cancel</button>
        <button onclick="processTransfer()" style="padding: 0.8rem 1.5rem; background: linear-gradient(45deg, var(--purple-500), var(--pink-500)); color: white; border: none; border-radius: 8px; cursor: pointer;">Confirm Transfer</button>
      </div>
    </div>
  `;

  // Show confirmation modal
  const modal = document.getElementById("successModal");
  const messageDiv = document.getElementById("successMessage");
  messageDiv.innerHTML = confirmationContent;
  modal.classList.add("active");
}

// Process the actual transfer
function processTransfer() {
  const today = new Date().toLocaleDateString();
  const transactionId = "TXN" + Date.now();

  hideSuccessModal();

  // Show processing
  showSuccessModal("⏳ Processing your transfer...");

  setTimeout(() => {
    hideSuccessModal();
    showSuccessModal(
      `🎉 Transfer Successful!\n\nTransaction ID: ${transactionId}\nDate: ${today}\nStatus: Completed`
    );
  }, 2000);
}

// Update the showTransferSuccess function to show confirmation first
function showTransferSuccess() {
  const dateInput = document.querySelector('#transfer input[type="date"]');
  const dashboardDateInput = document.querySelector(
    '#funds-transfer input[type="date"]'
  );

  // Validate date if present
  if (dateInput && !validateTransactionDate(dateInput)) return;
  if (dashboardDateInput && !validateTransactionDate(dashboardDateInput))
    return;

  // Show confirmation instead of direct success
  showTransferConfirmation();
}

// Success Modal Functions
function showSuccessModal(message) {
  const modal = document.getElementById("successModal");
  const messageDiv = document.getElementById("successMessage");
  messageDiv.innerHTML = message;
  modal.classList.add("active");
}

function hideSuccessModal() {
  const modal = document.getElementById("successModal");
  modal.classList.remove("active");
}

function showRandomQuote() {
  const quotes = [
    "💡 Save money and money will save you.",
    "💰 A penny saved is a penny earned.",
    "📈 Invest in yourself. It pays the best interest.",
    "🏦 Don't work for money. Make money work for you.",
    "🎯 Budgeting is telling your money where to go instead of wondering where it went.",
    "🚀 The best time to start saving was yesterday. The next best time is today.",
  ];

  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  const quoteDiv = document.getElementById("dashboardQuote");
  if (quoteDiv) {
    quoteDiv.textContent = quote;
  }
}

// Enhanced Parallax Effects
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const landing = document.getElementById("landing");

  if (landing && landing.style.display !== "none") {
    const sphere = document.querySelector(".sphere-3d");
    const cube = document.querySelector(".cube-3d");
    const pyramid = document.querySelector(".pyramid-3d");

    if (sphere) {
      sphere.style.transform = `translateY(${scrolled * 0.3}px) rotateX(${
        scrolled * 0.1
      }deg) rotateY(${scrolled * 0.1}deg)`;
    }

    if (cube) {
      cube.style.transform = `translateY(${scrolled * 0.2}px) rotateX(${
        scrolled * 0.15
      }deg) rotateY(${scrolled * 0.15}deg)`;
    }

    if (pyramid) {
      pyramid.style.transform = `translate(-50%, -50%) translateY(${
        scrolled * 0.4
      }px) rotateX(${scrolled * 0.2}deg) rotateY(${scrolled * 0.2}deg)`;
    }
  }
});

const apiUrl = 'http://localhost:8074/customers'; // update if different

function addCustomer() {
  const data = {
    aadhaar: document.getElementById('aadhaar').value,
    customerName: document.getElementById('customerName').value,
    email: document.getElementById('email').value,
    mobile: document.getElementById('mobile').value
  };

  fetch(`${apiUrl}/${data.aadhaar}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(c => {
    alert(`Customer ${c.customerName} saved.`);
    fetchAllCustomers();
  })
  .catch(err => alert("Error saving customer"));
}

function deleteCustomer() {
  const aadhaar = document.getElementById('aadhaar').value;
  fetch(`${apiUrl}/${aadhaar}`, { method: 'DELETE' })
    .then(() => {
      alert("Customer deleted");
      fetchAllCustomers();
    })
    .catch(err => alert("Error deleting customer"));
}

function fetchAllCustomers() {
  fetch(apiUrl)
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById('customerList');
      container.innerHTML = '<h3>All Customers</h3><ul>' +
        data.map(c => `<li><strong>${c.customerName}</strong> - ${c.aadhaar} - ${c.email} - ${c.mobile}</li>`).join('') +
        '</ul>';
    });
}

require(['knockout', 'ojs/ojarraydataprovider'], function(ko, ArrayDataProvider) {
  var customerVM = null;
  var bindingsApplied = false;

  window.loadCustomerTable = function() {
    // Show the section if it's hidden (optional, if you have a showSection function)
    if (typeof showSection === 'function') showSection('customer-management');

    // Create ViewModel if not already created
    if (!customerVM) {
      function CustomerTableViewModel() {
        var self = this;
        self.customerArray = ko.observableArray([]);
        self.customerDataSource = new ArrayDataProvider(self.customerArray, {keyAttributes: 'aadhaar'});
      }
      customerVM = new CustomerTableViewModel();
    }

    // Apply bindings only once
    if (!bindingsApplied) {
      ko.applyBindings(customerVM, document.getElementById('customerTableContainer'));
      bindingsApplied = true;
    }

    // Fetch and update data
    fetch("http://localhost:8074/customers")
      .then(res => res.json())
      .then(data => {
        customerVM.customerArray(data || []);
      });
  };
});

require(['knockout', 'ojs/ojarraydataprovider'], function(ko, ArrayDataProvider) {
  // Only run this when dashboard is shown/logged in
  window.loadTransactionTable = function(accountNo) {
    fetch(`http://localhost:8085/api/transactions`)
      .then(res => res.json())
      .then(data => {
        // Filter for this user's account
        var userTxns = (data || []).filter(function(txn) {
          return txn.accNo === accountNo;
        });
        var txnDataSource = new ArrayDataProvider(userTxns, {keyAttributes: 'transactionId'});
        // Apply Knockout binding to the table container
        ko.applyBindings({ transactionDataSource: txnDataSource }, document.getElementById('transactionTableContainer'));
      });
  };
});