import * as d3 from 'd3';

class Grid {
    constructor(data = []) {
        this._data = data;
        if (data.length !== 0) {
            this._width = this.data[0].reduce((result, current) => result + current.width, 0) + 10;
            this._height = this.data.reduce((result, current) => result + current[0].height, 0) + 10;
        }
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
        rows.selectAll(".square")
            .data(d => d)
            .enter().append("rect")
            .attr("class", "square")
            .attr("x", d => d.x)
            .attr("y", d => d.y)
            .attr("width", d => d.width)
            .attr("height", d => d.height)
            .style("fill", "#BFBFBF")
            .style("stroke", "#5B5B5B")
            .style("stroke-dasharray", ("1, 3"));
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
                    width: gridWidth
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
