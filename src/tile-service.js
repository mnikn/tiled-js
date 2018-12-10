let _selectedRect = null;
export class TileService {
    static get selectedTile() {
        return _selectedRect;
    }

    static set selectedTile(rect) {
        _selectedRect = rect;
    }
}