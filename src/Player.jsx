import { createSignal, onMount } from "solid-js";
import { parse } from "./parser";

function Player(props) {
  const story = parse(props.script);

  const [currentLabel, setCurrentLabel] = createSignal("main");
  const [currentIndex, setCurrentIndex] = createSignal(0);
  const [displayText, setDisplayText] = createSignal("");
  const [isTyping, setIsTyping] = createSignal(false);

  let typingTimeout;

  function typeText(text, onComplete) {
    setIsTyping(true);
    setDisplayText("");
    let i = 0;

    function typeNext() {
      if (i < text.length) {
        setDisplayText((prev) => prev + text[i]);
        i++;
        typingTimeout = setTimeout(typeNext, 50);
      } else {
        setIsTyping(false);
        if (onComplete) onComplete();
      }
    }

    typeNext();
  }

  function runCommand() {
    const label = currentLabel();
    const index = currentIndex();
    const commands = story[label];
    if (!commands || index >= commands.length) {
      console.log("end of label:", label);
      return;
    }

    const cmd = commands[index];
    if (cmd.type === "say") {
      typeText(cmd.text);
    } else if (cmd.type === "jump") {
      if (story[cmd.target]) {
        setCurrentLabel(cmd.target);
        setCurrentIndex(0);
        runCommand();
      } else {
        console.error("label not found:", cmd.target);
      }
    }
  }

  function handleClick() {
    if (isTyping()) {
      clearTimeout(typingTimeout);
      const label = currentLabel();
      const index = currentIndex();
      const cmd = story[label][index];
      if (cmd && cmd.type === "say") {
        setDisplayText(cmd.text);
      }
      setIsTyping(false);
      return;
    }

    const label = currentLabel();
    const commands = story[label];
    if (commands && currentIndex() < commands.length - 1) {
      setCurrentIndex(currentIndex() + 1);
      runCommand();
    } else {
      console.log("finished all commands in label:", label);
    }
  }

  onMount(() => {
    runCommand();
  });

  return (
    <div
      class="bg-black/80 text-white w-96 h-screen p-4 absolute -top-10 right-20 rounded-lg shadow-2xl border border-gray-600"
      onClick={handleClick}
    >
      <p class="pt-10">{displayText()}</p>
    </div>
  );
}

export default Player;
