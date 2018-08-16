const { Defer } = require('./utils')

module.exports = (stream, opts = {}) => {

  const queue = [];
  const defer = new Defer();
  let done = false;

  const onData = data => {
    queue.push(data);
    defer.resolve();
  };
  const onError = e => {
    done = true;
    defer.reject(e)
  };
  const onEnd = () => {
    done = true;
    defer.resolve();
  };

  stream.on('data', onData);
  stream.once('error', onError);
  stream.once('end', onEnd);
  stream.once('close', onEnd);

  const off = () => {
    stream.off('data', onData);
    stream.off('error', onError);
    stream.off('end', onEnd);
    stream.off('close', onEnd);
  };

  const iterator = {};

  iterator.next = async () => {
    if (done) {
      return { done };
    }
    try {
      await defer;
    } catch (error) {
      iterator.throw(error);
    }
    if (queue.length) {
      const value = queue.shift();
      if (!queue.length) {
        defer.reset();
      }
      return { value, done };
    } else {
      return iterator.return();
    }
  };

  iterator.throw = (error) => {
    off();
    defer.reject(error);
    done = true;
    return { done }
  };

  iterator.return = (value) => {
    defer.resolve(value);
    off();
    done = true;
    return { value, done }
  };

  iterator[Symbol.asyncIterator] = () => iterator;

  return iterator;
}
