import * as d3 from 'd3';
import * as Pickr from 'pickr-widget';

import './workbench.css';
import {
    GridAPI
} from '../core/grid';
import {
    TileService
} from '../tile-service';

export class Workbench extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
        <div class="ui left vertical segment" style="height: 100%; padding: 12px;">
            <div class="ui attached tabular menu" style="margin-top: 12px">
                <a class="active item" data-tab="color-tileset">Color tileset</a>
                <a class="item" data-tab="text-tileset">Text tileset</a>
                <a class="item" data-tab="add-tileset">
                    <i class="plus icon"></i>
                </a>
            </div>
            <div id='color-tab' class="ui attached active tab segment" data-tab="color-tileset">
                <div id="colortile-preview">
                </div>
                <div style="margin-top: 12px">
                    <div class="color-picker">
                    </div>
                    <button id="change-colortile-btn" class="ui circular icon button">
                        <i class="paste icon"></i>
                    </button>
                </div>
            </div>
            <div id='text-tab' class="ui attached tab segment" data-tab="text-tileset">
                <div id="texttile-preview">
                </div>
                <div style="margin-top: 12px">
                    <button id="change-texttile-btn" class="ui circular icon button">
                        <i class="paste icon"></i>
                    </button>
                </div>
            </div>
        </div>
        `;
        this.renderColorGrid();
        document.querySelector('#change-colortile-btn').addEventListener('click', e => {
            TileService.selectedTile.style.fill = pickr.getColor().toRGBA().toString();
        });

        let self = this;
        $('.menu .item').tab({
            onLoad: function () {
                if (this.id === 'text-tab') {
                    self.renderTextGrid();
                } else if (this.id === 'color-tab') {
                    self.renderColorGrid();
                }
            }
        });
        const pickr = new Pickr({
            el: '.color-picker',
            default: '#42445A',
            components: {
                preview: true,
                opacity: true,
                hue: true,
                interaction: {
                    hex: true,
                    rgba: true,
                    hsla: true,
                    hsva: true,
                    cmyk: true,
                    input: true,
                    clear: true,
                    save: true
                }
            }
        });
    }

    renderColorGrid() {
        let colorIndex = 0;
        let colors = [
            'red', 'green', 'yellow', 'blue', 'gray',
            'black', 'lightblue', 'lightgray', 'aqua', 'salmon',
            'azure', 'gold', 'silver', 'firebrick', 'hotpink',
            'teal', 'tan', 'skyblue', 'violet', 'khaki'
        ];
        let fillColor = () => colors[colorIndex++];
        this.grid = GridAPI.createGrid('#colortile-preview', {
            id: 'color-grid',
            column: 4,
            row: 4,
            width: 40,
            height: 40,
            fillColor: fillColor
        });
        this.grid.registerRectsEvent('click', function () {
            TileService.selectedTile = this;
        });
    }

    renderTextGrid() {
        this.grid = GridAPI.createGrid('#texttile-preview', {
            id: 'text-grid',
            column: 4,
            row: 4,
            width: 40,
            height: 40
        }, (grid, rects) => {
            let textIndex = 0;
            let texts = [
                'A', 'B', 'C', 'D', 'E',
                'F', 'G', 'H', 'I', 'J',
                'K', 'L', 'M', 'N', 'O',
                'P', 'Q', 'R', 'S', 'R'
            ];
            rects.data(d => d)
            .append("text")
            .attr("x", '40%')
            .attr("y", '60%')
            .text(() => texts[textIndex++]);
        });
        this.grid.registerRectsEvent('click', function () {
            TileService.selectedTile = this;
            console.log(this);
        });
    }
}

window.customElements.define('tiled-workbench', Workbench);