import * as _ from 'lodash';
import * as d3 from 'd3';

import {
    GridAPI
} from '../core/grid';
import {
    RectangleSelection, SimpleSelection
} from '../core/selection';
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
            self.paintTile(rectData, this);
        });
        this.grid.registerRectsEvent('mousedown', function (rectData) {
            self.paintTile(rectData, this);
        });
    }

    paintTile(rectData, rectElement) {
        if (!TileService.editMode) return;
        if (d3.event.buttons !== 1) return;

        let selectedTile = TileService.selection.selectedTile;

        if (d3.event.shiftKey) {
            if (TileService.selection.type === 'simple') {
                TileService.selection = new RectangleSelection();
                TileService.selection.selectedTile = selectedTile;
                TileService.selection.startRect = rectData;
                return;
            } else if (TileService.selection.type === 'rectangle' && !TileService.selection.startRect) {
                TileService.selection.startRect = rectData;
                return;
            }
        } else {
            if (TileService.selection.type !== 'simple') {
                TileService.selection = new SimpleSelection();
                TileService.selection.selectedTitle = selectedTile;
            }
            TileService.selection.selectedRect = rectData;
        }

        if (selectedTile && TileService.editMode.type === editMode.tile) {
            let fillTile = (rectElement) => {
                while (rectElement.childElementCount > 1) {
                    rectElement.removeChild(rectElement.lastChild);
                }
                for (let i = 1; i < selectedTile.children.length; ++i) {
                    let node = selectedTile.children[i].cloneNode(true);
                    rectElement.appendChild(node);
                }
            };
            if (d3.event.shiftKey === true && TileService.selection.startRect) {
                this.onRectangleSelection(rectData, (row, column) => {
                    let rect = document.querySelector(`#mapgrid-${row}-${column}`);
                    fillTile(rect);
                })
                TileService.selection.startRect = null;
            } else {
                fillTile(rectElement);
            }
        } else if (TileService.editMode.type === editMode.eraser) {
            if (d3.event.shiftKey === true && TileService.selection.startRect) {
                this.onRectangleSelection(rectData, (row, column) => {
                    let rect = document.querySelector(`#mapgrid-${row}-${column}`);
                    while (rect.childElementCount > 1) {
                        rect.removeChild(rect.lastChild);
                    }
                })
                TileService.selection.startRect = null;
            } else {
                while (rectElement.childElementCount > 1) {
                    rectElement.removeChild(rectElement.lastChild);
                }
            }
        }
    }

    onRectangleSelection(selectRectData, callback) {
        let endRect = selectRectData;
        let startRect = TileService.selection.startRect;
        _.range(Math.min(startRect.row, endRect.row), Math.max(startRect.row, endRect.row) + 1).forEach(row => {
            _.range(Math.min(startRect.column, endRect.column), Math.max(startRect.column, endRect.column) + 1).forEach(column => {
                callback(row, column);
            });
        })
    }
}

window.customElements.define('app-map', Map);
