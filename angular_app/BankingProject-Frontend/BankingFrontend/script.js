// Authentication state
let currentUser = null;
let isLoggedIn = false;

// Global Variables
let currentSection = "home";
let isTransitioning = false;
let userAccountNo = null;
let beneficiaries = [];

// Utility function to mask account numbers (show ****1234 format)
function maskAccountNumber(accountNumber) {
  if (!accountNumber || accountNumber.length < 4) return "****";
  const visibleDigits = accountNumber.slice(-4);
  const maskedPart = "****";
  return maskedPart + visibleDigits;
}

// Authentication Functions
function handleLogin() {
  const userId = document.getElementById("userId").value.trim();
  const password = document.getElementById("password").value.trim();
  const messageDiv = document.getElementById("login-message");

  if (!userId || !password) {
    showMessage(messageDiv, "Please fill all fields!", "error");
    return;
  }

  // Special case for admin login
  if (userId === "admin" && password === "admin123") {
    currentUser = { userId: "admin", role: "admin", name: "Administrator" };
    isLoggedIn = true;
    showMessage(messageDiv, "Admin login successful!", "success");
    setTimeout(() => {
      showSection("admin-dashboard");
    }, 1000);
    return;
  }

  // Customer login (backend)
  fetch("http://localhost:8074/customers/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ aadhaar: userId, password })
  })
    .then(res => {
      if (!res.ok) throw new Error("Invalid credentials");
      return res.json();
    })
    .then(customer => {
      currentUser = customer;
      isLoggedIn = true;
      // Fetch user's account number
      fetch(`http://localhost:8084/accounts/aadhaar/${customer.aadhaar}`)
        .then(r => r.json())
        .then(accounts => {
          if (accounts && accounts.length > 0) {
            userAccountNo = accounts[0].accountNo;
            loadBeneficiaries(); // <-- call here!
          }
        });
      showMessage(messageDiv, "Login successful!", "success");
      setTimeout(() => {
        showSection("dashboard");
      }, 1000);
    })
    .catch(() => {
      showMessage(messageDiv, "Invalid credentials!", "error");
      document.getElementById("password").value = "";
    });
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

function checkAuthAndShowDashboard() {
  if (!isLoggedIn) {
    showSuccessModal("🔒 Please login to access your dashboard.");
    setTimeout(() => {
      hideSuccessModal();
      showSection("login");
    }, 2000);
    return;
  }

  if (currentUser.role === "admin") {
    showSection("admin-dashboard");
  } else {
    showSection("dashboard");
  }
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
  const accountNumber = document.getElementById("beneficiaryAccount").value.trim();
  const confirmAccount = document.getElementById("confirmAccount").value.trim();
  const messageDiv = document.getElementById("beneficiary-message");

  if (!name || !accountNumber || accountNumber !== confirmAccount) {
    showMessage(messageDiv, "Invalid beneficiary details!", "error");
    return;
  }
  if (!userAccountNo) {
    showMessage(messageDiv, "User account not loaded!", "error");
    return;
  }

  fetch("http://localhost:8083/payees", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      accNo: userAccountNo,
      payeeName: name,
      payeeAccNo: accountNumber
    })
  })
    .then(r => r.json())
    .then(() => {
      // After adding, reload only this user's payees
      loadBeneficiaries();
      showMessage(messageDiv, "Beneficiary added!", "success");
      clearBeneficiaryForm();
    })
    .catch(() => showMessage(messageDiv, "Error adding beneficiary!", "error"));
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

  if (/novak/.test(msg)) {
    if (!isLoggedIn) return "🔒 Please login to check your balance.";
    return "He is being retired from tennis";
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


function loadBeneficiaries() {
  // Revert to previous logic (before mapping to backend only)
  beneficiaries = JSON.parse(localStorage.getItem("djokovic-bank-beneficiaries")) || [];
  populateBeneficiaryDropdowns();
  updateBeneficiaryList();
}

// ADMIN: CUSTOMER MANAGEMENT
function fetchAllCustomers() {
  const container = document.getElementById('customerList');
  container.innerHTML = '<div class="loading"></div> Loading...';
  fetch("http://localhost:8074/customers")
    .then(res => res.json())
    .then(data => {
      if (!Array.isArray(data) || data.length === 0) {
        container.innerHTML = '<p>No customers found.</p>';
        return;
      }
      container.innerHTML = '<h3>All Customers</h3><ul>' +
        data.map(c => `<li><strong>${c.customerName}</strong> - ${c.aadhaar} - ${c.email} - ${c.mobile} <button onclick="deleteCustomer('${c.aadhaar}')">Delete</button></li>`).join('') +
        '</ul>';
    })
    .catch(err => {
      container.innerHTML = `<p style="color: red;">Error fetching customers: ${err.message}</p>`;
    });
}

function addCustomer() {
  const aadhaar = document.getElementById('aadhaar').value;
  const customerName = document.getElementById('customerName').value;
  const email = document.getElementById('email').value;
  const mobile = document.getElementById('mobile').value;
  const password = document.getElementById('customerPassword') ? document.getElementById('customerPassword').value : '';
  fetch("http://localhost:8074/customers", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ aadhaar, customerName, email, mobile, password })
  })
    .then(res => res.json())
    .then(c => {
      alert(`Customer ${c.customerName} saved.`);
      fetchAllCustomers();
    })
    .catch(err => alert("Error saving customer"));
}

function deleteCustomer(aadhaar) {
  fetch(`http://localhost:8074/customers/${aadhaar}`, { method: 'DELETE' })
    .then(() => {
      alert("Customer deleted");
      fetchAllCustomers();
    })
    .catch(err => alert("Error deleting customer"));
}