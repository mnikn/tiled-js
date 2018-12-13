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
    editMode,
    TileService,
    FillMode,
    EraserMode
} from '../tile-service';
import { twinkle } from '../core/animation';

export class Map extends HTMLElement {

    constructor() {
        super();
        let self = this;
        this.id = 'map';
        this._twinkleAnimation = null;
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
                this._twinkleAnimation = twinkle(rectElement);
                return;
            }
        } else {
            if (TileService.selection.type !== 'simple') {
                TileService.selection = new SimpleSelection();
                TileService.selection.selectedTitle = selectedTile;
            }
            TileService.selection.selectedRect = rectData;
        }

        if (this._twinkleAnimation) {
            this._twinkleAnimation.cancel();
        }
        if (d3.event.shiftKey && TileService.selection.type === RectangleSelection.type && TileService.selection.startRect) {
            let endRect = rectData;
            let startRect = TileService.selection.startRect;
            let rects = TileService.selection.select(
                Math.min(startRect.row, endRect.row),
                Math.max(startRect.row, endRect.row),
                Math.min(startRect.column, endRect.column),
                Math.max(startRect.column, endRect.column),
                'mapgrid');
            switch (TileService.editMode.type) {
                case FillMode.type:
                    if (!selectedTile) break;
                    rects.forEach(e => this.fillTile(e, selectedTile));
                    break;
                case EraserMode.type:
                    rects.forEach(e => this.eraseTile(e));
                    break;
            }
            TileService.selection.startRect = null;
        } else {
            switch (TileService.editMode.type) {
                case FillMode.type:
                    if (!selectedTile) break;
                    this.fillTile(rectElement, selectedTile);
                    break;
                case EraserMode.type:
                    this.eraseTile(rectElement);
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
