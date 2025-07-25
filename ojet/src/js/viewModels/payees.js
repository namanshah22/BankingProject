define(['ojs/ojcore', 'knockout', 'jquery'], function(oj, ko, $) {
  function PayeesViewModel() {
    var self = this;
    self.payees = ko.observableArray([]);
    self.loading = ko.observable(false);
    self.error = ko.observable('');

    self.newPayeeName = ko.observable('');
    self.newPayeeAccNo = ko.observable('');

    self.addPayeeHandler = function() {
      var newPayee = {
        name: self.newPayeeName(),
        accNo: self.newPayeeAccNo()
      };
      self.addPayee(newPayee);
      self.newPayeeName('');
      self.newPayeeAccNo('');
    };

    self.fetchPayees = function() {
      self.loading(true);
      self.error('');
      fetch('http://localhost:8083/payees')
        .then(response => response.json())
        .then(data => self.payees(data))
        .catch(err => self.error('Failed to load payees'))
        .finally(() => self.loading(false));
    };

    self.addPayee = function(newPayee) {
      self.loading(true);
      fetch('http://localhost:8083/payees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPayee)
      })
      .then(response => response.json())
      .then(data => {
        self.payees.push(data);
      })
      .catch(err => self.error('Failed to add payee'))
      .finally(() => self.loading(false));
    };

    self.deletePayee = function(payee) {
      self.loading(true);
      fetch('http://localhost:8083/payees/' + payee.id, { method: 'DELETE' })
        .then(() => {
          self.payees.remove(payee);
        })
        .catch(err => self.error('Failed to delete payee'))
        .finally(() => self.loading(false));
    };

    // Initial load
    self.fetchPayees();
  }
  return new PayeesViewModel();
}); 