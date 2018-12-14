import { Cell } from './core/grid/grid';
import { Selection } from "./core/selection";

export enum EditMode {
    none = -1,
    stampBrush = 1,
    eraser,
    shapeFill
}

export class TileService {
    private static _cells: Cell[] = [];
    private static _selection: Selection = new Selection();
    private static _editMode: EditMode = EditMode.none;

    static get cells() {
        return TileService._cells;
    }

    static set cells(value) {
        this._cells = value;
        this._selection.reset(this._cells);
    }

    static get editMode() {
        return TileService._editMode;
    }

    static set editMode(value) {
        TileService._editMode = value;;
    }
    static get selection() {
        return TileService._selection;
    }

    static set selection(value) {
        TileService._selection = value;
    }
}