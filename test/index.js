const lib = require('..');
const fs = require('fs');
const { fork } = require('child_process')
const assert = require('assert');

main()
  .then(() => console.log('ok'))
  .catch(error => {
    console.error(error);
    process.exitCode = 1;
  });

async function main() {
  await basic();
  // await breaks();
  // await stdin();
  // await stdout();
}


async function basic() {
  const filename = __filename;

  let target = '';
  for await (const data of lib(fs.createReadStream(filename, { encoding: 'utf8' }))) {
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

async function stdout() {
  const cp = fork('test/stdout.js', { encoding: 'utf8', stdio: 'pipe' });
  let i = 0
  for await (let data of lib(cp.stdout.setEncoding('utf8'))) {
    data = parseInt(data)
    if (data !== i) {
      console.log({ i, data });
      throw new Error('!!')
    } else {
      console.log(data);
    }
    await new Promise(_ => setTimeout(_, 110))
    i++;
  }

}
