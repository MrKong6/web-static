import React from "react";
import ReactDOM from "react-dom";
import {Redirect} from 'react-router-dom'

import DialogTips from "../../Dialog/DialogTips";
import Progress from "../../Progress/Progress"

import mainSize from "../../../utils/mainSize";
import fmtTitle from '../../../utils/fmtTitle';
import ajax from "../../../utils/ajax";
import '../../Mkt/Leads/Leads.css'
import {Button, Table, Pagination, Upload, Input, Tooltip, Select} from 'element-react';
import CONFIG from "../../../utils/config";
import fmtDate, {formatWithTime} from "../../../utils/fmtDate";
import Commands from "../../Commands/Commands";

class List extends React.Component {
    constructor(props) {
        super(props);
        this.commands = this.props.commands.filter((command) => (command.name === 'Add'));
        this.title = fmtTitle(this.props.location.pathname);
        this.goToDetails = this.goToDetails.bind(this);
        this.addAction = this.addAction.bind(this);
        this.state = {
            group: this.props.changedCrmGroup,
            list: [],
            ids: [],
            isAnimating: true,
            redirectToReferrer: false,
            columns: [
                {
                    type: 'index'
                },
                {
                    label: "课程类别",
                    prop: "typeName",
                    sortable: true,
                },
                {
                    label: "姓名",
                    prop: "name",
                    showOverflowTooltip: true,
                },
                {
                    label: "性别",
                    prop: "genderText",
                    sortable: true,
                },
                {
                    label: "出生年月",
                    prop: "date",
                },
                {
                    label: "在读年级",
                    prop: "grade",
                    sortable: true
                },
                {
                    label: "与学员关系",
                    prop: "relation",
                },
                {
                    label: "家长姓名",
                    prop: "parentName",
                },
                {
                    label: "联系电话",
                    prop: "mobile",
                },
                {
                    label: "家庭住址",
                    prop: "address",
                },
                {
                    label: "创建时间",
                    prop: "createOn",
                }
            ],
            totalPage:0,
            currentPage:1,
            pageSize:10,
            totalCount:0,
            userList:[],
            chooseUser: this.props.location.state && this.props.location.state.phone ? this.props.location.state.phone : null

        };
    }

    componentDidMount() {
        const request = async () => {
            try {
                let list = await ajax('/wechat/getOrderRecordList.do', {orgId: this.state.group.id,userId:this.state.chooseUser,pageNum:this.state.currentPage,pageSize:this.state.pageSize});
                let userList = await ajax('/wechat/getWechatUserList.do', {orgId: this.state.group.id,pageNum:1,pageSize:9999});

                if(list.data && list.data.items){
                    const ids = list.data.items.map((contract) => (contract.id));
                    list.data.items.map(item => {
                        if(item.createOn != null){
                            item.createOn = formatWithTime(item.createOn);
                        }
                        if(item.date != null){
                            item.date = formatWithTime(item.date);
                        }

                    });
                    this.setState({list: list.data && list.data.items ? list.data.items : [],
                        ids: ids,totalPage: list.data.totalPage,totalCount: list.data.count,
                        userList: userList.data && userList.data.items ? userList.data.items : [],});

                }else{
                    this.setState({list: [],userList: userList.data && userList.data.items ? userList.data.items : [],
                        totalPage: 0,totalCount: 0});
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

    componentWillUnmount() {
        if (this.tipsContainer) {
            document.body.removeChild(this.tipsContainer);
        }
    }

    goToDetails(evt) {
        const url = `${this.props.match.url}/${evt}`;

        this.props.history.push(url);
    }

    pageChange(currentPage){
        console.log(currentPage);
        this.state.currentPage = currentPage;
        // this.setState({currentPage:currentPage});
        this.componentDidMount();
    }

    sizeChange(pageSize){
        console.log(pageSize);
        this.state.pageSize = pageSize;
        this.componentDidMount();
    }

    addAction(){
        this.props.history.push(`${this.props.match.url}/create`, {ids: this.state.ids});
    }

    chooseUser(value){
        this.state.chooseUser = value;
        this.setState({chooseUser:value});
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

        return (
            <div>
                <h5 id="subNav">
                    <i className={`fa ${this.title.icon}`} aria-hidden="true"/>&nbsp;{this.title.text}
                    <Commands
                        commands={this.commands}
                        addAction={this.addAction}
                    />
                </h5>
                <div id="main" className="main p-3">
                    <div className="row" style={{"margin-bottom":"10px"}}>
                        <div className="col-2">
                            <Select value={this.state.chooseUser} placeholder="请选择注册用户" clearable={true}
                                    onChange={this.chooseUser.bind(this)}>
                                {
                                    this.state.userList.map(el => {
                                        return <Select.Option key={el.id} label={el.name} value={el.id}/>
                                    })
                                }
                            </Select>
                        </div>
                    </div>
                    <Table
                        style={{width: '100%'}}
                        columns={this.state.columns}
                        data={this.state.list}
                        border={true}
                        fit={true}
                        emptyText={"--"}
                    />
                    <Pagination layout="total, sizes, prev, pager, next, jumper"
                                total={this.state.totalCount}
                                pageSizes={[10, 50, 100]}
                                pageSize={this.state.pageSize}
                                currentPage={this.state.currentPage}
                                pageCount={this.state.totalPage}
                                className={"leadlist_page"}
                                onCurrentChange={(currentPage) => this.pageChange(currentPage)}
                                onSizeChange={(pageSize) => this.sizeChange(pageSize)}/>
                </div>
            </div>
        )
    }
}

export default List;