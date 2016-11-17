(function(window) {
    'use strict';
    var App = window.App || {};

    function StrengthHandler() {
      this.initialStrength = 30;
    } // end strengthHandler

    StrengthHandler.prototype.updateSliderDetails = function(value) {
        // update strengthOutput when slider changes and add color
        var slider = document.getElementById("strengthLevel");
        var sliderOutput = document.getElementById("strengthOutput");
        var sliderLabel = document.getElementById('strengthLabel');

        // update slider value
        slider.value = value;

        // both value and textContent seem to work
        // can't find any discussion online about which to use
        // sliderOutput.textContent = slider.value;
        sliderOutput.value = slider.value
        // change the color of the label and number based on intensity
        var intensityColor;
        if (value < 34) {
            intensityColor = "green";
        } else if (value < 68) {
            intensityColor = 'gold';
        } else {
            intensityColor = "red";
        }
        sliderOutput.style.color = intensityColor;
        sliderLabel.style.color = intensityColor;
    }; // end updateSliderDetails

    App.StrengthHandler = StrengthHandler;
    window.App = App;
})(window);
