export function getBarOption() {
    const OPTION_BAR = {
        tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis : [
            {
                type : 'category',
                data : ['周一','周二','周三','周四','周五','周六','周日']
            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        series : [
            {
                name:'无',
                type:'bar',
                stack: '无',
                data:[0, 0, 0, 0, 0, 0, 0]
            },
        ]
    }
    return OPTION_BAR;
}

export function getChartOption() {
    const OPTION_BAR = {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            x: 'left',
            data:['未分配','未处理','进行中','已转化（机会）','已关闭']
        },
        series: [
            {
                name:'合计',
                type:'pie',
                selectedMode: 'single',
                radius: [0, '30%'],

                label: {
                    normal: {
                        position: 'inner'
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data:[
                    {value:0, name:'未分配', selected:true},
                    {value:0, name:'已分配'},
                ]
            },
            {
                name:'线索',
                type:'pie',
                radius: ['40%', '55%'],
                label: {
                    normal: {
                        formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                        backgroundColor: '#eee',
                        borderColor: '#aaa',
                        borderWidth: 1,
                        borderRadius: 4,
                        // shadowBlur:3,
                        // shadowOffsetX: 2,
                        // shadowOffsetY: 2,
                        // shadowColor: '#999',
                        // padding: [0, 7],
                        rich: {
                            a: {
                                color: '#999',
                                lineHeight: 22,
                                align: 'center'
                            },
                            // abg: {
                            //     backgroundColor: '#333',
                            //     width: '100%',
                            //     align: 'right',
                            //     height: 22,
                            //     borderRadius: [4, 4, 0, 0]
                            // },
                            hr: {
                                borderColor: '#aaa',
                                width: '100%',
                                borderWidth: 0.5,
                                height: 0
                            },
                            b: {
                                fontSize: 16,
                                lineHeight: 33
                            },
                            per: {
                                color: '#eee',
                                backgroundColor: '#334455',
                                padding: [2, 4],
                                borderRadius: 2
                            }
                        }
                    }
                },
                data:[
                    {value:0, name:'未处理'},
                    {value:0, name:'已转移'},
                    {value:0, name:'进行中'},
                    {value:0, name:'已转化（机会）'},
                    {value:0, name:'已关闭'},
                ]
            }
        ]
    }
    return OPTION_BAR;
}
//漏斗图
export function getFuuelChartOption() {
    const OPTION_BAR = {
        title: {
            text: '线索阶段漏斗图',
            // subtext: '纯属虚构'
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c}%"
        },
        /*toolbox: {
            feature: {
                dataView: {readOnly: false},
                restore: {},
                saveAsImage: {}
            }
        },*/
        legend: {
            data: ['展现','点击','访问','咨询','订单']
        },
        calculable: true,
        series: [
            {
                name:'漏斗图',
                type:'funnel',
                left: '10%',
                top: 60,
                //x2: 80,
                bottom: 60,
                width: '80%',
                // height: {totalHeight} - y - y2,
                // min: 0,
                // max: 100,
                // minSize: '0%',
                // maxSize: '100%',
                sort: 'descending',
                gap: 2,
                label: {
                    show: true,
                    position: 'inside'
                },
                labelLine: {
                    length: 10,
                    lineStyle: {
                        width: 1,
                        type: 'solid'
                    }
                },
                itemStyle: {
                    borderColor: '#fff',
                    borderWidth: 1
                },
                emphasis: {
                    label: {
                        fontSize: 20
                    }
                },
                data: [
                    {value: 60, name: '访问'},
                    {value: 40, name: '咨询'},
                    {value: 20, name: '订单'},
                    {value: 80, name: '点击'},
                    {value: 100, name: '展现'}
                ]
            }
        ]
    };
    return OPTION_BAR;
}
//多Y轴  簇状图
export function getMulYOption() {
    const OPTION_BAR = {
        title : {
            text: '',
            subtext: ''
        },
        tooltip : {
            trigger: 'axis'
        },
        legend: {
            data:[]
        },
        calculable : true,
        xAxis : [
            {
                type : 'category',
                data : ['星期一','星期二','星期三','星期四','星期五','星期六','星期七']
            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        series : [
            /*{
                name:'',
                type:'bar',
                data:[0,0,0,0,0,0,0],
                // markPoint : {
                //     data : [
                //         {type : 'max', name: '最大值'},
                //         {type : 'min', name: '最小值'}
                //     ]
                // },
                // markLine : {
                //     data : [
                //         {type : 'average', name: '平均值'}
                //     ]
                // }
            },
            {
                name:'降水量',
                type:'bar',
                data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
                // markPoint : {
                //     data : [
                //         {name : '年最高', value : 182.2, xAxis: 7, yAxis: 183},
                //         {name : '年最低', value : 2.3, xAxis: 11, yAxis: 3}
                //     ]
                // },
                // markLine : {
                //     data : [
                //         {type : 'average', name : '平均值'}
                //     ]
                // }
            }*/
        ]
    };
    return OPTION_BAR;
}
//玫瑰饼状图
export function getMagicType(){
    const OPTION_BAR = {
        title : {
            text: '班级状态分布表',
            // subtext: '纯属虚构',
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            x : 'center',
            y : 'bottom',
            data:['rose1','rose2','rose3','rose4']
        },
        // toolbox: {
        //         //     show : true,
        //         //     feature : {
        //         //         mark : {show: true},
        //         //         dataView : {show: true, readOnly: false},
        //         //         magicType : {
        //         //             show: true,
        //         //             type: ['pie', 'funnel']
        //         //         },
        //         //         restore : {show: true},
        //         //         saveAsImage : {show: true}
        //         //     }
        //         // },
        calculable : true,
        series : [
            {
                name:'面积模式',
                type:'pie',
                radius : [50, 110],
                roseType : 'area',
                data:[
                    {value:10, name:'rose1'},
                    {value:5, name:'rose2'},
                    {value:15, name:'rose3'},
                    {value:25, name:'rose4'}
                ]
            }
        ]
    };
    return OPTION_BAR;
}
//班级进度甘特图
export function getGanteType(){
    const OPTION_BAR = {
        title: {
            text: '班级进度表',
            left: 10
        },
        legend: {
            y: 'bottom',
            data: ['结课日期', '当前进度日期']  //修改的地方1

        },
        grid: {
            containLabel: true,
            left: 20
        },
        xAxis: {
            type: 'time'
        },

        yAxis: {

            data: []

        },
        tooltip: {
            trigger: 'axis',
            formatter: function(params) {
                var res = params[0].name + "</br>"
                var date0 = params[0].data;
                var date1 = params[1].data;
                var date2 = params[2].data;
                var date3 = params[3].data;
                date0 = date0.getFullYear() + "-" + (date0.getMonth() + 1) + "-" + date0.getDate();
                date1 = date1.getFullYear() + "-" + (date1.getMonth() + 1) + "-" + date1.getDate();
                date2 = date2.getFullYear() + "-" + (date2.getMonth() + 1) + "-" + date2.getDate();
                date3 = date3.getFullYear() + "-" + (date3.getMonth() + 1) + "-" + date3.getDate();
                // res += params[0].seriesName + "~" + params[1].seriesName + ":</br>" + date0 + "~" + date1 + "</br>"
                // res += params[2].seriesName + "~" + params[3].seriesName + ":</br>" + date2 + "~" + date3 + "</br>"
                res += params[2].seriesName + "~" + params[0].seriesName + ":</br>" + date2 + "~" + date0 + "</br>"
                console.log(params[0]);
                return res;
            }
        },
        series: [


            {
                name: '结课日期',
                type: 'bar',
                stack: 'test1',
                //修改地方2
                itemStyle: {
                    normal: {
                        color: '#F98563'
                    }
                },
                data: []
            },
            {
                name: '实际开课日期',
                type: 'bar',
                stack: 'test1',
                itemStyle: {
                    normal: {
                        color: 'rgba(0,0,0,0)'
                    }
                },
                data: []
            },
            {
                name: '当前进度日期',
                type: 'bar',
                stack: 'test1',
                //修改地方3
                itemStyle: {
                    normal: {
                        color: '#A2E068'
                    }
                },
                data: []
            },
            {
                name: '开课日期',
                type: 'bar',
                stack: 'test1',
                itemStyle: {
                    normal: {
                        color: 'rgba(0,0,0,0)'
                    }
                },
                data: []
            }
        ]
    };
    return OPTION_BAR;
}
//普通圆饼图
export function getPieOption(){
    const OPTION_BAR = {
        title : {
            text: '班级状态分布表',
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            type: 'scroll',
            orient: 'vertical',
            right: 10,
            top: 20,
            bottom: 20,
            data: [],
            selected: []
        },
        series : [
            {
                name: '姓名',
                type: 'pie',
                radius : '55%',
                center: ['40%', '50%'],
                label:{
                    normal:{
                        formatter: '{a} <br/>{b} : {c} ({d}%)',
                    }
                },
                data: [],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    //36课
    return OPTION_BAR;
}





