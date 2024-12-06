export const BUFFER_LENGTH = 131072;
export const BUFFER_MAX_LENGTH = 268435456;

export function noop() {}

export const { isArray } = Array;

export const isDone = ({ isDone }) => isDone;
export const isObject = value => value !== null && typeof value === 'object';

export const escapeXML = data =>
  String(data)
    .replaceAll('&', '&amp;')
    .replaceAll('>', '&gt;')
    .replaceAll('<', '&lt;')
    .replaceAll("'", '&apos;')
    .replaceAll('"', '&quot;');

export const sortSheets = (a, b) =>
  a.index === b.index ? a.id - b.id : a.index - b.index;

export function setSheetPageName(sheet) {
  let name = sheet.name;
  let page = ' ' + sheet.page;

  if (name.length + page.length > 31) {
    name.slice(0, 31 - (name.length + page.length));
  }

  sheet.name = name + page;
  return sheet;
}
