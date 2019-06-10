import React from "react";
import ReactDOM from "react-dom";
import {Redirect} from 'react-router-dom'

import DialogTips from "../../Dialog/DialogTips";
import Commands from "../../Commands/Commands";
import Progress from "../../Progress/Progress"

import mainSize from "../../../utils/mainSize";
import fmtDate from '../../../utils/fmtDate';
import fmtTitle from '../../../utils/fmtTitle';
import ajax from "../../../utils/ajax";
import {AJAX_PATH} from "../../../utils/ajax";
import { Button,Table,Pagination,Upload,Input,Form } from 'element-react';
import './Leads.css'

import {$} from "../../../vendor";

/*
const Table = ({list, goto}) => {
    return (
        <table className="table table-bordered table-sm">
            <thead>
            <tr>
                <th>创建人</th>
                <th>创建时间</th>
                <th>所属组织</th>
                <th>所属用户</th>
                <th>来源</th>
                <th>渠道</th>
                <th>阶段</th>
                <th>状态</th>
                <th>学员姓名</th>
                <th>性别</th>
                <th>年龄</th>
                <th>在读年级</th>
                <th>所在学校</th>
                <th>家长姓名</th>
                <th>与学员关系</th>
                <th>电话号码</th>
                <th>微信号</th>
                <th>家庭住址</th>
                <th>课程类别</th>
                <th>课程产品</th>
                <th>备注</th>
                <th>沟通记录</th>
            </tr>
            </thead>
            <tbody>{TableItem(list, goto)}</tbody>
        </table>
    );
};
*/

/*
const TableItem = (data, goto) => {
    let table = [];

    if (data.length === 0) {
        return table;
    }

    data.map(item => {
        table.push(
            <tr key={item.id}>
                <td>{item.creatorName}</td>
                <td>{fmtDate(item.createTime)}</td>
                <td>{item.organizationName}</td>
                <td>{item.executiveName}</td>
                <td>{item.sourceName}</td>
                <td>{item.channelName}</td>
                <td>{item.stageName}</td>
                <td>{item.statusName}</td>
                <td>
                    <a onClick={goto} lid={item.id} href="javascript:;">{item.student.name}</a>
                </td>
                <td>{item.student.genderText !== 'null' ? item.student.genderText : '--'}</td>
                <td>{item.student.age !== 'null' ? item.student.age : '--'}</td>
                <td>{item.student.classGrade !== 'null' ? item.student.classGrade : '--'}</td>
                <td>{item.student.schoolName ? item.student.schoolName : '--'}</td>
                <td>
                    <a onClick={goto} lid={item.id} href="javascript:;">{item.parent.name}</a>
                </td>
                <td>{item.parent.relation ? item.parent.relation : '--'}</td>
                <td>{item.parent.cellphone ? item.parent.cellphone : '--'}</td>
                <td>{item.parent.weichat ? item.parent.weichat : '--'}</td>
                <td>{item.parent.address ? item.parent.address : '--'}</td>
                <td>{item.courseType !== 'null' ? item.courseType : '--'}</td>
                <td>{item.courseName !== 'null' ? item.courseName : '--'}</td>
                <td>{item.note ? item.note : '--'}</td>
                <td>--</td>
            </tr>
        );
    });

    return table;
};
*/

class List extends React.Component {

    constructor(props) {
        super(props);
        this.commands = this.props.commands.filter(command => (command.name === 'Add' || command.name === 'Import'));
        this.title = fmtTitle(this.props.location.pathname);
        this.createDialogTips = this.createDialogTips.bind(this);
        // this.goToDetails = this.goToDetails.bind(this);
        this.addAction = this.addAction.bind(this);
        this.state = {
            group: this.props.changedCrmGroup,
            list: [],
            ids: [],
            isAnimating: true,
            redirectToReferrer: false,
            cellphone : '',
            columns:[
                {
                    label: "创建人",
                    prop: "creatorName",
                    width: 100,
                    sortable: true
                },
                {
                    label: "创建时间",
                    prop: "createTime",
                    width: 120,
                    sortable: true
                },
                {
                    label: "所属组织",
                    prop: "organizationName",
                    width: 175,
                    showOverflowTooltip: true,
                },
                {
                    label: "所属用户",
                    prop: "executiveName",
                    width: 95
                },
                {
                    label: "来源",
                    prop: "sourceName",
                    width: 100
                },
                {
                    label: "渠道",
                    prop: "channelName",
                    width: 120
                },
                {
                    label: "阶段",
                    prop: "stageName",
                    width: 150
                },
                {
                    label: "状态",
                    prop: "statusName",
                    width: 150
                },
                {
                    label: "学员姓名",
                    prop: "student.name",
                    width: 95,
                    render: (row, column, data)=>{
                        return <span><Button type="text" size="small" onClick={this.goToDetails.bind(this, row.id)}>{row.student.name}</Button></span>
                    }
                    /*render: function(data){
                        return <span><Button type="text" size="small" onClick={this.goToDetails.bind(this,data.id)} lid={data.id}>{data.student.name}</Button></span>
                    }*/
                },
                {
                    label: "性别",
                    prop: "student.genderText",
                    width: 65
                },
                {
                    label: "年龄",
                    prop: "student.age",
                    width: 90,
                    sortable: true
                },
                {
                    label: "在读年级",
                    prop: "student.classGrade",
                    width: 95
                },
                {
                    label: "所在学校",
                    prop: "student.schoolName",
                    width: 120
                },
                {
                    label: "家长姓名",
                    prop: "parent.name",
                    width: 95,
                    render: (row, column, data)=>{
                        return <span><Button type="text" size="small" onClick={this.goToDetails.bind(this, row.id)}>{row.parent.name}</Button></span>
                    }
                },
                {
                    label: "与学员关系",
                    prop: "parent.relation",
                    width: 110
                },
                {
                    label: "电话号码",
                    prop: "parent.cellphone",
                    width: 120
                },
                {
                    label: "微信号",
                    prop: "parent.weichat",
                    width: 80
                },
                {
                    label: "家庭住址",
                    prop: "parent.address",
                    width: 95
                },
                {
                    label: "课程类别",
                    prop: "courseType",
                    width: 95
                },
                {
                    label: "课程产品",
                    prop: "courseName",
                    width: 250
                },
            ],
        };

    }

    componentDidMount() {
        const request = async () => {
            try {
                let list = await ajax('/mkt/leads/list.do', {orgId: this.state.group.id,cellphone:this.state.cellphone});
                const ids = list.map((leads) => (leads.id));
                list.map(item => {
                    if(item.createTime != null){
                        item.createTime = fmtDate(item.createTime);
                    }
                });
                this.setState({list: list, ids: ids});
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
                    let list = await ajax('/mkt/leads/list.do', {orgId: nextProps.changedCrmGroup.id});
                    const ids = list.map((leads) => (leads.id));

                    this.setState({
                        group: nextProps.changedCrmGroup,
                        list: list,
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

    addAction() {
        this.props.history.push(`${this.props.match.url}/create`, {ids: this.state.ids});
    };

    importAction(content) {

    };

    onChange(key, value) {
        this.setState({
            cellphone: value
        });
    }

    render() {
        const uploadConfig = {
            className:"upload-demo",
            showFileList:false,
            withCredentials:true,
            data:{'aa':document.cookie},
            action: AJAX_PATH + '/mkt/leads/import.do'
        };
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

                    <Commands
                        commands={this.commands}
                        addAction={this.addAction}
                        importAction={uploadConfig}
                    />
                </h5>
                <div id="main" className="main p-3">
                    <Progress isAnimating={this.state.isAnimating}/>
                    {/*<Table list={this.state.list} goto={this.goToDetails}/>*/}
                    <Input placeholder="请输入手机号"
                           className={"leadlist_search"}
                           value={this.state.cellphone}
                           style={{width: '20%'}}
                           onChange={this.onChange.bind(this, 'cellphone')}
                           append={<Button type="primary" icon="search" onClick={this.componentDidMount.bind(this)}>搜索</Button>}
                            />
                    {/*append={<Button type="primary" icon="search" onClick={this.componentDidMount.bind(this)}>搜索</Button>}*/}
                    <Table
                        style={{width: '100%'}}
                        columns={this.state.columns}
                        data={this.state.list}
                        border={true}
                        show-overflow-tooltip={true}
                    />
                    {/*<Pagination layout="total, sizes, prev, pager, next, jumper"
                                total={400}
                                pageSizes={[30, 50, 100]}
                                pageSize={50}
                                currentPage={5}
                                className={"leadlist_page"}/>*/}
                </div>
            </div>
        )
    }
}

export default List;