import { app, BrowserWindow,ipcMain,dialog } from 'electron'

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
    height: 680,
    useContentSize: true,
    width: 1200,
		minWidth:1200,
		minHeight:680,
		webPreferences:{webSecurity: false}
		// frame:false
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
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

// const{ipcMain,dialog}=require('election')
ipcMain.on('open-project-file', (event) => {
	dialog.showOpenDialog({
		title:"打开工程目录",
		properties:['openDirectory'],
		filters:[
			{name:'Project',extensions:['json']}
		]
	},(files) => {
		if(files){
			event.sender.send('selected-project-file',files)
		}
	})
})