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
    {
      name: 'Next Sheet',
      columns: [
        {
          type: String,
        },
      ],
    },
  ],
});

async function test() {
  console.time('WRITE');

  const sheet1 = writer.sheets[0];
  for (let i = 0; i < 100; i++) {
    sheet1.write(['AAA', i, i ? new Date() : new Date(), i > 10]);
  }
  sheet1.close();

  const sheet2 = writer.sheets[1];
  for (let i = 0; i < 100; i++) {
    sheet2.write(['' + i]);
  }
  sheet2.close();

  console.timeEnd('WRITE');
}

test().catch(console.error);

try {
  console.time('READ');

  await writer.saveToFile('../../../Downloads/1.xlsx');

  // for await (const chunk of writer) {
  //   chunk;
  // }

  console.timeEnd('READ');
} catch (error) {
  console.error(error);
}
