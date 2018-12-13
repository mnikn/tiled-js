import * as _ from 'lodash';
import * as d3 from 'd3';

import {
    Messager
} from '../messager';

export interface Cell {
    id: string
    row: number,
    column: number,
    x: number,
    y: number,
    height: number
    width: number,
    events: Messager[]
}

export class Grid {
    private _data: Array<Array<Cell>> = [];
    private _cells: Cell[] = [];
    private _width = 0;
    private _height = 0;
    private _rows = 0;
    private _columns = 0;
    constructor(data: any[] = []) {
        this._data = data;
        this.updateGrid();
    }

    public updateGrid(): void {
        if (this._data.length !== 0) {
            this._width = this._data[0].reduce((result, current) => result + current.width, 0);
            this._height = this._data.reduce((result, current) => result + current[0].height, 0);
            this._rows = this._data.length;
            this._columns = this._data[0].length;
        }
        this._cells = _.flatten(this._data).map(e => {
            if (!e.events) e.events = [];
            return e;
        });
    }

    get data() {
        return this._data;
    }

    get width() {
        return this._width;
    }

    set width(value) {
        this._width = value;
    }

    get height() {
        return this._height;
    }

    set height(value) {
        this._height = value;
    }

    get rows() {
        return this._rows;
    }

    get columns() {
        return this._columns;
    }

    public registerCellEvent(id: string, eventName: string, callback: (...args) => void): void {
        let cell = this._cells.find(e => e.id === id);
        if (!cell) return;
        let event = cell.events[eventName];
        if (!event) {
            event = new Messager();
        }
        event.register(callback);
        cell.events[eventName] = event;
    }

    public registerGridEvent(eventName: string, callback: (...args) => void): void {
        this._cells.forEach(function (cell) {
            let event = cell.events[eventName];
            if (!event) {
                event = new Messager();
            }
            event.register(callback);
            cell.events[eventName] = event;
        });
    }

    public fireCellEvent(id: string, eventName: string, args: any, thisEnv: any = this): void {
        let cell = this._cells.find(e => e.id === id);
        if (!cell) return;
        let event = cell.events[eventName];
        if (!event) return;
        event.fire(args, thisEnv);
    }

    public fireGridEvent(eventName: string, args: any, thisEnv: any = this): void {
        let self = this;
        this._cells.forEach(function (rect) {
            self.fireCellEvent(rect.id, eventName, args, thisEnv);
        });
    }
}