'use strict';

import fetch from 'node-fetch';
import HttpsProxyAgent from 'https-proxy-agent';

/**
 *
 */
class Formstack {
  constructor(settings = {token: false, proxy: false}) {
    /** @type {String} The API token. */
    this.token = settings.token;

    /** @type {String} A proxy if behind a firewall. */
    this.proxy = settings.proxy;
  }

  /**
   * Gets a Formstack Form based on an ID.
   * @param  {sring}    id      The ID of the form to fetch.
   * @param  {Function} resolve The function to execute on resolution.
   * @return {Promise}          The fetch promise chain.
   */
  getForm(id, resolve) {
    return (!id) ? resolve('No form was specified') :
      fetch(this.endpoint('FORM').replace('${id}', id), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        agent: this._agent()
      })
      .then((response) => {
        if (response.status >= 400) {
          throw new Error('Bad response from server');
        } else {
          return response.json();
        }
      })
      .then((response) => {
        resolve(this.filter(response));
      });
  }

  /**
   * Filter out the fields based on their type
   * @param  {Object} response The full response of Formstack.
   * @return {Object}          The response with filtered fields.
   */
  filter(response) {
    response.fields = response.fields.filter((field) =>
      (this.c('FILTER_TYPES').indexOf(field.type) === -1)
    );
    return response;
  }

  /**
   * Build the endpoint url
   * @param  {String} name The name of the endpoint.
   * @return {String}      The domain and enpoint.
   */
  endpoint(name) {
    return `${this.c('DOMAIN')}${this.c(`ENDPOINT_${name}`)}`;
  }

  /**
   * Shorthand for retrieving class constants
   * @param  {string} name The key for the constant.
   * @return {mixed}       The desired constant.
   */
  c(name) {
    return Formstack.constants[name];
  }

  /**
   * If the proxy agent is set, create an agent object to pass to the fetch method
   * @return {Object} The proxy agent.
   */
  _agent() {
    return (this.proxy) ? new HttpsProxyAgent(this.proxy) : false;
  }
}

/** @type {Object} [description] */
Formstack.constants = {
  'DOMAIN': 'https://www.formstack.com/api/v2/',
  'ENDPOINT_FORM': 'form/${id}.json',
  'FILTER_TYPES': ['section', 'file', 'embed', 'richtext']
};

export default Formstack;
