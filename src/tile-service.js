import { Selection, SimpleSelection } from "./core/selection";

export class EditMode {
    constructor() {
    }
}

export class FillMode extends EditMode {
    constructor() {
        super();
    }

    get type() {
        return 'fill';
    }

    static get type() {
        return 'fill';
    }
}

export class EraserMode extends EditMode {
    constructor() {
        super();
    }

    get type() {
        return 'eraser';
    }

    static get type() {
        return 'eraser';
    }
}

export const editMode = Object.freeze({
    eraser: EraserMode.type,
    fill: FillMode.type
});

let _editMode = new EditMode();
let _selection = new SimpleSelection();
export class TileService {
    static get selection() {
        return _selection;
    }

    static set selection(value) {
        _selection = value;
    }

    static get editMode() {
        return _editMode;
    }

    static set editMode(value) {
        _editMode = value;;
    }
}