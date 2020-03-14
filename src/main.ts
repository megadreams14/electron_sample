import { app, powerSaveBlocker, BrowserWindow } from 'electron';
import { WindowManager, TrayManager, AutoUpdateManager, LogManager } from './lib';
import * as APP_CONST from './const';

import * as path from 'path';

// 既に起動している確認。起動している場合　`second-instance` イベントが発火する
// app.requestSingleInstanceLock();

// 既に起動していた場合落とす
app.on('second-instance', () => {
  // app.releaseSingleInstanceLock();
  // app.quit();
  // expressApp.destroy();
});

// アプリが落ちた時にエラーを表示しておくようにする
process.on('uncaughtException', function(err) {
  LogManager.error('electron:event:uncaughtException');
  LogManager.error(err);
  LogManager.error(err.stack);
  app.quit();
});

let mainWindow: BrowserWindow;
let powerSaveId: number;

function ready() {
  // スリープモードでもアプリを止めないようにする
  powerSaveId = powerSaveBlocker.start('prevent-app-suspension');
  // Windowsを表示
  mainWindow = WindowManager.createWindow();
  // - タスクトレイ設置
  TrayManager.createTaskTray(mainWindow);
  // - ログのセット
  LogManager.setWindow(mainWindow);
  // - AutoUpdate
  AutoUpdateManager.setWindow(mainWindow);

  setTimeout(() => {
    AutoUpdateManager.checkForUpdates();
    mainWindow.webContents.send('onAppVersion', APP_CONST.APP_VERSION);
  }, 3000);
}

app.commandLine.appendSwitch('disable-renderer-backgrounding');

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', ready);

app.on('before-quit', () => {
  powerSaveBlocker.stop(powerSaveId);
  app.exit();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it"s common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    mainWindow = WindowManager.createWindow();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
