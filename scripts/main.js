(function(window) {
    'use strict';

    var FORM_SELECTOR = '[data-coffee-order="form"]';
    var CHECKLIST_SELECTOR = '[data-coffee-order="checklist"]';
    var SERVER_URL = 'http://coffeerun-v2-rest-api.herokuapp.com/api/coffeeorders';

    var App = window.App;
    var Truck = App.Truck;
    var DataStore = App.DataStore;
    var RemoteDataStore = App.RemoteDataStore;
    var FormHandler = App.FormHandler;
    var Validation = App.Validation;
    var CheckList = App.CheckList;
    var remoteDS = new RemoteDataStore(SERVER_URL);
    var webshim = window.webshim;
    var StrengthHandler = App.StrengthHandler;

    // var myTruck = new Truck('ncc-1701', new DataStore());
    var myTruck = new Truck('ncc-1701', remoteDS);
    window.myTruck = myTruck;

    var strengthHandler = new StrengthHandler();

    var checkList = new CheckList(CHECKLIST_SELECTOR, strengthHandler);
// note that passing second parameter allows access to change data
    checkList.addClickHandler(myTruck.deliverOrder.bind(myTruck),
      function(email) {
      return myTruck.getOrder(email);
    });

    var formHandler = new FormHandler(FORM_SELECTOR, strengthHandler);
    // formHandler.addSubmitHandler(myTruck.createOrder.bind(myTruck));
    // console.log(formHandler);
    formHandler.addSubmitHandler(function(data) {
        myTruck.createOrder.call(myTruck, data);

        // use the data as caller sees fit
        var editing = false;
        if (data["emailAddress"] === checkList.editingEmail) {
            editing = true;
        }
        checkList.editingEmail = null;

        if (!editing) {
            checkList.addRow.call(checkList, data);
        } // end if
        else {
            console.log('editing');
            var row = checkList.rows[data["emailAddress"]];
            row.changeDescriptionTo(data);
        } // end else
        // these work too
        // myTruck.createOrder.bind(myTruck)(data);
        // checkList.addRow.bind(checkList)(data);
    }); // end formHandler.addSubmitHandler(fn);

formHandler.addEmailInputHandler(Validation.isCompanyEmail);
formHandler.addDecafInputHandler(Validation.isNotTooStrongForDecaf);

// to get validation to work in Safari
webshim.polyfill('forms forms-ext');
webshim.setOptions('forms', { addValidators: true, lazyCustomMessages: true});

})(window);
