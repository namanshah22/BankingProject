define(['knockout', 'ojs/ojarraydataprovider', 'ojs/ojbootstrap'],
    function (ko, ArrayDataProvider, Bootstrap) {
      function AdminViewModel() {
        const self = this;
  
        const BASE_URL = 'http://localhost:8074/customers';
  
        self.loggedIn = ko.observable(false);
        self.loginUsername = ko.observable('');
        self.loginPassword = ko.observable('');
  
        self.aadhaar = ko.observable('');
        self.name = ko.observable('');
        self.email = ko.observable('');
        self.mobile = ko.observable('');
        self.totalCustomers = ko.observable(0);
  
        self.customers = ko.observableArray([]);
        self.customerProvider = new ArrayDataProvider(self.customers, { keyAttributes: 'aadhaar' });
  
        self.login = function () {
          if (self.loginUsername() === 'admin' && self.loginPassword() === 'admin') {
            self.loggedIn(true);
            self.loadCustomers();
          } else {
            alert('Invalid credentials!');
          }
        };
  
        self.logout = function () {
          self.loggedIn(false);
          self.loginUsername('');
          self.loginPassword('');
        };
  
        self.getCustomers = function () {
          fetch(BASE_URL)
            .then(response => response.json())
            .then(data => {
              self.customers(data);
              self.totalCustomers(data.length);
            })
            .catch(error => console.error('Error fetching customers:', error));
        };
        
        self.loadCustomers = function () {
          fetch(BASE_URL)
            .then(response => response.json())
            .then(data => {
              self.customers(data);
              self.totalCustomers(data.length);
            })
            .catch(error => console.error('Error loading customers:', error));
        };
  
        self.addOrUpdateCustomer = function () {
          const customer = {
            aadhaar: self.aadhaar(),
            name: self.name(),
            email: self.email(),
            mobile: self.mobile()
          };
        
          const isUpdate = self.customers().some(c => c.aadhaar === self.aadhaar());
        
          fetch(`${BASE_URL}${isUpdate ? '/' + self.aadhaar() : ''}`, {
            method: isUpdate ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(customer)
          })
          .then(response => {
            if (response.ok) {
              self.loadCustomers();
              self.clearForm();
            } else {
              alert(isUpdate ? 'Update failed' : 'Add failed');
            }
          });
        };
        
        self.selectRow = function (event) {
          const row = event.detail.value[0];
          const selected = self.customers().find(c => c.aadhaar === row);
          if (selected) {
            self.aadhaar(selected.aadhaar);
            self.name(selected.name);
            self.email(selected.email);
            self.mobile(selected.mobile);
          }
        };
  
        self.deleteCustomer = function () {
          if (!self.aadhaar()) {
            alert('Please select a customer to delete.');
            return;
          }
  
          fetch(`${BASE_URL}/${self.aadhaar()}`, {
            method: 'DELETE'
          }).then(() => {
            self.loadCustomers();
            self.clearForm();
          });
        };
  
        self.clearForm = function () {
          self.aadhaar('');
          self.name('');
          self.email('');
          self.mobile('');
        };
      }
  
      return Bootstrap.whenDocumentReady().then(() => new AdminViewModel());
    });