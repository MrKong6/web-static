import React from 'react'
import ReactDOM from "react-dom";
import {Link, Redirect} from 'react-router-dom'
import {Button, Dialog, Pagination, Radio, Table, Tabs} from 'element-react';

import DialogTips from "../../Dialog/DialogTips";
import Commands from "../../Commands/Commands";

import fmtTitle from "../../../utils/fmtTitle";
import ajax from "../../../utils/ajax";
import mainSize from "../../../utils/mainSize";
import fmtDate from "../../../utils/fmtDate";
import StudentSit from "../../Service/Situation/StudentSituation"

class StudentSituation extends React.Component {
    constructor(props) {
        super(props);
        debugger
        this.commands = this.props.commands.filter(command => (command.id == '5-4-6-1'));

        this.first = !(this.props.sonView.filter(view => (view.id == '2-3-1')) == false) ? 'normal' : 'none';
        this.second = !(this.props.sonView.filter(view => (view.id == '2-3-2')) == false) ? 'normal' : 'none';
        this.third = !(this.props.sonView.filter(view => (view.id == '2-3-3')) == false) ? 'normal' : 'none';
        this.fourth = !(this.props.sonView.filter(view => (view.id == '2-3-5')) == false) ? 'normal' : 'none';
        this.fifth = !(this.props.sonView.filter(view => (view.id == '2-3-6')) == false) ? 'normal' : 'none';
        this.sixth = this.props.sonView && !(this.props.sonView.filter(view => (view.id == '2-3-7')) == false) ? 'normal' : 'none';
        this.seventh = this.props.sonView && !(this.props.sonView.filter(view => (view.id == '2-3-8')) == false) ? 'normal' : 'none';

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
                let list = await ajax('/student/situation/list.do', {
                    orgId: this.state.group.id, pageNum: this.state.currentPage,
                    pageSize: this.state.pageSize, stuId:this.state.id
                });
                if(list && list.items){
                    list.items.map(item => {
                        if (item.applyTime != null) {
                            item.applyTime = fmtDate(item.applyTime);
                        }
                    });
                }
                this.setState({list: list.items});
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

    toDirect() {
        if(this.state.situationView == 1){
            this.props.history.push(`/home/academy/class/situation/backMoneyAdd/${this.state.id}`, {id: this.state.id,type: 1});
        }else if(this.state.situationView == 2){
            this.props.history.push(`/home/academy/class/situation/pauseClassAdd/${this.state.id}`, {id: this.state.id,type: 1});
        }else{
            this.props.history.push(`/home/academy/class/situation/changeClassAdd/${this.state.id}`, {id: this.state.id,type: 1});
        }
    }

    assignAction() {
        this.setState({ dialogVisible3: true });
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
        this.setState({situationView:tab});
        this.state.situationView = tab;
        // this.componentDidMount();
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
                    <div className="btn-group float-right" role="group">
                        <div className="btn-group float-right" role="group">
                            <button onClick={this.assignAction} type="button" className="btn btn-primary" id="btnChoose" disabled={this.state.canAssign}>
                                新建
                            </button>
                        </div>
                    </div>
                </h5>
                <div id="main" className="main p-3">
                    {/*<Progress isAnimating={this.state.isAnimating}/>*/}
                    {/*<Table list={this.state.list} goto={this.goToDetails}/>*/}
                    <p>异动信息</p>
                    <div className="row" style={{"height": '80%'}}>
                        {/*<Tabs activeName="1" onTabClick={ this.changePanel }>
                            <Tabs.Pane label="退费" name="1">
                                <StudentSituationBackMoney type={"class"} id={this.state.id} data={this.state.list} />
                            </Tabs.Pane>
                            <Tabs.Pane label="休学" name="2">
                                <StudentSituationPauseClass type={"class"} id={this.state.id} data={this.state.list} />
                            </Tabs.Pane>
                            <Tabs.Pane label="转班" name="3">
                                <StudentSituationChangeClass type={"class"} id={this.state.id} data={this.state.list} />
                            </Tabs.Pane>
                        </Tabs>*/}
                        <StudentSit type={"class"} id={this.state.id} data={this.state.list} />
                    </div>
                    <Dialog
                        title="请选择异动类型"
                        size="tiny"
                        visible={ this.state.dialogVisible3 }
                        onCancel={ () => this.setState({ dialogVisible3: false }) }
                    >
                        <Dialog.Body>
                            <div className="form-group row">
                                <div className="col-2"></div>
                                <div className="col-10">
                                    <Radio value="1" checked={this.state.situationView === 1} onChange={this.changePanel.bind(this)}>退费</Radio>
                                    <Radio value="2" checked={this.state.situationView === 2} onChange={this.changePanel.bind(this)}>休学</Radio>
                                    <Radio value="3" checked={this.state.situationView === 3} onChange={this.changePanel.bind(this)}>转班</Radio>
                                </div>
                            </div>
                        </Dialog.Body>

                        <Dialog.Footer className="dialog-footer">
                            <Button onClick={ () => this.setState({ dialogVisible3: false }) }>取 消</Button>
                            <Button type="primary" onClick={this.toDirect.bind(this)}>确 定</Button>
                        </Dialog.Footer>
                    </Dialog>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb location_bottom">
                            <li className="breadcrumb-item"style={{"display":this.first}}><Link
                                to={`/home/sales/customer/student/${this.state.id}`}>学员信息</Link>
                            </li>
                            <li className="breadcrumb-item" style={{"display":this.second}}>
                                <Link to={{
                                    pathname: `/home/sales/customer/parent/${this.state.id}`,
                                    state: {stuName: this.state.stuName}
                                }}>家长信息</Link>
                            </li>
                            <li className="breadcrumb-item" style={{"display":this.third}}>
                                <Link to={{
                                    pathname: `/home/sales/customer/contract/${this.state.id}`,
                                    state: {stuName: this.state.stuName}
                                }}>合同信息</Link>
                            </li>
                            <li className="breadcrumb-item" style={{"display":this.fifth}}>
                                异动信息
                            </li>
                            <li className="breadcrumb-item" style={{"display":this.fourth}}>
                                <Link to={{
                                    pathname: `/home/sales/customer/account/${this.state.id}`,
                                    state: {stuName: this.state.stuName}
                                }}>账户信息</Link>
                            </li>
                            <li className="breadcrumb-item" style={{"display":this.sixth}}>
                                <Link to={{
                                    pathname: `/home/sales/customer/class/${this.state.id}`,
                                    state: {stuName: this.state.data ? this.state.data.name : this.state.stuName}
                                }}>班级信息</Link>
                            </li>
                            <li className="breadcrumb-item" style={{"display":this.seventh}}>
                                <Link to={{
                                    pathname: `/home/sales/customer/charge/${this.state.id}`,
                                    state: {stuName: this.state.data ? this.state.data.name : this.state.stuName}
                                }}>卡券信息</Link>
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>
        )
    }
}

export default StudentSituation;