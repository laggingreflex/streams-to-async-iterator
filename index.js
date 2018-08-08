const $ = 'resolve,reject'.split(',').reduce(($, _) => ({ ...$, [_]: Symbol(_) }), {});

module.exports = class streamsToAsyncGenerator {

  constructor(...streams) {
    this.next();

    const removeListeners = streams.map((stream, i) => addListeners(stream, {
      data: data => {
        data = String(data)
        this[$.resolve]({ stream, i, data });
      },
      close: code => {
        this[$.resolve]({ stream, i, code, done: true });
        this.done = true;
      },
      error: error => {
        error.stream = stream;
        this[$.reject](error);
      },
    }));

    this.return = () => {
      removeListeners.forEach(_ => _())
      this.done = true;
      return this;
    };
  }

  next() {
    if (this[$.error]) {
      throw this[$.error];
    } else if (this.done) {
      return this.return();
    }
    this.value = new Promise((resolve, reject) => {
      this[$.resolve] = resolve;
      this[$.reject] = error => {
        this[$.error] = error;
        reject(error);
      };
    });
    return this;
  }

  [Symbol.iterator]() { return this; }

}

function addListeners(stream, listeners) {
  const removeListeners = [];
  for (const event in listeners) {
    const listener = listeners[event];
    stream.on(event, listener);
    removeListeners.push(() => stream.off(event, listener));
  }
  return () => removeListeners.forEach(r => r());
}
