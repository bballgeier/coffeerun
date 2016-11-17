(function (window) {
  'use strict';
  var App = window.App || {};

  var Validation = {
    isCompanyEmail: function (email) {
      return /.+@me\.com$/.test(email);
    },

    isNotTooStrongForDecaf: function (coffee, strength) {
      var containsDecaf = /.*decaf.*/.test(coffee);
      var tooStrong = (strength > 20);
      return !(containsDecaf && tooStrong);
    }

  }; // end Validation

  App.Validation = Validation;
  window.App = App;
})(window);
