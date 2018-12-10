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

    fire(args, thisEnv = this) {
        this._queue.forEach(function (e) {
            e.apply(thisEnv, args);
        });
    }
}