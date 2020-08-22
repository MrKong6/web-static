import 'whatwg-fetch'
import {$} from '../vendor';
import {Message} from "element-react";

//生产
// export const AJAX_PATH = 'http://www.schooloms.com:8080/web/ajax';
// export const IMG_URL = 'http://www.schooloms.com:8084/';
//本地
export const AJAX_PATH = 'http://localhost:8081/ajax';
export const IMG_URL = 'http://localhost:4040/';

// export const AJAX_PATH = 'http://192.168.0.107:8081/ajax';
// export const IMG_URL = 'http://192.168.0.107:4040/';
//
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
        if(data.data && data.data.detail){
          if(data.data.code == 200){
              resolve(data.data);
          }else{
              Message({
                  message: data.data.detail,
                  type: 'error'
              });
              reject({
                  errCode: data.data.code,
                  errText: data.data.detail
              });
          }
        }else{
            resolve(data.data);
        }
      } else {
        reject({
          errCode: data.code,
          errText: data.detail
        });
          // Message({
          //     message: data.detail,
          //     type: 'error'
          // });
      }
    }).fail((jqXHR) => {
      reject({
        errCode: jqXHR.status,
        errText: "请刷新后重试，重试失败可重新登录！"
      });
    });
  })
}

export function ajaxGet(url, data){
    return new Promise((resolve, reject) => {
        $.ajax({
            url: AJAX_PATH + url,
            method: 'GET',
            crossDomain:true,
            xhrFields:{withCredentials:true},
            data: data || null,
            dataType: 'json'
        }).done((data) => {
            if (data.code === 200) {
                if(data.data && data.data.detail){
                    if(data.data.code == 200){
                        resolve(data.data);
                    }else{
                        Message({
                            message: data.data.detail,
                            type: 'error'
                        });
                        reject({
                            errCode: data.data.code,
                            errText: data.data.detail
                        });
                    }
                }else{
                    resolve(data.data);
                }
            } else {
                reject({
                    errCode: data.code,
                    errText: data.detail
                });
                // Message({
                //     message: data.detail,
                //     type: 'error'
                // });
            }
        }).fail((jqXHR) => {
            reject({
                errCode: jqXHR.status,
                errText: "请刷新后重试，重试失败可重新登录！"
            });
        });
    })
}

export function ajaxJson(url, data) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: AJAX_PATH + url,
            method: 'POST',
            crossDomain:true,
            xhrFields:{withCredentials:true},
            data: data || null,
            dataType: 'json',
            headers: {
                'Content-Type':'application/json'
            },
        }).done((data) => {
            if (data.code === 200) {
                if(data.data && data.data.detail){
                    if(data.data.code == 200){
                        resolve(data.data);
                    }else{
                        Message({
                            message: data.data.detail,
                            type: 'error'
                        });
                        reject({
                            errCode: data.data.code,
                            errText: data.data.detail
                        });
                    }
                }else{
                    resolve(data.data);
                }
            } else {
                reject({
                    errCode: data.code,
                    errText: data.detail
                });
                // Message({
                //     message: data.detail,
                //     type: 'error'
                // });
            }
        }).fail((jqXHR) => {
            reject({
                errCode: jqXHR.status,
                errText: "请刷新后重试，重试失败可重新登录！"
            });
        });
    })
}