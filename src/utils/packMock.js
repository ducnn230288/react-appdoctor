// http://www.wheresrhys.co.uk/fetch-mock/api
// http://mockjs.com/
import $$ from 'cmn-utils';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Mock from 'mockjs';
import config from '@/config';
const mock = Mock.mock;
var axiosMock = new MockAdapter(axios);
/**
 * Simulated delay request
 * @param {any} response Simulation response data
 * @param {number} time How many milliseconds delay, omit this province will generate a delay within 100ms
 */
const delay = (response, time) => {
  return () => $$.delay(time || Math.random() * 100).then(() => response);
};

// Pack back data when simulating data
const toSuccess = (response, time) => {
  if (time) {
    return delay(config.mock.toSuccess(response), time);
  } else {
    return config.mock.toSuccess(response);
  }
};
const toError = (message, time) => {
  if (time) {
    return delay(config.mock.toError(message), time);
  } else {
    return config.mock.toError(message);
  }
};

export default (...mocks) => {
  /**
   * If you don't intercept it, go directly to the native fetch method
   */

  mocks.forEach(mockFile => {
    let mockAPIs = {};
    if ($$.isFunction(mockFile)) {
      mockAPIs = mockFile({ axiosMock, delay, mock, toSuccess, toError });
    } else if ($$.isObject(mockFile)) {
      mockAPIs = mockFile;
    } else {
      throw new Error('mock file require both Function or Object');
    }

    for (const key in mockAPIs) {
      const method_url = key.split(' ');

      // 'GET /api/getUserInfo'
      let method = 'onPost';
      let url = null;
      if (method_url.length === 2) {
        method = method_url[0].toLowerCase();
        url = method_url[1];
      } else {
        url = method_url[0];
      }

      // Dealing with the regular situation, that is, regexp: at the beginning of the url
      if (url.indexOf('regexp:') === 0) {
        url = new RegExp(url.substring(7));
      }

      /**
       * If you want to target the parameters of the request, return different data, such as turning pages
       * Parse the number of pages in the body, or query conditions, and return the corresponding data,
       * At this time, you can write the mock as a function, then you will receive the time when you send the fetch
       * options as parameters fetch (url, options)
       */
      if ($$.isFunction(mockAPIs[key])) {
        axiosMock[method](url).reply(async (config) =>
          {
            const data = JSON.parse(config.data)
            const response = await mockAPIs[key]({ url, ...data })()
            return [200, response]
          }
        );
      } else {
        axiosMock[method](url).reply(200, mockAPIs[key]);
      }
    }
  });
};

export { mock };
