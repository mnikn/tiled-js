import * as _ from 'lodash';
import * as d3 from 'd3';

import {
    Messager
} from './messager';


export class Grid {
    constructor(data = []) {
        this._data = data;
        if (data.length !== 0) {
            this._width = this.data[0].reduce((result, current) => result + current.width, 0) + 10;
            this._height = this.data.reduce((result, current) => result + current[0].height, 0) + 10;
        }
        this._rects = _.flatten(this.data).map(e => _.extend({
            events: {}
        }, e));
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
        return [];
    }

    get columns() {
        return [];
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
}

let grids = [];
export class GridAPI {
    static createGrid(target, options = {}, customFn = () => {}) {
        let id = _.get(options, 'id', grids.length + 1);
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
        let gridElement = d3.select(target)
            .append('svg')
            .attr('height', grid.height)
            .attr('width', grid.width);
        let rows = gridElement.selectAll('.row')
            .data(grid.data)
            .enter().append('g')
            .attr('class', 'row');
        let rects = rows.selectAll(".square")
            .data(d => d)
            .enter().append("rect")
            .attr("class", "square")
            .attr('id', d => `square${d.id}`)
            .attr("x", d => d.x)
            .attr("y", d => d.y)
            .attr("width", d => d.width)
            .attr("height", d => d.height)
            .style("fill", fillColor)
            .style("stroke", strokeColor)
            .style('stroke-dasharray', strokeDasharray);
        customFn.call(this, grid);
        rects.on('click', function (d) {
            grid.fireRectEvent(d.id, 'click', [d], this);
        });
    }
}