
import { ipcMain, dialog, BrowserWindow } from 'electron';
import { autoUpdater } from 'electron-updater';
import { LogManager } from './logManager';
const DEFAULT_AUTO_UPDATE = true;

autoUpdater.logger = LogManager.log;

autoUpdater.autoDownload = DEFAULT_AUTO_UPDATE;
// アップデートがある場合
autoUpdater.addListener('update-available', (event) => {
  LogManager.info('[AutoUpdate]', '*** update-available ***');
  AutoUpdateManager.onUpdateAvailable(event);
});
autoUpdater.addListener('update-not-available', (event) => {
  LogManager.info('[AutoUpdate]', '*** update-not-available ***');
  AutoUpdateManager.onUpdateNotAvailable(event);
});
autoUpdater.on('download-progress', (progressObj) => {
  LogManager.info('[AutoUpdate]', '*** download-progress ***');
  AutoUpdateManager.onDownloadProgress(progressObj);
 });
 
// ダウンロード完了
autoUpdater.addListener('update-downloaded', (event,releaseNotes,releaseName,releaseDate,updateURL) => {
  LogManager.info('[AutoUpdate]', '*** update-downloaded ***');
  AutoUpdateManager.onUpdateDownloaded(event,releaseNotes,releaseName,releaseDate,updateURL);
});
 
autoUpdater.addListener('before-quit-for-update', ()=>{
  LogManager.info('[AutoUpdate]', '*** before-quit-for-update ***');
});
// アップデートに何か失敗した場合
autoUpdater.addListener('error', (error) => {
  LogManager.info('[AutoUpdate]', '*** error ***');
  LogManager.info(error);
  AutoUpdateManager.onError(error);

});


export class AutoUpdateManager {
  static isAutoUpdate: boolean = DEFAULT_AUTO_UPDATE;
  static mainWindow: BrowserWindow;

  static changeAutoUpdate(isAutoUpdate = DEFAULT_AUTO_UPDATE) {
    this.isAutoUpdate = isAutoUpdate;
    autoUpdater.autoDownload = isAutoUpdate;
  }

  static setWindow(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  static async checkForUpdates() {
    // 最新バージョンがあるか、チェック開始
    if (this.isAutoUpdate) {
      return autoUpdater.checkForUpdatesAndNotify();
    }
    return autoUpdater.checkForUpdates();
  }

  // アップデートがある場合の処理
  static async onUpdateAvailable(event: any) {
    LogManager.info(`[${this.name}] onUpdateAvailable`);

    if (this.isAutoUpdate) {
      // checkForUpdatesAndNotify の場合は、確認と同時にあればDLまで行われる。
      // そのため、ここで明示的に呼び出す必要はない
      // this.startDownloadUpdate();
      return true;
    } else {
      let msgBox = await dialog.showMessageBox(this.mainWindow, {
                          type: 'info',
                          title: '[CDC連携アプリ] アップデートが見つかりました',
                          message: '今すぐアプリケーションを更新しますか？',
                          buttons: ['はい', 'いいえ']
                        });
      if (msgBox.response === 0) {
        autoUpdater.downloadUpdate()
      }
    }
  }
  // アップデートがなかった場合
  static async onUpdateNotAvailable(event: any) {
    LogManager.info(`[${this.name}] onUpdateNotAvailable`);
    if (this.isAutoUpdate) {
    } else {
      await dialog.showMessageBox(this.mainWindow, {
              type: 'info',
              title: '[CDC連携アプリ]',
              message: '現在のバージョンは最新です。',
            });
    }
  }

  // ダウンロードを開始する
  static startDownloadUpdate() {
    LogManager.info(`[${this.name}] startDownloadUpdate`);
    autoUpdater.downloadUpdate()
  }

  // ダウンロード中
  static onDownloadProgress(progressObj:any) {
    LogManager.info(`[${this.name}] ${Math.floor(progressObj.percent)}%`);
    LogManager.info('update-download-progress', Math.floor(progressObj.percent) + '%');
  }

  // ダウンロード完了
  static async onUpdateDownloaded(event: any, releaseNotes: string, releaseName: string, releaseDate: string, updateURL: string) {
    LogManager.info(`[${this.name}] onUpdateDownloaded`);
    LogManager.info(`releaseNotes=${releaseNotes}`);
    LogManager.info(`releaseName=${releaseName}`);
    LogManager.info(`releaseDate=${releaseDate}`);
    LogManager.info(`updateURL=${updateURL}`);

    if (this.isAutoUpdate) {
      this.startQuitAndInstall();
    } else {
      // 確認ダイアログを出してからインストールを開始することも可能
      await dialog.showMessageBox(this.mainWindow, {
          type: 'info',
          title: '[CDC連携アプリ] ダウンロードが完了しました。',
          message: '最新版を反映するために、アプリケーションを再起動します。'
        });
      this.startQuitAndInstall();
    }
  }

  // アプリケーションを終了してアップデートを開始
  static startQuitAndInstall() {
    LogManager.info(`[${this.name}] startQuitAndInstall`);
    autoUpdater.quitAndInstall();
  }

  static onError(error: any) {
    LogManager.info(`[${this.name}] onError`);
    LogManager.info(error == null ? "unknown" : (error.stack || error).toString());

    if (this.isAutoUpdate) {
    } else {
      dialog.showErrorBox('Error: ', error == null ? "unknown" : (error.stack || error).toString())
    }
  }

}