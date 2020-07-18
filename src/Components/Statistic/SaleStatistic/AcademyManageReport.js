import React from 'react'

import mainSize from "../../../utils/mainSize";
import ajax from "../../../utils/ajax";
import {Button, Card} from "element-react";
import ReactEcharts from 'echarts-for-react';
import {
    getGanteType,
    getPieOption
} from "../../../utils/const";
import {addDate, addDateReturnDate, getWeekDateByDate, stringToDate} from "../../../utils/fmtDate";
import report from "./AcademyManageReport.css"
import {$} from '../../../vendor';


class AcademyManageReport extends React.Component {
    constructor(props) {
        super(props);
        // this.title = fmtTitle(this.props.location.pathname);
        // this.ids = this.props.location.state.ids;
        this.state = {
            group: this.props.changedCrmGroup,
            redirectToReferrer: false,
            redirectToList: false,
            isAnimating: false,
            isCreated: false,
            createdId: null,
            reportType: 1,
            indexNum:"0",
            typeId : this.props.typeId,
            optionAcademyClassStatus:getPieOption(),//教务管理-班级--班级状态--饼状图
            optionAcademyClassTime:getGanteType(),//教务管理-班级--班级课时进度--甘特图
            roomNum:3,//教务管理-教室 教室个数
            weeks:[
                {
                id: 1,
                name:'周一',
                date:null,
                },{
                    id: 2,
                    name:'周二',
                    date:null,
                },{
                    id: 3,
                    name:'周三',
                    date:null,
                },{
                    id: 4,
                    name:'周四',
                    date:null,
                },{
                    id: 5,
                    name:'周五',
                    date:null,
                },{
                    id: 6,
                    name:'周六',
                    date:null,
                },{
                    id: 7,
                    name:'周日',
                    date:null,
                }
            ], //教务管理-教室 周
            rooms:[], //教务管理-教室 教室
            roomByTimeData:[
                {
                    ts:'08:30', //开始时间
                    te:'09:00', //开始时间
                },
                {
                    ts:'09:30',
                    te:'10:00',
                },
                {
                    ts:'10:30',
                    te:'11:00',
                },
                {
                    ts:'11:30',
                    te:'12:00',
                },
                {
                    ts:'12:30',
                    te:'13:00',
                },
                {
                    ts:'13:30',
                    te:'14:00',
                },
                {
                    ts:'14:30',
                    te:'15:00',
                },
                {
                    ts:'15:30',
                    te:'16:00',
                },
                {
                    ts:'16:30',
                    te:'17:00',
                },
                {
                    ts:'17:30',
                    te:'18:00',
                },
                {
                    ts:'18:30',
                    te:'19:00',
                },
                {
                    ts:'19:30',
                    te:'20:00',
                },
                {
                    ts:'20:30',
                    te:'21:00',
                }

            ],//教务管理-教室 教室按照时间分布数据
            roomDataList:[],//教务管理-教室 教室按照时间分布数据
        };
        this.panelAcademyReq = this.panelAcademyReq.bind(this);
        this.initRoomData = this.initRoomData.bind(this);
    }

    componentDidMount() {
        if(this.state.typeId == 8){
            this.panelAcademyReq();
        }else if(this.state.typeId == 9)    {
            this.initRoomData(new Date());
        }
        mainSize();
    }

    componentWillReceiveProps(nextProps){
        this.state.indexNum = nextProps.indexNum;
        this.state.typeId = nextProps.typeId;
        this.setState({
            indexNum: nextProps.indexNum,
            typeId: nextProps.typeId,
        })
        this.componentDidMount();
    }
    //教务数据渲染
    panelAcademyReq(){
        //班级状态柱状图获取
        const request = async (rt) => {
            let list = await ajax('/statistic/getClassStatusStatistic.do', {orgId: this.state.group.id});
            if(list){
                this.setState({optionAcademyClassStatus:{
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
                            data: list.data.columns,
                        },
                        series : [
                            {
                                name: '姓名',
                                type: 'pie',
                                radius : '55%',
                                center: ['40%', '50%'],
                                label:{
                                    normal:{
                                        formatter: '{b}({d}%)',  //{a} <br/>{b} : {c} ({d}%)
                                    }
                                },
                                data: list.data.data,
                                itemStyle: {
                                    emphasis: {
                                        shadowBlur: 10,
                                        shadowOffsetX: 0,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                    }
                                }
                            }
                        ]
                    }});
            }
        };
        request();
        //班级进度甘特图获取
        const requestGante = async (rt) => {
            let list = await ajax('/statistic/getClassHourStatistic.do', {orgId: this.state.group.id});
            if(list && list.data){
                list = list.data;
                this.setState({optionAcademyClassTime:{
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
                            data: list.classCodes
                        },
                        tooltip: {
                            trigger: 'axis',
                            formatter: function(params) {
                                var res = params[0].name + "</br>"
                                var date0 = params[0].data;
                                var date1 = params[1].data;
                                var date2 = params[2].data;
                                var date3 = params[3].data;
                                /*if(date0){
                                    console.log(date0);
                                    date0 = fmtDate(date0)
                                    date0 = date0.getFullYear() + "-" + (date0.getMonth() + 1) + "-" + date0.getDate();
                                }
                                if(date2){
                                    console.log(date2);
                                    date2 = fmtDate(date2)
                                    date2 = date2.getFullYear() + "-" + (date2.getMonth() + 1) + "-" + date2.getDate();
                                }*/
                                // date0 = date0.getFullYear() + "-" + (date0.getMonth() + 1) + "-" + date0.getDate();
                                // date1 = date1.getFullYear() + "-" + (date1.getMonth() + 1) + "-" + date1.getDate();
                                // date2 = date2.getFullYear() + "-" + (date2.getMonth() + 1) + "-" + date2.getDate();
                                // date3 = date3.getFullYear() + "-" + (date3.getMonth() + 1) + "-" + date3.getDate();
                                // res += params[0].seriesName + "~" + params[1].seriesName + ":</br>" + date0 + "~" + date1 + "</br>"
                                // res += params[2].seriesName + "~" + params[3].seriesName + ":</br>" + date2 + "~" + date3 + "</br>"
                                res += params[2].seriesName + "~" + params[0].seriesName + ":</br>" + date2 + "~" + date0 + "</br>"
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
                                data: list.endDates
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
                                data: list.startDates
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
                                data: list.rightNowDates
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
                                data: list.startDates
                            }
                        ]
                    }});
            }
        };
        requestGante();
    }

    //教室数据渲染
    initRoomData(date) {
        console.log(date);
        //先将日期渲染 -- 当前日期的
        let thisWeekStr = getWeekDateByDate(date);
        let weeks = this.state.weeks;
        weeks.map(item => {
            item.date = thisWeekStr[item.id-1];
        });
        this.setState({weeks});
        this.initRoomDatayTime(thisWeekStr);
    }
    //
    initRoomDatayTime(thisWeekStr){
        //获取教室数据
        const request = async (thisWeekStr) => {
            try {
                //获取教室数据
                let roomList = await ajax('/academy/room/list.do', {orgId: this.state.group.id});
                //获取数据
                let roomDataList = await ajax('/statistic/getRoomUseStatistic.do', {orgId: this.state.group.id, startDate: (stringToDate(thisWeekStr[0])).getTime(), endDate:stringToDate(thisWeekStr[thisWeekStr.length-1]).getTime()});
                this.setState({
                    roomNum: roomList.data ? roomList.data.items.length : 0,
                    rooms: roomList.data ? roomList.data.items : [],
                    roomDataList: roomDataList.data
                });
                $(".right-table").width($(".report-box").width() - $(".left-table").width())
                $(".left-title,.content-table").height($(".report-box").height() - $("#chanceGridTable2").height())

                $(".content-table").on("scroll", function() {
                    var right_div2_top = $(this).scrollTop();
                    var right_div2_left = $(this).scrollLeft();
                    $(".left-title").scrollTop(right_div2_top);
                    $(".right-title").scrollLeft(right_div2_left);
                });
            }catch (err) {
                console.log(err);
            }
        };
        request(thisWeekStr);
    }
    //改变日期范围
    changeDateRange(val1, evt){
        let weeks = this.state.weeks;
        if(val1 == 1){
            //右移一周
            weeks.map(item => {
                item.date = addDate(item.date, 7);
            });
        }else if(val1 == 2){
            //左移一周
            weeks.map(item => {
                item.date = addDate(item.date, -7);
            });
        }
        this.setState({weeks});
        let thisWeekStr = getWeekDateByDate(stringToDate(weeks[0].date,'-'));
        this.initRoomDatayTime(thisWeekStr);
    }

    render() {
        if(this.state.typeId == 8){
            //教务 - 班级
            return (
                <div>
                    <Card className="box-card">
                        <ReactEcharts
                            option={this.state.optionAcademyClassStatus}
                            style={{height: '350px', width: '1000px'}}
                            className='react_for_echarts' />
                    </Card>
                    <br/>
                    <Card className="box-card">
                        <ReactEcharts
                            option={this.state.optionAcademyClassTime}
                            style={{height: '800px', width: '1000px'}}
                            className='react_for_echarts' />
                    </Card>
                    <br/><br/>
                </div>
            )
        }else if(this.state.typeId == 9){
            //教务 - 教室
            let that = this;
            return(
                <div style={{"marginTop":"20px"}} id="roomView">
                    <div className="row box-card">
                        <div className="col-1">
                            <Button type="primary" icon="arrow-left" onClick={this.changeDateRange.bind(this,2)}></Button>
                        </div>
                        <div className="col-10">
                            <div className="left-table left-title">
                                <table border="1" className="table" id="chanceGridTable1">
                                    <thead>
                                        <tr>
                                            <td>时间</td>
                                        </tr>
                                        <tr>
                                            <td>XXX</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.roomDataList.map(function (vo) {
                                                return (
                                                    <tr key={vo.idx}>
                                                        <td>{vo.time}</td>
                                                    </tr>
                                                )
                                            })
                                        }
                                        <tr>
                                            <td style={{"visibility": "hidden"}}></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="content-table">
                                <table border="1" className="table" id="chanceGridTable2">
                                    <thead>
                                    <tr>
                                        {
                                            this.state.weeks.map(function (vo) {
                                                return (
                                                    <td colSpan={that.state.roomNum} key={vo.id}>{vo.name}({vo.date})</td>
                                                )
                                            })
                                        }
                                    </tr>
                                    <tr>
                                        {
                                            this.state.weeks.map(function (vo) {
                                                return (
                                                    that.state.rooms.map(function (item) {
                                                        return (
                                                            <td nowrap="true" key={vo.id + '-' + item.id}>{item.code}</td>
                                                        )
                                                    })
                                                )
                                            })
                                        }
                                    </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.roomDataList.map(function (vo) {
                                                return (
                                                    <tr key={vo.idx}>
                                                        {
                                                            vo.datas.map(function (item) {
                                                                return (
                                                                    <td style={{'backgroundColor': item.color}} key={item.idx}><div>{item.classCode ? item.classCode :"'"}</div></td>
                                                                )
                                                            })
                                                        }
                                                    </tr>
                                                )
                                            })
                                        }
                                        <tr>
                                            <td style={{"visibility": "hidden"}}></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="col-1">
                            <Button type="primary" onClick={this.changeDateRange.bind(this,1)}><i className="el-icon-arrow-right el-icon-right"></i></Button>
                        </div>
                    </div>
                </div>
            )
        }else {
            return (
                <div></div>
            )
        }
    }
}
export default AcademyManageReport;