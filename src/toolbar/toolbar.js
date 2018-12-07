export class Toolbar extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
        <div class="ui left vertical inverted labeled icon menu" style="height: 100%">
            <a class="item">
                <i class="home icon"></i>
                Home
            </a>
            <a class="item">
                <i class="block layout icon"></i>
                Topics
            </a>
            <a class="item">
                <i class="smile icon"></i>
                Friends
            </a>
            </div>
        </div>
        `;
    }
}

window.customElements.define('tiled-toolbar', Toolbar);