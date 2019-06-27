import 'whatwg-fetch'
import {$} from '../vendor';

// 192.168.0.98
// export const AJAX_PATH = 'http://schooloms.com:8080/web/ajax';
export const AJAX_PATH = 'http://localhost:8080/ajax';


export default function (url, data) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: AJAX_PATH + url,
      method: 'POST',
      crossDomain:true,
      xhrFields:{withCredentials:true},
      data: data || null,
      dataType: 'json'
    }).done((data) => {
      if (data.code === 200) {
        resolve(data.data);
      } else {
        reject({
          errCode: data.code,
          errText: data.detail
        });
      }
    }).fail((jqXHR) => {
      reject({
        errCode: jqXHR.status,
        errText: jqXHR.statusText
      });
    });
  })
}