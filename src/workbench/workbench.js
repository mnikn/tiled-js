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
                <a class="item" data-tab="add-tileset">
                    <i class="plus icon"></i>
                </a>
            </div>
            <div class="ui attached active tab segment" data-tab="color-tileset">
                <div id="tile-preview">
                </div>
                <div style="margin-top: 12px">
                    <div class="color-picker">
                    </div>
                    <button id="change-colortile-btn" class="ui circular icon button">
                        <i class="paste icon"></i>
                    </button>
                </div>
            </div>
        </div>
        `;
        let colorIndex = 0;
        let colors = [
            'red', 'green', 'yellow', 'blue', 'gray',
            'black', 'lightblue', 'lightgray', 'aqua', 'salmon',
            'azure', 'gold', 'silver', 'firebrick', 'hotpink',
            'teal', 'tan', 'skyblue', 'violet', 'khaki'
        ];
        this.grid = GridAPI.createGrid('#tile-preview', {
            column: 4,
            row: 4,
            width: 40,
            height: 40,
            fillColor: () => colors[colorIndex++]
        });
        this.grid.registerRectsEvent('click', function () {
            TileService.selectedTile = this;
        });
        document.querySelector('#change-colortile-btn').addEventListener('click', e => {
            TileService.selectedTile.style.fill = pickr.getColor().toRGBA().toString();
        });

        // document.querySelector('#remove-colortile-btn').addEventListener('click', e => {
        //     if (!TileService.selectedTile) return;
        //     TileService.selectedTile.style.fill = '#BFBFBF';
        //     TileService.selectedTile = null;
        // });
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
}

window.customElements.define('tiled-workbench', Workbench);