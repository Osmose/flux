define(function(require) {
    var $ = require('jquery');

    var Util = require('flux/util');

    /**
     * Encapsulates a single audio file.
     */
    function Sound(audio) {
        this.audio = audio;
    }

    Sound.prototype = Object.create({
        play: function() {
            this.audio.play();
        },

        pause: function() {
            this.audio.pause();
        },

        stop: function() {
            this.audio.pause();
            this.audio.currentTime = 0;
        },

        loop: function() {
            this.audio.loop = true;
            this.audio.play();
        },

        mute: function() {
            this.audio.muted = true;
        },

        unmute: function() {
            this.audio.muted = false;
        },

        /**
         * Fade the volume of this sound to a new value.
         *
         * Duration is the length of the fade, tick is the delay between each
         * volume increase over the duration.
         */
        fade: function(final_volume, duration, tick) {
            var deferred = $.Deferred();

            tick = tick || 50;
            var current_volume = this.audio.volume;
            var dv = (final_volume - current_volume) / (duration / tick);

            var start = Date.now();
            var ramp = function() {
                this.audio.volume = Util.restrict(this.audio.volume + dv, 1, 0);
                var elapsed = Date.now() - start;

                if (elapsed > duration) {
                    this.audio.volume = final_volume;
                    deferred.resolveWith(this);
                } else {
                    setTimeout(ramp, tick);
                }
            };
            ramp.bind(this);

            return deferred;
        }
    });

    return Sound;
});
