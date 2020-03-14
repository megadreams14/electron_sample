import { app, BrowserWindow, Menu, Tray } from "electron";
import * as path from "path";

let tray: Tray;

export class TrayManager {
  static createTaskTray(browserWindow: BrowserWindow) {
    // LogManager.info(__filename, 'ファイルパス', path.resolve(__dirname, './icon.png'));
    tray = new Tray(path.resolve(__dirname, "./icon.png"));

    // タスクトレイに右クリックメニューを追加
    const contextMenu = Menu.buildFromTemplate([
      {
        label: "画面を表示",
        click: () => {
          // LogManager.info(__filename, '画面', `表示`)
          browserWindow.show();
        }
      },
      {
        label: "画面を非表示",
        click: () => {
          // LogManager.info(__filename, '画面', `非表示`)
          browserWindow.hide();
        }
      },
      {
        label: "アプリケーションの終了",
        role: "quit",
        click: () => {
          // LogManager.info(__filename, 'アプリケーション', `終了`)
          browserWindow.destroy();
        }
      }
    ]);
    tray.setContextMenu(contextMenu);

    // タスクトレイのツールチップをアプリ名に
    tray.setToolTip(app.name);
  }
}
