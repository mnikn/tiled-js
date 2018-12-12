import {
    editMode,
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
        </div>
        `;
        document.querySelector('#eraser-btn').addEventListener('click', e => {
            TileService.editMode = TileService.editMode !== null && TileService.editMode.type === editMode.eraser ? null : new EraserMode();
        });
    }
}

window.customElements.define('tiled-toolbar', Toolbar);