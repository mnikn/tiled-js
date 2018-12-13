import { Selection } from './../core/selection';
import { Grid } from './../core/grid';
import * as _ from 'lodash';
import * as d3 from 'd3';

import {
    GridAPI
} from '../core/grid';
import {
    RectangleSelection,
    SimpleSelection
} from '../core/selection';
import {
    TileService, EditMode
} from '../tile-service';
import { twinkle } from '../core/animation';

export class Map extends HTMLElement {
    private _twinkleAnimation: any;
    private grid: Grid;

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
        this.grid.registerGridEvent('mouseover', function (cellData) {
            self.paintTile(cellData, this);
        });
        this.grid.registerGridEvent('mousedown', function (cellData) {
            self.paintTile(cellData, this);
        });
    }

    paintTile(cellData, cellElement) {
        if (!TileService.editMode) return;
        if (d3.event.buttons !== 1) return;

        let selectedTile = TileService.selection.selectedTile;

        if (d3.event.shiftKey) {
            if (TileService.selection.type === 'simple') {
                let selection = new RectangleSelection();
                selection.selectedTile = selectedTile;
                selection.startRect = cellData;
                TileService.selection = selection;
                return;
            } else if (TileService.selection instanceof RectangleSelection && !TileService.selection.startRect) {
                TileService.selection.startRect = cellData;
                this._twinkleAnimation = twinkle(cellElement);
                return;
            }
        } else {
            if (!(TileService.selection instanceof SimpleSelection)) {
                TileService.selection = new SimpleSelection();
                TileService.selection.selectedTile = selectedTile;
            }
            (<SimpleSelection>TileService.selection).selectedRect = cellData;
        }

        if (this._twinkleAnimation) {
            this._twinkleAnimation.cancel();
        }
        if (d3.event.shiftKey && TileService.selection instanceof RectangleSelection && TileService.selection.startRect) {
            let endRect = cellData;
            let startRect = TileService.selection.startRect;
            let rects = TileService.selection.select(
                Math.min(startRect.row, endRect.row),
                Math.max(startRect.row, endRect.row),
                Math.min(startRect.column, endRect.column),
                Math.max(startRect.column, endRect.column),
                'mapgrid');
            switch (TileService.editMode) {
                case EditMode.fill:
                    if (!selectedTile) break;
                    rects.forEach(e => this.fillTile(e, selectedTile));
                    break;
                case EditMode.eraser:
                    rects.forEach(e => this.eraseTile(e));
                    break;
            }
            TileService.selection.startRect = null;
        } else {
            switch (TileService.editMode) {
                case EditMode.fill:
                    if (!selectedTile) break;
                    this.fillTile(cellElement, selectedTile);
                    break;
                case EditMode.eraser:
                    this.eraseTile(cellElement);
                    break;
            }
        }
    }

    fillTile(rectElement, selectedTile) {
        this.eraseTile(rectElement);
        for (let i = 1; i < selectedTile.children.length; ++i) {
            let node = selectedTile.children[i].cloneNode(true);
            rectElement.appendChild(node);
        }
    }

    eraseTile(rectElement) {
        while (rectElement.childElementCount > 1) {
            rectElement.removeChild(rectElement.lastChild);
        }
    }
}

window.customElements.define('app-map', Map);
