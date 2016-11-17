(function(window) {
    'use strict';
    var App = window.App || {};

    function Truck(truckID, db) {
        this.truckID = truckID;
        this.db = db;
    }

    Truck.prototype.createOrder = function(order) {
        console.log('Adding order for ' + order.emailAddress);
        this.db.add(order.emailAddress, order);
    };

    Truck.prototype.deliverOrder = function(customerID) {
        console.log('Delivering order for ' + customerID);
        this.db.remove(customerID);
    };

    Truck.prototype.printOrders = function() {
        var customerIdArray = Object.keys(this.db.getAll());

        console.log('Truck #' + this.truckID + ' has pending orders:');
        customerIdArray.forEach(function(id) {
            console.log(this.db.get(id));
        }.bind(this));
    };

    Truck.prototype.getOrder = function(id) {
      return this.db.get(id);
    };

    App.Truck = Truck;
    window.App = App;
})(window);
