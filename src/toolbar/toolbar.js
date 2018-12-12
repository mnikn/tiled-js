import {
    editMode,
    FillShapeMode,
    TileService,
    EraserMode
} from '../tile-service';

export class Toolbar extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
        <div class="ui top horizontal inverted labeled icon menu" style="width: 100%">
            <a id='eraser-btn' class="item">
                <i class="eraser icon"></i> 
            </a>
            <a id='fill-shape-btn' class='item'>
                <i class='square icon'></i>
            </a>
        </div>
        `;
        document.querySelector('#eraser-btn').addEventListener('click', e => {
            TileService.editMode = TileService.editMode.type === editMode.eraser ? null : new EraserMode();
        });
        document.querySelector('#fill-shape-btn').addEventListener('click', e => {
            TileService.editMode = TileService.editMode.type === editMode.fillShape ? null : new FillShapeMode();
        });
    }
}

window.customElements.define('tiled-toolbar', Toolbar);