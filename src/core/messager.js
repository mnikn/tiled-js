export class Messager {
    constructor() {
        this._queue = [];
    }

    register(callback) {
        this._queue.push(callback);
    }

    unregister(callback) {
        this._queue.splice(this._queue.indexOf(callback), 1);
    }

    fire(args) {
        this._queue.forEach(e => e.apply(this, args));
    }
}