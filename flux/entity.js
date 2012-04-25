define(function(require) {
    function Entity(x, y) {
        this.x = x || 0;
        this.y = y || 0;
        this.graphic = null;
    }

    Entity.prototype = {
        tick: function() {

        },

        render: function(ctx) {
            if (this.graphic !== null) {
                this.graphic.render(ctx, this.x, this.y);
            }
        }
    };

    return Entity;
});
