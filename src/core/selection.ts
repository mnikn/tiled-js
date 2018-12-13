import { Cell } from './grid';
import {
    Messager
} from "./messager";
import * as _ from 'lodash';

export class Selection {
    private _selectedTile: any;
    private _onSelectionChange = new Messager();

    get type(): string {
        return '';
    }

    registerSelectionChange(callback): void {
        this._onSelectionChange.register(callback);
    }

    fireSelectionChange(args): void {
        this._onSelectionChange.fire(args);
    }

    get selectedTile() {
        return this._selectedTile;
    }

    set selectedTile(value) {
        this._selectedTile = value;
    }
}

export class SimpleSelection extends Selection {
    private _selectedRect: any;
    constructor() {
        super();
    }

    get selectedRect() {
        return this._selectedRect;
    }

    set selectedRect(value) {
        this._selectedRect = value;
        super.fireSelectionChange(value);
    }

    get type(): string {
        return 'simple';
    }

    static get type(): string {
        return 'simple';
    }
}

export class RectangleSelection extends Selection {
    private _startRect: any;
    private _endRect: any;

    static get type(): string {
        return 'rectangle';
    }

    get type(): string {
        return 'rectangle';
    }

    get startRect() {
        return this._startRect;
    }

    set startRect(value) {
        this._startRect = value;
    }

    get endRect() {
        return this._endRect;
    }

    set endRect(value) {
        this._endRect = value;
        super.fireSelectionChange(value);
    }

    select(leftRow: number, rightRow: number, leftColumn: number, rightColumn: number, gridId: string): Cell[] {
        let rects = [];
        _.range(leftRow, rightRow + 1).forEach(row => {
            _.range(leftColumn, rightColumn + 1).forEach(column => {
                let rect = document.querySelector(`#${gridId}-${row}-${column}`);
                rects.push(rect);
            });
        });
        return rects;
    }
}
