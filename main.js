const electron = require("electron");

const url = require("url");
const path = require("path");

const { app, BrowserWindow, Menu, ipcMain } = electron;

//set environment to production

process.env.NODE_ENV = "production";

let mainWindow;
let addWindow;

app.on("ready", () => {
  //create new window
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "mainwindow.html"),
      protocol: "file:",
      slashes: true
    })
  );

  // quit all windows when main windows is closed

  mainWindow.on("closed", () => {
    app.quit();
  });

  // build menu
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

  //insert menu
  Menu.setApplicationMenu(mainMenu);
});

// create add window

function createAddWindow() {
  //create new window
  addWindow = new BrowserWindow({
    width: 400,
    height: 400,
    title: "Add Shopping List Item",
    webPreferences: { nodeIntegration: true }
  });

  addWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "addWindow.html"),
      protocol: "file:",
      slashes: true
    })
  );

  addWindow.on("closed", () => {
    addWindow = null;
  });
}

//catch item:add

ipcMain.on("item:add", (e, item) => {
  mainWindow.webContents.send("item:add", item);
});

// create Menu Template

const mainMenuTemplate = [
  {
    label: "File",
    submenu: [
      {
        label: "Add Item",
        click() {
          createAddWindow();
        }
      },
      {
        label: "Clear Items",
        click() {
          mainWindow.webContents.send("item:clear");
        }
      },
      {
        label: "Quit",
        accelerator: "Ctrl+Q",
        click() {
          app.quit();
        }
      }
    ]
  }
];

// add developer tools

if (process.env.NODE_ENV !== "production") {
  mainMenuTemplate.push({
    label: "Developer Tools",
    submenu: [
      {
        label: "Toggle Dev Tools",
        accelerator: "Ctrl+D",
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        }
      },
      { role: "reload" }
    ]
  });
}
