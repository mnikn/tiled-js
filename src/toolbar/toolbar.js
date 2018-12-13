import {
    editMode,
    TileService,
    EraserMode,
    FillMode
} from '../tile-service';

export class Toolbar extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
        <div class="ui top horizontal inverted labeled icon menu" style="width: 100%">
            <a id='eraser-btn' class="item">
                <i class="eraser icon"></i> 
            </a>
            <a id='fill-btn' class="item">
                <i class="pencil alternate icon"></i> 
            </a>
        </div>
        `;
        document.querySelector('#eraser-btn').addEventListener('click', e => {
            TileService.editMode = TileService.editMode !== null && TileService.editMode.type === editMode.eraser ? null : new EraserMode();
        });
        document.querySelector('#fill-btn').addEventListener('click', e => {
            TileService.editMode = TileService.editMode !== null && TileService.editMode.type === editMode.fill ? null : new FillMode();
        });
    }
}

window.customElements.define('tiled-toolbar', Toolbar);