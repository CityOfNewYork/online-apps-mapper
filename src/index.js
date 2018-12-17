'use strict';

import dotenv from 'dotenv';
import { Menu, app, BrowserWindow } from 'electron';
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';

// import Store from 'electron-store';
import Templating from './lib/templating';
import AppMenu from './lib/menu';

dotenv.config();

// const store = new Store();
const templating = new Templating();

let Window = null;

app.on('window-all-closed', () => {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('ready', () => {
  let locals = {
    'form_id': process.env.FORMSTACK_FORM || '',
    'proxy': process.env.HTTP_PROXY || '',
    'pdftk_path': process.env.PDFTK_PATH || '',
    'token': process.env.FORMSTACK_TOKEN || '',
    'file': process.env.PDF_FILE || '',
    'pdf': {},
    'formstack': {},
    'map': {},
    'update': {}
  };

  // store.get('locals', locals);

  templating.toHtml('index.slm', 'views', 'html', locals)
    .then((path) => {
      Window = new BrowserWindow({
        width: 800,
        height: 600
      });

      let appMenu = new AppMenu(app, Window);

      if (process.env.NODE_ENV != 'development') {
        Menu.setApplicationMenu(Menu.buildFromTemplate(appMenu.getMenu()));
      }

      if (process.env.NODE_ENV === 'development') {
        installExtension(VUEJS_DEVTOOLS)
          .then((name) => console.log(`Added Extension: ${name}`))
          .catch((err) => console.log('An error occurred: ', err));
      }

      Window.locals = locals;

      Window.maximize();
      Window.loadURL(`file://${path}`);
      Window.on('closed', () => {
        Window = null;
      });
    })
    .catch(err => console.log(err));
});
