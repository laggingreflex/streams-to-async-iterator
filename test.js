const lib = require('.');
const fs = require('fs');
const assert = require('assert');

main()
  .then(() => console.log('ok'))
  .catch(error => process.exit(console.error(error), 1));

async function main() {
  await basic();
  // await breaks();
  // await stdin();
}


async function basic() {
  const filename = __filename;

  let target = '';
  for await (const { data } of new lib(fs.createReadStream(filename))) {
    if (data) {
      // console.log(`data:`, data);
      target += data;
    }
  }

  const source = fs.readFileSync(filename, 'utf8');
  assert.equal(source, target);
}

async function stdin() {

  for await (const { data } of new lib(process.stdin)) {
    process.stdout.write(data)
  }

}
