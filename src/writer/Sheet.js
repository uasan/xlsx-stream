import { Readable } from 'node:stream';
import { SHEET_FOOTER } from './template/sheet.js';
import { headToXML } from './xml/header.js';
import { isArray, isObject } from './utils.js';
import { createColumn } from './xml/column.js';
import { rowToXML } from './xml/row.js';

export class Sheet {
  id = 0;
  count = 0;
  columns = [];

  name = '';
  writer = null;
  stream = null;

  constructor(writer, { name, columns, rows }) {
    this.writer = writer;
    this.stream = Readable({ read() {} });

    this.id = writer.sheets.length + 1;
    this.name = name || 'Sheet ' + this.id;

    if (isArray(columns)) {
      for (const column of columns)
        if (isObject(column)) {
          this.columns.push(createColumn(this, column));
        } else {
          throw new Error('Parameter sheets[].columns must be an array object');
        }
    } else {
      throw new Error('Parameter sheets[].columns must be an array');
    }

    this.stream.on('error', writer.abort.bind(writer));
    this.stream.push(headToXML(this), 'utf8');

    if (rows) {
      this.put(rows);
    }
  }

  write(values) {
    this.stream.push(rowToXML(this, values), 'utf8');
  }

  close() {
    this.stream.push(SHEET_FOOTER, 'utf8');
    this.stream.push(null);
  }

  async put(rows) {
    try {
      for await (const row of rows) this.write(row);
      this.close();
    } catch (error) {
      this.writer.abort(error);
    }
  }
}
