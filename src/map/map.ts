import { Cell } from './../core/grid/grid';
import * as _ from 'lodash';
import * as d3 from 'd3';

import { GridAPI } from '../core/grid/api';
import { Grid } from '../core/grid/grid';
import { TileService, EditMode } from '../tile-service';
import { SelectionModes } from './../core/selection';
import './map.css';
import { twinkle } from '../core/animation';

export class Map extends HTMLElement {
    private _twinkleAnimation: any;
    private grid: Grid;
    private _selectionDropdown: HTMLSelectElement;

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


        let paintTile = (e, cell) => this.paintTile(cell, e.buttons === 1);
        this.grid
            .registerGridEvent('mousedown', paintTile)
            .registerGridEvent('mousemove', paintTile);
        TileService.cells = this.grid.cells;

        this.createSelectionDropdown();
    }

    private createSelectionDropdown(): void {
        let selectionDropdown = document.createElement('select');
        selectionDropdown.id = 'tiled-selection-mode-dropdown';
        selectionDropdown.className = 'ui dropdown';

        let singleOption = document.createElement('option');
        singleOption.value = SelectionModes.single.toString();
        singleOption.innerText = 'Single';
        selectionDropdown.appendChild(singleOption);

        let rectangleOption = document.createElement('option');
        rectangleOption.value = SelectionModes.rectangle.toString();
        rectangleOption.innerText = 'Rectangle';
        selectionDropdown.appendChild(rectangleOption);

        this._selectionDropdown = selectionDropdown;
        this._selectionDropdown.addEventListener('change', (e: any) => {
            TileService.selection.swtichSelectionMode(Number.parseInt(e.target.value));
        });
        this.appendChild(this._selectionDropdown);
    }

    private paintTile(cell: Cell, isMouseClicked: boolean): void {
        if (!TileService.editMode) return;
        if (!isMouseClicked) return;

        let cells = TileService.selection.select(cell);
        let cellElements = cells.map(e => e.element);
        cellElements.forEach(e => {
            switch (TileService.editMode) {
                case EditMode.eraser:
                    this.eraseTile(e);
                    break;
                case EditMode.shapeFill:
                case EditMode.stampBrush:
                    this.fillTile(e, TileService.selection.selectedTile);
                    break;
            }
        });
    }

    private fillTile(cellElement: HTMLElement, selectedTile: HTMLElement): void {
        this.eraseTile(cellElement);
        for (let i = 1; i < selectedTile.children.length; ++i) {
            let node = selectedTile.children[i].cloneNode(true);
            cellElement.appendChild(node);
        }
    }

    private eraseTile(cellElement: HTMLElement): void {
        while (cellElement.childElementCount > 1) {
            cellElement.removeChild(cellElement.lastChild);
        }
    }
}

window.customElements.define('app-map', Map);
