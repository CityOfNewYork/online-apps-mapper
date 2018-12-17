'use strict';

/**
 *
 */
class AppMenu {
  constructor(app, Window) {
    /** @type {[type]} [description] */
    this.app = app;

    /** @type {[type]} [description] */
    this.window = Window;
  }

  /**
   * [getMenu description]
   * @return {[type]} [description]
   */
  getMenu() {
    return [{
      label: 'Application',
      submenu: [
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: () => this.app.quit()
        }
      ]}, {
        label: 'Edit',
        submenu: [
          { label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
          { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
          { type: 'separator' },
          { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
          { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
          { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
          { label: 'Select All', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:' }
        ]
      }, {
        label: 'View',
        submenu: [
          {
            label: 'Developer', submenu: [
              {
                label: 'Developer Tools',
                accelerator: 'CmdOrCtrl+Option+I',
                click: () => this.window.webContents.openDevTools()
              }
            ]
          }
        ]
      }
    ];
  }
}

export default AppMenu;
