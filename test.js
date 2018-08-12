const lib = require('.');
const fs = require('fs');
const assert = require('assert');

main()
  .then(() => console.log('ok'))
  .catch(error => {
    console.error(error);
    process.exitCode = 1;
  });

async function main() {
  // await basic();
  // await breaks();
  await stdin();
}


async function basic() {
  const filename = __filename;

  let target = '';
  for await (const data of lib(fs.createReadStream(filename, {encoding: 'utf8'}))) {
    // console.log(data.length);
    if (data) {
      // console.log(`data:`, data);
      target += data;
    }
  }

  const source = fs.readFileSync(filename, 'utf8');
  assert.equal(source, target);
}

async function stdin() {

  for await (const data of lib(process.stdin)) {
    // console.log('1');
    process.stdout.write(data)
  }

}
