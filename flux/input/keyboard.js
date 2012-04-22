define(function(require) {
    function Keyboard() {
        var self = this;
        this._keys = {};
        this._pressed = {};
        this._released = {};
        this._controls = {};

        function setKey(code, status) {
            if (code) {
                if (!self._keys[code]) {
                    self._pressed[code] = status;
                } else if (!status) {
                    self._released[code] = true;
                }

                self._keys[code] = status;
            }
        }

        window.addEventListener('keydown', function(e) {
            setKey(e.keyCode, true);
        });

        window.addEventListener('keyup', function(e) {
            setKey(e.keyCode, false);
        });
    };

    Keyboard.prototype = {
        letter: function(l) {
            return self.keys[l.toUpperCase().charCodeAt(0)];
        },

        // Define a new control, which maps a name to keycodes.
        define: function(name) {
            if (arguments.length > 1) {
                if (!(name in this._controls)) {
                    this._controls[name] = [];
                }

                this._controls.concat(arguments.slice(1));
            }
        },

        check: function(code) {
            return this._test(code, function(code) {
                return self._keys[code];
            });
        },

        pressed: function(code) {
            return this._test(code, function(code) {
                return self._pressed[code];
            });
        },

        released: function(code) {
            return this._test(code, function(code) {
                return self._released[code];
            });
        },

        _test: function(code, test) {
            if (typeof code === 'string') {
                return this._controls[code].some(test);
            } else {
                return test.call(this, code);
            }
        },

        tick: function() {
            self._pressed = {};
        }
    };

    Keyboard.LEFT = 37;
    Keyboard.UP = 38;
    Keyboard.RIGHT = 39;
    Keyboard.DOWN = 40;
    Keyboard.SPACE = 32;

    // Letters and numbers.
    for (var k = 48; k < 91; k++) {
        Keyboard[String.fromCharCode(k).toUpperCase()] = k;
    }

    return Keyboard;
});
