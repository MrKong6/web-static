import React from 'react'
import ReactDOM from "react-dom";
import {Link, Redirect} from 'react-router-dom'
import {Button, Pagination, Table, Tabs} from 'element-react';

import DialogTips from "../../Dialog/DialogTips";
import Commands from "../../Commands/Commands";

import fmtTitle from "../../../utils/fmtTitle";
import ajax from "../../../utils/ajax";
import mainSize from "../../../utils/mainSize";
import CONFIG from "../../../utils/config";
import calculateAge from "../../../utils/calculateAge";
import fmtDate from "../../../utils/fmtDate";
import StudentSituationBackMoney from "./StudentSituationBackMoney";
import StudentSituationPauseClass from "./StudentSituationPauseClass";
import StudentSituationChangeClass from "./StudentSituationChangeClass";

class StudentSituation extends React.Component {
    constructor(props) {
        super(props);

        this.commands = this.props.commands.filter(command => (command.id == '5-4-6-1'));
        this.first = !(this.props.sonView.filter(view => (view.id == '5-4-1')) == false) ? 'normal' : 'none';
        this.second = !(this.props.sonView.filter(view => (view.id == '5-4-2')) == false) ? 'normal' : 'none';
        this.third = !(this.props.sonView.filter(view => (view.id == '5-4-3')) == false) ? 'normal' : 'none';
        this.fourth = !(this.props.sonView.filter(view => (view.id == '5-4-4')) == false) ? 'normal' : 'none';
        this.fifth = !(this.props.sonView.filter(view => (view.id == '5-4-5')) == false) ? 'normal' : 'none';
        this.sixth = !(this.props.sonView.filter(view => (view.id == '5-4-6')) == false) ? 'normal' : 'none';
        this.title = fmtTitle(this.props.location.pathname);
        this.state = {
            group: this.props.changedCrmGroup,
            redirectToReferrer: false,
            redirectToList: false,
            isAnimating: false,
            id: this.props.match.params.contractId,
            data: null,
            stuName: this.props.location.state.stuName,
            ids: [],
            totalPage: 0,
            currentPage: 1,
            pageSize: 10,
            totalCount: 0,
            situationView: 1
        };
        this.createDialogTips = this.createDialogTips.bind(this);
        this.assignAction = this.assignAction.bind(this);
        this.goToDetails = this.goToDetails.bind(this);
        this.changePanel = this.changePanel.bind(this);
    }

    componentDidMount() {
        const request = async () => {
            try {
                let list = await ajax('/service/customer/student/classStuList.do', {
                    orgId: this.state.group.id, pageNum: this.state.currentPage,
                    pageSize: this.state.pageSize, id: this.state.id, needParent: 1
                });
                list.data.map(item => {
                    if (item.idType != null) {
                        item.idType = CONFIG.DOCUMENT[item.idType];
                    }
                    if (item.birthday != null) {
                        item.age = calculateAge(fmtDate(item.birthday));
                        item.birthday = fmtDate(item.birthday);
                    }
                });
                console.log(list.data);
                this.setState({list: list.data, totalPage: list.totalPage, totalCount: list.count});
            } catch (err) {
                if (err.errCode === 401) {
                    this.setState({redirectToReferrer: true})
                } else {
                    this.createDialogTips(`${err.errCode}: ${err.errText}`);
                }
            }
        };

        request();
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

    goToDetails(id) {
        this.props.history.push(`/home/service/customer/student/` + id);
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

    assignAction() {
        debugger
        if(this.state.situationView == 1){
            this.props.history.push(`/home/academy/class/situation/backMoneyAdd/${this.state.id}`, {id: this.state.id,type: 1});
        }else if(this.state.situationView == 2){
            this.props.history.push(`/home/academy/class/situation/pauseClassAdd/${this.state.id}`, {id: this.state.id,type: 1});
        }else{
            this.props.history.push(`/home/academy/class/situation/changeClassAdd/${this.state.id}`, {id: this.state.id,type: 1});
        }
    }

    pageChange(currentPage) {
        console.log(currentPage);
        this.state.currentPage = currentPage;
        // this.setState({currentPage:currentPage});
        this.componentDidMount();
    }

    sizeChange(pageSize) {
        console.log(pageSize);
        this.state.pageSize = pageSize;
        this.componentDidMount();
    }
    changePanel(tab){
        this.setState({situationView:tab.props.name});
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
                <Redirect to="/home/academy/class"/>
            )
        }


        return (
            <div>
                <h5 id="subNav">
                    <i className={`fa ${this.title.icon}`} aria-hidden="true"/>
                    &nbsp;{this.title.text}&nbsp;&nbsp;|&nbsp;&nbsp;
                    <p className="d-inline text-muted">{this.state.stuName}</p>
                    <Commands
                        commands={this.commands}
                        thAction={this.assignAction}
                    />
                </h5>
                <div id="main" className="main p-3">
                    {/*<Progress isAnimating={this.state.isAnimating}/>*/}
                    {/*<Table list={this.state.list} goto={this.goToDetails}/>*/}
                    <p>班级异动信息</p>
                    <div className="row" style={{"height": '80%'}}>
                        <Tabs activeName="1" onTabClick={ this.changePanel }>
                            <Tabs.Pane label="退费" name="1">
                                <StudentSituationBackMoney type={"class"} id={this.state.id} />
                            </Tabs.Pane>
                            <Tabs.Pane label="休学" name="2">
                                <StudentSituationPauseClass type={"class"} id={this.state.id} />
                            </Tabs.Pane>
                            <Tabs.Pane label="转班" name="3">
                                <StudentSituationChangeClass type={"class"} id={this.state.id} />
                            </Tabs.Pane>
                        </Tabs>
                    </div>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb location_bottom">
                            <li className="breadcrumb-item"><Link
                                to={`/home/academy/class/${this.state.id}`} style={{"display":this.first}}>班级基本信息</Link></li>
                            <li className="breadcrumb-item active" style={{"display":this.second}}>
                                <Link to={{
                                    pathname: `/home/academy/class/student/${this.state.id}`,
                                    state: {stuName: this.state.stuName}
                                }}>班级学员信息</Link>
                            </li>
                            <li className="breadcrumb-item" style={{"display":this.third}}>
                                <Link to={{
                                    pathname: `/home/academy/class/teacher/${this.state.id}`,
                                    state: {stuName: this.state.stuName}
                                }}>班级教师信息</Link>
                            </li>
                            <li className="breadcrumb-item" style={{"display":this.fourth}}>
                                <Link to={{
                                    pathname: `/home/academy/class/assignClass/${this.state.id}`,
                                    state: {stuName: this.state.stuName}
                                }}>班级课程表</Link>
                            </li>
                            <li className="breadcrumb-item" style={{"display":this.fifth}}>
                                <Link to={{
                                pathname: `/home/academy/class/clocked/${this.state.id}`,
                                state: {stuName: this.state.stuName}
                            }}>班级考勤信息</Link></li>
                            <li className="breadcrumb-item" style={{"display":this.sixth}}>
                                班级异动信息
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>
        )
    }
}

export default StudentSituation;