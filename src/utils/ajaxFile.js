import 'whatwg-fetch'
import {$} from '../vendor';
import {AJAX_PATH} from './ajax'

function formatParam(obj){
    let arr=[]
    for(let key in obj){
        arr.push(encodeURIComponent(key)+'='+encodeURIComponent(obj[key]))
    }
    arr.push(("v=" + Math.random()).replace(".",''))
    return arr.join('&')
}


export default function (url, data) {
    function createObjectURL(object) { return (window.URL) ? window.URL.createObjectURL(object) : window.webkitURL.createObjectURL(object); }
    var xhr = new XMLHttpRequest();
    let param=formatParam(data);

    xhr.open('get',AJAX_PATH + url+"?"+param);  //url填写后台的接口地址，如果是post，在formData append参数（参考原文地址）
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.responseType = 'blob';
    xhr.withCredentials = true;
    xhr.onload = function (e) {

        if (this.status == 200) {
            let responseHeader = xhr.getAllResponseHeaders();
            var blob = this.response;
            console.log(xhr.getResponseHeader("Content-Filename"));
            // var filename = responseHeader.substr((responseHeader.lastIndexOf(":")+1),(responseHeader.length-1));
            // filename = decodeURI(filename);
            // filename = filename.trim();//替换
            // console.log(filename)
            var filename = xhr.getResponseHeader("Content-Filename");
            filename = decodeURI(filename);
            if (window.navigator.msSaveOrOpenBlob) {
                navigator.msSaveBlob(blob, filename);
            } else {
                var a = document.createElement('a');
                var url = createObjectURL(blob);
                a.href = url;
                console.log(a.href);
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            }

        }
    };
    xhr.send(data);
}