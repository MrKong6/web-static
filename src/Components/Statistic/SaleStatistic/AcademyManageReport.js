import React from 'react'

import mainSize from "../../../utils/mainSize";
import fmtTitle from '../../../utils/fmtTitle';
import ajax from "../../../utils/ajax";
import {Button, Card} from "element-react";
import ReactEcharts from 'echarts-for-react';
import {
    getBarOption,
    getChartOption,
    getFuuelChartOption,
    getGanteType,
    getMulYOption,
    getPieOption
} from "../../../utils/const";

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
            optionAcademyClassStatus:getPieOption(),//教务管理--班级状态--饼状图
            optionAcademyClassTime:getGanteType(),//教务管理--班级课时进度--甘特图
        };
        this.panelAcademyReq = this.panelAcademyReq.bind(this);
    }

    componentDidMount() {
        if(this.state.indexNum == '4'){
            this.panelAcademyReq();
        }else{

        }
        mainSize();
    }

    componentWillReceiveProps(nextProps){
        this.state.indexNum = nextProps.indexNum;
        this.setState({
            indexNum: nextProps.indexNum
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


    render() {
        if(this.state.indexNum == '4'){
            //教务
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
        }else{
            return(
                <div>

                </div>
            )
        }
    }
}

export default AcademyManageReport;