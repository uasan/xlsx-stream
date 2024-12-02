const baseString = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function getCellId(rowIndex, cellIndex) {
  let position = 0;
  let cellXPosition = '';
  let remaining = cellIndex;

  do {
    position = remaining % baseString.length;
    cellXPosition = baseString[position] + cellXPosition;
    remaining = Math.floor(remaining / baseString.length) - 1;
  } while (remaining >= 0);

  return cellXPosition + rowIndex;
}

export function getId(index) {
  return 'r="' + getCellId(this.sheet.count, index) + '"';
}
