
/**
 * Processes a streaming response from the server.
 * @param body - The response body stream.
 * @param onChunk - Callback function for each text chunk.
 */
export async function processStreamResponse(
  body: ReadableStream<Uint8Array> | null,
  onChunk: (chunk: string) => void
): Promise<void> {
  if (!body) return;

  const reader = body.getReader();
  const decoder = new TextDecoder("utf-8");
  let done = false;

  try {
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;

      if (value) {
        const chunk = decoder.decode(value, { stream: true });
        onChunk(chunk);
      }
    }
  } catch (error) {
    console.error("Error processing stream:", error);
    throw error;
  } finally {
    reader.releaseLock();
  }
}
