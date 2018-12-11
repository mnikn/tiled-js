import * as _ from 'lodash';
import * as d3 from 'd3';

import {
    GridAPI
} from '../core/grid';
import {
    editMode,
    TileService
} from '../tile-service';

export class Map extends HTMLElement {

    constructor() {
        super();
        let self = this;
        this.id = 'map';
        this.style.overflow = 'auto';
        this.grid = GridAPI.createGrid('#map', {
            id: 'map-grid',
            strokeColor: '#5B5B5B',
            strokeDasharray: ('1, 3')
        });
        this.grid.registerRectsEvent('mouseover', function () {
            self.paintTile.call(this);
        });
        this.grid.registerRectsEvent('mousedown', function () {
            self.paintTile.call(this);
        });
    }

    paintTile() {
        if (!TileService.selectedTile) return;
        if (d3.event.buttons !== 1) return;

        if (TileService.editMode === editMode.tile) {
            while (this.childElementCount > 1) {
                this.removeChild(this.lastChild);
            }
            for (let i = 1; i < TileService.selectedTile.children.length; ++i) {
                let node = TileService.selectedTile.children[i].cloneNode(true);
                this.appendChild(node);
            }
        } else if (TileService.editMode === editMode.eraser) {
            while (this.childElementCount > 1) {
                this.removeChild(this.lastChild);
            }
            this.children[0].style.fill = '#BFBFBF';
        }
    }
}

window.customElements.define('app-map', Map);
