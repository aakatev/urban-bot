// Native node http/https modules wrapped with promises 
let https = require('https');
// Adjustable parameters
// request timeout in seconds
const REQ_TIMEOUT = 5;

module.exports = class HttpUtil {
  httpsGetText(url, path, req_timeout=REQ_TIMEOUT) {
    // create new promise
    return new Promise((resolve, reject) => {
      // request timeout
      setTimeout(() => {
        reject(new Error(`${new Date()} - ${req_timeout}s timeout exceeded`));  
      }, req_timeout*1000);

      https.get(`https://www.${url}/${path}`, (res) => {
        // response status check
        if (res.statusCode < 200 || res.statusCode > 299) {
          reject(new Error(`${new Date()} - rejection in httpsGetText with status ${res.statusCode}`));
        }
        // var to store res body
        let res_body = "";
        // get body (by chunks)
        res.on('data', (data) => {
          res_body += data;
        });
        // resolve promise(return body as text)
        res.on('end', () => {
          resolve(res_body);
        });
      }).on('error', () => {reject(new Error(`${new Date()} - request rejection in httpsGetText`))});
    });
  }
}