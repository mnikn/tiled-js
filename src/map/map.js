import * as _ from 'lodash';
import * as d3 from 'd3';

import { 
    GridAPI
} from '../core/grid';

export class Map extends HTMLElement {

    constructor() {
        super();
        this.id = 'map';
        this.style.overflow = 'auto';
        this.grid = GridAPI.createGrid('#map', {
            strokeColor: '#5B5B5B',
            strokeDasharray: ('1, 3')
        });
        this.grid.registerRectsEvent('click', function() {
            d3.select(this).style('fill', 'red');
        });
    }
}

window.customElements.define('app-map', Map);
