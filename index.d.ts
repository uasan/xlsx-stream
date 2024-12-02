interface ColumnOptions{
  head?: string;
  type: StringConstructor | NumberConstructor | DateConstructor | BigInt | BooleanConstructor;
}

interface SheetOptions {
  name?: string;
  rows?: any[];
  columns: ColumnOptions[];
}

interface  WriterXLSXOptions {
  sheets: SheetOptions[]
}

export declare class WriterXLSX {
  constructor(options: WriterXLSXOptions);
}