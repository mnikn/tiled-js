export class EditMode {
    constructor() {
    }
}

export class TileMode extends EditMode {
    constructor() {
        super();
    }

    get type() {
        return 'tile';
    }
}

export class EraserMode extends EditMode {
    constructor() {
        super();
    }

    get type() {
        return 'eraser';
    }
}

export class FillShapeMode extends EditMode {

    constructor() {
        super();
        this._startRect = null;
        this._endRect = null;
    }

    get startRect() {
        return this._startRect;
    }

    set startRect(value) {
        this._startRect = value;
    }

    get endRect() {
        return this._endRect;
    }

    set endRect(value) {
        this._endRect = value;
    }

    get type() {
        return 'fillShape';
    }
}

export const editMode = Object.freeze({
    eraser: new EraserMode().type,
    fillShape: new FillShapeMode().type,
    tile: new TileMode().type
});

let _selectedRect = null;
let _editMode = new EditMode();
export class TileService {
    static get selectedTile() {
        return _selectedRect;
    }

    static set selectedTile(rect) {
        _selectedRect = rect;
    }

    static get editMode() {
        return _editMode;
    }

    static set editMode(value) {
        _editMode = value;;
    }
}