define(function(require) {
    var Keyboard = require('./input/keyboard.js');
    var DefaultWorld = require('./worlds/default.js');

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
    function Engine(width, height, scale) {
        this.width = width;
        this.height = height;
        this.scale = scale;

        this.kb = new Keyboard();

        // Engine State
        this.running = false;
        this.worlds = [];
        this.pushWorld(new DefaultWorld());

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

        // Entity management.
        this.entities = [];
        this.removes = [];
    }

    Engine.prototype = {
        // Process and render a single frame, and schedule another loop
        // for the next frame.
        loop: function() {
            var self = this;
            this.tick();
            this.render();

            // Remove entities that have been marked for removal.
            this.entities = this.entities.filter(function(entity) {
                if (entity.id in self.removes) {
                    delete entity.engine;
                    return false;
                } else {
                    return true;
                }
            });
            this.removes = {};

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
            for (var k = 0; k < this.worlds.length; k++) {
                this.worlds[k].render(this.ctx);
                if (this.worlds[k].block_render) break;
            }
            this.world.render(this.ctx);
        },

        pushWorld: function(world, block_tick, block_render) {
            this.worlds.push(world);
            if (block_tick !== undefined) world.block_tick = block_tick;
            if (block_render !== undefined) world.block_render = block_render;
        },

        popWorld: function(world) {
            return this.worlds.pop();
        },

        addEntity: function(entity) {
            entity.engine = this;
            this.entities.push(entity);
        },

        removeEntity: function(entity) {
            this.removes.push(entity.id);
        },

        // Start the game loop.
        start: function() {
            this.running = true;
            this.loop();
        },

        // Stop the game.
        stop: function() {
            this.running = false;
        }
    };

    return Engine;
});
