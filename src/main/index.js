'use strict'

import { app, BrowserWindow, ipcMain } from 'electron'
import logger from 'electron-log'
import {AffinePancake} from 'affine-pancake'
import keytar from 'keytar'

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
  const secret = await keytar.findCredentials('com.meganii.apps.affi-search.a8')
  const affine = await AffinePancake.bake('A8')
  await affine.initialize()
  await affine.login(secret[0].account, secret[0].password)
  const result = await affine.search(arg.keyword)
  event.sender.send('affisearch-a8-reply', result)
  logger.info('done affi search')
})

ipcMain.on('affisearch-val', async (event, arg) => {
  console.log(arg)
  logger.info('exec val search')
  const secret = await keytar.findCredentials('com.meganii.apps.affi-search.valuecommerce')
  const affine = await AffinePancake.bake('VALUECOMMERCE')
  await affine.initialize()
  await affine.login(secret[0].account, secret[0].password)
  const result = await affine.search(arg.keyword)
  event.sender.send('affisearch-val-reply', result)
  logger.info('done val search')
})

ipcMain.on('affisearch-a8sb', async (event, arg) => {
  console.log(arg)
  logger.info('exec a8sb search')
  const secret = await keytar.findCredentials('com.meganii.apps.affi-search.a8')
  const affine = await AffinePancake.bake('A8SB')
  await affine.initialize()
  await affine.login(secret[0].account, secret[0].password)
  const result = await affine.search(arg.keyword)
  event.sender.send('affisearch-a8sb-reply', result)
  logger.info('done a8sb search')
})

ipcMain.on('affisearch-epos', async (event, arg) => {
  console.log(arg)
  logger.info('exec epos search')
  const affine = await AffinePancake.bake('EPOS')
  await affine.initialize()
  const result = await affine.search(arg.keyword)
  event.sender.send('affisearch-epos-reply', result)
  logger.info('done epos search')
})

ipcMain.on('affisearch-hapitas', async (event, arg) => {
  console.log(arg)
  logger.info('exec hapitas search')
  const affine = await AffinePancake.bake('HAPITAS')
  await affine.initialize()
  const result = await affine.search(arg.keyword)
  event.sender.send('affisearch-hapitas-reply', result)
  logger.info('done hapitas search')
})

ipcMain.on('affisearch-valsb', async (event, arg) => {
  console.log(arg)
  logger.info('exec valsb search')
  const secret = await keytar.findCredentials('com.meganii.apps.affi-search.valuecommerce')
  const affine = await AffinePancake.bake('VALUECOMMERCESB')
  await affine.initialize()
  await affine.login(secret[0].account, secret[0].password)
  const result = await affine.search(arg.keyword)
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
