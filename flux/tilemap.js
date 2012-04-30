define(function(require) {
    function Tilemap(grid, x, y) {
        this.grid = grid;
        this.graphic = null;

        this.x = x || 0;
        this.y = y || 0;
        this.heightTiles = grid.length;
        this.widthTiles = grid[0].length;

        // Format: Type => Array of tile numbers
        this.solid = {};
    }

    Tilemap.prototype = {
        render: function(ctx, x, y) {
            var camera = this.engine.camera;
            if (this.graphic === null) return;
            x = x || this.x;
            y = y || this.y;

            // Adjust for camera.
            x -= camera.x;
            y -= camera.y;

            for (var ty = 0; ty < this.grid.length; ty++) {
                for (var tx = 0; tx < this.grid[ty].length; tx++) {
                    this.graphic.renderTile(ctx, this.grid[ty][tx],
                                    x + (tx * this.graphic.tileWidth),
                                    y + (ty * this.graphic.tileHeight));
                }
            }
        },

        collideEntity: function(entity, type, dx, dy) {
            // TODO: Cache this per frame
            var tileWidth = this.graphic.tileWidth;
            var tileHeight = this.graphic.tileHeight;

            // Entity's hitbox relative to this tilemap;
            var entityLeft = entity.x + entity.hitbox.x + dx - this.x;
            var entityTop = entity.y + entity.hitbox.y + dy - this.y;
            var entityRight = entityLeft + entity.hitbox.width;
            var entityBottom = entityTop + entity.hitbox.height;

            // Bounds for tiles that are colliding with the entity.
            var tilesLeft = Math.max(0, Math.floor(entityLeft / tileWidth));
            var tilesTop = Math.max(0, Math.floor(entityTop / tileHeight));
            var tilesRight = Math.min(this.widthTiles - 1,
                                      Math.floor(entityRight / tileWidth));
            var tilesBottom = Math.min(this.heightTiles - 1,
                                       Math.floor(entityBottom / tileHeight));

            for (var ty = tilesTop; ty <= tilesBottom; ty++) {
                for (var tx = tilesLeft; tx <= tilesRight; tx++) {
                    var t = this.grid[ty][tx] + 1;
                    if (this.solid[type].indexOf(t) !== -1) return true;
                }
            }

            return false;
        }
    };

    return Tilemap;
});
