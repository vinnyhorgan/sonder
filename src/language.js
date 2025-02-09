import { StreamLanguage } from "@codemirror/language";

const parser = {
  startState() {
    return {};
  },

  token(stream, state) {
    if (stream.eatSpace()) return null;

    if (stream.match(/^(jump|say)\b/)) {
      return "keyword";
    }

    if (stream.match(/^[A-Za-z_]\w*:/)) {
      return "tag";
    }

    stream.next();
    return null;
  },
};

export const language = StreamLanguage.define(parser);
