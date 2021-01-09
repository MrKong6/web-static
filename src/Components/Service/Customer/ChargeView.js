import React from 'react'
import ReactDOM from "react-dom";
import {Link, Redirect} from 'react-router-dom'

import fmtTitle from "../../../utils/fmtTitle";
import fmtDate from "../../../utils/fmtDate";
import ajax from "../../../utils/ajax";
import mainSize from "../../../utils/mainSize";
import DialogAccount from "../../Dialog/DialogAccount";
import {Button, Form, Table} from "element-react";
import DialogAccountRelateClass from "../../Dialog/DialogAccountRelateClass";

const INCOME="收入";

class AccountView extends React.Component {
    constructor(props) {
        super(props);
        this.title = fmtTitle(this.props.location.pathname);
        let type = 1;
        if(this.props.location.state && this.props.location.state.type && this.props.location.state.type == 2){
            //从教学的我的班级的学员信息页面跳转而来
            type = this.props.location.state.type;
            this.commands = [];
            this.first = 'normal';
            this.second = 'normal';
            this.third = 'normal';
            this.fourth = 'normal';
            this.fifth = 'normal';
            this.sixth = 'normal'
            this.seventh = 'normal';
        }else{
            this.commands = this.props.commands.filter(command => (command.id === '3-2-1-2' || command.id === '3-2-1-3'));
            this.first = !(this.props.sonView.filter(view => (view.id == '3-2-1')) == false) ? 'normal' : 'none';
            this.second = !(this.props.sonView.filter(view => (view.id == '3-2-2')) == false) ? 'normal' : 'none';
            this.third = !(this.props.sonView.filter(view => (view.id == '3-2-3')) == false) ? 'normal' : 'none';
            this.fourth = !(this.props.sonView.filter(view => (view.id == '3-2-4')) == false) ? 'normal' : 'none';
            this.fifth = !(this.props.sonView.filter(view => (view.id == '3-2-5')) == false) ? 'normal' : 'none';
            this.sixth = !(this.props.sonView.filter(view => (view.id == '3-2-6')) == false) ? 'normal' : 'none'
            this.seventh = this.props.sonView && !(this.props.sonView.filter(view => (view.id == '3-2-7')) == false) ? 'normal' : 'none';

        }
        this.state = {
            group: this.props.changedCrmGroup,
            redirectToReferrer: false,
            redirectToList: false,
            id: this.props.match.params.studentId ? this.props.match.params.studentId : this.props.match.params.contractId,
            ids: [],
            name: this.props.location.state.stuName,
            columns: [
                {
                    type: 'expand',
                    expandPannel: function(data){
                        if(data.outCode == 'CLASS_FEE' && data.sonList && data.sonList.length > 0){
                            return (
                                    <table className="table table-bordered table-sm noBorder tableWidth">
                                        <tr>
                                            <th>项目</th>
                                            <th>序号</th>
                                            <th>日期</th>
                                            <th>摘要</th>
                                            <th>收入</th>
                                            <th>支出</th>
                                            <th>余额</th>
                                            <th>操作</th>
                                        </tr>
                                        <tbody>
                                            {
                                                data.sonList.map(function (evt) {
                                                    return <tr key={evt.id}>
                                                                <td style={{"border": 0, "borderTop": "hidden"}}>{evt.proName}</td>
                                                                <td style={{"border": 0, "borderLeft": "1px solid black"}}>{evt.no}</td>
                                                                <td style={{"border": 0}}>{evt.payDate}</td>
                                                                <td style={{"border": 0}}>{evt.remark}</td>
                                                                <td style={{"border": 0}}>{evt.income}</td>
                                                                <td style={{"border": 0}}>{evt.outcome}</td>{/*¥*/}
                                                                <td style={{"border": 0, "borderRight": "1px solid black"}}>{evt.afterBalance}</td>
                                                                <td style={{"border": 0}}></td>
                                                            </tr>
                                                })
                                            }
                                        </tbody>
                                    </table>


                            )
                        }else{
                            return (
                                <div>暂无信息</div>
                            )
                        }
                    }
                },
                {
                    label: "项目",
                    prop: "proName",
                    width: 150
                },
                {
                    label: "序号",
                    prop: "no",
                    width: 160
                },
                {
                    label: "日期",
                    prop: "payDate"
                },
                {
                    label: "摘要",
                    prop: "remark"
                },
                {
                    label: "收入",
                    prop: "income"
                },
                {
                    label: "支出",
                    prop: "outcome"
                },
                {
                    label: "余额",
                    prop: "afterBalance"
                },
                {
                    label: "操作",
                    prop: "operate",
                    render: (row, column, data)=>{
                        if(row.outCode == 'CLASS_FEE'){
                            if(row.classId){
                                return <span><Button type="primary" size="small" onClick={this.createCourseHourDialog.bind(this,row)}>关联班级</Button></span>
                            }else{
                                return <span><Button type="danger" size="small" onClick={this.createCourseHourDialog.bind(this,row)}>关联班级</Button></span>
                            }
                        }
                    }
                }
            ],
            data: [],
            type: type,

        };
        this.createAccountDialog = this.createAccountDialog.bind(this);
        this.createCourseHourDialog= this.createCourseHourDialog.bind(this);
        this.refresh = this.refresh.bind(this);
    }

    componentDidMount() {
        this.refresh();
        mainSize();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.changedCrmGroup !== nextProps.changedCrmGroup) {
            this.setState({redirectToList: true})
        }
    }

    componentWillUnmount() {
        if (this.tipsContainer) {
            document.body.removeChild(this.tipsContainer);
        }
    }

    createAccountDialog(egt) {
        this.actContainer = document.createElement('div');
        ReactDOM.render(
            <DialogAccount
                accept={this.acceptActDialog}
                changedCrmGroup={this.state.group}
                refresh={this.refresh}
                id={this.state.id}
                accountType={egt.target.innerText == INCOME ? 1 : 2}
                notRoot={true}
                defaults={this.state.channelId}
                replace={this.props.replace}
                from={this.props.from}
                ref={(dom) => {
                    this.act = dom
                }}
            />,
            document.body.appendChild(this.actContainer)
        );
        this.act.dialog.modal('show');
    }

    createCourseHourDialog(data) {
        this.actContainer = document.createElement('div');
        ReactDOM.render(
            <DialogAccountRelateClass
                accept={this.acceptActDialog}
                changedCrmGroup={this.state.group}
                notRoot={true}
                id={this.state.id}
                mainAccountId={data.id}
                totalFee={(data.sonList && data.sonList.length >= 1 ? data.sonList[0].afterBalance : 0)}
                defaults={this.state.channelId}
                replace={this.props.replace}
                from={this.props.from}
                ref={(dom) => {
                    this.act = dom
                }}
            />,
            document.body.appendChild(this.actContainer)
        );
        this.act.dialog.modal('show');
    }

    refresh(){
        const request = async () => {
            try {
                let data = await ajax('/service/account/list.do', {stuId: this.state.id});
                if(data && data.data.items){
                    data = data.data.items;
                    let idx = 1;
                    let sonIdx = 1;
                    data.map(item => {
                        if(item.payDate){
                            item.no = idx++;
                            item.payDate = new Date(item.payDate).format("yyyy-MM-dd");
                        }
                        sonIdx = 1;
                        if(item.sonList && item.sonList.length > 0){
                            item.sonList.map(son => {
                                son.no = sonIdx++;
                                son.payDate = new Date(son.payDate).format("yyyy-MM-dd");
                            });
                        }
                    });
                    this.setState({data});
                }
            } catch (err) {
                if (err.errCode === 401) {
                    this.setState({redirectToReferrer: true})
                } else {
                    // this.createDialogTips(`${err.errCode}: ${err.errText}`);
                }
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

        if (this.state.redirectToList) {
            return (
                <Redirect to="/home/service/customer"/>
            )
        }

        return (
            <div>
                <h5 id="subNav">
                    <i className={`fa ${this.title.icon}`} aria-hidden="true"/>
                    &nbsp;{this.title.text}&nbsp;&nbsp;|&nbsp;&nbsp;
                    <p className="d-inline text-muted">{this.state.name}</p>

                    <div className="btn-group float-right ml-4" role="group" style={{"display":this.fourth}}>
                        <button onClick={() => {
                            this.props.history.push('/home/service/customer');
                        }} type="button" className="btn btn-light">返回
                        </button>
                    </div>

                </h5>

                <div id="main" className="main p-3" style={{"height":"80%"}}>
                    {/*<div className="row justify-content-md-center mb-2">
                        <div className="col col-12">
                            <div className="card border-top-0">
                                <div className="card-body">
                                    <p className="ht pb-3 b-b">账户信息</p>
                                    <Table
                                        style={{width: '80%'}}
                                        columns={this.state.columns}
                                        data={this.state.data}
                                        border={false}
                                        onCurrentChange={item=>{console.log(item)}}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>*/}

                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb location_bottom">
                            <li className="breadcrumb-item"style={{"display":this.first}}>
                                <Link
                                    to={{pathname: `/home/service/customer/student/${this.state.id}`,
                                        state: {stuName: this.state.name,type: this.state.type}}}>学员信息
                                </Link>
                            </li>
                            <li className="breadcrumb-item" style={{"display":this.second}}>
                                <Link to={{
                                    pathname: `/home/service/customer/parent/${this.state.id}`,
                                    state: {stuName: this.state.name,type: this.state.type}
                                }}>家长信息</Link>
                            </li>
                            <li className="breadcrumb-item" style={{"display":this.third}}>
                                <Link to={{
                                    pathname: `/home/service/customer/contract/${this.state.id}`,
                                    state: {stuName: this.state.name,type: this.state.type}
                                }}>合同信息</Link>
                            </li>
                            <li className="breadcrumb-item" style={{"display":this.fourth}}>
                                <Link to={{
                                    pathname: `/home/service/customer/account/${this.state.id}`,
                                    state: {stuName: this.state.data.name,type: this.state.type}
                                }}>账户信息</Link>
                            </li>
                            <li className="breadcrumb-item" style={{"display":this.sixth}}>
                                <Link to={{
                                    pathname: `/home/service/customer/class/${this.state.id}`,
                                    state: {stuName: this.state.data.name,type: this.state.type}
                                }}>班级信息</Link>
                            </li>
                            <li className="breadcrumb-item" style={{"display":this.fifth}}>
                                <Link to={{
                                    pathname: `/home/service/customer/situation/${this.state.id}`,
                                    state: {stuName: this.state.data.name,type: this.state.type}
                                }}>异动信息</Link>
                            </li>
                            <li className="breadcrumb-item" style={{"display":this.seventh}}>
                                卡券信息
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>
        )
    }
}

export default AccountView;