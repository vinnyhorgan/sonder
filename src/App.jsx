import { onMount, createSignal, onCleanup } from "solid-js";
import { basicSetup, EditorView } from "codemirror";
import { oneDark } from "@codemirror/theme-one-dark";
import { Menu, MenuItem, Submenu } from "@tauri-apps/api/menu";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import "./App.css";
import Split from "split.js";

function App() {
  let editorRef;
  let editorView;

  const [script, setScript] = createSignal(
    "main:\n    say Hello!\n    say How are you?\n    jump next\n\nnext:\n    say Bye!\n"
  );

  async function createMenu() {
    const newItem = await MenuItem.new({
      text: "New",
      id: "new",
      action: console.log("New clicked"),
    });

    const openItem = await MenuItem.new({
      text: "Open",
      id: "open",
      action: console.log("Open clicked"),
    });

    const quitItem = await MenuItem.new({
      text: "Quit",
      id: "quit",
      action: console.log("Quit clicked"),
    });

    const fileSubmenu = await Submenu.new({
      text: "File",
      items: [newItem, openItem, quitItem],
    });

    const aboutItem = await MenuItem.new({
      text: "About",
      id: "about",
      action: console.log("About clicked"),
    });

    const helpSubmenu = await Submenu.new({
      text: "Help",
      items: [aboutItem],
    });

    const menu = await Menu.new({
      items: [fileSubmenu, helpSubmenu],
    });

    await menu.setAsAppMenu();
  }

  async function showWindow() {
    await getCurrentWebviewWindow().show();
  }

  onMount(() => {
    if (editorRef) {
      editorView = new EditorView({
        doc: script(),
        extensions: [basicSetup],
        parent: editorRef,
      });

      editorView.dom.style.height = "100%";
    }

    Split(["#editor", "#preview"], {
      sizes: [50, 50],
      minSize: 200,
      gutterSize: 8,
      cursor: "col-resize",
    });

    createMenu();
    showWindow();
  });

  onCleanup(() => {
    if (editorView) {
      editorView.destroy();
    }
  });

  return (
    <div className="flex h-screen">
      <div id="editor" ref={editorRef} className="h-full overflow-auto"></div>
      <div
        id="preview"
        className="h-full bg-cover bg-center bg-[url('/park_winter.webp')]"
      ></div>
    </div>
  );
}

export default App;
