import { createEffect } from "solid-js";
import { basicSetup, EditorView } from "codemirror";
import { Menu, MenuItem, Submenu } from "@tauri-apps/api/menu";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import "./App.css";

function App() {
  let editorRef = null;

  createEffect(() => {
    if (editorRef) {
      const view = new EditorView({
        doc: "console.log('Hello world!')",
        extensions: [basicSetup],
        parent: editorRef,
      });
    }
  });

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

  createMenu();
  showWindow();

  return <div ref={editorRef}></div>;
}

export default App;
