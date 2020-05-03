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

class List extends React.Component {
    constructor(props) {
        super(props);
        this.createDialogTips = this.createDialogTips.bind(this);
        this.goToDetails = this.goToDetails.bind(this);
        this.addAction = this.addAction.bind(this);
        this.commands = this.props.commands.filter(command => (command.name === 'Add'));
        this.title = fmtTitle(this.props.location.pathname);
        this.state = {
            group: this.props.changedCrmGroup,
            list: [],
            ids: [],
            isAnimating: true,
            redirectToReferrer: false,
            columns:[
                {
                    label: "创建人",
                    prop: "creatorName",
                    sortable: true
                },
                {
                    label: "创建时间",
                    prop: "createTime",
                    sortable: true
                },
                {
                    label: "活动名称",
                    prop: "name",
                    sortable: true,
                    render: (row, column, data)=>{
                        return <span><Button type="text" size="small" onClick={this.goToDetails.bind(this, row.id)}>{row.name}</Button></span>
                    }
                },
                {
                    label: "开始时间",
                    prop: "startDate",
                    sortable: true
                },
                {
                    label: "结束时间",
                    prop: "endDate",
                    sortable: true
                },
                {
                    label: "预计花费",
                    prop: "budget",
                    sortable: true
                },
                {
                    label: "实际花费",
                    prop: "cost",
                    sortable: true
                },
                {
                    label: "获取线索量",
                    prop: "leads",
                    sortable: true
                },
                {
                    label: "转化机会量",
                    prop: "opportunities",
                    sortable: true
                },
                {
                    label: "签约客户量",
                    prop: "contracts",
                    sortable: true
                },
                {
                    label: "签约客户金额",
                    prop: "totalAmount",
                    sortable: true
                },
                {
                    label: "ROI",
                    prop: "roi",
                    sortable: true
                },

            ],

        };

    }

    componentDidMount() {
        const request = async () => {
            try {
                let list = await ajax('/mkt/activity/list.do', {organizationId: this.state.group.id});
                const ids = list.map((act) => (act.id));
                list.map(item => {
                    if(item.createTime != null){
                        item.createTime = fmtDate(item.createTime);
                    }
                    if(item.startDate != null){
                        item.startDate = fmtDate(item.startDate);
                    }
                    if(item.endDate != null){
                        item.endDate = fmtDate(item.endDate);
                    }
                });
                this.setState({list: actProcess(list), ids: ids});
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

        // request();
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

            // request();
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

    addAction() {
        this.props.history.push(`${this.props.match.url}/create`, {ids: this.state.ids});
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
                    <Tabs activeName="1" onTabClick={ (tab) => console.log(tab.props.name) }>
                        <Tabs.Pane label="营销活动" name="1"></Tabs.Pane>
                        {/*<Tabs.Pane label="配置管理" name="2"></Tabs.Pane>
                        <Tabs.Pane label="角色管理" name="3"></Tabs.Pane>
                        <Tabs.Pane label="定时补偿任务" name="4"></Tabs.Pane>*/}
                    </Tabs>
                    <Progress isAnimating={this.state.isAnimating}/>
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