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
            id: 'map-grid',
            strokeColor: '#5B5B5B',
            strokeDasharray: ('1, 3')
        });
        this.grid.registerRectsEvent('click', function () {
            if (!TileService.selectedTile) return;

            while (this.hasChildNodes()) {
                this.removeChild(this.lastChild);
            }
            for(let i = 0;i < TileService.selectedTile.children.length; ++i) {
                let node = TileService.selectedTile.children[i].cloneNode(true); 
                this.appendChild(node);
            }
        });
    }
}

window.customElements.define('app-map', Map);
