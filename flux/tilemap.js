define(function(require) {
    function Tilemap(x, y, grid) {
        this.x = x;
        this.y = y;
        this.grid = grid;
        this.graphic = null;

        // Format: Type => Array of tile numbers
        this.solid = {};
    }

    Tilemap.prototype = {
        render: function(ctx, x, y) {
            if (this.graphic === null) return;

            for (var ty = 0; ty < this.grid.length; ty++) {
                for (var tx = 0; tx < this.grid[ty].length; tx++) {
                    this.graphic.renderTile(ctx, this.grid[ty][tx],
                                    x + (tx * this.graphic.tileWidth),
                                    y + (ty * this.graphic.tileHeight));
                }
            }
        }
    };

    return Tilemap;
});
