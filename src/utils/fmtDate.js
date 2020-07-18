import CONFIG from "./config";

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
const WEEKNAME=CONFIG.WEEKNAME;
export function getNumByWeek(num){
    let retval = 1;
    switch (num){
        case WEEKNAME[0]: retval = 1;break;
        case WEEKNAME[1]: retval = 2;break;
        case WEEKNAME[2]: retval = 3;break;
        case WEEKNAME[3]: retval = 4;break;
        case WEEKNAME[4]: retval = 5;break;
        case WEEKNAME[5]: retval = 6;break;
        case WEEKNAME[6]: retval = 7;break;
    }
    return retval;
}

export function getTimeFourByDate(date){
    let useDate = new Date(date);
    let hour = useDate.getHours();
    let minute = useDate.getMinutes();
    if(hour >= 10){
        hour = hour;
    }else{
        hour = '0' + hour;
    }

    if(minute >= 10){
        minute = minute;
    }else{
        minute = '0' + minute;
    }return hour + ":" + minute;
}


export function getTimeByWeek(week,date){
    //获取所传日期是周几
    let weekNum = date.getDay();
    //根据周几获取数字
    let num = getNumByWeek(week);
    let offset = num - weekNum; // 计算出差几天
    date = date.getTime(); // 拿到当前的时间戳
    debugger
    var future = date + offset * 24 * 3600 * 1000; // 计算出星期五的时间戳
    return new Date(future); // 转成时间对象

}

//根据传入日期（字符串）返回日期当前周的七天日期
export function getWeekDate(date){
    //获取所传日期是周几
    let newDate = new Date(date);
    let num = newDate.getDay();
    let weekDate = [];
    for(let i=1;i<=7;i++){
        if(i <= num){
            weekDate.push(new Date(newDate.getTime() - (num - i) * 24 * 3600 * 1000).format("yyyy-MM-dd"));
        }else{
            weekDate.push(new Date(newDate.getTime() + (i - num) * 24 * 3600 * 1000).format("yyyy-MM-dd"));
        }
    }
    return weekDate; // 转成时间对象
}

//根据传入日期（日期）返回日期当前周的七天日期
export function getWeekDateByDate(date){
    //获取所传日期是周几
    let newDate = date;
    let num = newDate.getDay();
    let weekDate = [];
    for(let i=1;i<=7;i++){
        if(i <= num){
            weekDate.push(new Date(newDate.getTime() - (num - i) * 24 * 3600 * 1000).format("yyyy-MM-dd"));
        }else{
            weekDate.push(new Date(newDate.getTime() + (i - num) * 24 * 3600 * 1000).format("yyyy-MM-dd"));
        }
    }
    return weekDate; // 转成时间对象
}

//根据传入日期(字符串)加减几天 返回字符串
export function addDate(date, addnum){
    return new Date(stringToDate(date,null).getTime() + addnum * 24 * 3600 * 1000).format("yyyy-MM-dd"); // 转成时间对象
}

//根据传入日期(字符串)加减几天 返回日志
export function addDateReturnDate(date, addnum){
    return new Date(stringToDate(date,null).getTime() + addnum * 24 * 3600 * 1000); // 转成时间对象
}