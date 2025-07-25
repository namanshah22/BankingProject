require(['knockout', 'ojs/ojcore'], function(ko, oj) {
  function AppViewModel() {
    var self = this;

    // Observables
    self.isLoggedIn = ko.observable(false);
    self.currentUser = ko.observable();
    self.userAccountNo = ko.observable();
    self.beneficiaries = ko.observableArray([]);
    self.transactions = ko.observableArray([]);

    // Login form
    self.loginAadhaar = ko.observable('');
    self.loginPassword = ko.observable('');
    self.loginError = ko.observable('');

    // Add payee form
    self.newPayeeName = ko.observable('');
    self.newPayeeAccNo = ko.observable('');
    self.payeeMessage = ko.observable('');

    // Transfer form
    self.transferToAcc = ko.observable('');
    self.transferAmount = ko.observable('');
    self.transferRemarks = ko.observable('');
    self.transferMessage = ko.observable('');

    // Login
    self.login = function() {
      self.loginError('');
      oj.ajax({
        url: "http://localhost:8074/customers/login",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ aadhaar: self.loginAadhaar(), password: self.loginPassword() }),
        success: function(customer) {
          self.currentUser(customer);
          self.isLoggedIn(true);
          // Fetch user's account number
          oj.ajax({
            url: "http://localhost:8084/accounts/aadhaar/" + customer.aadhaar,
            type: "GET",
            success: function(accounts) {
              if (accounts && accounts.length > 0) {
                self.userAccountNo(accounts[0].accountNo);
                self.fetchPayees();
                self.fetchTransactions();
              }
            }
          });
        },
        error: function() {
          self.loginError("Invalid credentials!");
        }
      });
    };

    // Logout
    self.logout = function() {
      self.isLoggedIn(false);
      self.currentUser(null);
      self.userAccountNo(null);
      self.beneficiaries([]);
      self.transactions([]);
      self.loginAadhaar('');
      self.loginPassword('');
    };

    // Fetch payees for the user
    self.fetchPayees = function() {
      if (!self.userAccountNo()) return;
      oj.ajax({
        url: "http://localhost:8083/payees/account/" + self.userAccountNo(),
        type: "GET",
        success: function(payees) {
          self.beneficiaries(payees || []);
        },
        error: function() {
          self.beneficiaries([]);
        }
      });
    };

    // Add a payee
    self.addPayee = function() {
      if (!self.newPayeeName() || !self.newPayeeAccNo()) return;
      oj.ajax({
        url: "http://localhost:8083/payees",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
          accNo: self.userAccountNo(),
          payeeName: self.newPayeeName(),
          payeeAccNo: self.newPayeeAccNo()
        }),
        success: function() {
          self.payeeMessage("Payee added!");
          self.newPayeeName('');
          self.newPayeeAccNo('');
          self.fetchPayees();
          setTimeout(() => self.payeeMessage(''), 2000);
        },
        error: function() {
          self.payeeMessage("Error adding payee!");
        }
      });
    };

    // Delete a payee
    self.deletePayee = function(payee) {
      oj.ajax({
        url: "http://localhost:8083/payees/" + payee.payeeId,
        type: "DELETE",
        success: function() {
          self.fetchPayees();
        }
      });
    };

    // Transfer funds
    self.transferFunds = function() {
      if (!self.transferToAcc() || !self.transferAmount()) return;
      oj.ajax({
        url: "http://localhost:8085/api/transactions",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
          accNo: self.userAccountNo(),
          destAccNo: self.transferToAcc(),
          transAmount: self.transferAmount(),
          remarks: self.transferRemarks()
        }),
        success: function() {
          self.transferMessage("Transfer successful!");
          self.fetchTransactions();
          self.transferToAcc('');
          self.transferAmount('');
          self.transferRemarks('');
          setTimeout(() => self.transferMessage(''), 2000);
        },
        error: function() {
          self.transferMessage("Transfer failed!");
        }
      });
    };

    // Fetch transactions for the user
    self.fetchTransactions = function() {
      if (!self.userAccountNo()) return;
      oj.ajax({
        url: "http://localhost:8085/api/transactions",
        type: "GET",
        success: function(txns) {
          var userTxns = (txns || []).filter(function(txn) {
            return txn.accNo === self.userAccountNo();
          });
          self.transactions(userTxns);
        },
        error: function() {
          self.transactions([]);
        }
      });
    };
  }

  ko.applyBindings(new AppViewModel(), document.getElementById('mainContent'));
});