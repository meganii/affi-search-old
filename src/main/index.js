'use strict'

import { app, BrowserWindow, ipcMain } from 'electron'
import a8 from './services/a8'
import a8sb from './services/a8_sb'
import epos from './services/epos'
import hapitas from './services/hapitas'
import valuecommerceSb from './services/valuecommerce_sb'
import valuecommerce from './services/valuecommerce'
import logger from 'electron-log'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.webContents.openDevTools()
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on('affisearch-a8', async (event, arg) => {
  console.log(arg)
  logger.info('exec affi search')
  const result = await a8(arg.keyword)
  event.sender.send('affisearch-a8-reply', result)
  logger.info('done affi search')
})

ipcMain.on('affisearch-val', async (event, arg) => {
  console.log(arg)
  logger.info('exec val search')
  const result = await valuecommerce(arg.keyword)
  event.sender.send('affisearch-val-reply', result)
  logger.info('done val search')
})

ipcMain.on('affisearch-a8sb', async (event, arg) => {
  console.log(arg)
  logger.info('exec a8sb search')
  const result = await a8sb(arg.keyword)
  event.sender.send('affisearch-a8sb-reply', result)
  logger.info('done a8sb search')
})

ipcMain.on('affisearch-epos', async (event, arg) => {
  console.log(arg)
  logger.info('exec epos search')
  const result = await epos(arg.keyword)
  event.sender.send('affisearch-epos-reply', result)
  logger.info('done epos search')
})

ipcMain.on('affisearch-hapitas', async (event, arg) => {
  console.log(arg)
  logger.info('exec hapitas search')
  const result = await hapitas(arg.keyword)
  event.sender.send('affisearch-hapitas-reply', result)
  logger.info('done hapitas search')
})

ipcMain.on('affisearch-valsb', async (event, arg) => {
  console.log(arg)
  logger.info('exec valsb search')
  const result = await valuecommerceSb(arg.keyword)
  event.sender.send('affisearch-valsb-reply', result)
  logger.info('done valsb search')
})

// Error handling
process.on('unhandledRejection', console.dir)

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
