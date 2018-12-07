import * as d3 from 'd3';

class Grid {
    constructor(data = []) {
        this.data = data;
    }

    get width() {
        if (this.data.length === 0) return 0;
        return this.data[0].reduce((result, current) => result + current.width, 0) + 10;
    }

    get height() {
        if (this.data.length === 0) return 0;
        return this.data.reduce((result, current) => result + current[0].height, 0) + 10;
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
        this.initStyle();
        this.grid = this.createGrid();
        this.refresh();
    }

    initStyle() {
        this.style.overflow = 'auto';
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
            .style("fill", "#fff")
            .style("stroke", "#222");
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
