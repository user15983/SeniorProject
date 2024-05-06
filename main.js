const {app, BrowserWindow, ipcMain, BrowserView} = require('electron');
const { clear } = require('node:console');
const path = require('node:path');

if (require('electron-squirrel-startup')) app.quit();

const buttonUrls = [
    'https://www.fourseasons.com/northsandiego/dining/restaurants/seasons_restaurant/breakfast/',
    'https://www.fourseasons.com/northsandiego/dining/restaurants/seasons_restaurant/lunch/',
    'https://www.fourseasons.com/northsandiego/dining/restaurants/seasons_restaurant/dinner/',
];

const viewPrefs = {
    sandbox: true,
    disableDialogs: true,
    webPreferences: {
        preload: path.join(__dirname, 'browser-preload.js')
    }
}

const createWindow = () => {
    const win = new BrowserWindow({ 
        minWidth: 600,
        minHeight: 400,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        },
        fullscreen: true,
        movable: false,
        resizable: false,
        kiosk: true,
        autoHideMenuBar: true,
        alwaysOnTop: true
    });

    ipcMain.on('button-click', (event, button) => {
        if(button == -1) {
            win.setBrowserView(null);
            currentView = new BrowserView(viewPrefs);
        }  
        else {
            updateBrowserView(win, button);
        }
    });
    ipcMain.on('webview-scrolled', (event) => {
        resetIdling(win);
    });
    ipcMain.on('browser-animation-ready', (event) => {
        win.setBrowserView(currentView);
    });

    win.loadFile('index.html');
    return win;
}

//IDLE
var idleId = 0;

const clearIdling = () => {
    clearTimeout(idleId);
};

const IdleMinutes = 1;

const resetIdling = (win) => {
    clearIdling();
    idleId = setTimeout(triggerIdling, 1000 * 60 * IdleMinutes, win);
}

const triggerIdling = (win) => {
    clearIdling();
    win.loadFile('index.html').then(() => {
        win.setBrowserView(null);
        currentView = new BrowserView(viewPrefs);
    });
}

const padding = 50, bottomPadding = 300;

const updateBrowserView = (win, button) => {
    const url = buttonUrls[button];
    currentView.webContents.setWindowOpenHandler(({url}) => {
        return { action: 'deny' };
    });
    currentView.setBounds({ x: padding, y: padding, width: win.getSize()[0] - 2*padding, height: win.getSize()[1] - bottomPadding });
    currentView.webContents.loadURL(url).then(() => {
        resetIdling(win);
        win.webContents.send('finish-loading');
    });
}

app.whenReady().then(() => {
    currentView = new BrowserView(viewPrefs);
    const win = createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    });
});

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') app.quit();
});