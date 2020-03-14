import { BrowserWindow, dialog } from 'electron';
import * as path from 'path';

export class WindowManager {
  static createWindow() {
    // Create the browser window.
    let browserWindow = new BrowserWindow({
      height: 600,
      webPreferences: {
        // preload: path.join(__dirname, "preload.js"),
        nodeIntegration: true,
      },
      width: 800,
    });

    // and load the index.html of the app.
    browserWindow.loadFile(path.join(__dirname, 'index.html'));

    // Open the DevTools.
    browserWindow.webContents.openDevTools();

    browserWindow.on('close', async (event: any) => {
      let msgBox = await dialog.showMessageBox(browserWindow, {
        type: 'info',
        title: '[CDC連携アプリ] アプリケーションを閉じますか？',
        message: 'アプリを終了すると、連携が停止してしまいます。それでもよいですか？',
        buttons: ['はい', 'いいえ'],
      });
      if (msgBox.response === 1) {
        // Unlike usual browsers that a message box will be prompted to users, returning
        // a non-void value will silently cancel the close.
        // It is recommended to use the dialog API to let the user confirm closing the
        // application.
        event.returnValue = false; // equivalent to `return false` but not recommended
      }
    });

    // Emitted when the window is closed.
    browserWindow.on('closed', () => {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      browserWindow = null;
    });

    return browserWindow;
  }
}
