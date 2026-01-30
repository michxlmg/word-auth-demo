/**
 * Processes a Server-Sent Events (SSE) streaming response from the server.
 * Parses SSE format (event: ..., data: ...) and invokes onChunk for each data line.
 * @param body - The response body stream (ReadableStream<Uint8Array>).
 * @param onChunk - Callback function for each parsed data chunk.
 */
export async function processStreamResponse(
  body: ReadableStream<Uint8Array>,
  onChunk: (chunk: string) => void,
): Promise<void> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let eventType = "message";
  let dataLines: string[] = [];
  let doneSeen = false;

  const flushEvent = () => {
    const data = dataLines;
    const currentEvent = eventType;
    eventType = "message";
    dataLines = [];

    if (data.length === 0) return;

    const joined = data.join("\n");
    if (joined.trim() === "[DONE]") {
      doneSeen = true;
      return;
    }

    if (currentEvent === "error") {
      throw new Error(joined || "Error del asistente");
    }

    // Invoke onChunk for each data line
    for (const part of data) {
      if (part === "") {
        onChunk("\n");
      } else {
        onChunk(part);
      }
    }
  };

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      let newlineIndex;
      // Process all complete lines in the buffer
      while ((newlineIndex = buffer.indexOf("\n")) >= 0) {
        const line = buffer.slice(0, newlineIndex);
        buffer = buffer.slice(newlineIndex + 1);
        const cleanLine = line.endsWith("\r") ? line.slice(0, -1) : line;

        if (cleanLine === "") {
          flushEvent();
          continue;
        }

        if (cleanLine.startsWith("event:")) {
          eventType = cleanLine.slice(6).trim() || "message";
          continue;
        }

        if (!cleanLine.startsWith("data:")) continue;

        let content = cleanLine.slice(5);
        if (content.startsWith(" ")) {
          content = content.slice(1);
        }
        dataLines.push(content);
      }
    }

    // Process remaining buffer
    if (buffer.length > 0) {
      const cleanLine = buffer.endsWith("\r") ? buffer.slice(0, -1) : buffer;
      if (cleanLine.startsWith("event:")) {
        eventType = cleanLine.slice(6).trim() || "message";
      } else if (cleanLine.startsWith("data:")) {
        let content = cleanLine.slice(5);
        if (content.startsWith(" ")) content = content.slice(1);
        dataLines.push(content);
      }
    }

    flushEvent();
    if (!doneSeen) {
      throw new Error("La respuesta del asistente se interrumpió");
    }
  } catch (error) {
    console.error("Error processing stream:", error);
    throw error;
  } finally {
    reader.releaseLock();
  }
}
