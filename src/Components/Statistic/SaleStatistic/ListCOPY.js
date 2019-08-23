// import React from "react";
// import ReactDOM from "react-dom";
// import {Redirect} from 'react-router-dom'
//
// import DialogTips from "../../Dialog/DialogTips";
// import actProcess from "../../../utils/actProcess";
// import mainSize from "../../../utils/mainSize";
// import fmtTitle from '../../../utils/fmtTitle';
// import ajax from "../../../utils/ajax";
// import {Button, Table, Pagination, Upload, Input, Tooltip, Tabs} from 'element-react';
// import ReactEcharts from 'echarts-for-react';
// import Commands from "../../Commands/Commands";
// import {getBarOption,getChartOption,getFuuelChartOption,getMulYOption} from "../../../utils/const";
//
// class List extends React.Component {
//     constructor(props) {
//         super(props);
//         this.createDialogTips = this.createDialogTips.bind(this);
//         this.goToDetails = this.goToDetails.bind(this);
//         this.changePanel = this.changePanel.bind(this);
//         this.changeRepportType = this.changeRepportType.bind(this);
//         this.panelLeadReq = this.panelLeadReq.bind(this);
//         this.panelOpporReq = this.panelOpporReq.bind(this);
//         this.panelVisitorReq = this.panelVisitorReq.bind(this);
//         this.modAction = this.modAction.bind(this);
//         this.commands = this.props.commands.filter(command => (command.name === 'Show'));
//         this.title = fmtTitle(this.props.location.pathname);
//         this.state = {
//             group: this.props.changedCrmGroup,
//             list: [],
//             ids: [],
//             type : 2,
//             typeId : 1,
//             fromWay : 2,
//             isAnimating: true,
//             redirectToReferrer: false,
//             optionBar:getBarOption(),
//             reportType:1,
//             option: getChartOption(),
//             optionLeadFunnel: getFuuelChartOption(),  //漏斗图（线索和机会）
//             optionNum:getMulYOption(), //线索数量簇状柱状图 机会数量簇状柱状图
//             optionOpporNum:getMulYOption(), //销售数量簇状柱状图
//         };
//
//     }
//
//     componentDidMount() {
//
//         /*const request = async () => {
//             try {
//                 if(this.state.type == 1){
//
//                 }else if(this.state.type == 2){
//                     /!*let list = await ajax('/mkt/leads/getStatisticCount.do', {orgId: this.state.group.id,cellphone:this.state.cellphone,
//                         pageNum:this.state.currentPage,pageSize:this.state.pageSize,fromWay:this.state.fromWay,typeId:this.state.typeId,
//                         isIn:0});
//                     if(list){
//                         let out = [];
//                         let inside = [];
//                         let legendText = [];
//                         out = list.twoMap;
//                         inside = list.oneMap;
//                         if(out && out.length > 0){
//                             out.map(item => {
//                                 legendText.push(item.name);
//                             })
//                         }
//                         this.setState({option: {
//                                 tooltip: {
//                                     trigger: 'item',
//                                     formatter: "{a} <br/>{b}: {c} ({d}%)"
//                                 },
//                                 legend: {
//                                     orient: 'vertical',
//                                     x: 'left',
//                                     data:legendText
//                                 },
//                                 series: [
//                                     {
//                                         name:'合计',
//                                         type:'pie',
//                                         selectedMode: 'single',
//                                         radius: [0, '30%'],
//
//                                         label: {
//                                             normal: {
//                                                 position: 'inner'
//                                             }
//                                         },
//                                         labelLine: {
//                                             normal: {
//                                                 show: false
//                                             }
//                                         },
//                                         data:inside
//                                     },
//                                     {
//                                         name:'线索',
//                                         type:'pie',
//                                         radius: ['40%', '55%'],
//                                         label: {
//                                             normal: {
//                                                 formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
//                                                 backgroundColor: '#eee',
//                                                 borderColor: '#aaa',
//                                                 borderWidth: 1,
//                                                 borderRadius: 4,
//                                                 rich: {
//                                                     a: {
//                                                         color: '#999',
//                                                         lineHeight: 22,
//                                                         align: 'center'
//                                                     },
//                                                     hr: {
//                                                         borderColor: '#aaa',
//                                                         width: '100%',
//                                                         borderWidth: 0.5,
//                                                         height: 0
//                                                     },
//                                                     b: {
//                                                         fontSize: 16,
//                                                         lineHeight: 33
//                                                     },
//                                                     per: {
//                                                         color: '#eee',
//                                                         backgroundColor: '#334455',
//                                                         padding: [2, 4],
//                                                         borderRadius: 2
//                                                     }
//                                                 }
//                                             }
//                                         },
//                                         data:out
//                                     }
//                                 ]
//                             }});
//                     }
//                     //线索漏斗图
//                     let listStage = await ajax('/mkt/leads/getStageStatisticCount.do', {orgId: this.state.group.id,cellphone:this.state.cellphone,
//                         pageNum:this.state.currentPage,pageSize:this.state.pageSize,fromWay:this.state.fromWay,typeId:this.state.typeId,
//                         isIn:0});
//                     if(listStage){
//                         // debugger
//                         this.setState({optionLeadFunnel: {
//                                 title: {
//                                     text: '线索阶段漏斗图',
//                                     // subtext: '纯属虚构'
//                                 },
//                                 tooltip: {
//                                     trigger: 'item',
//                                     formatter: "{a} <br/>{b} : {c}%"
//                                 },
//                                 legend: {
//                                     data: listStage.legend
//                                 },
//                                 calculable: true,
//                                 series: [
//                                     {
//                                         name:'漏斗图',
//                                         type:'funnel',
//                                         left: '10%',
//                                         top: 60,
//                                         bottom: 60,
//                                         width: '80%',
//                                         sort: 'descending',
//                                         gap: 2,
//                                         label: {
//                                             show: true,
//                                             normal: {
//                                                 position: 'inside',
//                                                 formatter: '{c}',
//                                             },
//                                             emphasis: {
//                                                 position: 'inside',
//                                                 formatter: '{c}'
//                                             }
//                                         },
//                                         /!*label: {
//                                             show: true,
//                                             position: 'inside',
//                                             formatter: '{c}',
//                                         },*!/
//                                         /!*emphasis: {
//                                             label: {
//                                                 fontSize: 20
//                                             }
//                                         },*!/
//                                         labelLine: {
//                                             length: 10,
//                                             lineStyle: {
//                                                 width: 1,
//                                                 type: 'solid'
//                                             }
//                                         },
//                                         itemStyle: {
//                                             borderColor: '#fff',
//                                             borderWidth: 1
//                                         },
//                                         data: listStage.data
//                                     }
//                                 ]
//                             }});
//                     }
//                     //线索数量簇状图
//                     let listTwo = await ajax('/mkt/leads/getAllCountByDay.do', {orgId: this.state.group.id,cellphone:this.state.cellphone,
//                         pageNum:this.state.currentPage,pageSize:this.state.pageSize,fromWay:this.state.fromWay,typeId:this.state.typeId,reportType:this.state.reportType,
//                         isIn:0});
//                     if(listTwo){
//                         let legendText = [];
//                         let dataOne = [];let dataTwo = [];
//                         if(listTwo.dataOne && listTwo.dataOne.length > 0){
//                             listTwo.dataOne.map(item => {
//                                 legendText.push(item.showStr);
//                                 dataOne.push(item.code);
//                             })
//                         }
//                         if(listTwo.dataTwo && listTwo.dataTwo.length > 0){
//                             listTwo.dataTwo.map(item => {
//                                 dataTwo.push(item.code);
//                             })
//                         }
//                         // debugger
//                         this.setState({optionNum: {
//                                 title : {
//                                     text: '线索数量簇状图',
//                                     // subtext: ''
//                                 },
//                                 tooltip : {
//                                     trigger: 'axis'
//                                 },
//                                 legend: {
//                                     data:['本期','上期']
//                                 },
//                                 calculable : true,
//                                 xAxis : [
//                                     {
//                                         type : 'category',
//                                         data : legendText
//                                     }
//                                 ],
//                                 yAxis : [
//                                     {
//                                         type : 'value'
//                                     }
//                                 ],
//                                 series : [
//                                     {
//                                         name:'本期',
//                                         type:'bar',
//                                         data:dataOne,
//                                     },
//                                     {
//                                         name:'上期',
//                                         type:'bar',
//                                         data:dataTwo,
//                                     }
//                                 ]
//                             }});
//                     }*!/
//
//                 }else if(this.state.type == 3){
//                     let list = await ajax('/mkt/leads/getStatisticCount.do', {orgId: this.state.group.id,cellphone:this.state.cellphone,
//                         pageNum:this.state.currentPage,pageSize:this.state.pageSize,fromWay:1,
//                         isIn:0,typeId:4});
//                     if(list){
//                         let out = [];
//                         let inside = [];
//                         let legendText = [];
//                         out = list.twoMap;
//                         inside = list.oneMap;
//                         if(out && out.length > 0){
//                             out.map(item => {
//                                 legendText.push(item.name);
//                             })
//                         }
//                         this.setState({option: {
//                                 tooltip: {
//                                     trigger: 'item',
//                                     formatter: "{a} <br/>{b}: {c} ({d}%)"
//                                 },
//                                 legend: {
//                                     orient: 'vertical',
//                                     x: 'left',
//                                     data:legendText
//                                 },
//                                 series: [
//                                     {
//                                         name:'合计',
//                                         type:'pie',
//                                         selectedMode: 'single',
//                                         radius: [0, '30%'],
//
//                                         label: {
//                                             normal: {
//                                                 position: 'inner'
//                                             }
//                                         },
//                                         labelLine: {
//                                             normal: {
//                                                 show: false
//                                             }
//                                         },
//                                         data:inside
//                                     },
//                                     {
//                                         name:'线索',
//                                         type:'pie',
//                                         radius: ['40%', '55%'],
//                                         label: {
//                                             normal: {
//                                                 formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
//                                                 backgroundColor: '#eee',
//                                                 borderColor: '#aaa',
//                                                 borderWidth: 1,
//                                                 borderRadius: 4,
//                                                 // shadowBlur:3,
//                                                 // shadowOffsetX: 2,
//                                                 // shadowOffsetY: 2,
//                                                 // shadowColor: '#999',
//                                                 // padding: [0, 7],
//                                                 rich: {
//                                                     a: {
//                                                         color: '#999',
//                                                         lineHeight: 22,
//                                                         align: 'center'
//                                                     },
//                                                     // abg: {
//                                                     //     backgroundColor: '#333',
//                                                     //     width: '100%',
//                                                     //     align: 'right',
//                                                     //     height: 22,
//                                                     //     borderRadius: [4, 4, 0, 0]
//                                                     // },
//                                                     hr: {
//                                                         borderColor: '#aaa',
//                                                         width: '100%',
//                                                         borderWidth: 0.5,
//                                                         height: 0
//                                                     },
//                                                     b: {
//                                                         fontSize: 16,
//                                                         lineHeight: 33
//                                                     },
//                                                     per: {
//                                                         color: '#eee',
//                                                         backgroundColor: '#334455',
//                                                         padding: [2, 4],
//                                                         borderRadius: 2
//                                                     }
//                                                 }
//                                             }
//                                         },
//                                         data:out
//                                     }
//                                 ]
//                             }});
//                     }
//                 }
//             } catch (err) {
//                 if (err.errCode === 401) {
//                     this.setState({redirectToReferrer: true})
//                 } else {
//                     this.createDialogTips(`${err.errCode}: ${err.errText}`);
//                 }
//             } finally {
//                 this.setState({isAnimating: false});
//             }
//         };
//
//         request();
//         mainSize()*/
//         if(this.state.type == 1){
//
//         }else if(this.state.type == 2){
//             this.panelLeadReq();
//         }else if(this.state.type == 3){
//             this.panelVisitorReq();
//         }
//         mainSize()
//     }
//
//     componentWillReceiveProps(nextProps) {
//         if (this.props.changedCrmGroup.id !== nextProps.changedCrmGroup.id) {
//             this.setState({isAnimating: true});
//
//             const request = async () => {
//                 try {
//                     let list = await ajax('/mkt/activity/list.do', {organizationId: nextProps.changedCrmGroup.id});
//                     const ids = list.map((act) => (act.id));
//
//                     this.setState({
//                         group: nextProps.changedCrmGroup,
//                         list: actProcess(list),
//                         ids: ids
//                     });
//                 } catch (err) {
//                     if (err.errCode === 401) {
//                         this.setState({redirectToReferrer: true})
//                     } else {
//                         this.createDialogTips(`${err.errCode}: ${err.errText}`);
//                     }
//                 } finally {
//                     this.setState({isAnimating: false});
//                 }
//             };
//
//             request();
//         }
//     }
//
//     componentWillUnmount() {
//         if (this.tipsContainer) {
//             document.body.removeChild(this.tipsContainer);
//         }
//     }
//
//     createDialogTips(text) {
//         if (this.tips === undefined) {
//             this.tipsContainer = document.createElement('div');
//
//             ReactDOM.render(
//                 <DialogTips
//                     accept={this.logout}
//                     title="提示"
//                     text={text}
//                     ref={(dom) => {
//                         this.tips = dom
//                     }}
//                 />,
//                 document.body.appendChild(this.tipsContainer)
//             );
//         } else {
//             this.tips.setText(text);
//         }
//
//         this.tips.dialog.modal('show');
//     }
//
//     goToDetails(data) {
//         const url = `${this.props.match.url}/${data}`;
//
//         this.props.history.push(url, {ids: this.state.ids});
//     }
//
//     panelLeadReq(){
//         const request = async () => {
//             let list = await ajax('/mkt/leads/getStatisticCount.do', {orgId: this.state.group.id,cellphone:this.state.cellphone,
//                 pageNum:this.state.currentPage,pageSize:this.state.pageSize,fromWay:this.state.fromWay,typeId:this.state.typeId,
//                 isIn:0});
//             if(list){
//                 let out = [];
//                 let inside = [];
//                 let legendText = [];
//                 out = list.twoMap;
//                 inside = list.oneMap;
//                 if(out && out.length > 0){
//                     out.map(item => {
//                         legendText.push(item.name);
//                     })
//                 }
//                 this.setState({option: {
//                         tooltip: {
//                             trigger: 'item',
//                             formatter: "{a} <br/>{b}: {c} ({d}%)"
//                         },
//                         legend: {
//                             orient: 'vertical',
//                             x: 'left',
//                             data:legendText
//                         },
//                         series: [
//                             {
//                                 name:'合计',
//                                 type:'pie',
//                                 selectedMode: 'single',
//                                 radius: [0, '30%'],
//
//                                 label: {
//                                     normal: {
//                                         position: 'inner'
//                                     }
//                                 },
//                                 labelLine: {
//                                     normal: {
//                                         show: false
//                                     }
//                                 },
//                                 data:inside
//                             },
//                             {
//                                 name:'线索',
//                                 type:'pie',
//                                 radius: ['40%', '55%'],
//                                 label: {
//                                     normal: {
//                                         formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
//                                         backgroundColor: '#eee',
//                                         borderColor: '#aaa',
//                                         borderWidth: 1,
//                                         borderRadius: 4,
//                                         rich: {
//                                             a: {
//                                                 color: '#999',
//                                                 lineHeight: 22,
//                                                 align: 'center'
//                                             },
//                                             hr: {
//                                                 borderColor: '#aaa',
//                                                 width: '100%',
//                                                 borderWidth: 0.5,
//                                                 height: 0
//                                             },
//                                             b: {
//                                                 fontSize: 16,
//                                                 lineHeight: 33
//                                             },
//                                             per: {
//                                                 color: '#eee',
//                                                 backgroundColor: '#334455',
//                                                 padding: [2, 4],
//                                                 borderRadius: 2
//                                             }
//                                         }
//                                     }
//                                 },
//                                 data:out
//                             }
//                         ]
//                     }});
//             }
//             //线索漏斗图
//             let listStage = await ajax('/mkt/leads/getStageStatisticCount.do', {orgId: this.state.group.id,cellphone:this.state.cellphone,
//                 pageNum:this.state.currentPage,pageSize:this.state.pageSize,fromWay:this.state.fromWay,typeId:this.state.typeId,
//                 isIn:0});
//             if(listStage){
//                 // debugger
//                 this.setState({optionLeadFunnel: {
//                         title: {
//                             text: '线索阶段漏斗图',
//                             // subtext: '纯属虚构'
//                         },
//                         tooltip: {
//                             trigger: 'item',
//                             formatter: "{a} <br/>{b} : {c}%"
//                         },
//                         legend: {
//                             data: listStage.legend
//                         },
//                         calculable: true,
//                         series: [
//                             {
//                                 name:'漏斗图',
//                                 type:'funnel',
//                                 left: '10%',
//                                 top: 60,
//                                 bottom: 60,
//                                 width: '80%',
//                                 sort: 'descending',
//                                 gap: 2,
//                                 label: {
//                                     show: true,
//                                     normal: {
//                                         position: 'inside',
//                                         formatter: '{c}',
//                                     },
//                                     emphasis: {
//                                         position: 'inside',
//                                         formatter: '{c}'
//                                     }
//                                 },
//                                 /*label: {
//                                     show: true,
//                                     position: 'inside',
//                                     formatter: '{c}',
//                                 },*/
//                                 /*emphasis: {
//                                     label: {
//                                         fontSize: 20
//                                     }
//                                 },*/
//                                 labelLine: {
//                                     length: 10,
//                                     lineStyle: {
//                                         width: 1,
//                                         type: 'solid'
//                                     }
//                                 },
//                                 itemStyle: {
//                                     borderColor: '#fff',
//                                     borderWidth: 1
//                                 },
//                                 data: listStage.data
//                             }
//                         ]
//                     }});
//             }
//             //线索数量簇状图
//             let listTwo = await ajax('/mkt/leads/getAllCountByDay.do', {orgId: this.state.group.id,cellphone:this.state.cellphone,
//                 pageNum:this.state.currentPage,pageSize:this.state.pageSize,fromWay:this.state.fromWay,typeId:this.state.typeId,reportType:this.state.reportType,
//                 isIn:0});
//             if(listTwo){
//                 let legendText = [];
//                 let dataOne = [];let dataTwo = [];
//                 if(listTwo.dataOne && listTwo.dataOne.length > 0){
//                     listTwo.dataOne.map(item => {
//                         legendText.push(item.showStr);
//                         dataOne.push(item.code);
//                     })
//                 }
//                 if(listTwo.dataTwo && listTwo.dataTwo.length > 0){
//                     listTwo.dataTwo.map(item => {
//                         dataTwo.push(item.code);
//                     })
//                 }
//                 // debugger
//                 this.setState({optionNum: {
//                         title : {
//                             text: '线索数量簇状图',
//                             // subtext: ''
//                         },
//                         tooltip : {
//                             trigger: 'axis'
//                         },
//                         legend: {
//                             data:['本期','上期']
//                         },
//                         calculable : true,
//                         xAxis : [
//                             {
//                                 type : 'category',
//                                 data : legendText
//                             }
//                         ],
//                         yAxis : [
//                             {
//                                 type : 'value'
//                             }
//                         ],
//                         series : [
//                             {
//                                 name:'本期',
//                                 type:'bar',
//                                 data:dataOne,
//                             },
//                             {
//                                 name:'上期',
//                                 type:'bar',
//                                 data:dataTwo,
//                             }
//                         ]
//                     }});
//             }
//         };
//         request();
//     }
//     panelOpporReq(){
//         const request = async () => {
//             let list = await ajax('/mkt/leads/getStatisticCount.do', {orgId: this.state.group.id,cellphone:this.state.cellphone,
//                 pageNum:this.state.currentPage,pageSize:this.state.pageSize,fromWay:this.state.fromWay,typeId:this.state.typeId,
//                 isIn:0});
//             if(list){
//                 let out = [];
//                 let inside = [];
//                 let legendText = [];
//                 out = list.twoMap;
//                 inside = list.oneMap;
//                 if(out && out.length > 0){
//                     out.map(item => {
//                         legendText.push(item.name);
//                     })
//                 }
//                 this.setState({option: {
//                         tooltip: {
//                             trigger: 'item',
//                             formatter: "{a} <br/>{b}: {c} ({d}%)"
//                         },
//                         legend: {
//                             orient: 'vertical',
//                             x: 'left',
//                             data:legendText
//                         },
//                         series: [
//                             {
//                                 name:'合计',
//                                 type:'pie',
//                                 selectedMode: 'single',
//                                 radius: [0, '30%'],
//
//                                 label: {
//                                     normal: {
//                                         position: 'inner'
//                                     }
//                                 },
//                                 labelLine: {
//                                     normal: {
//                                         show: false
//                                     }
//                                 },
//                                 data:inside
//                             },
//                             {
//                                 name:'线索',
//                                 type:'pie',
//                                 radius: ['40%', '55%'],
//                                 label: {
//                                     normal: {
//                                         formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
//                                         backgroundColor: '#eee',
//                                         borderColor: '#aaa',
//                                         borderWidth: 1,
//                                         borderRadius: 4,
//                                         rich: {
//                                             a: {
//                                                 color: '#999',
//                                                 lineHeight: 22,
//                                                 align: 'center'
//                                             },
//                                             hr: {
//                                                 borderColor: '#aaa',
//                                                 width: '100%',
//                                                 borderWidth: 0.5,
//                                                 height: 0
//                                             },
//                                             b: {
//                                                 fontSize: 16,
//                                                 lineHeight: 33
//                                             },
//                                             per: {
//                                                 color: '#eee',
//                                                 backgroundColor: '#334455',
//                                                 padding: [2, 4],
//                                                 borderRadius: 2
//                                             }
//                                         }
//                                     }
//                                 },
//                                 data:out
//                             }
//                         ]
//                     }});
//             }
//             let listTwo = await ajax('/mkt/leads/getStatisticCountByDay.do', {orgId: this.state.group.id,cellphone:this.state.cellphone,
//                 fromWay:this.state.fromWay,typeId:this.state.typeId,isIn:0,reportType:this.state.reportType});
//             if(listTwo){
//                 let dataOne = [],dataTwo = [],dataThree = [],dataFour = [],xAxis=[];
//                 listTwo.dataOne.map(item => {
//                     dataOne.push(item.code);xAxis.push(item.showStr);
//                     this.state.optionBar.xAxis[0].data.push(item.showStr);
//                     this.state.optionBar.series[0].data.push();
//                 });
//                 listTwo.dataTwo.map(item => {
//                     dataTwo.push(item.code);
//                     this.state.optionBar.series[0].data.push(item.code);
//                 });
//                 listTwo.dataThree.map(item => {
//                     dataThree.push(item.code);
//                     this.state.optionBar.series[0].data.push(item.code);
//                 });
//                 listTwo.dataFour.map(item => {
//                     dataFour.push(item.code);
//                     this.state.optionBar.series[0].data.push(item.code);
//                 });
//                 this.setState({optionBar: {
//                         tooltip : {
//                             trigger: 'axis',
//                             axisPointer : {            // 坐标轴指示器，坐标轴触发有效
//                                 type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
//                             }
//                         },
//                         legend: {
//                             orient: 'vertical',
//                             x: 'left',
//                             data:['访客->线索->机会','线索->机会','访客->机会','创建机会'],
//                         },
//                         grid: {
//                             left: '20%',
//                             right: '4%',
//                             bottom: '3%',
//                             top: '3%',
//                             containLabel: true
//                         },
//                         xAxis : [
//                             {
//                                 type : 'category',
//                                 data : xAxis
//                             }
//                         ],
//                         yAxis : [
//                             {
//                                 type : 'value'
//                             }
//                         ],
//                         series : [
//                             {
//                                 name:'访客->线索->机会',
//                                 type:'bar',
//                                 stack: '机会',
//                                 data:dataOne
//                             },
//                             {
//                                 name:'线索->机会',
//                                 type:'bar',
//                                 stack: '机会',
//                                 data:dataTwo
//                             },
//                             {
//                                 name:'访客->机会',
//                                 type:'bar',
//                                 stack: '机会',
//                                 data:dataFour
//                             },
//                             {
//                                 name:'创建机会',
//                                 type:'bar',
//                                 stack: '机会',
//                                 data:dataThree
//                             }
//                         ]
//                     }});
//             }
//             //线索漏斗图  机会漏斗图
//             let listStage = await ajax('/mkt/leads/getStageStatisticCount.do', {orgId: this.state.group.id,cellphone:this.state.cellphone,
//                 pageNum:this.state.currentPage,pageSize:this.state.pageSize,fromWay:this.state.fromWay,typeId:this.state.typeId,
//                 isIn:0});
//             if(listStage){
//                 // debugger
//                 this.setState({optionLeadFunnel: {
//                         title: {
//                             text: '机会阶段漏斗图',
//                             // subtext: '纯属虚构'
//                         },
//                         tooltip: {
//                             trigger: 'item',
//                             formatter: "{a} <br/>{b} : {c}%"
//                         },
//                         legend: {
//                             orient: 'vertical',
//                             x: 'left',
//                             data: listStage.legend,
//                             top: '10%',
//                         },
//                         calculable: true,
//                         grid: {
//                             top: '10%',
//                         },
//                         series: [
//                             {
//                                 name:'漏斗图',
//                                 type:'funnel',
//                                 left: '20%',
//                                 top: 60,
//                                 bottom: 60,
//                                 width: '80%',
//                                 sort: 'descending',
//                                 gap: 2,
//                                 label: {
//                                     show: true,
//                                     normal: {
//                                         position: 'inside',
//                                         formatter: '{c}',
//                                     },
//                                     emphasis: {
//                                         position: 'inside',
//                                         formatter: '{c}'
//                                     }
//                                 },
//                                 /*label: {
//                                     show: true,
//                                     position: 'inside',
//                                     formatter: '{c}',
//                                 },*/
//                                 /*emphasis: {
//                                     label: {
//                                         fontSize: 20
//                                     }
//                                 },*/
//                                 labelLine: {
//                                     length: 10,
//                                     lineStyle: {
//                                         width: 1,
//                                         type: 'solid'
//                                     }
//                                 },
//                                 itemStyle: {
//                                     borderColor: '#fff',
//                                     borderWidth: 1
//                                 },
//                                 data: listStage.data
//                             }
//                         ]
//                     }});
//             }
//         };
//         request();
//     }
//     panelVisitorReq(){
//         const request = async () => {
//             let list = await ajax('/mkt/leads/getStatisticCount.do', {orgId: this.state.group.id,cellphone:this.state.cellphone,
//                 pageNum:this.state.currentPage,pageSize:this.state.pageSize,fromWay:1,
//                 isIn:0,typeId:4});
//             if(list){
//                 let out = [];
//                 let inside = [];
//                 let legendText = [];
//                 out = list.twoMap;
//                 inside = list.oneMap;
//                 if(out && out.length > 0){
//                     out.map(item => {
//                         legendText.push(item.name);
//                     })
//                 }
//                 this.setState({option: {
//                         tooltip: {
//                             trigger: 'item',
//                             formatter: "{a} <br/>{b}: {c} ({d}%)"
//                         },
//                         legend: {
//                             orient: 'vertical',
//                             x: 'left',
//                             data:legendText
//                         },
//                         series: [
//                             {
//                                 name:'合计',
//                                 type:'pie',
//                                 selectedMode: 'single',
//                                 radius: [0, '30%'],
//
//                                 label: {
//                                     normal: {
//                                         position: 'inner'
//                                     }
//                                 },
//                                 labelLine: {
//                                     normal: {
//                                         show: false
//                                     }
//                                 },
//                                 data:inside
//                             },
//                             {
//                                 name:'线索',
//                                 type:'pie',
//                                 radius: ['40%', '55%'],
//                                 label: {
//                                     normal: {
//                                         formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
//                                         backgroundColor: '#eee',
//                                         borderColor: '#aaa',
//                                         borderWidth: 1,
//                                         borderRadius: 4,
//                                         // shadowBlur:3,
//                                         // shadowOffsetX: 2,
//                                         // shadowOffsetY: 2,
//                                         // shadowColor: '#999',
//                                         // padding: [0, 7],
//                                         rich: {
//                                             a: {
//                                                 color: '#999',
//                                                 lineHeight: 22,
//                                                 align: 'center'
//                                             },
//                                             // abg: {
//                                             //     backgroundColor: '#333',
//                                             //     width: '100%',
//                                             //     align: 'right',
//                                             //     height: 22,
//                                             //     borderRadius: [4, 4, 0, 0]
//                                             // },
//                                             hr: {
//                                                 borderColor: '#aaa',
//                                                 width: '100%',
//                                                 borderWidth: 0.5,
//                                                 height: 0
//                                             },
//                                             b: {
//                                                 fontSize: 16,
//                                                 lineHeight: 33
//                                             },
//                                             per: {
//                                                 color: '#eee',
//                                                 backgroundColor: '#334455',
//                                                 padding: [2, 4],
//                                                 borderRadius: 2
//                                             }
//                                         }
//                                     }
//                                 },
//                                 data:out
//                             }
//                         ]
//                     }});
//             }
//         };
//         request();
//     }
//
//     changePanel(tab) {
//         console.log(tab);
//         // let text = '线索';let typeId = 1;let fromWay = 2;
//         this.state.typeId = typeId;
//         this.state.fromWay = fromWay;
//         if(tab.props.name == '2'){
//             //机会
//             // text = '机会';
//             // typeId = 2;
//             // fromWay = 3;
//             this.panelOpporReq();
//         }else if(tab.props.name == '1'){
//             //线索
//             this.panelLeadReq();
//         }
//
//         /*const request = async () => {
//             try {
//                 let list = await ajax('/mkt/leads/getStatisticCount.do', {orgId: this.state.group.id,cellphone:this.state.cellphone,
//                     fromWay:fromWay,typeId:typeId,isIn:0});
//
//                 if(list){
//                     let out = [];
//                     let inside = [];
//                     let legendText = [];
//                     out = list.twoMap;
//                     inside = list.oneMap;
//                     if(out && out.length > 0){
//                         out.map(item => {
//                             legendText.push(item.name);
//                         })
//                     }
//                     this.setState({option: {
//                             tooltip: {
//                                 trigger: 'item',
//                                 formatter: "{a} <br/>{b}: {c} ({d}%)"
//                             },
//                             legend: {
//                                 orient: 'vertical',
//                                 x: 'left',
//                                 data:legendText
//                             },
//                             series: [
//                                 {
//                                     name:'合计',
//                                     type:'pie',
//                                     selectedMode: 'single',
//                                     radius: [0, '30%'],
//
//                                     label: {
//                                         normal: {
//                                             position: 'inner'
//                                         }
//                                     },
//                                     labelLine: {
//                                         normal: {
//                                             show: false
//                                         }
//                                     },
//                                     data:inside
//                                 },
//                                 {
//                                     name:text,
//                                     type:'pie',
//                                     radius: ['40%', '55%'],
//                                     label: {
//                                         normal: {
//                                             formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
//                                             backgroundColor: '#eee',
//                                             borderColor: '#aaa',
//                                             borderWidth: 1,
//                                             borderRadius: 4,
//                                             // shadowBlur:3,
//                                             // shadowOffsetX: 2,
//                                             // shadowOffsetY: 2,
//                                             // shadowColor: '#999',
//                                             // padding: [0, 7],
//                                             rich: {
//                                                 a: {
//                                                     color: '#999',
//                                                     lineHeight: 22,
//                                                     align: 'center'
//                                                 },
//                                                 // abg: {
//                                                 //     backgroundColor: '#333',
//                                                 //     width: '100%',
//                                                 //     align: 'right',
//                                                 //     height: 22,
//                                                 //     borderRadius: [4, 4, 0, 0]
//                                                 // },
//                                                 hr: {
//                                                     borderColor: '#aaa',
//                                                     width: '100%',
//                                                     borderWidth: 0.5,
//                                                     height: 0
//                                                 },
//                                                 b: {
//                                                     fontSize: 16,
//                                                     lineHeight: 33
//                                                 },
//                                                 per: {
//                                                     color: '#eee',
//                                                     backgroundColor: '#334455',
//                                                     padding: [2, 4],
//                                                     borderRadius: 2
//                                                 }
//                                             }
//                                         }
//                                     },
//                                     data:out
//                                 }
//                             ]
//                         }});
//                 }
//                 if(typeId == 2){
//                     let listTwo = await ajax('/mkt/leads/getStatisticCountByDay.do', {orgId: this.state.group.id,cellphone:this.state.cellphone,
//                         fromWay:fromWay,typeId:typeId,isIn:0,reportType:this.state.reportType});
//                     if(listTwo){
//                         let dataOne = [],dataTwo = [],dataThree = [],dataFour = [],xAxis=[];
//                         listTwo.dataOne.map(item => {
//                             dataOne.push(item.code);xAxis.push(item.showStr);
//                             this.state.optionBar.xAxis[0].data.push(item.showStr);
//                             this.state.optionBar.series[0].data.push();
//                         });
//                         listTwo.dataTwo.map(item => {
//                             dataTwo.push(item.code);
//                             this.state.optionBar.series[0].data.push(item.code);
//                         });
//                         listTwo.dataThree.map(item => {
//                             dataThree.push(item.code);
//                             this.state.optionBar.series[0].data.push(item.code);
//                         });
//                         listTwo.dataFour.map(item => {
//                             dataFour.push(item.code);
//                             this.state.optionBar.series[0].data.push(item.code);
//                         });
//                         this.setState({optionBar: {
//                                 tooltip : {
//                                     trigger: 'axis',
//                                     axisPointer : {            // 坐标轴指示器，坐标轴触发有效
//                                         type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
//                                     }
//                                 },
//                                 legend: {
//                                     orient: 'vertical',
//                                     x: 'left',
//                                     data:['访客->线索->机会','线索->机会','访客->机会','创建机会'],
//                                 },
//                                 grid: {
//                                     left: '20%',
//                                     right: '4%',
//                                     bottom: '3%',
//                                     top: '3%',
//                                     containLabel: true
//                                 },
//                                 xAxis : [
//                                     {
//                                         type : 'category',
//                                         data : xAxis
//                                     }
//                                 ],
//                                 yAxis : [
//                                     {
//                                         type : 'value'
//                                     }
//                                 ],
//                                 series : [
//                                     {
//                                         name:'访客->线索->机会',
//                                         type:'bar',
//                                         stack: '机会',
//                                         data:dataOne
//                                     },
//                                     {
//                                         name:'线索->机会',
//                                         type:'bar',
//                                         stack: '机会',
//                                         data:dataTwo
//                                     },
//                                     {
//                                         name:'访客->机会',
//                                         type:'bar',
//                                         stack: '机会',
//                                         data:dataFour
//                                     },
//                                     {
//                                         name:'创建机会',
//                                         type:'bar',
//                                         stack: '机会',
//                                         data:dataThree
//                                     }
//                                 ]
//                             }});
//                     }
//                 }
//
//                 //线索漏斗图  机会漏斗图
//                 let listStage = await ajax('/mkt/leads/getStageStatisticCount.do', {orgId: this.state.group.id,cellphone:this.state.cellphone,
//                     pageNum:this.state.currentPage,pageSize:this.state.pageSize,fromWay:fromWay,typeId:typeId,
//                     isIn:0});
//                 if(listStage){
//                     // debugger
//                     this.setState({optionLeadFunnel: {
//                             title: {
//                                 text: text+'阶段漏斗图',
//                                 // subtext: '纯属虚构'
//                             },
//                             tooltip: {
//                                 trigger: 'item',
//                                 formatter: "{a} <br/>{b} : {c}%"
//                             },
//                             legend: {
//                                 orient: 'vertical',
//                                 x: 'left',
//                                 data: listStage.legend,
//                                 top: '10%',
//                             },
//                             calculable: true,
//                             grid: {
//                                 top: '10%',
//                             },
//                             series: [
//                                 {
//                                     name:'漏斗图',
//                                     type:'funnel',
//                                     left: '20%',
//                                     top: 60,
//                                     bottom: 60,
//                                     width: '80%',
//                                     sort: 'descending',
//                                     gap: 2,
//                                     label: {
//                                         show: true,
//                                         normal: {
//                                             position: 'inside',
//                                             formatter: '{c}',
//                                         },
//                                         emphasis: {
//                                             position: 'inside',
//                                             formatter: '{c}'
//                                         }
//                                     },
//                                     /!*label: {
//                                         show: true,
//                                         position: 'inside',
//                                         formatter: '{c}',
//                                     },*!/
//                                     /!*emphasis: {
//                                         label: {
//                                             fontSize: 20
//                                         }
//                                     },*!/
//                                     labelLine: {
//                                         length: 10,
//                                         lineStyle: {
//                                             width: 1,
//                                             type: 'solid'
//                                         }
//                                     },
//                                     itemStyle: {
//                                         borderColor: '#fff',
//                                         borderWidth: 1
//                                     },
//                                     data: listStage.data
//                                 }
//                             ]
//                         }});
//                 }
//             } catch (err) {
//                 if (err.errCode === 401) {
//                     this.setState({redirectToReferrer: true})
//                 } else {
//                     this.createDialogTips(`${err.errCode}: ${err.errText}`);
//                 }
//             } finally {
//                 this.setState({isAnimating: false});
//             }
//         };
//
//         request();*/
//     }
//
//     modAction(evt){
//         let type = 1;
//         if(evt && evt.target.innerHTML == "市场管理"){
//             type = 1;
//         }else if(evt && evt.target.innerHTML == "销售管理"){
//             type = 2;
//         }else if(evt && evt.target.innerHTML == "客户服务"){
//             type = 3;
//         }
//         this.state.type=type;
//         this.setState({type:type});
//         this.componentDidMount();
//     }
//
//     changeRepportType(reportType,typeId){
//         this.state.reportType = reportType;
//         if(typeId == 2){
//             let tab= {'props':{'name':2}};
//             this.changePanel(tab);
//         }else if(typeId == 1){
//             this.componentDidMount();
//         }else if(typeId == 3){
//             this.componentDidMount();
//         }
//     }
//
//     render() {
//
//         if (this.state.redirectToReferrer) {
//             return (
//                 <Redirect to={{
//                     pathname: '/login',
//                     state: {from: this.props.location}
//                 }}/>
//             )
//         }
//         if(this.state.type == 1){
//             return (
//                 <div>
//                     <h5 id="subNav">
//                         <i className={`fa ${this.title.icon}`} aria-hidden="true"/>&nbsp;{this.title.text}
//                         <Commands
//                             commands={this.commands}
//                             modAction={this.modAction}
//                         />
//                     </h5>
//                     <div id="main" className="main p-3">
//                         <Tabs activeName="1" onTabClick={ (tab) => console.log(tab.props.name) }>
//                             <Tabs.Pane label="市场活动" name="1"></Tabs.Pane>
//                         </Tabs>
//                     </div>
//                 </div>
//             )
//         }else if(this.state.type == 2){
//             return (
//                 <div>
//                     <h5 id="subNav">
//                         <i className={`fa ${this.title.icon}`} aria-hidden="true"/>&nbsp;{this.title.text}
//                         <Commands
//                             commands={this.commands}
//                             modAction={this.modAction}
//                         />
//                     </h5>
//                     <div id="main" className="main p-3">
//                         <Tabs activeName="1" onTabClick={this.changePanel }>
//                             <Tabs.Pane label="线索" name="1">
//                                 <ReactEcharts
//                                     option={this.state.option}
//                                     style={{height: '350px', width: '1000px'}}
//                                     className='react_for_echarts' />
//                                 <br/><br/>
//                                 <ReactEcharts
//                                     option={this.state.optionLeadFunnel}
//                                     style={{maxWidth: '50%'}}
//                                     className='react_for_echarts' />
//                                 <br/><br/>
//                                 <Button type="primary" size="small" onClick={this.changeRepportType.bind(this,1,1)}>近一周</Button>
//                                 <Button type="primary" size="small" onClick={this.changeRepportType.bind(this,2,1)}>近一月</Button>
//                                 <Button type="primary" size="small" onClick={this.changeRepportType.bind(this,3,1)}>近一年</Button>
//                                 <ReactEcharts
//                                     option={this.state.optionNum}
//                                     style={{height: '350px', width: '1000px'}}
//                                     className='react_for_echarts' />
//                                 <br/><br/>
//                             </Tabs.Pane>
//                             <Tabs.Pane label="机会" name="2">
//                                 <ReactEcharts
//                                     option={this.state.option}
//                                     style={{height: '350px', width: '1000px'}}
//                                     className='react_for_echarts' />
//                                 <br/><br/>
//                                 <Button type="primary" size="small" onClick={this.changeRepportType.bind(this,1,2)}>近一周</Button>
//                                 <Button type="primary" size="small" onClick={this.changeRepportType.bind(this,2,2)}>近一月</Button>
//                                 <Button type="primary" size="small" onClick={this.changeRepportType.bind(this,3,2)}>近一年</Button>
//                                 <ReactEcharts
//                                     option={this.state.optionBar}
//                                     style={{height: '350px', width: '1000px'}}
//                                     className='react_for_echarts' />
//                                 <br/><br/>
//                                 <ReactEcharts
//                                     option={this.state.optionLeadFunnel}
//                                     style={{maxWidth: '50%'}}
//                                     className='react_for_echarts' />
//                                 <br/><br/>
//                                 <Button type="primary" size="small" onClick={this.changeRepportType.bind(this,1,3)}>近一周</Button>
//                                 <Button type="primary" size="small" onClick={this.changeRepportType.bind(this,2,3)}>近一月</Button>
//                                 <Button type="primary" size="small" onClick={this.changeRepportType.bind(this,3,3)}>近一年</Button>
//                                 <ReactEcharts
//                                     option={this.state.optionNum}
//                                     style={{height: '350px', width: '1000px'}}
//                                     className='react_for_echarts' />
//                                 <br/><br/>
//                                 {/*<br/><br/>
//                                 <Button type="primary" size="small" onClick={this.changeRepportType.bind(this,1,3)}>近一周</Button>
//                                 <Button type="primary" size="small" onClick={this.changeRepportType.bind(this,2,3)}>近一月</Button>
//                                 <Button type="primary" size="small" onClick={this.changeRepportType.bind(this,3,3)}>近一年</Button>
//                                 <ReactEcharts
//                                     option={this.state.optionOpporNum}
//                                     style={{height: '350px', width: '1000px'}}
//                                     className='react_for_echarts' />
//                                 <br/><br/>*/}
//                             </Tabs.Pane>
//                         </Tabs>
//                     </div>
//                 </div>
//             )
//         }else if(this.state.type == 3){
//             return (
//                 <div>
//                     <h5 id="subNav">
//                         <i className={`fa ${this.title.icon}`} aria-hidden="true"/>&nbsp;{this.title.text}
//                         <Commands
//                             commands={this.commands}
//                             modAction={this.modAction}
//                         />
//                     </h5>
//                     <div id="main" className="main p-3">
//                         <Tabs activeName="1" onTabClick={ (tab) => console.log(tab.props.name) }>
//                             <Tabs.Pane label="访客" name="1">
//                                 <ReactEcharts
//                                     option={this.state.option}
//                                     style={{height: '350px', width: '1000px'}}
//                                     className='react_for_echarts' />
//                             </Tabs.Pane>
//                             <Tabs.Pane label="合同" name="2"></Tabs.Pane>
//                             <Tabs.Pane label="学员" name="3"></Tabs.Pane>
//                         </Tabs>
//                     </div>
//                 </div>
//             )
//         }
//
//     }
// }
//
// export default List;