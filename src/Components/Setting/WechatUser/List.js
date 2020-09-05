import React from "react";
import ReactDOM from "react-dom";
import {Redirect} from 'react-router-dom'

import DialogTips from "../../Dialog/DialogTips";
import Progress from "../../Progress/Progress"

import mainSize from "../../../utils/mainSize";
import fmtTitle from '../../../utils/fmtTitle';
import ajax from "../../../utils/ajax";
import '../../Mkt/Leads/Leads.css'
import { Button,Table,Pagination,Upload,Input,Tooltip } from 'element-react';
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
                    label: "学员名称",
                    prop: "name",
                    sortable: true,
                },
                {
                    label: "联系电话",
                    prop: "phone",
                    showOverflowTooltip: true,
                },
                {
                    label: "性别",
                    prop: "gender",
                    sortable: true,
                },
                {
                    label: "在读年级",
                    prop: "grade",
                },
                {
                    label: "注册时间",
                    prop: "createOn",
                    sortable: true
                },
                {
                    label: "预约次数",
                    prop: "orderCount",
                    render: (row, column, data) => {
                        return <span><Button type="text" size="small"
                                             onClick={this.goToDetails.bind(this, row.id, 1)}>{row.orderCount}</Button></span>
                    }
                },
                {
                    label: "访问次数",
                    prop: "sourceInfoCount",
                    render: (row, column, data) => {
                        return <span><Button type="text" size="small"
                                             onClick={this.goToDetails.bind(this, row.phone, 2)}>{row.sourceInfoCount}</Button></span>
                    }
                },
            ],
            totalPage:0,
            currentPage:1,
            pageSize:10,
            totalCount:0,
        };
    }

    componentDidMount() {
        const request = async () => {
            try {
                let list = await ajax('/wechat/getWechatUserList.do', {orgId: this.state.group.id,pageNum:this.state.currentPage,pageSize:this.state.pageSize});
                if(list.data && list.data.items){
                    const ids = list.data.items.map((contract) => (contract.id));
                    list.data.items.map(item => {
                        if(item.createOn != null){
                            item.createOn = formatWithTime(item.createOn);
                        }
                    });
                    this.setState({list: list.data && list.data.items ? list.data.items : null, ids: ids,totalPage: list.data.totalPage,totalCount: list.data.count});

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

    goToDetails(evt,type) {
        if(type == 2){
            //实时访客
            const url = `/home/wechat/record`;
            this.props.history.push(url,{phone: evt});
        }else{
            //预约
            const url = `/home/wechat/order`;
            this.props.history.push(url,{phone: evt});
        }
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