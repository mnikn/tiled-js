export class Toolbar extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
        <div class="ui top horizontal inverted labeled icon menu" style="width: 100%">
            <a class="item">
            </a>
        </div>
        `;
    }
}

window.customElements.define('tiled-toolbar', Toolbar);