import { Menu, MenuItem, Submenu } from "@tauri-apps/api/menu";
import "./App.css";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";

function App() {
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

  return <h1 class="text-3xl font-bold underline">Hello world!</h1>;
}

export default App;
