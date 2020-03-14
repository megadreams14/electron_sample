
export const PREFIX = process.env.FILE_PREFIX;
export const NODE_ENV = process.env.NODE_ENV;
export const SETTING_PATH = `${process.env[process.platform == "win32" ? "USERPROFILE" : "HOME"]}/.cdc`;
export const APP_VERSION = process.env.npm_package_version;
