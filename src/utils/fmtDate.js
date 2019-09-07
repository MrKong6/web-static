Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, // month
        "d+": this.getDate(), // day
        "h+": this.getHours(), // hour
        "m+": this.getMinutes(), // minute
        "s+": this.getSeconds(), // second
        "q+": Math.floor((this.getMonth() + 3) / 3), // quarter
        "S": this.getMilliseconds()
        // millisecond
    }

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "")
            .substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
                : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
};

export default function (date) {
    return new Date(date).format("yyyy-MM-dd");
  // const d = new Date(date);
  // const yy = d.getFullYear();
  // const mm = d.getMonth() + 1;
  // const dd = d.getDate();
  //
  // return yy + '-' + mm + '-' + dd
}

export function formatWithTime(date) {
    return new Date(date).format("yyyy-MM-dd hh:mm");
    // const d = new Date(date);
    // const yy = d.getFullYear();
    // const mm = d.getMonth() + 1;
    // const dd = d.getDate();
    // const hour = d.getHours();
    // const minute = d.getMinutes();
    //
    // return yy + '-' + mm + '-' + dd + ' ' + hour + ':' + minute;
}