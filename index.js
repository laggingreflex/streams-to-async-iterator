const { Defer } = require('./utils')

module.exports = async function*(stream, opts = {}) {

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
  stream.once('error', onError);
  stream.once('end', onEnd);
  stream.once('close', onEnd);

  try {
    while (true) {
      await Promise.race([defer, opts.interrupt].filter(Boolean));
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
    defer.resolve();
  }
}
