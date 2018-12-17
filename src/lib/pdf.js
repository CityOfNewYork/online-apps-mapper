'use strict';

import Pdftk from 'node-pdftk';
import Path from 'path';
import Fs from 'fs';

/**
 *
 */
class Pdf {
  constructor(settings = {'bin': '/usr/local/bin/pdftk'}) {
    this.pdftk = Pdftk;

    this.pdftk.configure({
      bin: settings.bin
    });
  }

  /**
   * Gets the fillable fields of a pdf using Pdftk and passes JSON obj.
   * @param  {string}   path    The path to the file relative to method call.
   * @param  {Function} resolve The callback function to pass data to.
   * @return {Promise}          The Pdftk promise chain.
   */
  getFillableFields(path, resolve) {
    if (!path) return resolve('No PDF file was specified');

    Fs.readFile(path, (error, data) => {
      if (error) {
        console.dir(error);
        return resolve(error);
      }

      if (data) this.pdftk.input(data)
        .dumpDataFields()
        .output()
        .then(Buffer => {
          resolve(this._formatFieldsToJson(Buffer));
        })
        .catch(error => {
          console.dir(error);
          resolve(error);
        });
    });
  }

  /**
   * Shorthand for retrieving class constants
   * @param  {string} name The key for the constant.
   * @return {mixed}       The desired constant.
   */
  c(name) {
    return Pdf.constants[name];
  }

  /**
   * Private Methods
   */

  /**
   * Takes the Buffer provided by the Pdftk output and converts it to
   * a more friendly JSON Object.
   * @param  {Buffer} Buffer Buffer object of Pdftk data field dump.
   * @return {Object}        JSON object of the Pdftk data field dump.
   */
  _formatFieldsToJson(Buffer) {
    return Buffer.toString('utf8').split(this.c('FIELD_DUMP_SEPARATOR'))
      .map((field) => field.split('\n')
        .map((attr) => {
          let obj = {};
          attr = attr.split(': ');
          obj[attr[0]] = attr[1];
          if (attr[1] != null) return obj;
        }))
      .map((field) => field.filter((i) => i != null))
      .filter((field) => field.length > 0)
      .map((field) => {
        return field.reduce((acc, curr) => {
          let option = this.c('FIELD_OPT');
          if (curr.hasOwnProperty(option)) {
           acc[option].push(curr[option]);
           return acc;
          } else {
            return Object.assign(acc, curr);
          }
        }, {'FieldStateOption': []})
      });
  }
}

/** @type {Object} Class constants */
Pdf.constants = {
  'FIELD_DUMP_SEPARATOR': '---',
  'FIELD_OPT': 'FieldStateOption'
};

export default Pdf;
