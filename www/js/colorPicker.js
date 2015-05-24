
(function (document) {
    var cpk = document.CPK || {};
    document.CPK = cpk;

    cpk.toHex = function (r, g, b) {
        return '#' + ('0' + r.toString(16)).slice(-2) + ('0' + g.toString(16)).slice(-2) + ('0' + b.toString(16)).slice(-2);
    }

    cpk.getRandomColor = function (webSafe) {
        return {
            red: Math.floor(Math.random() * 256),
            green: Math.floor(Math.random() * 256),
            blue: Math.floor(Math.random() * 256)
        }
    }

    cpk.querySliders = function () {
        return {
            red: document.querySelector('#rgbSliderRed'),
            green: document.querySelector('#rgbSliderGreen'),
            blue: document.querySelector('#rgbSliderBlue')
        };
    }

    cpk.queryColor = function () {
        var sliders = this.querySliders();
        return {
            red: parseInt(sliders.red.value),
            green: parseInt(sliders.green.value),
            blue: parseInt(sliders.blue.value)
        };
    }

    cpk.setBackground = function (color) {
        var hexElem = document.querySelector('#controlHex');
        var body = document.querySelector('body');

        var hexValue = this.toHex(color.red, color.green, color.blue);
        hexElem.innerText = hexValue;
        body.style.backgroundColor = hexValue;
    }

    cpk.changeColor = function (color) {
        var sliders = this.querySliders();

        sliders.red.value = color.red;
        sliders.green.value = color.green;
        sliders.blue.value = color.blue;
        this.setBackground(color);
    }
    
    cpk.needWebSafe = function () {
        return document.querySelector('#checkWebSafe').checked;
    }

    cpk.convertToWebSafe = function (color) {
        var webSafeStep = 51;
        return {
            red: webSafeStep * Math.floor(color.red / webSafeStep),
            green: webSafeStep * Math.floor(color.green / webSafeStep),
            blue: webSafeStep * Math.floor(color.blue / webSafeStep)
        }
    }

    cpk.init = function () {
        var self = this;

        var randomHandler = function () {
            var sliders = self.querySliders();
            var color = self.getRandomColor(self.needWebSafe());
            if (self.needWebSafe()) {
                color = self.convertToWebSafe(color);
            }

            self.changeColor(color);
        }

        var sliderHandler = function () {
            self.setBackground(self.queryColor());
        }

        var webSafeHandler = function () {
            var sliders = self.querySliders();
            var newInputStep = self.needWebSafe() ? '51' : '1';

            sliders.red.setAttribute('step', newInputStep);
            sliders.green.setAttribute('step', newInputStep);
            sliders.blue.setAttribute('step', newInputStep);

            if (self.needWebSafe()) {
                var color = self.convertToWebSafe(self.queryColor());

                sliders.red.value = color.red;
                sliders.green.value = color.green;
                sliders.blue.value = color.blue;
                self.changeColor(color);
            }
        }

        var sliders = self.querySliders();
        sliders.red.addEventListener('input', sliderHandler, false);
        sliders.green.addEventListener('input', sliderHandler, false);
        sliders.blue.addEventListener('input', sliderHandler, false);

        document.querySelector('#controlRandom').addEventListener('click', randomHandler, false);
        document.querySelector('#controlWebSafe').addEventListener('click', webSafeHandler, false);

        self.changeColor({ red: 128, green: 128, blue: 128 });
    }
}) (document);