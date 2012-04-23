define(function(require) {
    function Entity(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }

    Entity.prototype = {
        tick: function() {

        },

        render: function(ctx) {

        }
    };

    return Entity;
});
