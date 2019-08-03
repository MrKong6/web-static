import React from "react";
import ReactDOM from "react-dom";
import {Redirect} from 'react-router-dom'
import {$} from "../../../vendor";

import DialogTips from "../../Dialog/DialogTips";
import Commands from "../../Commands/Commands";
import Progress from "../../Progress/Progress"

import actProcess from "../../../utils/actProcess";
import mainSize from "../../../utils/mainSize";
import fmtDate from '../../../utils/fmtDate';
import fmtTitle from '../../../utils/fmtTitle';
import ajax from "../../../utils/ajax";
import {Button, Table, Pagination, Upload, Input, Tooltip, Tabs} from 'element-react';
import ReactEcharts from 'echarts-for-react';

class List extends React.Component {
    constructor(props) {
        super(props);
        this.createDialogTips = this.createDialogTips.bind(this);
        this.goToDetails = this.goToDetails.bind(this);
        this.changePanel = this.changePanel.bind(this);
        this.commands = this.props.commands.filter(command => (command.name === 'Add'));
        this.title = fmtTitle(this.props.location.pathname);
        this.state = {
            group: this.props.changedCrmGroup,
            list: [],
            ids: [],
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
                let list = await ajax('/mkt/leads/getStatisticCount.do', {orgId: this.state.group.id,cellphone:this.state.cellphone,
                    pageNum:this.state.currentPage,pageSize:this.state.pageSize,fromWay:2,
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

    render() {
        if (this.state.redirectToReferrer) {
            return (
                <Redirect to={{
                    pathname: '/login',
                    state: {from: this.props.location}
                }}/>
            )
        }

        return (
            <div>
                <h5 id="subNav">
                    <i className={`fa ${this.title.icon}`} aria-hidden="true"/>&nbsp;{this.title.text}
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
                    {/*<Progress isAnimating={this.state.isAnimating}/>*/}
                    {/*<Table list={this.state.list} goto={this.goToDetails}/>*/}
                    {/*<Table
                        style={{width: '100%'}}
                        columns={this.state.columns}
                        data={this.state.list}
                        border={true}
                        fit={true}
                        emptyText={"--"}
                    />*/}
                </div>
            </div>
        )
    }
}

export default List;