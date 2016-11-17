(function(window) {
    'use strict';
    var App = window.App || {};
    var $ = window.jQuery;

    function FormHandler(selector, strengthHandler) {

        this.strengthHandler = strengthHandler;

        if (!selector) {
            throw new Error('No selector provided');
        } // end if

        this.$formElement = $(selector);
        if (this.$formElement.length === 0) {
            throw new Error('Could not find element with selector: ' + selector);
        } // end if

        // // set initial color
        strengthHandler.updateSliderDetails(strengthHandler.initialStrength);

        var slider = document.getElementById("strengthLevel");
        slider.addEventListener("input", function(event) { // using change only shows
            // number after letting go of slider
            strengthHandler.updateSliderDetails(event.target.value);
        });

    } // end FormHandler(selector)

    FormHandler.prototype.addSubmitHandler = function(fn) {
            console.log('Setting submit handler for form');
            // the this inside on method is the form, not formHandler
            var strengthHandler = this.strengthHandler;
            this.$formElement.on('submit', function(event) {
                event.preventDefault();

                // create data object holding form information
                // var data = $(this).serializeArray();
                var data = {};
                $(this).serializeArray().forEach(function(item) {
                    data[item.name] = item.value;
                    console.log(item.name + ' is ' + item.value);
                });
                console.log(data);

                // call callback
                fn(data);

                // reset form presentation
                this.reset();
                strengthHandler.updateSliderDetails(strengthHandler.initialStrength);
                this.elements[0].focus();
            });
        }; // end addSubmitHandler()

        FormHandler.prototype.addEmailInputHandler = function(fn) {
          console.log('Setting email input handler for form');
          this.$formElement.on('input', '[name="emailAddress"]', function(event){
            var emailAddress = event.target.value;
            var message = '';
            if (fn(emailAddress)) {
              $(event.target).setCustomValidity(message);
            } else {
              message = emailAddress + ' is not an authorized email address!';
              $(event.target).setCustomValidity(message);
            }
          });
        }; // end addEmailInputHandler(fn)

        FormHandler.prototype.addDecafInputHandler = function(fn) {
          console.log('Setting coffee input handler for form');
          this.$formElement.on('input', '[name="coffee"], [name="strength"]' , function(event) {
            var coffeeSelector = document.querySelector('[data-coffee-order="coffeeOrder"]');
            var strengthSelector = document.querySelector('[data-coffee-order="strength"]');
            var coffee = coffeeSelector.value;
            var strength = strengthSelector.value;
            strength = parseInt(strength, 10);

            // to use webshim library with setCustomValidity, we
            // have to wrap objects with jQuery first

            var message = '';
            if (fn(coffee, strength)) {
              // set both selectors to be valid (not just event.target)
              $(coffeeSelector).setCustomValidity('');
              $(strengthSelector).setCustomValidity('');
            } else {
                message = coffee + ' cannot have caffeine rating of ' + strength;
                // to make sure message appears for input most recently changed
                // and has updated values for strength/coffeeOrder in messsage
                if (event.target === strengthSelector) {
                  $(coffeeSelector).setCustomValidity('');
                  $(strengthSelector).setCustomValidity(message);
                }
                else if (event.target === coffeeSelector) {
                  $(coffeeSelector).setCustomValidity(message);
                  $(strengthSelector).setCustomValidity('');
                }
            }
          });
        }; // end addCoffeeInputHandler(fn)

    App.FormHandler = FormHandler;
    window.App = App;

})(window);
