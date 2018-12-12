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
            id: 'mapgrid',
            strokeColor: '#5B5B5B',
            strokeDasharray: ('1, 3')
        });
        this.grid.registerRectsEvent('mouseover', function (rectData) {
            self.paintTile.call(this, rectData);
        });
        this.grid.registerRectsEvent('mousedown', function (rectData) {
            self.paintTile.call(this, rectData);
        });
    }

    paintTile(rectData) {
        if (!TileService.selectedTile && !TileService.editMode) return;
        if (d3.event.buttons !== 1) return;
        
        if (TileService.editMode.type === editMode.tile) {
            while (this.childElementCount > 1) {
                this.removeChild(this.lastChild);
            }
            for (let i = 1; i < TileService.selectedTile.children.length; ++i) {
                let node = TileService.selectedTile.children[i].cloneNode(true);
                this.appendChild(node);
            }
        } else if (TileService.editMode.type === editMode.eraser) {
            while (this.childElementCount > 1) {
                this.removeChild(this.lastChild);
            }
            this.children[0].style.fill = '#BFBFBF';
        } else if (TileService.editMode.type === editMode.fillShape) {
            if (!TileService.editMode.startRect) {
                TileService.editMode.startRect = rectData;
                return;
            }
        
            let endRect = rectData;
            let startRect = TileService.editMode.startRect;
            _.range(Math.min(startRect.row, endRect.row), Math.max(startRect.row, endRect.row) + 1).forEach(row => {
                _.range(Math.min(startRect.column, endRect.column), Math.max(startRect.column, endRect.column) + 1).forEach(column => {
                    let rect = document.querySelector(`#mapgrid-${row}-${column}`);
                    while (rect.childElementCount > 1) {
                        rect.removeChild(rect.lastChild);
                    }
                    for (let i = 1; i < TileService.selectedTile.children.length; ++i) {
                        let node = TileService.selectedTile.children[i].cloneNode(true);
                        rect.appendChild(node);
                    }
                });

            })
            TileService.editMode.startRect = null;
            // let 
        }
    }
}

window.customElements.define('app-map', Map);
