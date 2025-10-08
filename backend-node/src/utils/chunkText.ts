export function recursiveChunk(
  text: string,
  chunkSize = 500,    // approx number of words per chunk
  overlap = 50,       // words
  separators = ["\n\n", "\n", ". ", " "]
): string[] {
  const chunks: string[] = [];

  function splitRecursively(textPart: string, sepIndex = 0) {
    if (!textPart) return;
    if (textPart.split(/\s+/).length <= chunkSize) {
      chunks.push(textPart.trim());
      return;
    }

    const sep = separators[sepIndex] || "";
    const parts = sep ? textPart.split(sep) : [textPart];

    let current = "";
    for (const part of parts) {
      if ((current + sep + part).split(/\s+/).length > chunkSize) {
        if (current) chunks.push(current.trim());
        current = part;
      } else {
        current += sep + part;
      }
    }
    if (current) chunks.push(current.trim());

    // recursively split oversized chunks
    if (sepIndex + 1 < separators.length) {
      const oversized = [...chunks];
      chunks.length = 0;
      oversized.forEach(c => splitRecursively(c, sepIndex + 1));
    }
  }

  splitRecursively(text);

  // add overlap
  const finalChunks: string[] = [];
  for (let i = 0; i < chunks.length; i++) {
    if (i === 0) {
      finalChunks.push(chunks[i]);
    } else {
      const prevWords = chunks[i - 1].split(/\s+/).slice(-overlap).join(" ");
      finalChunks.push(prevWords + " " + chunks[i]);
    }
  }

  return finalChunks;
}
