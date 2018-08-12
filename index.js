module.exports = async function*(stream, opts) {

  const queue = [];
  const defer = new Defer();
  let ended = false;

  const onData = data => {
    queue.push(data);
    defer.resolve();
  };
  const onError = e => defer.reject(e);
  const onEnd = () => {
    defer.resolve();
    ended = true;
  };

  stream.on('data', onData);
  stream.on('error', onError);
  stream.on('end', onEnd);
  stream.on('close', onEnd);

  try {
    while (true) {
      await defer;
      if (ended) break;
      defer.reset();
      while (queue.length) {
        yield queue.shift();
      }
    }
  } finally {
    stream.off('data', onData);
    stream.off('error', onError);
    stream.off('end', onEnd);
    stream.off('close', onEnd);
  }
}

class Defer {
  constructor() {
    this.reset();
  }
  reset() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    })
  }
  get then() { return this.promise.then.bind(this.promise) }
  get catch() { return this.promise.catch.bind(this.promise) }
}
