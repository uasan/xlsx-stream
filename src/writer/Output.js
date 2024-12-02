import ZipStream from 'zip-stream';
import { setZipFiles } from './zip.js';
import { noop, BUFFER_LENGTH, BUFFER_MAX_LENGTH } from './utils.js';

export class Output {
  length = 0;
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
      .on('end', this.onEnd.bind(this))
      .on('error', writer.abort.bind(writer));
  }

  init() {
    setZipFiles(this);
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
}
