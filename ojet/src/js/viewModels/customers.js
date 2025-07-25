/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/*
 * Your customer ViewModel code goes here
 */
define([
  'knockout',
  'ojs/ojarraydataprovider',
  'ojs/ojtable',
  'ojs/ojcore'
], function (ko, ArrayDataProvider) {
  function CustomerViewModel() {
    const self = this;

    self.customerData = ko.observableArray([]);
    self.customerDataProvider = new ArrayDataProvider(self.customerData, {
      keyAttributes: 'aadhaar' // Use aadhaar as unique ID
    });

    self.connected = async () => {
      try {
        const response = await fetch("http://localhost:8074/customers");
        const data = await response.json();

        const formatted = data.map(c => ({
          name: c.customerName,
          email: c.email,
          phone: c.mobile,
          city: c.address,
          gender: c.gender,
          dob: c.dob,
          occupation: c.occupation,
          pan: c.pan
        }));

        self.customerData(formatted);
      } catch (err) {
        console.error("Failed to fetch customers:", err);
      }
    };
  }

  return CustomerViewModel;
});
