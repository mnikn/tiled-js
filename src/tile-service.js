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
        this._startPoint = null;
        this._endPoint = null;
    }

    get startPoint() {
        return this._startPoint;
    }

    set startPoint(value) {
        this._startPoint = value;
    }

    get endPoint() {
        return this._endPoint;
    }

    set endPoint(value) {
        this._endPoint = value;
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