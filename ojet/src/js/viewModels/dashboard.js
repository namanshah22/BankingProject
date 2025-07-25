define([
  'knockout',
  'ojs/ojarraydataprovider',
  'ojs/ojchart'
], function (ko, ArrayDataProvider) {

  function DashboardViewModel() {
    var self = this;

    // Raw observables
    self.customers = ko.observableArray([]);
    self.accounts = ko.observableArray([]);
    self.transactions = ko.observableArray([]);
    self.payees = ko.observableArray([]);
    self.nominees = ko.observableArray([]);
    self.loginAttempts = ko.observableArray([]);

    // Chart observables
    self.txnSeries = ko.observableArray([]);
    self.txnGroups = ko.observableArray([]);
    self.accountTypePieData = ko.observableArray([]);
    self.loginAttemptsSeries = ko.observableArray([]);
    self.loginAttemptsGroups = ko.observableArray([]);
    self.genderPieData = ko.observableArray([]);
    self.genderPieGroups = ko.observableArray([]);
    self.payeesSeries = ko.observableArray([]);
    self.payeesGroups = ko.observableArray([]);
    self.nomineesSeries = ko.observableArray([]);
    self.nomineesGroups = ko.observableArray([]);
    self.isLoading = ko.observable(true);

    // Fetch all data and prep charts
    self.connected = async function () {
      self.isLoading(true);
      try {
        const [custRes, accRes, txnRes, payeeRes, nomineeRes, loginRes] = await Promise.all([
          fetch('http://localhost:8074/customers'),
          fetch('http://localhost:8084/accounts'),
          fetch('http://localhost:9010/api/transactions'),
          fetch('http://localhost:8083/payees'),
          fetch('http://localhost:8001/nominees'),
          fetch('http://localhost:8082/login-attempts')
        ]);
        if (!custRes.ok) throw new Error(`Customers API failed: ${custRes.status}`);
        if (!accRes.ok) throw new Error(`Accounts API failed: ${accRes.status}`);
        if (!txnRes.ok) throw new Error(`Transactions API failed: ${txnRes.status}`);
        if (!payeeRes.ok) throw new Error(`Payees API failed: ${payeeRes.status}`);
        if (!nomineeRes.ok) throw new Error(`Nominees API failed: ${nomineeRes.status}`);
        if (!loginRes.ok) throw new Error(`Login attempts API failed: ${loginRes.status}`);

        const [cust, acc, txn, payees, nominees, logins] = await Promise.all([
          custRes.json(),
          accRes.json(),
          txnRes.json(),
          payeeRes.json(),
          nomineeRes.json(),
          loginRes.json()
        ]);

        self.customers(Array.isArray(cust) ? cust : []);
        self.accounts(Array.isArray(acc) ? acc : []);
        self.transactions(Array.isArray(txn) ? txn : []);
        self.payees(Array.isArray(payees) ? payees : []);
        self.nominees(Array.isArray(nominees) ? nominees : []);
        self.loginAttempts(Array.isArray(logins) ? logins : []);

        self.prepareChartData();

      } catch (err) {
        console.error("Dashboard data load failed:", err);
        self.customers([]);
        self.accounts([]);
        self.transactions([]);
        self.payees([]);
        self.nominees([]);
        self.loginAttempts([]);
        self.prepareChartData();
      } finally {
        self.isLoading(false);
      }
    };

    self.prepareChartData = function () {
      // 1. Transactions Over Time (line)
      let txnMap = {};
      self.transactions().forEach(txn => {
        let date = txn.date ? txn.date.split('T')[0] : 'Unknown';
        txnMap[date] = (txnMap[date] || 0) + 1;
      });
      self.txnGroups(Object.keys(txnMap).sort());
      self.txnSeries([{ name: 'Transactions', items: Object.values(txnMap) }]);

      // 2. Account Types Pie Chart
      let accMap = {};
      self.accounts().forEach(acc => {
        let accountType = acc.type || acc.accountType || 'Unknown';
        accMap[accountType] = (accMap[accountType] || 0) + 1;
      });
      const accountTypeValues = Object.keys(accMap).map(type => accMap[type]);
      self.accountTypePieData([{ name: "Account Types", items: accountTypeValues }]);

      // 3. Login Attempts
      let loginMap = {};
      self.loginAttempts().forEach(l => {
        let aadhaar = l.aadhaar || l.userId || 'Unknown';
        loginMap[aadhaar] = (loginMap[aadhaar] || 0) + 1;
      });
      self.loginAttemptsGroups(Object.keys(loginMap));
      self.loginAttemptsSeries([{ name: 'Login Attempts', items: Object.values(loginMap) }]);

      // 4. Gender Distribution (Corrected)
      const genderMap = {};
      self.customers().forEach(cust => {
        let gender = cust.gender;
        if (!gender) {
          gender = 'Other';
        } else {
          gender = gender.trim();
          if (gender.toLowerCase() === 'male' || gender.toLowerCase() === 'm') {
            gender = 'Male';
          } else if (gender.toLowerCase() === 'female' || gender.toLowerCase() === 'f') {
            gender = 'Female';
          } else {
            gender = 'Other';
          }
        }
        genderMap[gender] = (genderMap[gender] || 0) + 1;
      });
      const genderLabels = Object.keys(genderMap);
      const genderCounts = genderLabels.map(g => genderMap[g]);
      self.genderPieGroups(genderLabels);
      self.genderPieData([{
        name: "Gender Distribution",
        items: genderCounts
      }]);
      // Debug logs for development
      console.log('Gender Pie Groups:', genderLabels);
      console.log('Gender Pie Data:', genderCounts);

      // 5. Payees per Customer
      let payeeMap = {};
      self.payees().forEach(p => {
        let accNo = p.accNo || p.accountNumber || 'Unknown';
        payeeMap[accNo] = (payeeMap[accNo] || 0) + 1;
      });
      self.payeesGroups(Object.keys(payeeMap));
      self.payeesSeries([{ name: 'Payees', items: Object.values(payeeMap) }]);

      // 6. Nominees per Customer
      let nomineeMap = {};
      self.nominees().forEach(n => {
        let aadhaar = n.customerAadhaar || n.aadhaar || 'Unknown';
        nomineeMap[aadhaar] = (nomineeMap[aadhaar] || 0) + 1;
      });
      self.nomineesGroups(Object.keys(nomineeMap));
      self.nomineesSeries([{ name: 'Nominees', items: Object.values(nomineeMap) }]);
    };

    // Initialize chart observables to valid structure
    self.genderPieData([{ name: "Gender Distribution", items: [] }]);
    self.genderPieGroups([]);

    return self;
  }

  return new DashboardViewModel();
});
