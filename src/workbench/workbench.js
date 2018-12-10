import './workbench.css';
import {
    GridAPI
} from '../core/grid';

export class Workbench extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
        <div class="ui left vertical segment" style="height: 100%; width: 200px; padding: 12px;">
            <button class="ui icon button">
                <i class="plus icon">
                </i>
            </button>
            <div id="tile-preview">
            </div>
        </div>
        `;
        this.grid = GridAPI.createGrid('#tile-preview', {
            fillColor: 'red'
        });
    }
}

window.customElements.define('tiled-workbench', Workbench);