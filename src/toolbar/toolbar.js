import {
    editMode,
    TileService
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
            TileService.editMode = TileService.editMode === editMode.eraser ? '' : editMode.eraser;
        });
    }
}

window.customElements.define('tiled-toolbar', Toolbar);