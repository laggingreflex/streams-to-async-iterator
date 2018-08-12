# streams-to-async-iterator

A simple stream to async iterator

## Install

```
npm i streams-to-async-iterator
```

## Usage

```js
import toAsync from 'streams-to-async-iterator';

const stream = fs.createReadStream(filename);
const asyncStream = toAsync(stream);

for await (const chunk of asyncStream) {
  // ...
}
```

## Alternatives:

* **[stream-to-async-iterator]**

[stream-to-async-iterator]: https://github.com/basicdays/node-stream-to-async-iterator

