'use strict';

import dotenv from 'dotenv';
import Express from 'express';
import Path from 'path';

import Formstack from './lib/formstack';
import Pdf from './lib/pdf.js';

dotenv.config();

const express = new Express();
const formstack = new Formstack();
const pdf = new Pdf();

express.set('views', Path.join(__dirname, 'views'));
express.set('view engine', 'slm');
express.set('port', '8080');
express.use(Express.static('static'));

express.get('/*', (request, resolve) => {
  formstack.getForm(process.env.FORMSTACK_FORM, (response) => {
    pdf.getFillableFields('static/SCRIE_Application_Packet_EN.pdf', (pdfFields) => {
      let locals = {
        'pdfFields': pdfFields,
        'formstackFields': response.fields,
      };

      resolve.render(request.params[0], locals);
    });
  });
});

express.listen(express.get('port'), () => {
  console.log(`Listening on port ${express.get('port')}!`);
});
