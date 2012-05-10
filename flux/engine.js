define(function(require) {
    var Keyboard = require('./input/keyboard');
    var DefaultWorld = require('./worlds/default');

    var requestFrame = (function() {
        return window.mozRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            function(callback) {
                setTimeout(callback, 30);
            };
    })();

    // Handles the game loop, timing, and dispatching processing and rendering
    // to the active entities.
    function Engine(width, height, scale, world) {
        var self = this;

        // Graphics
        this.width = width;
        this.height = height;
        this.scale = scale;
        this.bg_color = '#FFF';

        // Input
        this.kb = new Keyboard();

        // Engine State
        this.running = false;
        this.worlds = [];
        if (world === undefined) {
            world = new DefaultWorld();
        }
        this.pushWorld(world);

        // Bind the engine to the loop function used as a callback
        // in request frame.
        this.bound_loop = this.loop.bind(this);

        // Initialize canvas.
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = this.width * this.scale;
        this.canvas.height = this.height * this.scale;
        this.ctx.scale(this.scale, this.scale);
        this.ctx.mozImageSmoothingEnabled = false;

        // Initialize camera.
        this.camera = {
            x: 0,
            y: 0,
            width: width,
            height: height
        };

        // Bind focus and blur handlers to pause when not in focus.
        // TODO: Proper pausing.
        window.addEventListener('focus', function() {
            self.start();
        }, false);
        window.addEventListener('blur', function() {
            self.stop();
        }, false);
    }

    Engine.prototype = {
        // Process and render a single frame, and schedule another loop
        // for the next frame.
        loop: function() {
            var self = this;
            this.tick();
            this.render();

            if (this.running) {
                requestFrame(this.bound_loop, this.canvas);
            }
        },

        // Process one frame of behavior.
        tick: function() {
            for (var k = 0; k < this.worlds.length; k++) {
                this.worlds[k].tick();
                if (this.worlds[k].block_tick) break;
            }
            this.kb.tick();
        },

        // Render the screen.
        render: function() {
            this.ctx.save();
            this.ctx.fillStyle = this.bg_color;
            this.ctx.fillRect(0, 0, this.width, this.height);
            this.ctx.restore();

            for (var k = 0; k < this.worlds.length; k++) {
                this.worlds[k].render(this.ctx);
                if (this.worlds[k].block_render) break;
            }
        },

        pushWorld: function(world, block_tick, block_render) {
            this.worlds.push(world);
            world.engine = this;
            if (block_tick !== undefined) world.block_tick = block_tick;
            if (block_render !== undefined) world.block_render = block_render;
        },

        popWorld: function() {
            var world = this.worlds.pop();
            world.engine = null;
            return world;
        },

        get world() {
            return this.worlds[this.worlds.length - 1];
        },

        addEntity: function(entity) {
            this.world.addEntity(entity);
        },

        removeEntity: function(entity) {
            this.world.removeEntity(entity);
        },

        // Start the game loop.
        start: function() {
            if (!this.running) {
                this.running = true;

                if (this.world !== undefined &&
                    this.world.start !== undefined) {
                    this.world.start();
                }
                this.loop();
            }
        },

        // Stop the game.
        stop: function() {
            this.running = false;
            if (this.world !== undefined && this.world.stop !== undefined) {
                this.world.stop();
            }
        }
    };

    return Engine;
});
