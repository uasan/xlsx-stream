import { SHEET_HEADER } from '../template/sheet.js';
import { escapeXML } from '../utils.js';
import { getCellId } from './cell.js';

const isHead = ({ head }) => !!head;

export function headToXML(sheet) {
  let xml = SHEET_HEADER;

  if (sheet.columns.some(isHead)) {
    sheet.count++;
    let cells = '';

    for (let i = 0; i < sheet.columns.length; i++) {
      const { head } = sheet.columns[i];

      if (head) {
        cells += `<c r="${getCellId(sheet.count, i)}" t="inlineStr" s="1"><is><t>${escapeXML(head)}</t></is></c>`;
      }
    }

    xml += `<row r="${sheet.count}" spans="1:1" x14ac:dyDescent="0.2">${cells}</row>`;
  }

  return xml;
}
