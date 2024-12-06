import { openSync, writeSync, closeSync, unlinkSync } from 'node:fs';

import { Sheet } from './writer/Sheet.js';
import { Iterator } from './writer/Iterator.js';
import { Output } from './writer/Output.js';
import { isArray, isObject } from './writer/utils.js';

export class WriterXLSX {
  error = null;
  isDone = false;

  sheets = [];
  output = new Output(this);
  iterator = Iterator(this);

  constructor({ sheets } = {}) {
    if (!isArray(sheets)) {
      throw new Error('Parameter sheets must be an array');
    }

    if (!sheets.length) {
      throw new Error('Parameter sheets empty array');
    }

    for (const sheet of sheets)
      if (isObject(sheet)) {
        this.output.addSheet(new Sheet(this, sheet));
      } else {
        throw new Error('Parameter sheets must be an array object');
      }
  }

  abort(error) {
    if (this.isDone === false) {
      this.error = error;
      this.isDone = true;

      for (const sheet of this.sheets) {
        sheet.stream.destroy(error);
      }

      this.output.reject(error);
    }
  }

  [Symbol.asyncIterator]() {
    return this.iterator;
  }

  async saveToFile(path) {
    const fd = openSync(path, 'w');

    try {
      for await (const chunk of this.iterator) writeSync(fd, chunk);
    } catch (error) {
      this.abort(error);
      throw error;
    } finally {
      closeSync(fd);
      if (this.error) unlinkSync(path);
    }
  }
}
