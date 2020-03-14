import { BrowserWindow } from 'electron';
import log from 'electron-log';
log.transports.file.level = 'info';
log.transports.console.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}';
// log.transports.file.file = `${APP_CONST.SETTING_PATH}/run.log`;

console.log = log.log;
console.log(log.transports.file.getFile());

export class LogManager {
  static log = log;

  static mainWindow: BrowserWindow;
  static setWindow(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  public static sendViewLog(logType: string, ...params: any[]) {
    if (this.mainWindow) {
      this.mainWindow.webContents.send('message', `[${logType}] ${JSON.stringify(params)}`);
    }
  }

  public static info(...params: any[]) {
    this.log.info(params);
    this.sendViewLog(`info`, params);
  }

  public static debug(...params: any[]) {
    this.log.debug(params);
    this.sendViewLog(`debug`, params);
  }

  public static warn(...params: any[]) {
    this.log.warn(params);
    this.sendViewLog(`warn`, params);
  }

  public static error(...params: any[]) {
    this.log.error(params);
    this.sendViewLog(`error`, params);
  }
}
