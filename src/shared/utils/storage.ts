export enum StorageKeys {
  theme = 'theme',
}

export default class StorageUtil {
  static getItem(key: StorageKeys) {
    return localStorage.getItem(key);
  }

  static setItem(key: StorageKeys, value: string) {
    return localStorage.setItem(key, value);
  }
}
