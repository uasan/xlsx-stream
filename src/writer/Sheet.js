import { Readable } from 'node:stream';
import { SHEET_FOOTER } from './template/sheet.js';
import { headToXML } from './xml/header.js';
import { isArray, isDone, isObject, setSheetPageName } from './utils.js';
import { createColumn } from './xml/column.js';
import { rowToXML } from './xml/row.js';

export class Sheet {
  id = 1;
  page = 1;

  count = 0;
  index = 0;
  columns = [];

  name = '';
  isDone = false;

  writer = null;
  stream = null;

  constructor(writer, { name, columns, rows }) {
    this.writer = writer;

    this.index = writer.sheets.length;
    this.name = name || 'Sheet ' + this.index + 1;

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

    this.openStream();

    if (rows) {
      this.put(rows);
    }
  }

  openStream() {
    this.stream = Readable({ read() {} });
    this.stream.on('error', this.writer.abort.bind(this.writer));
    this.stream.push(headToXML(this), 'utf8');
  }

  closeStream() {
    this.stream.push(SHEET_FOOTER, 'utf8');
    this.stream.push(null);
  }

  write(values) {
    this.stream.push(rowToXML(this, values), 'utf8');

    if (this.count > 1048575) {
      this.nextPage();
    }
  }

  close() {
    this.isDone = true;
    this.closeStream();

    if (this.writer.sheets.every(isDone)) {
      this.writer.output.finish();
    }
  }

  async put(rows) {
    try {
      for await (const row of rows) this.write(row);
      this.close();
    } catch (error) {
      this.writer.abort(error);
    }
  }

  nextPage() {
    this.page++;
    this.count = 0;

    this.closeStream();
    this.openStream();

    this.writer.output.addSheet(setSheetPageName(Object.create(this)));
  }
}
