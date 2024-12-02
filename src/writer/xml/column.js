import { escapeXML } from '../utils.js';
import { getId } from './cell.js';
import { getDate } from './date.js';

function numberToXML(value, index) {
  return `<c ${this.getId(index)} t="n"><v>${value}</v></c>`;
}

function bigintToXML(value, index) {
  return `<c ${this.getId(index)} t="n"><v>${value}</v></c>`;
}

function dateToXML(value, index) {
  return `<c ${this.getId(index)} t="n" s="7"><v>${getDate(value)}</v></c>`;
}

function booleanToXML(value, index) {
  return `<c ${this.getId(index)} t="b"><v>${value ? '1' : '0'}</v></c>`;
}

function stringToXML(value, index) {
  return `<c ${this.getId(index)} t="inlineStr" s="6"><is><t>${escapeXML(value)}</t></is></c>`;
}

export function createColumn(sheet, { type, head }) {
  let toXML = stringToXML;

  switch (type) {
    case Number:
      toXML = numberToXML;
      break;

    case BigInt:
      toXML = bigintToXML;
      break;

    case Date:
      toXML = dateToXML;
      break;

    case Boolean:
      toXML = booleanToXML;
      break;
  }

  return { sheet, head, getId, toXML };
}
