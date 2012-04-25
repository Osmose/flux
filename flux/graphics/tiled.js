define(function(require) {
    function TiledGraphic(image, tileWidth, tileHeight, xGap, yGap) {
        this.image = image;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        this.xGap = xGap || 0;
        this.yGap = yGap || 0;

        this.tileColumns = Math.floor(image.width / (tileWidth + this.xGap));
        this.tileRows = Math.floor(image.height / (tileHeight + this.yGap));

        this.names = {};
    }

    TiledGraphic.prototype = {
        // Add an alias for a specific tile.
        addTilename: function(name, tile) {
            this.names[name] = tile;
        },

        // Render a single tile for this graphic with the given tile number.
        renderTile: function(ctx, tile, x, y) {
            if (typeof tile === 'string') {
                tile = this.names[tile];
            }

            var ty = Math.floor(tile / this.tileColumns);
            var tx = tile % this.tileColumns;
            var sourceX = (tx * this.tileWidth) + (tx * this.xGap);
            var sourceY = (ty * this.tileHeight) + (ty * this.yGap);

            ctx.drawImage(this.image, sourceX, sourceY,
                          this.tileWidth, this.tileHeight,
                          x, y, this.tileWidth, this.tileHeight);
        }
    };

    return TiledGraphic;
});
