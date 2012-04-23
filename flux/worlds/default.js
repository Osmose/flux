define(function(require) {
    function DefaultWorld() {
        this.engine = null;
        this.block_tick = false; // Controls if worlds below this tick.
        this.block_render = false; // Controls if worlds below this render.
    }

    DefaultWorld.prototype = {
        tick: function() {
            var e = this.engine;
            e.entities.forEach(function(entity) {
                entity.tick();
            });
        },

        render: function(ctx) {
            var e = this.engine;
            e.entities.forEach(function(entity) {
                entity.render(ctx);
            });
        }
    };

    return DefaultWorld;
});
