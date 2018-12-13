export class Messager {
    private _queue: any[] = [];

    register(callback: () => void) {
        this._queue.push(callback);
    }

    unregister(callback: () => void) {
        this._queue.splice(this._queue.indexOf(callback), 1);
    }

    fire(args: any, thisEnv: any = this) {
        this._queue.forEach(function (e) {
            e.apply(thisEnv, args);
        });
    }
}