'use strict';

import Vue from 'vue/dist/vue.common';
import { remote } from 'electron';
import Formstack from '../lib/formstack';
import Pdf from '../lib/pdf';

/**
 *
 */
class App {
  constructor() {
    /** @type {Object} Data storage. */
    this.data = remote.getCurrentWindow().locals;

    /** @type {Object} The Vue.js settings. */
    this.vue = {
      el: '#app',
      data: {
        'pdf': this.data.pdf,
        'formstack': this.data.formstack,
        'token': this.data.token,
        'proxy': this.data.proxy,
        'pdftk_path': this.data.pdftk_path,
        'form_id': this.data.form_id,
        'file': this.data.file,
        'newkey': '',
        'map': this.data.map,
        'update': this.data.update
      },
      methods: {
        'setMapping': App.setMapping,
        'deleteMapping': App.deleteMapping,
        'getForm': App.getForm,
        'getPdf': App.getPdf,
        'openPdfDialog': App.openPdfDialog,
        'updateToggle': function(key) {
          this.$set(this.update, key, !(this.update[key]))
          return this;
        }//,
        //'saveSettings': App.saveSettings
      }
    };
  }

  /**
   * The initializing function.
   * @return {Object} The App class.
   */
  init() {
    /** Register components */
    Vue.component('formstack-options', App.formstackOptions);

    /** Initialize Vue */
    this.vue = new Vue(this.vue);

    return this;
  }
}

/**
 * [setMapping description]
 * @param {[type]} event [description]
 */
App.setMapping = function(key, value) {
  this.$set(this.map, key, value);
  return this;
};

/**
 * Delete a map by it's key.
 * @param  {[type]} event [description]
 * @return {[type]}       [description]
 */
App.deleteMapping = function(key) {
  this.$delete(this.map, key);
  return this;
};

/**
 * Use the FormStack library to get
 * @param  {String} id The new form ID string.
 * @return {Object}    The Vue app instance.
 */
App.getForm = function(id) {
  if (this.form_id == id) return this;

  let formstack = new Formstack({
    'token': this.token,
    'proxy': this.proxy
  });

  this.form_id = id;

  formstack.getForm(id, (response) => {
    this.$set(this, 'formstack', response.fields);
  });

  return this;
};

/**
 * [getPdf description]
 * @param  {[type]} file The updated file path.
 * @return {Object}      The Vue app instance.
 */
App.getPdf = function(file) {
  let pdf = new Pdf({
    'bin': this.pdftk_path
  });

  pdf.getFillableFields(file, (pdfFields) => {
    this.file = file;
    this.pdf = pdfFields;
  });

  return this;
};

/**
 * Open the file browsing dialogue and call the pdf function
 * @param  {Object} event The Vue click event.
 * @return {Object}       The Vue app instance.
 */
App.openPdfDialog = function($event) {
  remote.dialog.showOpenDialog({
    properties: ['openFile'],
  }, (filePaths) => {
    if (filePaths) this.getPdf(filePaths[0]);
  });

  return this;
};

/**
 * [saveSettings description]
 * @param  {[type]} save [description]
 * @return {[type]}      [description]
 */
// App.saveSettings = function(save) {
//   let store = new Store;

//   save = save || Object.keys(remote.getCurrentWindow().locals);

//   for (let i = 0; i < save.length; i++) {
//     store.set(`locals.${save[i]}`, this[save[i]]);
//   }

//   return store.get('locals');
// };

/**
 * Components
 */

App.formstackOptions = {
  props: ['options', 'pdfkey'],
  template: '#formstack-options'
};

new App().init();
