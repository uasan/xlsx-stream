import { STYLE_SHEET } from './template/styles.js';
import {
  RELS,
  setWorkbook,
  WORKBOOK_RELS,
  CONTENT_TYPES,
} from './template/workbook.js';

class Queue extends Array {
  zip = null;
  writer = null;

  constructor(writer, zip) {
    super();
    this.zip = zip;
    this.writer = writer;
  }

  entry(source, name) {
    this.zip.entry(source, { name }, this.dequeue);
  }

  enqueue(source, name) {
    this.push(source, name);
    return this;
  }

  dequeue = error => {
    if (error) {
      this.writer.abort(error);
    } else if (this.length) {
      this.entry(this.shift(), this.shift());
    } else {
      this.zip.finalize();
    }
  };

  end = this.dequeue;
}

export function setZipFiles({ writer, zip }) {
  const queue = new Queue(writer, zip)
    .enqueue(CONTENT_TYPES, '[Content_Types].xml')
    .enqueue(RELS, '_rels/.rels')
    .enqueue(setWorkbook(writer), 'xl/workbook.xml')
    .enqueue(WORKBOOK_RELS, 'xl/_rels/workbook.xml.rels')
    .enqueue(STYLE_SHEET, 'xl/styles.xml');

  for (const sheet of writer.sheets) {
    queue.enqueue(sheet.stream, `xl/worksheets/sheet${sheet.id}.xml`);
  }

  queue.end();
}
