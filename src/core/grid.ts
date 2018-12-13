import * as _ from 'lodash';
import * as d3 from 'd3';

import {
    Messager
} from './messager';

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

export interface GridRenderOptions {
    id: string;
    row: number;
    column: number;
    height: number;
    width: number;
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

export class GridAPI {
    private static _grids: Grid[] = [];

    static createGrid(targetElementId: string, options: GridRenderOptions | any = {}, customFn = (...args) => { }): Grid {
        let id = _.get(options, 'id', GridAPI._grids.length + 1);
        if (GridAPI._grids[id]) {
            this.render(id, targetElementId, options, customFn);
            return GridAPI._grids[id];
        }

        let row = _.get(options, 'row', 100);
        let column = _.get(options, 'column', 100);
        let cellHeight = _.get(options, 'height', 32);
        let cellWidth = _.get(options, 'width', 32);

        let data = [];
        let xpos = 1;
        let ypos = 1;
        for (let i = 0; i < row; ++i) {
            data[i] = [];
            for (let j = 0; j < column; ++j) {
                data[i].push({
                    row: i,
                    column: j,
                    x: xpos,
                    y: ypos,
                    height: cellHeight,
                    width: cellWidth,
                    id: xpos + ypos
                });
                xpos += cellWidth;
            }
            xpos = 1;
            ypos += cellHeight;
        }
        GridAPI._grids[id] = new Grid(data);
        GridAPI.render(id, targetElementId, options, customFn);
        return GridAPI._grids[id];
    }

    static render(gridId: string, targetElementId: string, options: GridRenderOptions | any = {}, customFn = (...args) => { }): void {
        if (!targetElementId) return;
        let grid = GridAPI.getGrid(gridId);
        if (!grid) return;

        let fillColor = _.get(options, 'fillColor', '#BFBFBF')
        let strokeColor = _.get(options, 'strokeColor', 'black')
        let strokeDasharray = _.get(options, 'strokeDasharray', ('0, 0'));
        let targetElement = document.querySelector(targetElementId);
        while (targetElement.hasChildNodes()) {
            targetElement.removeChild(targetElement.lastChild);
        }
        let gridElement = d3.select(targetElementId)
            .append('svg')
            .attr('height', grid.height + 2)
            .attr('width', grid.width + 2);
        let rows = gridElement.selectAll('.row')
            .data(grid.data)
            .enter().append('g')
            .attr('class', 'row');
        let cells = rows.selectAll(".square")
            .data(d => d)
            .enter().append('svg')
            .attr('id', d => `${gridId.split('-').join('')}-${d.row}-${d.column}`)
            .attr("x", d => d.x)
            .attr("y", d => d.y)
            .attr('width', d => d.width)
            .attr('height', d => d.height)
            .attr('viewBox', d => `0 0 ${d.width} ${d.height}`)
            .attr('preserveAspectRatio', 'xMaxYMax meet')
            .style("stroke", strokeColor)
            .style('stroke-dasharray', strokeDasharray)
            // .append('g')
            .append("rect")
            .attr("class", "square")
            .attr("width", '100%')
            .attr("height", '100%')
            .style("fill", fillColor);
        cells = rows.selectAll('svg');
        customFn.call(this, grid, cells);
        cells.on('click', function (d) {
            grid.fireCellEvent(d.id, 'click', [d], this);
        }).on('mousedown', function (d) {
            grid.fireCellEvent(d.id, 'mousedown', [d], this);
        }).on('mouseover', function (d) {
            grid.fireCellEvent(d.id, 'mouseover', [d], this);
        });
    }

    static getGrid(id: string): Grid {
        return GridAPI._grids[id];
    }
}