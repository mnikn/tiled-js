import * as d3 from 'd3';
import * as Pickr from 'pickr-widget';

import './workbench.css';
import {
    GridAPI
} from '../core/grid';
import {
    TileService,
    TileMode
} from '../tile-service';

export class Workbench extends HTMLElement {
    constructor() {
        super();
        let self = this;
        this._customTextTileText = 'W';
        let textinputPopup = `
        <div class='ui form'>
            <div class='field'><label>Custom text</label>
                <textarea id='texttitle-textarea' rows='2'></textarea>
            </div>
            <button id='texttitle-input-okbtn' class='ui green button'>
                Ok
            </button>
            <button class='ui deny button'>
                Cancel
            </button>
        </div>`;
        this.innerHTML = `
        <div class="ui left vertical segment" style="height: 100%; padding: 12px;">
            <div class="ui attached tabular menu" style="margin-top: 12px; 
            display: flex; flex-direction: row; flex-wrap: wrap;">
                <a class="active item" data-tab="color-tileset">Color tileset</a>
                <a class="item" data-tab="text-tileset">Text tileset</a>
                <a class="item" data-tab="add-tileset">
                    <i class="plus icon"></i>
                </a>
            </div>
            <div id='color-tab' class="ui attached active tab segment" data-tab="color-tileset">
                <div id="colortile-preview">
                </div>
                <div style="margin-top: 12px; display: flex">
                    <div class="color-picker">
                    </div>
                    <button id="change-colortile-btn" class="ui circular icon button" style="margin-left: 4px">
                        <i class="paste icon"></i>
                    </button>
                </div>
            </div>
            <div id='text-tab' class="ui attached tab segment" data-tab="text-tileset">
                <div id="texttile-preview">
                </div>
                <div style="margin-top: 12px">
                    <div id="texttile-input" style="display: inline;" data-html="${textinputPopup}">
                        W
                    </div>
                    <button id="change-texttile-btn" class="ui circular icon button">
                        <i class="paste icon"></i>
                    </button>
                </div>
            </div>
        </div>
        `;
        this.renderColorGrid();
        document.querySelector('#change-colortile-btn').addEventListener('click', e => {
            TileService.selection.selectedTile.children[1].style.fill = pickr.getColor().toRGBA().toString();
        });
        document.querySelector('#change-texttile-btn').addEventListener('click', e => {
            TileService.selection.selectedTile.children[1].innerHTML = self._customTextTileText;
        });


        $('.menu .item').tab({
            onLoad: function () {
                if (this.id === 'text-tab') {
                    self.renderTextGrid();
                } else if (this.id === 'color-tab') {
                    self.renderColorGrid();
                }
            }
        });
        $('#texttile-input').popup({
            position: 'bottom left',
            on: 'click',
            onVisible: () => {
                let btn = document.querySelector('#texttitle-input-okbtn');
                let textarea = document.querySelector('#texttitle-textarea');
                textarea.value = self._customTextTileText;
                btn.addEventListener('click', e => {
                    self._customTextTileText = textarea.value;
                    document.querySelector('#texttile-input').innerText = textarea.value;
                    // document.querySelector('.popup').remove();
                });
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
        this.grid = GridAPI.createGrid('#colortile-preview', {
            id: 'color-grid',
            column: 5,
            row: 6,
            width: 40,
            height: 40
        }, (grid, rects) => {
            let colorIndex = 0;
            let colors = [
                'red', 'green', 'yellow', 'blue', 'gray',
                'black', 'lightblue', 'lightgray', 'aqua', 'salmon',
                'azure', 'gold', 'silver', 'firebrick', 'hotpink',
                'teal', 'tan', 'skyblue', 'violet', 'khaki',
                'brown', 'saddlebrown', 'cadetblue', 'gainsboro', 'wheat',
                'honeydew', 'tan', 'forestgreen', 'bisque', 'lawngreen'
            ];
            rects.data(d => d)
                .append("rect")
                .attr("width", '100%')
                .attr("height", '100%')
                .style("fill", () => colors[colorIndex++])
                .style("stroke-width", '0');
        });
        this.grid.registerRectsEvent('click', function () {
            TileService.selection.selectedTile = this;
            TileService.editMode = new TileMode();
        });
    }

    renderTextGrid() {
        this.grid = GridAPI.createGrid('#texttile-preview', {
            id: 'text-grid',
            column: 5,
            row: 6,
            width: 40,
            height: 40
        }, (grid, rects) => {
            let textIndex = 0;
            let texts = [
                'A', 'B', 'C', 'D', 'E',
                'F', 'G', 'H', 'I', 'J',
                'K', 'L', 'M', 'N', 'O',
                'P', 'Q', 'R', 'S', 'T',
                'U', 'V', 'W', 'X', 'Y',
                'Y'
            ];
            rects.data(d => d)
                .append("text")
                .attr("x", '40%')
                .attr("y", '60%')
                .text(() => texts[textIndex++]);
        });
        this.grid.registerRectsEvent('click', function () {
            TileService.selection.selectedTile = this;
            TileService.editMode = new TileMode();
        });
    }
}

window.customElements.define('tiled-workbench', Workbench);