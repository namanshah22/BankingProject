define(['ojs/ojcore', 'knockout', 'jquery'], function(oj, ko, $) {
  function TransactionsViewModel() {
    var self = this;
    self.transactions = ko.observableArray([]);
    self.loading = ko.observable(false);
    self.error = ko.observable('');

    self.newTransactionAmount = ko.observable('');
    self.newTransactionType = ko.observable('');
    self.newTransactionDate = ko.observable('');

    self.addTransactionHandler = function() {
      var newTransaction = {
        amount: self.newTransactionAmount(),
        type: self.newTransactionType(),
        date: self.newTransactionDate()
      };
      self.addTransaction(newTransaction);
      self.newTransactionAmount('');
      self.newTransactionType('');
      self.newTransactionDate('');
    };

    self.fetchTransactions = function() {
      self.loading(true);
      self.error('');
      fetch('http://localhost:9010/api/transactions')
        .then(response => response.json())
        .then(data => self.transactions(data))
        .catch(err => self.error('Failed to load transactions'))
        .finally(() => self.loading(false));
    };

    self.addTransaction = function(newTransaction) {
      self.loading(true);
      fetch('http://localhost:9010/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTransaction)
      })
      .then(response => response.json())
      .then(data => {
        self.transactions.push(data);
      })
      .catch(err => self.error('Failed to add transaction'))
      .finally(() => self.loading(false));
    };

    // Initial load
    self.fetchTransactions();
  }
  return new TransactionsViewModel();
}); 