export function parse(script) {
  const story = {};
  let currentLabel = null;
  const lines = script.split(/\r?\n/);

  for (const line of lines) {
    if (line.trim() === "") continue;

    if (/^\w+:\s*$/.test(line)) {
      currentLabel = line.trim().slice(0, -1);
      story[currentLabel] = [];
    } else if (currentLabel !== null) {
      const trimmed = line.trim();

      if (trimmed.startsWith("say ")) {
        const text = trimmed.substring(4).trim();
        story[currentLabel].push({ type: "say", text });
      } else if (trimmed.startsWith("jump ")) {
        const target = trimmed.substring(5).trim();
        story[currentLabel].push({ type: "jump", target });
      }
    }
  }

  return story;
}
