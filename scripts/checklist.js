(function(window) {
    'use strict';

    var App = window.App || {};
    var $ = window.jQuery;

    function CheckList(selector, strengthHandler) {
        this.strengthHandler = strengthHandler;
        this.editingEmail = null;
        if (!selector) {
            throw new Error('No selector provided');
        } // end if

        this.$element = $(selector);
        if (this.$element.length === 0) {
            throw new Error('Could not find element with selector ' + selector);
        } // end if

        // create a row of its rows
        this.rows = {};
    } // end CheckList(selector, strengthHandler)

// look into disabling highlighting of text when clicking
    CheckList.prototype.addClickHandler = function(fn, getData) {
            var DELAY = 500,
                clicks = 0,
                timer = null;

            this.$element.on('click', 'input', function(event) {
                // on first click, set timer for action to be performed for 1 click
                // if DELAY passes by, execute and reset clicks to 0
                // if second click occurs before DELAY, then cancel timer
                // and perform double click action, reset clicks to 0
                clicks++;

                var email = event.target.value;

                if (clicks === 1) {
                    timer = setTimeout(function() {
                        var targetDiv = event.target.closest('[data-coffee-order="checkbox"]');
                        targetDiv.style.opacity = .4;
                        // if user single clicks, we will exit editing order
                        this.editingEmail = null;

                        setTimeout(function() {
                            this.removeRow(email);
                            fn(email);
                          }.bind(this), 2200);
                        clicks = 0;
                    }.bind(this), DELAY);
                } // end if
                else { // we have a double-click
                    clearTimeout(timer);
                    clicks = 0;
                    // populate form with data from double clicked row
                    // first get db info
                    var rowInfo = getData(email);
                    $('#coffeeOrder').val(rowInfo.coffee);
                    $('#emailInput').val(rowInfo.emailAddress);
                    $('input:radio').val([rowInfo.size]);
                    $('#flavorShot').val(rowInfo.flavor);
                    this.strengthHandler.updateSliderDetails(rowInfo.strength);
                    // update editingEmail
                    this.editingEmail = rowInfo.emailAddress;
                    console.log('editingEmail set to :' + this.editingEmail);
                } // end else

            }.bind(this)).on('dblclick', 'input', function(event) {
                event.preventDefault(); // in case system double-click event
            });

        }; // end addClickHandler

    CheckList.prototype.addRow = function(coffeeOrder) {
            // Remove any existing rows that match the email address
            this.removeRow(coffeeOrder.emailAddress);

            // Create a new instance of a row using the coffee order info
            var rowElement = new Row(coffeeOrder);

            // update rows property of CheckList
            this.rows[coffeeOrder.emailAddress] = rowElement;

            // Add the new row instance's $lement property to the CheckList
            this.$element.append(rowElement.$element);
        } // end addRow(coffeeOrder)

    CheckList.prototype.removeRow = function(email) {
            this.$element
                .find('[value="' + email + '"]')
                .closest('[data-coffee-order="checkbox"]')
                .remove();
        }; // end removeRow(email)

    function Row(coffeeOrder) {
        var $div = $('<div></div>', {
            'data-coffee-order': 'checkbox',
            'class': 'checkbox'
        });

        var $label = $('<label></label>');

        var $checkbox = $('<input></input>', {
            type: 'checkbox',
            value: coffeeOrder.emailAddress
        });

        $label.append($checkbox);
        $label.append(Row.makeDescription(coffeeOrder));
        $div.append($label);

        // color code row based on flavor
        var rowColor;
        var rowTextColor;
        switch (coffeeOrder.flavor) {
            case 'caramel':
                rowColor = '#CC9966';
                rowTextColor = 'yellow';
                break;
            case 'almond':
                rowColor = '#8B4513';
                rowTextColor = 'yellow';
                break;
            case 'mocha':
                rowColor = '#654634';
                rowTextColor = 'yellow';
                break;
            case '':
                // keep defualt colors
                break;
            default:
                // dropdown list only has the above cases
                console.log('invalid falvor');
        }
        $div.css({
            background: rowColor,
            color: rowTextColor
        });

        this.$element = $div;
        // use this.label.text() to edit description of row
        this.label = $label;
    } // end Row(coffeeOrder)

    Row.prototype.changeDescriptionTo = function(coffeeOrder) {
// first part is redundant -- don't know how to avoid yet
      var $checkbox = $('<input></input>', {
          type: 'checkbox',
          value: coffeeOrder.emailAddress
      });
      var description = Row.makeDescription(coffeeOrder);
// perhaps better way to reset -- but see first issue
      this.label.text('');
      this.label.append($checkbox);
      this.label.append(description);
    }; // end changeDescriptionTo(coffeeOrder)

    Row.makeDescription = function(coffeeOrder) {
      var description = '[' + coffeeOrder.strength + 'x] ';
      description += coffeeOrder.size + ' ';
      if (coffeeOrder.flavor) {
          description += coffeeOrder.flavor + ' ';
      } // end if

      description += coffeeOrder.coffee + ', ';
      description += '(' + coffeeOrder.emailAddress + ') ';

      return description;
    }; // end makeDescription


    App.CheckList = CheckList;
    window.App = App;
})(window);
