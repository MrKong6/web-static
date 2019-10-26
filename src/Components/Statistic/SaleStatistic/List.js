import React from "react";
import ReactDOM from "react-dom";
import {Redirect} from 'react-router-dom'

import DialogTips from "../../Dialog/DialogTips";
import actProcess from "../../../utils/actProcess";
import mainSize from "../../../utils/mainSize";
import fmtTitle from '../../../utils/fmtTitle';
import ajax from "../../../utils/ajax";
import {Button, Table, Pagination, Upload, Input, Tooltip, Tabs, Card} from 'element-react';
import ReactEcharts from 'echarts-for-react';
import Commands from "../../Commands/Commands";
import {getBarOption, getChartOption, getFuuelChartOption, getMagicType, getMulYOption} from "../../../utils/const";

class List extends React.Component {
    constructor(props) {
        super(props);
        this.createDialogTips = this.createDialogTips.bind(this);
        this.goToDetails = this.goToDetails.bind(this);
        this.changePanel = this.changePanel.bind(this);
        this.changeRepportType = this.changeRepportType.bind(this);
        this.panelLeadReq = this.panelLeadReq.bind(this);
        this.panelOpporReq = this.panelOpporReq.bind(this);
        this.panelOpporReqSplit = this.panelOpporReqSplit.bind(this);
        this.panelVisitorReq = this.panelVisitorReq.bind(this);
        this.panelAcademyReq = this.panelAcademyReq.bind(this);

        this.modAction = this.modAction.bind(this);
        this.commands = this.props.commands.filter(command => (command.name === 'Show'));
        this.title = fmtTitle(this.props.location.pathname);
        this.state = {
            group: this.props.changedCrmGroup,
            list: [],
            ids: [],
            type : 2,
            typeId : 1,
            fromWay : 2,
            isAnimating: true,
            redirectToReferrer: false,
            optionBar:getBarOption(),
            reportType:1,
            option: getChartOption(),
            optionLeadFunnel: getFuuelChartOption(),  //漏斗图（线索和机会）
            optionNum:getMulYOption(), //线索数量簇状柱状图 机会数量簇状柱状图
            optionOpporNum:getMulYOption(), //销售数量簇状柱状图
            optionOpporNumBar:getBarOption(),//销售数量堆积图
            optionAcademyClassStatus:getMagicType(),//教务管理--班级状态--饼状图
            viewMode: 'Day',
            tasks: this.getTasks(),
        };
    }

    componentDidMount() {
        if(this.state.type == 1){

        }else if(this.state.type == 2){
            this.panelLeadReq();
        }else if(this.state.type == 3){
            this.panelVisitorReq();
        }else if(this.state.type == 4){
            this.panelAcademyReq();
        }
        mainSize()
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.changedCrmGroup.id !== nextProps.changedCrmGroup.id) {
            this.setState({isAnimating: true});

            const request = async () => {
                try {
                    let list = await ajax('/mkt/activity/list.do', {organizationId: nextProps.changedCrmGroup.id});
                    const ids = list.map((act) => (act.id));

                    this.setState({
                        group: nextProps.changedCrmGroup,
                        list: actProcess(list),
                        ids: ids
                    });
                } catch (err) {
                    if (err.errCode === 401) {
                        this.setState({redirectToReferrer: true})
                    } else {
                        this.createDialogTips(`${err.errCode}: ${err.errText}`);
                    }
                } finally {
                    this.setState({isAnimating: false});
                }
            };

            request();
        }
    }

    componentWillUnmount() {
        if (this.tipsContainer) {
            document.body.removeChild(this.tipsContainer);
        }
    }

    createDialogTips(text) {
        if (this.tips === undefined) {
            this.tipsContainer = document.createElement('div');

            ReactDOM.render(
                <DialogTips
                    accept={this.logout}
                    title="提示"
                    text={text}
                    ref={(dom) => {
                        this.tips = dom
                    }}
                />,
                document.body.appendChild(this.tipsContainer)
            );
        } else {
            this.tips.setText(text);
        }

        this.tips.dialog.modal('show');
    }

    goToDetails(data) {
        const url = `${this.props.match.url}/${data}`;

        this.props.history.push(url, {ids: this.state.ids});
    }
    //线索的数据渲染
    panelLeadReq(){
        const request = async () => {
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
            //线索漏斗图
            let listStage = await ajax('/mkt/leads/getStageStatisticCount.do', {orgId: this.state.group.id,cellphone:this.state.cellphone,
                pageNum:this.state.currentPage,pageSize:this.state.pageSize,fromWay:this.state.fromWay,typeId:this.state.typeId,
                isIn:0});
            if(listStage){
                // debugger
                this.setState({optionLeadFunnel: {
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
                                name:'漏斗图',
                                type:'funnel',
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
                    }});
            }
            //线索数量簇状图
            let listTwo = await ajax('/mkt/leads/getAllCountByDay.do', {orgId: this.state.group.id,cellphone:this.state.cellphone,
                pageNum:this.state.currentPage,pageSize:this.state.pageSize,fromWay:this.state.fromWay,typeId:this.state.typeId,reportType:this.state.reportType,
                isIn:0});
            if(listTwo){
                let legendText = [];
                let dataOne = [];let dataTwo = [];
                if(listTwo.dataOne && listTwo.dataOne.length > 0){
                    listTwo.dataOne.map(item => {
                        legendText.push(item.showStr);
                        dataOne.push(item.code);
                    })
                }
                if(listTwo.dataTwo && listTwo.dataTwo.length > 0){
                    listTwo.dataTwo.map(item => {
                        dataTwo.push(item.code);
                    })
                }
                // debugger
                this.setState({optionNum: {
                        title : {
                            text: '线索数量簇状图',
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
                fromWay:this.state.fromWay,typeId:this.state.typeId,isIn:0,reportType:this.state.reportType});
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
    panelOpporReq(reportType,opporReportType){
        const request = async () => {
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
            //机会 来源堆积图
            let listTwo = await ajax('/mkt/leads/getStatisticCountByDay.do', {orgId: this.state.group.id,cellphone:this.state.cellphone,
                fromWay:this.state.fromWay,typeId:this.state.typeId,isIn:0,reportType:this.state.reportType});
            if(listTwo){
                let dataOne = [],dataTwo = [],dataThree = [],dataFour = [],xAxis=[];
                listTwo.dataOne.map(item => {
                    dataOne.push(item.code);xAxis.push(item.showStr);
                    this.state.optionBar.xAxis[0].data.push(item.showStr);
                    this.state.optionBar.series[0].data.push();
                });
                listTwo.dataTwo.map(item => {
                    dataTwo.push(item.code);
                    this.state.optionBar.series[0].data.push(item.code);
                });
                listTwo.dataThree.map(item => {
                    dataThree.push(item.code);
                    this.state.optionBar.series[0].data.push(item.code);
                });
                listTwo.dataFour.map(item => {
                    dataFour.push(item.code);
                    this.state.optionBar.series[0].data.push(item.code);
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
                                sort: 'descending',
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
            //机会数量簇状图
            let listThree = await ajax('/mkt/leads/getAllCountByDay.do', {orgId: this.state.group.id,cellphone:this.state.cellphone,
                pageNum:this.state.currentPage,pageSize:this.state.pageSize,fromWay:this.state.fromWay,typeId:this.state.typeId,reportType:this.state.reportType,
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

            //机会转化数量簇状图
            let listFour = await ajax('/mkt/leads/getAllCountByDay.do', {orgId: this.state.group.id,cellphone:this.state.cellphone,
                pageNum:this.state.currentPage,pageSize:this.state.pageSize,fromWay:this.state.fromWay,typeId:this.state.typeId,
                reportType:reportType ? reportType : this.state.reportType,isIn:0,statusId:13});
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
            //机会数量堆积图
            let listFive = await ajax('/mkt/leads/getSalesNumByPerson.do', {orgId: this.state.group.id,cellphone:this.state.cellphone,
                fromWay:this.state.fromWay,typeId:this.state.typeId,isIn:0,reportType:opporReportType ? opporReportType : this.state.reportType,statusId:13});
            if(listFive){
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
            }
        };
        request();
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
            //机会数量簇状图
            let listThree = await ajax('/mkt/leads/getAllCountByDay.do', {orgId: this.state.group.id,cellphone:this.state.cellphone,
                pageNum:this.state.currentPage,pageSize:this.state.pageSize,fromWay:this.state.fromWay,typeId:5,
                reportType:rt ? rt : this.state.reportType,
                isIn:0});
            if(listThree && listThree.dataOne){
                let data = [],xAxis = [];
                listThree.dataOne.map(item => {
                    xAxis.push(item.showStr);
                    data.push(item.code);
                });
                this.setState({optionBar:{
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
                            data: data
                        },
                    ]
                }});
            }
        };
        requestTwo(reportType)
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
                            data:list.data.columns
                        },
                        calculable : true,
                        series : [
                            {
                                name:'班级状态',
                                type:'pie',
                                radius : [50, 110],
                                roseType : 'area',
                                data:list.data.data
                            }
                        ]
                    }});
            }
        };
        request();
    }
    //销售管理机会和线索面板切换
    changePanel(tab) {
        console.log(tab);
        if(tab.props.name == '2'){
            //机会
            this.state.typeId = 2;
            this.state.fromWay = 3;
            // this.panelOpporReq();
            this.panelOpporReqSplit(60,null);
        }else if(tab.props.name == '1'){
            //线索
            this.state.typeId = 1;
            this.state.fromWay = 2;
            this.panelLeadReq();
        }
    }
    //顶部导航切换
    modAction(evt){
        let type = 1;
        if(evt && evt.target.innerHTML == "市场管理"){
            type = 1;
        }else if(evt && evt.target.innerHTML == "销售管理"){
            type = 2;
        }else if(evt && evt.target.innerHTML == "客户服务"){
            type = 3;
        }else if(evt && evt.target.innerHTML == "教务管理"){
            type = 4;
        }
        this.state.type=type;
        this.setState({type:type});
        this.componentDidMount();
    }

    changeRepportType(reportType,typeId){
        this.state.reportType = reportType;
        if(typeId == 2){
            let tab= {'props':{'name':2}};
            this.changePanel(tab);
        }else if(typeId == 1){
            this.componentDidMount();
        }else if(typeId == 3){
            this.componentDidMount();
        }
    }


    componentDidMount() {
        window.setInterval(function() {
            this.setState({
                viewMode: ['Quarter Day', 'Half Day', 'Day', 'Week', 'Month'][parseInt(Math.random() * 5 + 1) - 1],
                tasks: this.getTasks().slice(0, parseInt(Math.random() * 4 + 1))
            });
        }.bind(this), 5000)
    };

    getTasks = () => {
        let names = [
            ["Redesign website", [0, 7]],
            ["Write new content", [1, 4]],
            ["Apply new styles", [3, 6]],
            ["Review", [7, 7]],
            ["Deploy", [8, 9]],
            ["Go Live!", [10, 10]]
        ];

        let tasks = names.map(function(name, i) {
            let today = new Date();
            let start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            let end = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            start.setDate(today.getDate() + name[1][0]);
            end.setDate(today.getDate() + name[1][1]);
            return {
                start: start,
                end: end,
                name: name[0],
                id: "Task " + i,
                progress: parseInt(Math.random() * 100, 10)
            }
        });
        tasks[1].dependencies = "Task 0";
        tasks[2].dependencies = "Task 1, Task 0";
        tasks[3].dependencies = "Task 2";
        tasks[5].dependencies = "Task 4";

        tasks[0].custom_class = "bar-milestone";
        tasks[0].progress = 60;
        return tasks;
    };

    customPopupHtml = task => {
        const end_date = task._end.format('MMM D');
        return `
                  <div class="details-container">
                    <h5>${task.name}</h5>
                    <p>Expected to finish by ${end_date}</p>
                    <p>${task.progress}% completed!</p>
                  </div>
                `;
    };

    render() {

        if (this.state.redirectToReferrer) {
            return (
                <Redirect to={{
                    pathname: '/login',
                    state: {from: this.props.location}
                }}/>
            )
        }
        if(this.state.type == 1){
            return (
                <div>
                    <h5 id="subNav">
                        <i className={`fa ${this.title.icon}`} aria-hidden="true"/>&nbsp;{this.title.text}
                        <Commands
                            commands={this.commands}
                            modAction={this.modAction}
                        />
                    </h5>
                    <div id="main" className="main p-3">
                        <Tabs activeName="1" onTabClick={ (tab) => console.log(tab.props.name) }>
                            <Tabs.Pane label="市场活动" name="1"></Tabs.Pane>
                        </Tabs>
                    </div>
                </div>
            )
        }else if(this.state.type == 2){
            return (
                <div>
                    <h5 id="subNav">
                        <i className={`fa ${this.title.icon}`} aria-hidden="true"/>&nbsp;{this.title.text}
                        <Commands
                            commands={this.commands}
                            modAction={this.modAction}
                        />
                    </h5>
                    <div id="main" className="main p-3">
                        <Tabs activeName="1" onTabClick={this.changePanel }>
                            <Tabs.Pane label="线索" name="1">
                                <ReactEcharts
                                    option={this.state.option}
                                    style={{height: '350px', width: '1000px'}}
                                    className='react_for_echarts' />
                                <br/><br/>
                                <ReactEcharts
                                    option={this.state.optionLeadFunnel}
                                    style={{maxWidth: '50%'}}
                                    className='react_for_echarts' />
                                <br/><br/>
                                <Button type="primary" size="small" onClick={this.changeRepportType.bind(this,1,1)}>近一周</Button>
                                <Button type="primary" size="small" onClick={this.changeRepportType.bind(this,2,1)}>近一月</Button>
                                <Button type="primary" size="small" onClick={this.changeRepportType.bind(this,3,1)}>近一年</Button>
                                <ReactEcharts
                                    option={this.state.optionNum}
                                    style={{height: '350px', width: '1000px'}}
                                    className='react_for_echarts' />
                                <br/><br/>
                            </Tabs.Pane>
                            <Tabs.Pane label="机会" name="2">
                                <ReactEcharts
                                    option={this.state.option}
                                    style={{height: '350px', width: '1000px'}}
                                    className='react_for_echarts' />
                                <br/><br/>
                                <Button type="primary" size="small" onClick={this.changeRepportType.bind(this,1,2)}>近一周</Button>
                                <Button type="primary" size="small" onClick={this.changeRepportType.bind(this,2,2)}>近一月</Button>
                                <Button type="primary" size="small" onClick={this.changeRepportType.bind(this,3,2)}>近一年</Button>
                                <ReactEcharts
                                    option={this.state.optionBar}
                                    style={{height: '350px', width: '1000px'}}
                                    className='react_for_echarts' />
                                <br/><br/>
                                <ReactEcharts
                                    option={this.state.optionLeadFunnel}
                                    style={{maxWidth: '50%'}}
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
                            </Tabs.Pane>
                        </Tabs>
                    </div>
                </div>
            )
        }else if(this.state.type == 3){
            return (
                <div>
                    <h5 id="subNav">
                        <i className={`fa ${this.title.icon}`} aria-hidden="true"/>&nbsp;{this.title.text}
                        <Commands
                            commands={this.commands}
                            modAction={this.modAction}
                        />
                    </h5>
                    <div id="main" className="main p-3">
                        <Tabs activeName="1" onTabClick={ (tab) => console.log(tab.props.name) }>
                            <Tabs.Pane label="访客" name="1">
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
                            </Tabs.Pane>
                            <Tabs.Pane label="合同" name="2">
                            </Tabs.Pane>
                            <Tabs.Pane label="学员" name="3"></Tabs.Pane>
                        </Tabs>
                    </div>
                </div>
            )
        }else if(this.state.type == 4){
            return (
                <div>
                    <h5 id="subNav">
                        <i className={`fa ${this.title.icon}`} aria-hidden="true"/>&nbsp;{this.title.text}
                        <Commands
                            commands={this.commands}
                            modAction={this.modAction}
                        />
                    </h5>
                    <div id="main" className="main p-3">
                        <Card className="box-card">
                            <ReactEcharts
                                option={this.state.optionAcademyClassStatus}
                                style={{height: '350px', width: '1000px'}}
                                className='react_for_echarts' />
                        </Card>
                        <Card className="box-card">

                        </Card>
                    </div>
                </div>
            )
        }

    }
}

export default List;