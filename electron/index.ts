// Native
import { join } from "path";

// Packages
import { app, BrowserWindow, ipcMain, IpcMainEvent } from "electron";
import isDev from "electron-is-dev";
import path from "path";
import { MySqlConnetionManager } from "./manager/mysqlConnectionManager";
import { CreateMysqlConnectionArgs } from "./common/event-types";

require("electron-reload")(__dirname, {
    electron: path.join(__dirname, "../node_modules", ".bin", "electron"),
});
console.log(path.join(__dirname, "../node_modules", ".bin", "electron"));

const height = 600;
const width = 900;

const globalManager: {
    mysqlConnectionManager: MySqlConnetionManager | null;
} = {
    mysqlConnectionManager: null,
};

function createWindow() {
    // Create the browser window.
    const window = new BrowserWindow({
        width,
        height,
        //  change to false to use AppBar
        frame: false,
        show: true,
        resizable: true,
        fullscreenable: true,
        webPreferences: {
            preload: join(__dirname, "preload.js"),
        },
    });

    const port = process.env.PORT || 3000;
    const url = isDev ? `http://localhost:${port}` : join(__dirname, "../src/out/index.html");

    // and load the index.html of the app.
    if (isDev) {
        window?.loadURL(url);
    } else {
        window?.loadFile(url);
    }
    // Open the DevTools.
    // window.webContents.openDevTools();

    // For AppBar
    ipcMain.on("minimize", () => {
        // eslint-disable-next-line no-unused-expressions
        window.isMinimized() ? window.restore() : window.minimize();
        // or alternatively: win.isVisible() ? win.hide() : win.show()
    });
    ipcMain.on("maximize", () => {
        // eslint-disable-next-line no-unused-expressions
        window.isMaximized() ? window.restore() : window.maximize();
    });

    ipcMain.on("close", () => {
        window.close();
    });
    initGlobalManager();
}

function initGlobalManager() {
    globalManager.mysqlConnectionManager = new MySqlConnetionManager();
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow();

    app.on("activate", () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
        // 初始化 全局manager
    });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// listen the channel `message` and resend the received message to the renderer process
ipcMain.on("message", async (event: IpcMainEvent, message: any) => {
    console.log(message);

    // const msyqlConnection = new MySqlConnection({
    //     host: "localhost",
    //     port: 3306,
    //     user: "root",
    //     password: "root",
    // });
    // await msyqlConnection.connect();
    // // new MySqlConnection({
    // //     host: "localhost",
    // //     port: 3306,
    // //     user: "root",
    // //     password: "root",
    // // });

    setTimeout(() => event.sender.send("message", "hi from electron"), 500);
});

ipcMain.on("create_mysql_connection", async (event: IpcMainEvent, args: CreateMysqlConnectionArgs) => {
    const resp = await globalManager.mysqlConnectionManager?.createMySqlConnection({
        connectionName: args.connectionName,
    });

    if (resp && resp?.err) {
        return event.sender.send("server_error", {
            message: `${resp.err.message}`,
        });
    }

    const databases = await globalManager.mysqlConnectionManager
        ?.getMySqlConnection(args.connectionName)
        ?.listDatabases();
    return event.sender.send("create_mysql_connection", {
        status: 1,
        databases: databases,
    });
});
