import ZipStream from 'zip-stream';
import { Queue } from './Queue.js';
import { STYLE_SHEET } from './template/styles.js';
import { noop, BUFFER_LENGTH, BUFFER_MAX_LENGTH, sortSheets } from './utils.js';
import {
  RELS,
  setWorkbook,
  setContentTypes,
  setWorkbookRels,
} from './template/workbook.js';

export class Output {
  length = 0;

  queue = null;
  writer = null;

  reject = noop;
  resolve = noop;

  zip = new ZipStream({ zlib: { level: 4, strategy: 0 } });

  buffer = new ArrayBuffer(BUFFER_LENGTH, { maxByteLength: BUFFER_MAX_LENGTH });
  bytes = new Uint8Array(this.buffer);

  constructor(writer) {
    this.writer = writer;

    this.zip
      .on('warning', console.warn)
      .on('data', this.onData.bind(this))
      .on('finish', this.onEnd.bind(this))
      .on('error', writer.abort.bind(writer));

    this.queue = new Queue(this);
  }

  addSheet(sheet) {
    sheet.id = this.writer.sheets.push(sheet);
    this.queue.enqueue(sheet.stream, `xl/worksheets/sheet${sheet.id}.xml`);
  }

  onData(bytes) {
    const { length } = this;

    this.length += bytes.byteLength;

    if (this.length > this.buffer.byteLength) {
      this.buffer.resize(this.length);
    }

    this.bytes.set(bytes, length);

    if (this.resolve !== noop) {
      this.resolve();
      this.resolve = noop;
    }
  }

  onEnd() {
    this.writer.isDone = true;
    this.resolve();
  }

  pull() {
    const { length } = this;
    //console.log('PULL', length);

    this.length = 0;
    this.buffer.resize(BUFFER_LENGTH);

    return this.bytes.slice(0, length);
  }

  then(resolve, reject) {
    this.reject = reject;
    this.resolve = resolve;
  }

  finish() {
    this.writer.sheets.sort(sortSheets);
    this.queue
      .enqueue(RELS, '_rels/.rels')
      .enqueue(STYLE_SHEET, 'xl/styles.xml')
      .enqueue(setWorkbook(this.writer), 'xl/workbook.xml')
      .enqueue(setContentTypes(this.writer), '[Content_Types].xml')
      .enqueue(setWorkbookRels(this.writer), 'xl/_rels/workbook.xml.rels');
  }
}
