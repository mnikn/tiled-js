import { Selection, SimpleSelection } from "./core/selection";

export enum EditMode {
    none = -1,
    fill = 1,
    eraser
}

export class TileService {
    private static _selection: Selection = new SimpleSelection();
    private static _editMode: EditMode = EditMode.none;

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