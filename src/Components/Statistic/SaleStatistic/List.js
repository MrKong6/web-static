import React from "react";
import ReactDOM from "react-dom";
import {Redirect} from 'react-router-dom'

import DialogTips from "../../Dialog/DialogTips";
import actProcess from "../../../utils/actProcess";
import mainSize from "../../../utils/mainSize";
import fmtTitle from '../../../utils/fmtTitle';
import ajax from "../../../utils/ajax";
import {Button, Table, Pagination, Upload, Input, Tooltip, Tabs} from 'element-react';
import ReactEcharts from 'echarts-for-react';
import Commands from "../../Commands/Commands";

class List extends React.Component {
    constructor(props) {
        super(props);
        this.createDialogTips = this.createDialogTips.bind(this);
        this.goToDetails = this.goToDetails.bind(this);
        this.changePanel = this.changePanel.bind(this);
        this.modAction = this.modAction.bind(this);
        this.commands = this.props.commands.filter(command => (command.name === 'Show'));
        this.title = fmtTitle(this.props.location.pathname);
        this.state = {
            group: this.props.changedCrmGroup,
            list: [],
            ids: [],
            type : 2,
            isAnimating: true,
            redirectToReferrer: false,
            option: {
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
        };

    }

    componentDidMount() {
        const request = async () => {
            try {
                if(this.state.type == 1){

                }else if(this.state.type == 2){
                    let list = await ajax('/mkt/leads/getStatisticCount.do', {orgId: this.state.group.id,cellphone:this.state.cellphone,
                        pageNum:this.state.currentPage,pageSize:this.state.pageSize,fromWay:2,typeId:1,
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
                }else if(this.state.type == 3){
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
                                        data:out
                                    }
                                ]
                            }});
                    }
                }
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

    changePanel(tab) {
        console.log(tab);
        let text = '线索';let typeId = 1;let fromWay = 2;
        if(tab.props.name == '2'){
            //机会
            text = '机会';
            typeId = 2;
            fromWay = 3;
        }
        const request = async () => {
            try {
                let list = await ajax('/mkt/leads/getStatisticCount.do', {orgId: this.state.group.id,cellphone:this.state.cellphone,
                    fromWay:fromWay,typeId:typeId,isIn:0});
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
                                    name:text,
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

    modAction(evt){
        let type = 1;
        if(evt && evt.target.innerHTML == "市场管理"){
            type = 1;
        }else if(evt && evt.target.innerHTML == "销售管理"){
            type = 2;
        }else if(evt && evt.target.innerHTML == "客户服务"){
            type = 3;
        }
        this.state.type=type;
        this.setState({type:type});
        this.componentDidMount();
    }

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
                        <Tabs activeName="1" onTabClick={ this.changePanel }>
                            <Tabs.Pane label="线索" name="1">
                                <ReactEcharts
                                    option={this.state.option}
                                    style={{height: '350px', width: '1000px'}}
                                    className='react_for_echarts' />
                            </Tabs.Pane>
                            <Tabs.Pane label="机会" name="2">
                                <ReactEcharts
                                    option={this.state.option}
                                    style={{height: '350px', width: '1000px'}}
                                    className='react_for_echarts' />
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
                            </Tabs.Pane>
                            <Tabs.Pane label="合同" name="2"></Tabs.Pane>
                            <Tabs.Pane label="学员" name="3"></Tabs.Pane>
                        </Tabs>
                    </div>
                </div>
            )
        }

    }
}

export default List;