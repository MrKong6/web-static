import React from 'react'

import mainSize from "../../../utils/mainSize";
import fmtTitle from '../../../utils/fmtTitle';
import ajax from "../../../utils/ajax";
import {Button} from "element-react";
import ReactEcharts from 'echarts-for-react';
import {getBarOption, getChartOption, getFuuelChartOption, getMulYOption} from "../../../utils/const";

class SaleManageReport extends React.Component {
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
            typeId : this.props.typeId,
            fromWay : this.props.fromWay,
            reportType: 1,
            option: getChartOption(),
            optionLeadFunnel: getFuuelChartOption(),  //漏斗图（线索和机会）
            optionNum:getMulYOption(), //线索数量簇状柱状图 机会数量簇状柱状图
            optionOpporNum:getMulYOption(), //销售数量簇状柱状图
            optionOpporNumBar:getBarOption(),//销售数量堆积图
            optionBar:getBarOption(),
        };
        this.panelLeadReq = this.panelLeadReq.bind(this);
        this.panelOpporReqSplit = this.panelOpporReqSplit.bind(this);
    }

    componentDidMount() {
        if(this.state.typeId == 1){
            this.panelLeadReq();
        }else if(this.state.typeId == 2){
            this.panelOpporReqSplit(60,null);
        }
        mainSize();
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.typeId && nextProps.typeId != 0){
            this.state.typeId = nextProps.typeId;
            this.state.fromWay = nextProps.fromWay;

            this.setState({
                typeId: nextProps.typeId,
                fromWay: nextProps.fromWay,
                group: nextProps.changedCrmGroup
            })
            this.componentDidMount();
        }else{
            this.state.typeId = nextProps.typeId;
        }
    }

    //线索的数据渲染
    panelLeadReq() {
        const request = async () => {
            let list = await ajax('/mkt/leads/getStatisticCount.do', {
                orgId: this.state.group.id,
                cellphone: this.state.cellphone,
                pageNum: this.state.currentPage,
                pageSize: this.state.pageSize,
                fromWay: this.state.fromWay,
                typeId: this.state.typeId,
                isIn: 0
            });
            if (list) {
                let out = [];
                let inside = [];
                let legendText = [];
                out = list.twoMap;
                inside = list.oneMap;
                if (out && out.length > 0) {
                    out.map(item => {
                        legendText.push(item.name);
                    })
                }
                this.setState({
                    option: {
                        tooltip: {
                            trigger: 'item',
                            formatter: "{a} <br/>{b}: {c} ({d}%)"
                        },
                        legend: {
                            orient: 'vertical',
                            x: 'left',
                            data: legendText
                        },
                        series: [
                            {
                                name: '合计',
                                type: 'pie',
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
                                data: inside
                            },
                            {
                                name: '线索',
                                type: 'pie',
                                radius: ['40%', '55%'],
                                label: {
                                    normal: {
                                        formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                                        backgroundColor: '#eee',
                                        borderColor: '#aaa',
                                        borderWidth: 1,
                                        borderRadius: 4,
                                        rich: {
                                            a: {
                                                color: '#999',
                                                lineHeight: 22,
                                                align: 'center'
                                            },
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
                                data: out
                            }
                        ]
                    }
                });
            }
            //线索漏斗图
            let listStage = await ajax('/mkt/leads/getStageStatisticCount.do', {
                orgId: this.state.group.id,
                cellphone: this.state.cellphone,
                pageNum: this.state.currentPage,
                pageSize: this.state.pageSize,
                fromWay: this.state.fromWay,
                typeId: this.state.typeId,
                isIn: 0
            });
            if (listStage) {
                // debugger
                this.setState({
                    optionLeadFunnel: {
                        title: {
                            text: '线索阶段漏斗图',
                            // subtext: '纯属虚构'
                        },
                        tooltip: {
                            trigger: 'item',
                            formatter: "{a} <br/>{b} : {c}%"
                        },
                        legend: {
                            data: listStage.legend
                        },
                        calculable: false,
                        series: [
                            {
                                name: '漏斗图',
                                type: 'funnel',
                                left: '10%',
                                top: 60,
                                bottom: 60,
                                width: '80%',
                                sort: 'none', //descending
                                gap: 2,
                                label: {
                                    show: true,
                                    normal: {
                                        position: 'inside',
                                        formatter: '{c}',
                                    },
                                    emphasis: {
                                        position: 'inside',
                                        formatter: '{c}'
                                    }
                                },
                                /*label: {
                                    show: true,
                                    position: 'inside',
                                    formatter: '{c}',
                                },*/
                                /*emphasis: {
                                    label: {
                                        fontSize: 20
                                    }
                                },*/
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
                                data: listStage.data
                            }
                        ]
                    }
                });
            }
            //线索数量簇状图
            let listTwo = await ajax('/mkt/leads/getAllCountByDay.do', {
                orgId: this.state.group.id,
                cellphone: this.state.cellphone,
                pageNum: this.state.currentPage,
                pageSize: this.state.pageSize,
                fromWay: this.state.fromWay,
                typeId: this.state.typeId,
                reportType: this.state.reportType,
                isIn: 0
            });
            if (listTwo) {
                let legendText = [];
                let dataOne = [];
                let dataTwo = [];
                if (listTwo.dataOne && listTwo.dataOne.length > 0) {
                    listTwo.dataOne.map(item => {
                        legendText.push(item.showStr);
                        dataOne.push(item.code);
                    })
                }
                if (listTwo.dataTwo && listTwo.dataTwo.length > 0) {
                    listTwo.dataTwo.map(item => {
                        dataTwo.push(item.code);
                    })
                }
                // debugger
                this.setState({
                    optionNum: {
                        title: {
                            text: '线索数量簇状图',
                            // subtext: ''
                        },
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            data: ['本期', '上期']
                        },
                        calculable: true,
                        xAxis: [
                            {
                                type: 'category',
                                data: legendText
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value'
                            }
                        ],
                        series: [
                            {
                                name: '本期',
                                type: 'bar',
                                data: dataOne,
                            },
                            {
                                name: '上期',
                                type: 'bar',
                                data: dataTwo,
                            }
                        ]
                    }
                });
            }
        };
        request();
    }
    //机会数据渲染
    panelOpporReqSplit(type,reportType){
        //type  60是全更新
        const requestOne = async (rt) => {
            let list = await ajax('/mkt/leads/getStatisticCount.do', {orgId: this.state.group.id,cellphone:this.state.cellphone,
                pageNum:this.state.currentPage,pageSize:this.state.pageSize,fromWay:this.state.fromWay,typeId:this.state.typeId,
                isIn:0});
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
                                        rich: {
                                            a: {
                                                color: '#999',
                                                lineHeight: 22,
                                                align: 'center'
                                            },
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
        const requestTwo = async (rt) => {
            //机会 来源堆积图
            let listTwo = await ajax('/mkt/leads/getStatisticCountByDay.do', {orgId: this.state.group.id,cellphone:this.state.cellphone,
                fromWay:this.state.fromWay,typeId:this.state.typeId,isIn:0,reportType:rt ? rt : this.state.reportType});
            if(listTwo){
                let dataOne = [],dataTwo = [],dataThree = [],dataFour = [],xAxis=[];
                listTwo.dataOne.map(item => {
                    dataOne.push(item.code);xAxis.push(item.showStr);
                    this.state.optionBar.xAxis[0].data.push(item.showStr);
                    // this.state.optionBar.series[0].data.push();
                });
                listTwo.dataTwo.map(item => {
                    dataTwo.push(item.code);
                    // this.state.optionBar.series[0].data.push(item.code);
                });
                listTwo.dataThree.map(item => {
                    dataThree.push(item.code);
                    // this.state.optionBar.series[0].data.push(item.code);
                });
                listTwo.dataFour.map(item => {
                    dataFour.push(item.code);
                    // this.state.optionBar.series[0].data.push(item.code);
                });
                this.setState({optionBar: {
                        tooltip : {
                            trigger: 'axis',
                            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                            }
                        },
                        legend: {
                            orient: 'vertical',
                            x: 'left',
                            data:['访客->线索->机会','线索->机会','访客->机会','创建机会'],
                        },
                        grid: {
                            left: '20%',
                            right: '4%',
                            bottom: '3%',
                            top: '3%',
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
                                name:'访客->线索->机会',
                                type:'bar',
                                stack: '机会',
                                data:dataOne
                            },
                            {
                                name:'线索->机会',
                                type:'bar',
                                stack: '机会',
                                data:dataTwo
                            },
                            {
                                name:'访客->机会',
                                type:'bar',
                                stack: '机会',
                                data:dataFour
                            },
                            {
                                name:'创建机会',
                                type:'bar',
                                stack: '机会',
                                data:dataThree
                            }
                        ]
                    }});
            }
        };
        const requestThree = async (rt) => {
            //机会漏斗图  机会漏斗图
            let listStage = await ajax('/mkt/leads/getStageStatisticCount.do', {orgId: this.state.group.id,cellphone:this.state.cellphone,
                pageNum:this.state.currentPage,pageSize:this.state.pageSize,fromWay:this.state.fromWay,typeId:this.state.typeId,
                isIn:0});
            if(listStage){
                // debugger
                this.setState({optionLeadFunnel: {
                        title: {
                            text: '机会阶段漏斗图',
                            // subtext: '纯属虚构'
                        },
                        tooltip: {
                            trigger: 'item',
                            formatter: "{a} <br/>{b} : {c}%"
                        },
                        legend: {
                            orient: 'vertical',
                            x: 'left',
                            data: listStage.legend,
                            top: '10%',
                        },
                        calculable: true,
                        grid: {
                            top: '10%',
                        },
                        series: [
                            {
                                name:'漏斗图',
                                type:'funnel',
                                left: '20%',
                                top: 60,
                                bottom: 60,
                                width: '80%',
                                sort: 'none',
                                gap: 2,
                                label: {
                                    show: true,
                                    normal: {
                                        position: 'inside',
                                        formatter: '{c}',
                                    },
                                    emphasis: {
                                        position: 'inside',
                                        formatter: '{c}'
                                    }
                                },
                                /*label: {
                                    show: true,
                                    position: 'inside',
                                    formatter: '{c}',
                                },*/
                                /*emphasis: {
                                    label: {
                                        fontSize: 20
                                    }
                                },*/
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
                                data: listStage.data
                            }
                        ]
                    }});
            }
        };
        const requestFour = async (rt) => {
            //机会数量簇状图
            let listThree = await ajax('/mkt/leads/getAllCountByDay.do', {orgId: this.state.group.id,cellphone:this.state.cellphone,
                pageNum:this.state.currentPage,pageSize:this.state.pageSize,fromWay:this.state.fromWay,typeId:this.state.typeId,
                reportType:rt ? rt : this.state.reportType,
                isIn:0});
            if(listThree){
                let legendText = [];
                let dataOne = [];let dataTwo = [];
                if(listThree.dataOne && listThree.dataOne.length > 0){
                    listThree.dataOne.map(item => {
                        legendText.push(item.showStr);
                        dataOne.push(item.code);
                    })
                }
                if(listThree.dataTwo && listThree.dataTwo.length > 0){
                    listThree.dataTwo.map(item => {
                        dataTwo.push(item.code);
                    })
                }
                // debugger
                this.setState({optionNum: {
                        title : {
                            text: '机会数量簇状图',
                            // subtext: ''
                        },
                        tooltip : {
                            trigger: 'axis'
                        },
                        legend: {
                            data:['本期','上期']
                        },
                        calculable : true,
                        xAxis : [
                            {
                                type : 'category',
                                data : legendText
                            }
                        ],
                        yAxis : [
                            {
                                type : 'value'
                            }
                        ],
                        series : [
                            {
                                name:'本期',
                                type:'bar',
                                data:dataOne,
                            },
                            {
                                name:'上期',
                                type:'bar',
                                data:dataTwo,
                            }
                        ]
                    }});
            }
        };
        const requestFive = async (rt) => {
            //机会转化数量簇状图
            let listFour = await ajax('/mkt/leads/getAllCountByDay.do', {orgId: this.state.group.id,cellphone:this.state.cellphone,
                pageNum:this.state.currentPage,pageSize:this.state.pageSize,fromWay:this.state.fromWay,typeId:this.state.typeId,
                reportType:rt ? rt : this.state.reportType,isIn:0,statusId:13});
            if(listFour){
                let legendText = [];
                let dataOne = [];let dataTwo = [];
                if(listFour.dataOne && listFour.dataOne.length > 0){
                    listFour.dataOne.map(item => {
                        legendText.push(item.showStr);
                        dataOne.push(item.code);
                    })
                }
                if(listFour.dataTwo && listFour.dataTwo.length > 0){
                    listFour.dataTwo.map(item => {
                        dataTwo.push(item.code);
                    })
                }
                // debugger
                this.setState({optionOpporNum: {
                        title : {
                            text: '机会已转化数量簇状图',
                            // subtext: ''
                        },
                        tooltip : {
                            trigger: 'axis'
                        },
                        legend: {
                            data:['本期','上期']
                        },
                        calculable : true,
                        xAxis : [
                            {
                                type : 'category',
                                data : legendText
                            }
                        ],
                        yAxis : [
                            {
                                type : 'value'
                            }
                        ],
                        series : [
                            {
                                name:'本期',
                                type:'bar',
                                data:dataOne,
                            },
                            {
                                name:'上期',
                                type:'bar',
                                data:dataTwo,
                            }
                        ]
                    }});
            }
        };
        const requestSix = async (rt) => {
            //机会数量堆积图
            let listFive = await ajax('/mkt/leads/getSalesNumByPerson.do', {orgId: this.state.group.id,cellphone:this.state.cellphone,
                fromWay:this.state.fromWay,typeId:this.state.typeId,isIn:0,reportType:rt ? rt : this.state.reportType,statusId:13});
            if(listFive && listFive.dataOne && listFive.dataOne.length > 0){
                this.setState({optionOpporNumBar: {
                        title : {
                            text: '机会已转化数量堆积图',
                            // subtext: ''
                        },
                        tooltip : {
                            trigger: 'axis',
                            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                            }
                        },
                        legend: {
                            orient: 'vertical',
                            x: 'left',
                            data:['本期','上期'],
                        },
                        grid: {
                            left: '20%',
                            right: '4%',
                            bottom: '3%',
                            top: '3%',
                            containLabel: true
                        },
                        xAxis : [
                            {
                                type : 'category',
                                data : (listFive.dataOne && listFive.dataOne.length > 0) ? listFive.dataOne[0].xAixs : []
                            }
                        ],
                        yAxis : [
                            {
                                type : 'value'
                            }
                        ],
                        series : listFive.dataOne ? listFive.dataOne : []
                    }});
                console.log(this.state.optionOpporNumBar);
            }else{
                this.setState({optionOpporNumBar:getMulYOption()});
                }
        };
        if(type == 60 || type ==1){
            requestOne(reportType);
        }
        if(type == 60 || type ==2){
            requestTwo(reportType);
        }
        if(type == 60 || type ==3){
            requestThree(reportType);
        }
        if(type == 60 || type ==4){
            requestFour(reportType);
        }
        if(type == 60 || type ==5){
            requestFive(reportType);
        }
        if(type == 60 || type ==6){
            requestSix(reportType);
        }
    }

    //近一年  近一月
    changeRepportType(reportType,typeId){
        this.state.reportType = reportType;
        if(typeId == 2){
            this.panelLeadReq();
        }else if(typeId == 1){
            this.panelLeadReq();
        }else if(typeId == 3){
            this.panelLeadReq();
        }
    }

    render() {
        if(this.state.typeId == 1){
            //线索
            return (
                <div>

                    <ReactEcharts
                        option={this.state.option}
                        style={{height: '350px', width: '1000px'}}
                        className='react_for_echarts'/>
                    <br/><br/>
                    <ReactEcharts
                        option={this.state.optionLeadFunnel}
                        style={{maxWidth: '50%'}}
                        className='react_for_echarts'/>
                    <br/><br/>
                    <Button type="primary" size="small" onClick={this.changeRepportType.bind(this, 1, 1)}>近一周</Button>
                    <Button type="primary" size="small" onClick={this.changeRepportType.bind(this, 2, 1)}>近一月</Button>
                    <Button type="primary" size="small" onClick={this.changeRepportType.bind(this, 3, 1)}>近一年</Button>
                    <ReactEcharts
                        option={this.state.optionNum}
                        style={{height: '350px', width: '1000px'}}
                        className='react_for_echarts'/>
                    <br/><br/>
                </div>
            )
        }else if(this.state.typeId == 2){
            //机会
            return(
                <div>

                    <ReactEcharts
                        option={this.state.option}
                        style={{height: '350px', width: '1000px'}}
                        className='react_for_echarts' />
                    <br/><br/>
                    <Button type="primary" size="small" onClick={this.panelOpporReqSplit.bind(this,2,1)}>近一周</Button>
                    <Button type="primary" size="small" onClick={this.panelOpporReqSplit.bind(this,2,2)}>近一月</Button>
                    <Button type="primary" size="small" onClick={this.panelOpporReqSplit.bind(this,2,3)}>近一年</Button>
                    <ReactEcharts
                        option={this.state.optionBar}
                        style={{height: '350px', width: '1000px'}}
                        className='react_for_echarts' />
                    <br/><br/>
                    <br/><br/>
                    <ReactEcharts
                        option={this.state.optionLeadFunnel}
                        style={{height: '350px', width: '1000px'}}
                        className='react_for_echarts' />
                    <br/><br/>
                    <Button type="primary" size="small" onClick={this.panelOpporReqSplit.bind(this,4,1)}>近一周</Button>
                    <Button type="primary" size="small" onClick={this.panelOpporReqSplit.bind(this,4,2)}>近一月</Button>
                    <Button type="primary" size="small" onClick={this.panelOpporReqSplit.bind(this,4,3)}>近一年</Button>
                    <ReactEcharts
                        option={this.state.optionNum}
                        style={{height: '350px', width: '1000px'}}
                        className='react_for_echarts' />
                    <br/><br/>
                    <Button type="primary" size="small" onClick={this.panelOpporReqSplit.bind(this,5,1)}>近一周</Button>
                    <Button type="primary" size="small" onClick={this.panelOpporReqSplit.bind(this,5,2)}>近一月</Button>
                    <Button type="primary" size="small" onClick={this.panelOpporReqSplit.bind(this,5,3)}>近一年</Button>
                    <ReactEcharts
                        option={this.state.optionOpporNum}
                        style={{height: '350px', width: '1000px'}}
                        className='react_for_echarts' />
                    <br/><br/>
                    <br/><br/>
                    <Button type="primary" size="small" onClick={this.panelOpporReqSplit.bind(this,6,1)}>近一周</Button>
                    <Button type="primary" size="small" onClick={this.panelOpporReqSplit.bind(this,6,2)}>近一月</Button>
                    <Button type="primary" size="small" onClick={this.panelOpporReqSplit.bind(this,6,3)}>近一年</Button>
                    <ReactEcharts
                        option={this.state.optionOpporNumBar}
                        style={{height: '350px', width: '1000px'}}
                        className='react_for_echarts' />
                    <br/><br/>
                </div>
            )
        }else {
            return (<div></div>)
        }
    }
}

export default SaleManageReport;