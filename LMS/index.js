const { app, BrowserWindow, autoUpdater, dialog } = require('electron');
const path = require('path');

if (require('electron-squirrel-startup')) { // Обрабатывает создание/удаление ярлыков в Windows при установке/удалении.
  app.quit();
}

const createWindow = () => {
  const main = new BrowserWindow({              // Создает окно
    width: 800,
    height: 600,
    backgroundColor: '#2e2c29',                 // Серый фон при запуске
    // icon: path.join(__dirname, 'book.ico'),  // Иконка (не нужна при компиляции)
    webPreferences: {
      nodeIntegration: true,                    // Разрешить использовать nodejs
    },
  });

  main.loadFile(path.join(__dirname, 'index.html')); // Запуск определенного файла при запуске
  main.setMenuBarVisibility(false);                  // Убрать верхний тулбар
  // main.webContents.openDevTools();                // Открытие консоли при запуске
}

app.on('ready', createWindow); // Запускает программу при готовности

app.on('window-all-closed', () => { // Для Mac OS
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => { // Для OS X
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});