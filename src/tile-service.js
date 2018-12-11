export const editMode = Object.freeze({
    eraser:   Symbol('eraser'),
    tile:  Symbol('tile')
});

let _selectedRect = null;
let _editMode = null;
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