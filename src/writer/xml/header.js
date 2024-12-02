import { SHEET_HEADER } from '../template/sheet.js';
import { escapeXML } from '../utils.js';
import { getCellId } from './cell.js';

export function headToXML(sheet) {
  let xml = SHEET_HEADER;
  let cells = '';

  for (let i = 0; i < sheet.columns.length; i++) {
    const { head } = sheet.columns[i];
    if (head) {
      cells += `<c r="${getCellId(sheet.count, i)}" t="inlineStr" s="6"><is><t>${escapeXML(head)}</t></is></c>`;
    }
  }

  if (cells) {
    xml += `<row r="${++sheet.count}" spans="1:${sheet.columns.length}" x14ac:dyDescent="0.2">${cells}</row>`;
  }

  return xml;
}
