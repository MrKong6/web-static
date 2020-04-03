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
//时间选择器所需时间格式
export function formatWithOnlyTime(date) {
    // return new Date(date).format("hh:mm");
    const d = new Date(date);
    const yy = d.getFullYear();
    const mm = d.getMonth();
    const dd = d.getDate();
    const hour = d.getHours();
    const minute = d.getMinutes();
    return new Date(yy, mm, dd, hour, minute);
    //
    // return yy + '-' + mm + '-' + dd + ' ' + hour + ':' + minute;
}
//时间用第二个参数  日期用第一个
export function formatWithDateAndTime(date,dateWithTime) {
    // return new Date(date).format("hh:mm");
    let useDate = new Date(date);
    let useTime = new Date(dateWithTime);
    let yy = useDate.getFullYear();
    let mm = useDate.getMonth();
    let dd = useDate.getDate();
    let hour = useTime.getHours();
    let minute = useTime.getMinutes();
    return new Date(yy, mm, dd, hour, minute);
    //
    // return yy + '-' + mm + '-' + dd + ' ' + hour + ':' + minute;
}

export function stringToDate(dateStr,separator){
    if(!separator){
        separator="-";
    }
    var dateArr = dateStr.split(separator);
    var year = parseInt(dateArr[0]);
    var month;
    //处理月份为04这样的情况
    if(dateArr[1].indexOf("0") == 0){
        month = parseInt(dateArr[1].substring(1));
    }else{
        month = parseInt(dateArr[1]);
    }
    var day = parseInt(dateArr[2]);
    var date = new Date(year,month -1,day);
    return date;
}


export function getWeekByNum(num){
    let retval = "周";
    switch (num){
        case 1: retval = retval + "一";break;
        case 2: retval = retval + "二";break;
        case 3: retval = retval + "三";break;
        case 4: retval = retval + "四";break;
        case 5: retval = retval + "五";break;
        case 6: retval = retval + "六";break;
        case 7: retval = retval + "日";break;
    }
    return retval;
}

export function getTimeFourByDate(date){
    let useDate = new Date(date);
    let hour = useDate.getHours();
    let minute = useDate.getMinutes();
    return hour + ":" + minute;
}