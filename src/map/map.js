import * as _ from 'lodash';
import * as d3 from 'd3';

import {
    GridAPI
} from '../core/grid';
import {
    TileService
} from '../tile-service';

export class Map extends HTMLElement {

    constructor() {
        super();
        this.id = 'map';
        this.style.overflow = 'auto';
        this.grid = GridAPI.createGrid('#map', {
            strokeColor: '#5B5B5B',
            strokeDasharray: ('1, 3')
        });
        this.grid.registerRectsEvent('click', function () {
            if (!TileService.selectedTile) return;
            this.style.fill = TileService.selectedTile.style.fill;
        });
    }
}

window.customElements.define('app-map', Map);
