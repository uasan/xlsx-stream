import { WriterXLSX } from '../WriterXLSX.js';

const writer = new WriterXLSX({
  sheets: [
    {
      name: 'My test',
      columns: [
        { head: 'Text', type: String },
        { head: 'Number', type: Number },
        { head: 'Date', type: Date },
        { head: 'Boolean', type: Boolean },
      ],
    },
  ],
});

async function test() {
  console.time('WRITE');

  const sheet = writer.sheets[0];

  for (let i = 0; i < 1000000; i++) {
    sheet.write(['AAA', i, i ? new Date() : new Date(), i > 10]);
  }

  sheet.close();

  console.timeEnd('WRITE');
}

test().catch(console.error);

try {
  console.time('READ');

  //await writer.saveToFile('./test.xlsx');

  //for await (const chunk of writer) {}

  console.timeEnd('READ');
} catch (error) {
  console.error(error);
}
