import { Cell } from './grid/grid';
import { Messager } from "./messager";
import * as _ from 'lodash';

export enum SelectionModes {
    single,
    rectangle
}

export interface MapSelectionMode {
    select(cell: Cell): Cell[];
    reset(cells: Cell[]): void;
}

export class MapSingleSelectionMode implements MapSelectionMode {
    private _selectedCell: Cell;

    select(cell: Cell): Cell[] {
        if (!cell) return [this._selectedCell];

        this._selectedCell = cell;
        return [cell];
    }

    reset(): void {
        this._selectedCell = null;
    }
}

export class MapRectangleSelectionMode implements MapSelectionMode {
    private _cells: Cell[] = [];
    private _startCell: Cell;
    private _endCell: Cell;

    constructor(cells: Cell[]) {
        this._cells = cells;
    }

    select(cell: Cell): Cell[] {
        if (!cell) return this.selectRectangleRange(this._startCell, this._endCell);

        if (!this._startCell) {
            this._startCell = cell;
        } else {
            this._endCell = cell;
        }

        return this.selectRectangleRange(this._startCell, this._endCell);
    }

    reset(cells: Cell[] = []): void {
        this._startCell = null;
        this._endCell = null;
        this._cells = cells;
    }

    public selectRectangleRange(startCell: Cell, endCell: Cell): Cell[] {
        if (!startCell || !endCell) return [];

        let leftRow = Math.min(startCell.row, endCell.row), rightRow = Math.max(startCell.row, endCell.row);
        let leftColumn = Math.min(startCell.column, endCell.column), rightColumn = Math.max(startCell.column, endCell.column);
        let cells = [];
        _.range(leftRow, rightRow + 1).forEach(row => {
            _.range(leftColumn, rightColumn + 1).forEach(column => {
                let cell = this._cells.find(e => e.row === row && e.column === column);
                if (cell) {
                    cells.push(cell);
                }
            });
        });
        return cells;
    }
}

export class Selection {
    private _cells: Cell[] = [];
    private _selectedTile: any;
    private _onSelectionChange = new Messager();

    private _mapSelectionMode: MapSelectionMode = null;
    private _mapSingleSelectionMode: MapSingleSelectionMode;
    private _mapRectangleSelectionMode: MapRectangleSelectionMode;

    constructor(cells: Cell[] = []) {
        this._mapSingleSelectionMode = new MapSingleSelectionMode();
        this._mapRectangleSelectionMode = new MapRectangleSelectionMode(cells);
        this._mapSelectionMode = this._mapSingleSelectionMode;
    }

    public select(cell: Cell): Cell[] {
        return this._mapSelectionMode.select(cell);
    }

    public reset(cells: Cell[] = []) {
        this._mapSelectionMode.reset(cells);
        this._cells = cells;
    }

    public swtichSelectionMode(mode: SelectionModes) {
        switch(mode) {
            case SelectionModes.single:
                this._mapSelectionMode = this._mapSingleSelectionMode;
                break;
            case SelectionModes.rectangle:
                this._mapSelectionMode = this._mapRectangleSelectionMode;
                break;
        }
        this._mapSelectionMode.reset(this._cells);
    }

    get selectedTile() {
        return this._selectedTile;
    }

    set selectedTile(value) {
        this._selectedTile = value;
    }

    registerSelectionChange(callback): void {
        this._onSelectionChange.register(callback);
    }

    fireSelectionChange(args): void {
        this._onSelectionChange.fire(args);
    }
}

// export class SimpleSelection extends Selection {
//     private _selectedRect: any;
//     constructor() {
//         super();
//     }

//     get selectedRect() {
//         return this._selectedRect;
//     }

//     set selectedRect(value) {
//         this._selectedRect = value;
//         super.fireSelectionChange(value);
//     }

//     get type(): string {
//         return 'simple';
//     }

//     static get type(): string {
//         return 'simple';
//     }
// }

// export class RectangleSelection extends Selection {
//     private _startRect: any;
//     private _endRect: any;

//     static get type(): string {
//         return 'rectangle';
//     }

//     get type(): string {
//         return 'rectangle';
//     }

//     get startRect() {
//         return this._startRect;
//     }

//     set startRect(value) {
//         this._startRect = value;
//     }

//     get endRect() {
//         return this._endRect;
//     }

//     set endRect(value) {
//         this._endRect = value;
//         super.fireSelectionChange(value);
//     }

//     select(leftRow: number, rightRow: number, leftColumn: number, rightColumn: number, gridId: string): Cell[] {
//         let rects = [];
//         _.range(leftRow, rightRow + 1).forEach(row => {
//             _.range(leftColumn, rightColumn + 1).forEach(column => {
//                 let rect = document.querySelector(`#${gridId}-${row}-${column}`);
//                 rects.push(rect);
//             });
//         });
//         return rects;
//     }
// }
