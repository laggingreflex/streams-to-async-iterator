# streams-to-async-iterator

## Install

```
npm i streams-to-async-iterator
```

## Usage

```js
import toAsync from 'streams-to-async-iterator';

const stream = fs.createReadStream(filename);
const asyncStream = new toAsync(stream);

for await (const { data, done } of asyncStream) {
  // ...
}
```

