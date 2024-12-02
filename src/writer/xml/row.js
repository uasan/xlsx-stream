export function rowToXML(sheet, values) {
  let xml = `<row r="${++sheet.count}" spans="1:${sheet.columns.length}" x14ac:dyDescent="0.2">`;

  for (let i = 0; i < values.length; i++) {
    if (values[i] != null) {
      xml += sheet.columns[i].toXML(values[i], i);
    }
  }

  return xml + '</row>';
}
