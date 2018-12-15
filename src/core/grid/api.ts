import * as _ from 'lodash';
import * as d3 from 'd3';


import { Grid, Cell } from './grid';

export interface GridRenderOptions {
    id: string;
    row: number;
    column: number;
    height: number;
    width: number;
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
                    id: `${i}-${j}`
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
        cells.each(function (d: Cell) {
            let element: any = this;
            d.element = element;
        });
        customFn.call(this, grid, cells);
        grid.updateGrid();
    }

    static getGrid(id: string): Grid {
        return GridAPI._grids[id];
    }
}