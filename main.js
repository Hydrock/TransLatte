const { app, BrowserWindow } = require("electron");
const path = require("path");
const is_mac = process.platform === 'darwin'
console.log('is_mac:', is_mac);
if (is_mac) {
    app.dock.hide()                                     // - 1 - 
}
const MAIN_WINDOWS_WIDTH = 300;
const MAIN_WINDOWS_HEIGHT = 350;
function createClapWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: MAIN_WINDOWS_WIDTH,
        height: MAIN_WINDOWS_HEIGHT,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        }
    })
    mainWindow.setAlwaysOnTop(true, "screen-saver")     // - 2 -
    mainWindow.setVisibleOnAllWorkspaces(true)          // - 3 -
    mainWindow.loadFile('public/reaction.html')
}
app.whenReady().then(() => {
    createClapWindow()
})
