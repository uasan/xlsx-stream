export async function* Iterator(writer) {
  try {
    while (writer.isDone === false) {
      if (writer.output.length === 0) {
        await writer.output;
      }

      if (writer.output.length) {
        yield writer.output.pull();
      }
    }

    if (writer.error) {
      throw writer.error;
    }
  } finally {
    if (writer.isDone === false) {
      writer.abort();
    }
  }
}
