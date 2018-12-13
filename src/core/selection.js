import {
    Messager
} from "./messager";

export class Selection {
    constructor() {
        this._selectedTitle = null;
        this._onSelectionChange = new Messager();
    }

    get type() {
        return '';
    }

    registerSelectionChange(callback) {
        this._onSelectionChange.register(callback);
    }

    fireSelectionChange(args) {
        this._onSelectionChange.fire(args);
    }

    get selectedTitle() {
        return this._selectedTitle;
    }

    set selectedTitle(value) {
        this._selectedTitle = value;
    }
}

export class SimpleSelection extends Selection {
    constructor() {
        super();
        this._selectedRect = null;
    }

    get selectedRect() {
        return this._selectedRect;
    }

    set selectedRect(value) {
        this._selectedRect = value;
        super.fireSelectionChange(value);
    }

    get type() {
        return 'simple';
    }

    static get type() {
        return 'simple';
    }
}

export class RectangleSelection extends Selection {

    constructor() {
        super();
        this._startRect = null;
        this._endRect = null;
    }

    static get type() {
        return 'rectangle';
    }

    get type() {
        return 'rectangle';
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
        super.fireSelectionChange(value);
    }

    select(leftRow, rightRow, leftColumn, rightColumn, gridId) {
        let rects = [];
        _.range(leftRow, rightRow + 1).forEach(row => {
            _.range(leftColumn, rightColumn + 1).forEach(column => {
                let rect = document.querySelector(`#${gridId}-${row}-${column}`);
                rects.push(rect);
            });
        });
        return rects;
    }
}
