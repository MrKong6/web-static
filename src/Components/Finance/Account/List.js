import React from "react";
import ReactDOM from "react-dom";
import {Redirect} from 'react-router-dom'

import DialogTips from "../../Dialog/DialogTips";
import Progress from "../../Progress/Progress"

import mainSize from "../../../utils/mainSize";
import fmtTitle from '../../../utils/fmtTitle';
import ajax from "../../../utils/ajax";
import '../../Mkt/Leads/Leads.css'
import {Button, Table, Pagination, Tag, Input} from 'element-react';

class List extends React.Component {
    constructor(props) {
        super(props);

        this.commands = this.props.commands.filter((command) => (command === 'Add'));
        this.title = fmtTitle(this.props.location.pathname);
        this.createDialogTips = this.createDialogTips.bind(this);
        this.goToDetails = this.goToDetails.bind(this);
        this.state = {
            group: this.props.changedCrmGroup,
            list: [],
            ids: [],
            isAnimating: true,
            redirectToReferrer: false,
            columns: [
                {
                    width: 100,
                    type: 'index'
                },
                {
                    label: "学员编号",
                    prop: "stuCode",
                    render: (row, column, data) => {
                        return <span><Button type="text" size="small"
                                             onClick={this.goToDetails.bind(this, row.stuId, row.stuName)}>{row.stuCode}</Button></span>
                    }
                },
                {
                    label: "学员姓名",
                    prop: "stuName",
                },
                {
                    label: "英文名",
                    prop: "stuEnName",
                },
                {
                    label: "性别",
                    prop: "stuGender",
                },
                {
                    label: "年龄",
                    prop: "stuAge",
                },
                {
                    label: "总收入",
                    prop: "allInCome",
                    sortable: true
                },
                {
                    label: "总支出",
                    prop: "allInOut",
                },
                {
                    label: "账户余额",
                    prop: "accountBalance",
                    sortable: true
                },
                {
                    label: "课时总支出",
                    prop: "courseFeeOut",
                    sortable: true
                },
                {
                    label: "课时总余额",
                    prop: "courseFee",
                },
            ],
            totalPage:0,
            currentPage:1,
            pageSize:10,
            totalCount:0,
            mount:{},
            chooseStuName: null
        };
    }

    componentDidMount() {
        const request = async () => {
            try {
                let list = await ajax('/service/account/accountBalanceList.do', {orgId: this.state.group.id,pageNum:this.state.currentPage,
                    pageSize:this.state.pageSize, stuName: this.state.chooseStuName});
                if(list.data && list.data.items){
                    const ids = list.data.items.map((contract) => (contract.id));
                    this.setState({list: list.data.items, ids: ids,totalPage: list.data.totalPage,totalCount: list.data.count});
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
        this.getTotal();
    }

    componentWillReceiveProps(nextProps) {
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

    goToDetails(evt,name) {
        const url = `${this.props.match.url}/customer/account/`+evt;
        this.props.history.push(url,{state: {"stuName": name}});
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

    //获取汇总金额
    getTotal(){
        const request = async () => {
            try {
                let list = await ajax('/service/account/getTotalAmount.do', {orgId: this.state.group.id,pageNum:this.state.currentPage,pageSize:this.state.pageSize});
                if(list.data){
                    if(list.data.allInCome >= list.data.accountBalance){
                        list.data.outCome = list.data.allInCome - list.data.accountBalance;
                    }
                    this.setState({mount: list.data});
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
    //学员姓名搜索
    onChange(value){
        this.state.chooseStuName = value;
        this.setState({chooseStuName: value});
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
                    <Progress isAnimating={this.state.isAnimating}/>
                    <div className="row">
                        <div className="col-3">
                            <Input placeholder="请输入学员姓名"
                                   className={"leadlist_search"}
                                   value={this.state.chooseStuName}
                                   onChange={this.onChange.bind(this)}
                                   append={<Button type="primary" icon="search" onClick={this.componentDidMount.bind(this)}>搜索</Button>}
                            />
                        </div>
                    </div>
                    {/*<Table list={this.state.list} goto={this.goToDetails}/>*/}
                    <div style={{"textAlign":"right","marginBottom":"15px"}}>
                        <Tag type="primary" style={{"marginRight":"15px","fontWeight":"bolder"}}>总收入：{this.state.mount.allInCome}</Tag>
                        <Tag type="primary" style={{"marginRight":"15px","fontWeight":"bolder"}}>总支出：{this.state.mount.outCome}</Tag>
                        <Tag type="primary" style={{"marginRight":"15px","fontWeight":"bolder"}}>总余额：{this.state.mount.accountBalance}</Tag>
                        <Tag type="primary" style={{"marginRight":"15px","fontWeight":"bolder"}}>课时总支出：{this.state.mount.courseFeeOut}</Tag>
                        <Tag type="primary" style={{"marginRight":"15px","fontWeight":"bolder"}}>课时总余额：{this.state.mount.courseFee}</Tag>

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