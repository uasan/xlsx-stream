export class Queue extends Array {
  zip = null;
  writer = null;
  isProcessing = false;

  constructor({ writer, zip }) {
    super();
    this.zip = zip;
    this.writer = writer;
  }

  entry(source, name) {
    this.zip.entry(source, { name }, this.dequeue);
  }

  enqueue(source, name) {
    if (this.isProcessing === false) {
      this.isProcessing = true;
      this.entry(source, name);
    } else {
      this.push(source, name);
    }
    return this;
  }

  dequeue = error => {
    if (error) {
      this.writer.abort(error);
    } else if (this.length) {
      this.entry(this.shift(), this.shift());
    } else {
      this.zip.finalize();
    }
  };
}
