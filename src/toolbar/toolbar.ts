import {
    TileService,
    EditMode
} from '../tile-service';

export class Toolbar extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
        <div id='tiled-toolbar' class="ui top horizontal inverted labeled icon menu" style="width: 100%">
            <a id='eraser-btn' class="item">
                <i class="eraser icon"></i> 
            </a>
            <a id='fill-btn' class="item">
                <i class="pencil alternate icon"></i> 
            </a>
        </div>
        `;
        document.querySelector('#eraser-btn').addEventListener('click', e => {
            TileService.editMode = TileService.editMode !== EditMode.eraser ? EditMode.eraser : EditMode.none;
            let children = document.querySelector('#tiled-toolbar').children;
            for(let i = 0;i < children.length; ++i) {
                if (children[i].id === 'eraser-btn' && children[i].className !== 'active item') {
                    children[i].setAttribute('class', 'active item');
                } else {
                    children[i].setAttribute('class', 'item');
                }
            }
        });
        document.querySelector('#fill-btn').addEventListener('click', e => {
            TileService.editMode = TileService.editMode !== EditMode.fill ? EditMode.fill : EditMode.none;
            let children = document.querySelector('#tiled-toolbar').children;
            for(let i = 0;i < children.length; ++i) {
                if (children[i].id === 'fill-btn' && children[i].className !== 'active item') {
                    children[i].setAttribute('class', 'active item');
                } else {
                    children[i].setAttribute('class', 'item');
                }
            }
        });
    }
}

window.customElements.define('tiled-toolbar', Toolbar);