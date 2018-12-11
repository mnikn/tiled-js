import * as _ from 'lodash';
import * as d3 from 'd3';

import {
    Messager
} from './messager';


export class Grid {
    constructor(data = []) {
        this._data = data;
        this.updateGrid();
    }

    updateGrid() {
        if (this._data.length !== 0) {
            this._width = this._data[0].reduce((result, current) => result + current.width, 0);
            this._height = this._data.reduce((result, current) => result + current[0].height, 0);
            this._rows = this._data.length;
            this._columns = this._data[0].length;
        }
        this._rects = _.flatten(this._data).map(e => {
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

    registerRectEvent(id, eventName, callback) {
        let rect = this._rects.find(e => e.id === id);
        if (!rect) return;
        let event = rect.events[eventName];
        if (!event) {
            event = new Messager();
        }
        event.register(callback);
        rect.events[eventName] = event;
    }

    registerRectsEvent(eventName, callback) {
        this._rects.forEach(function (rect) {
            let event = rect.events[eventName];
            if (!event) {
                event = new Messager();
            }
            event.register(callback);
            rect.events[eventName] = event;
        });
    }

    fireRectEvent(id, eventName, args, thisEnv = this) {
        let rect = this._rects.find(e => e.id === id);
        if (!rect) return;
        let event = rect.events[eventName];
        if (!event) return;
        event.fire(args, thisEnv);
    }

    fireRectsEvent(eventName, args, thisEnv = this) {
        let self = this;
        this._rects.forEach(function (rect) {
            self.fireRectEvent(rect.id, eventName, args, thisEnv);
        });
    }

    // removeRect(id) {
    //     this._data.forEach(function (row) {
    //         row = row.filter(rect => rect.id === id);
    //     });
    //     this.updateGrid();
    // }
}

let grids = [];
export class GridAPI {
    static createGrid(target, options = {}, customFn = () => {}) {
        let id = _.get(options, 'id', grids.length + 1);
        if (grids[id]) {
            this.render(id, target, options, customFn);
            return grids[id];
        }

        let row = _.get(options, 'row', 100);
        let column = _.get(options, 'column', 100);
        let rectHeight = _.get(options, 'height', 32);
        let rectWidth = _.get(options, 'width', 32);

        let data = [];
        let xpos = 1;
        let ypos = 1;
        for (let i = 0; i < row; ++i) {
            data[i] = [];
            for (let j = 0; j < column; ++j) {
                data[i].push({
                    x: xpos,
                    y: ypos,
                    height: rectHeight,
                    width: rectWidth,
                    id: xpos + ypos
                });
                xpos += rectWidth;
            }
            xpos = 1;
            ypos += rectHeight;
        }
        grids[id] = new Grid(data);
        GridAPI.render(id, target, options, customFn);
        return grids[id];
    }

    static render(id, target, options = {}, customFn = () => {}) {
        if (!target) return;
        let grid = grids[id];
        if (!grid) return;

        let fillColor = _.get(options, 'fillColor', '#BFBFBF')
        let strokeColor = _.get(options, 'strokeColor', 'black')
        let strokeDasharray = _.get(options, 'strokeDasharray', ('0, 0'));
        let targetElement = document.querySelector(target);
        while (targetElement.hasChildNodes()) {
            targetElement.removeChild(targetElement.lastChild);
        }
        let gridElement = d3.select(target)
            .append('svg')
            .attr('height', grid.height + 2)
            .attr('width', grid.width + 2);
        let rows = gridElement.selectAll('.row')
            .data(grid.data)
            .enter().append('g')
            .attr('class', 'row');
        let rects = rows.selectAll(".square")
            .data(d => d)
            .enter().append('svg')
            .attr("x", d => d.x)
            .attr("y", d => d.y)
            .attr('width', d => d.width)
            .attr('height', d => d.height)
            .attr('viewBox', d => `0 0 ${d.width} ${d.height}`)
            .attr('preserveAspectRatio', 'xMaxYMax meet')
            // .append('g')
            .append("rect")
            .attr("class", "square")
            .attr("width", '100%')
            .attr("height", '100%')
            .style("fill", fillColor)
            .style("stroke", strokeColor)
            .style('stroke-dasharray', strokeDasharray);
        rects = rows.selectAll('svg');
        customFn.call(this, grid, rects);
        rects.on('click', function (d) {
            grid.fireRectEvent(d.id, 'click', [d], this);
        }).on('mousedown', function (d) {
            grid.fireRectEvent(d.id, 'mousedown', [d], this);
        }).on('mouseover', function (d) {
            grid.fireRectEvent(d.id, 'mouseover', [d], this);
        });
    }
}