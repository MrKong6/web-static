import React from 'react'

import mainSize from "../../../utils/mainSize";
import fmtTitle from '../../../utils/fmtTitle';
import ajax from "../../../utils/ajax";
import {Button} from "element-react";
import ReactEcharts from 'echarts-for-react';
import {getBarOption, getChartOption, getFuuelChartOption, getMulYOption} from "../../../utils/const";

class CustomerServiceReport extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            group: this.props.changedCrmGroup,
            redirectToReferrer: false,
            redirectToList: false,
            isAnimating: false,
            isCreated: false,
            createdId: null,
            reportType: 1,
            indexNum:"0",
            option: getChartOption(),
            optionBar:getBarOption(),
        };
        this.panelVisitorReq = this.panelVisitorReq.bind(this);
    }

    componentDidMount() {
        if(this.state.indexNum == '2-1'){
            this.panelVisitorReq(4,1);
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

    //访客数据渲染
    panelVisitorReq(type,reportType){
        const request = async (rt) => {
            let list = await ajax('/mkt/leads/getStatisticCount.do', {orgId: this.state.group.id,cellphone:this.state.cellphone,
                pageNum:this.state.currentPage,pageSize:this.state.pageSize,fromWay:1,
                isIn:0,typeId:4});
            if(list){
                let out = [];
                let inside = [];
                let legendText = [];
                out = list.twoMap;
                inside = list.oneMap;
                if(out && out.length > 0){
                    out.map(item => {
                        legendText.push(item.name);
                    })
                }
                this.setState({option: {

                        tooltip: {
                            trigger: 'item',
                            formatter: "{a} <br/>{b}: {c} ({d}%)"
                        },
                        legend: {
                            orient: 'vertical',
                            x: 'left',
                            data:legendText
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
                                data:inside
                            },
                            {
                                name:'访客',
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
                                data:out
                            }
                        ]
                    }});
            }
        };
        request();
        const requestTwo = async (rt) => {

            let listThree = await ajax('/mkt/leads/getAllCountByDay.do', {orgId: this.state.group.id,cellphone:this.state.cellphone,
                pageNum:this.state.currentPage,pageSize:this.state.pageSize,fromWay:1,typeId:5,
                reportType:rt ? rt : this.state.reportType,
                isIn:0});
            if(listThree && listThree.dataOne){
                let data = [],xAxis = [];
                listThree.dataOne.map(item => {
                    xAxis.push(item.showStr);
                    data.push(item.code);
                });
                this.setState({optionBar:{
                        title: {
                            text: '访客数量柱状图',
                            // subtext: '纯属虚构'
                        },
                        tooltip : {
                            trigger: 'axis',
                            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                            }
                        },
                        grid: {
                            left: '20%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        xAxis : [
                            {
                                type : 'category',
                                data : xAxis
                            }
                        ],
                        yAxis : [
                            {
                                type : 'value'
                            }
                        ],
                        series : [
                            {
                                name:'访客数量',
                                type:'bar',
                                stack: '无',
                                label: {
                                    show: true,
                                    formatter: '{c}',
                                    position: 'insideBottom',
                                },
                                data: data
                            },
                        ]
                    }});
            }
        };
        requestTwo(reportType)
    }


    render() {
        if(this.state.indexNum == '2-1'){
            //访客
            return (
                <div>

                    <ReactEcharts
                        option={this.state.option}
                        style={{height: '350px', width: '1000px'}}
                        className='react_for_echarts' />
                    <br/><br/>
                    <Button type="primary" size="small" onClick={this.panelVisitorReq.bind(this,4,1)}>近一周</Button>
                    <Button type="primary" size="small" onClick={this.panelVisitorReq.bind(this,4,2)}>近一月</Button>
                    <Button type="primary" size="small" onClick={this.panelVisitorReq.bind(this,4,3)}>近一年</Button>
                    <ReactEcharts
                        option={this.state.optionBar}
                        style={{height: '350px', width: '1000px'}}
                        className='react_for_echarts' />
                    <br/><br/>
                </div>
            )
        }else{
            //机会
            return(
                <div>

                </div>
            )
        }
    }
}

export default CustomerServiceReport;