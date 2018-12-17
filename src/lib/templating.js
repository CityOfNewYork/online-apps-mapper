'use strict';

import Slm from 'slm';
import Path from 'path';
import Fs from 'fs';
import pretty from 'pretty';
import Alerts from './alerts';

/**
 *
 */
class Templating {
  constructor() {
    // this...
  }

  /**
   * Returns a promise that tries to resolve compiling a slm-lang template
   * to html and writes it to a distribution directory. Rejects if fails.
   * @param  {String} path   The path to the file template.
   * @param  {String} src    The source directory name.
   * @param  {String} dist   The distribution directory name.
   * @param  {Object} locals Locals to pass to the template.
   * @return {Promise}       Resolves if the compilation process completes.
   */
  toHtml(path, src, dist, locals = {}) {
    return new Promise((resolve, reject) => {
      path = Path.join(__dirname, '../', src, path);

      let compiled = this.compile(path, locals);
      if (!compiled) reject('Compiler error.');

      path = path.replace(src, dist);
      path = path.replace(Templating.ext, '.html');

      Fs.writeFile(path, pretty(compiled), err => {
        if (err) {
          console.log(`${Alerts.error} ${err}`);
          reject(err);
          return;
        }

        resolve(path);
        path = path.replace(Path.join(__dirname, '../'), '');
        console.log(`${Alerts.success} Slm compiled to ${path}`);
      });

    });
  }

  /**
   * Uses the slm-lang compile method to create a string of html from templates.
   * @param  {String} path   Path to the template to render.
   * @param  {Object} locals Collection of variables to pass to the template.
   * @return {String}        Returns the compiled html string to write to a file.
   */
  compile(path, locals) {
    try {
      return Slm.compile(Fs.readFileSync(path, 'utf-8'), {
        filename: path
      })(locals);
    } catch(err) {
      console.log(`${Alerts.error} ${err}`);
      return false;
    }
  }
}

/** @type {String} The extension of the templating engine. */
Templating.ext = '.slm';

export default Templating;