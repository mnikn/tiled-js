import * as _ from 'lodash';
import * as d3 from 'd3';
import {
    Messager
} from '../core/messager';

class Grid {
    constructor(data = []) {
        this._data = data;
        if (data.length !== 0) {
            this._width = this.data[0].reduce((result, current) => result + current.width, 0) + 10;
            this._height = this.data.reduce((result, current) => result + current[0].height, 0) + 10;
        }
        this._reacts = _.flatten(this.data).map(e => _.extend({events: {}}, e));
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
        let rect = _.get(this.rects, {id: id});
        if (!rect) return;
        let events = this.events[eventName];
        if (!events) {
            events = new Messager();
        }
        events.push(callback);
    }

    registerRectsEvent(eventName, callback) {
        this._reacts.forEach(e => this.registerRectEvent(e.id, eventName, callback));
    }

    fireRectEvent(id, eventName, args) {
        let rect = _.get(this.rects, {id: id});
        if (!rect) return;
        let event = this.events[eventName];
        if (!event) return;
        event.fire(args);
    }

    fireRectsEvent(eventName, args) {
        this._reacts.forEach(e => this.fireRectEvent(e.id, eventName, args));
    }
}

export class Map extends HTMLElement {

    constructor() {
        super();
        this.id = 'map';
        this.style.overflow = 'auto';
        this.grid = this.createGrid();
        this.refresh();
    }

    refresh() {
        let grid = d3.select('#map')
            .append('svg')
            .attr('height', this.grid.height)
            .attr('width', this.grid.width);
        let rows = grid.selectAll('.row')
            .data(this.grid.data)
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
            .style("fill", "#BFBFBF")
            .style("stroke", "#5B5B5B")
            .style("stroke-dasharray", ("1, 3"));
        rects.on('click', function (d) {
            d3.select(this).style('fill', 'red');
        });
    }

    createGrid(row = 100, column = 100) {
        let data = [];
        let xpos = 1;
        let ypos = 1;
        let gridHeight = 32;
        let gridWidth = 32;
        for (let i = 0; i < row; ++i) {
            data[i] = [];
            for (let j = 0; j < column; ++j) {
                data[i].push({
                    x: xpos,
                    y: ypos,
                    height: gridHeight,
                    width: gridWidth,
                    id: xpos + ypos
                });
                xpos += gridWidth;
            }
            xpos = 1;
            ypos += gridHeight;
        }
        return new Grid(data);
    }
}

window.customElements.define('app-map', Map);
