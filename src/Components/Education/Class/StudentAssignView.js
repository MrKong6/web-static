import React from 'react'
import ReactDOM from "react-dom";
import {Link, Redirect} from 'react-router-dom'
import {Button, Message, Table, Tooltip, Transfer} from 'element-react';

import DialogTips from "../../Dialog/DialogTips";
import Commands from "../../Commands/Commands";

import fmtTitle from "../../../utils/fmtTitle";
import ajax from "../../../utils/ajax";
import mainSize from "../../../utils/mainSize";
import CONFIG from "../../../utils/config";
import calculateAge from "../../../utils/calculateAge";
import fmtDate from "../../../utils/fmtDate";

const NextBtn = ({id, ids}) => {
    const curIndex = ids.indexOf(id);

    if ((curIndex + 1) === ids.length) {
        return <button type="button" className="btn btn-light" disabled={true}>下一条</button>
    }

    return (
        <Link
            className="btn btn-light"
            to={{
                pathname: `/home/academy/class/${ids[curIndex + 1]}`,
                state: {ids: ids}
            }}
        >
            下一条
        </Link>
    )
};

const PrevBtn = ({id, ids}) => {
    const curIndex = ids.indexOf(id);

    if (curIndex === 0) {
        return <button type="button" className="btn btn-light" disabled={true}>上一条</button>
    }

    return (
        <Link
            className="btn btn-light"
            to={{
                pathname: `/home/academy/class/${ids[curIndex - 1]}`,
                state: {ids: ids}
            }}
        >
            上一条
        </Link>
    )
};

class StudentAssignView extends React.Component {
    constructor(props) {
        super(props);

        this.commands = this.props.commands.filter(command => (command.name !== 'Add' && command.name !== 'Mod'));
        this.title = fmtTitle(this.props.location.pathname);
        this.state = {
            group: this.props.changedCrmGroup,
            redirectToReferrer: false,
            redirectToList: false,
            isAnimating: false,
            id: this.props.match.params.contractId,
            data: [],
            dataRight: [],
            ids: [],
            columns: [
                {
                    type: 'selection'
                },
                {
                    label: "(状态)",
                    prop: "classStatusName",
                },
                {
                    label: "学员姓名",
                    prop: "name",
                },
                {
                    label: "性别",
                    prop: "genderText",
                },
                {
                    label: "出生年月",
                    prop: "birthday",
                },
                {
                    label: "年龄",
                    prop: "age",
                },
                {
                    label: "在读年级",
                    prop: "classGrade",
                },
                {
                    label: "所在学校",
                    prop: "schoolName",
                    className:'tabletd',
                    render: function (data) {

                        return <Tooltip effect="dark" content={data.schoolName}
                                        placement="top-start">
                            {data.schoolName}
                        </Tooltip>
                    }
                }
            ],
            columnsFrom: [
                {
                    type: 'selection'
                },
                {
                    label: "(状态)",
                    prop: "classStatusName",
                },
                {
                    label: "学员姓名",
                    prop: "name",
                },
                {
                    label: "性别",
                    prop: "genderText",
                },
                {
                    label: "出生年月",
                    prop: "birthday",
                },
                {
                    label: "年龄",
                    prop: "age",
                },
                {
                    label: "在读年级",
                    prop: "classGrade",
                },
                {
                    label: "所在学校",
                    prop: "schoolName",
                    className:'tabletd',
                    render: function (data) {

                        return <Tooltip effect="dark" content={data.schoolName}
                                        placement="top-start">
                            {data.schoolName}
                        </Tooltip>
                    }
                }
            ],
            totalPage: 0,
            currentPage: 1,
            pageSize: 10,
            totalCount: 0,
            value: null,
            chooseLeftRows:[],
            chooseRightRows:[],
        };
        this.assignAction = this.assignAction.bind(this);
        this.renderFunc = this.renderFunc.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.reqListData = this.reqListData.bind(this);
    }

    componentDidMount() {
        this.reqListData();
        mainSize();
    }
    reqListData(){
        const request = async () => {
            try {
                let list = await ajax('/service/customer/student/classStuList.do', {orgId: this.state.group.id,classStatus:1,exceptAssign:1,id:this.state.id});
                let listRight = await ajax('/service/customer/student/classStuList.do', {orgId: this.state.group.id,id:this.state.id});
                if(list){
                    list.data.map(item => {
                        if(item.idType != null){
                            item.idType = CONFIG.DOCUMENT[item.idType];
                        }
                        if(item.birthday != null){
                            item.age = calculateAge(fmtDate(item.birthday));
                            item.birthday = fmtDate(item.birthday);
                        }
                    });
                    this.setState({data:list.data})
                }
                if(listRight){
                    listRight.data.map(item => {
                        if(item.idType != null){
                            item.idType = CONFIG.DOCUMENT[item.idType];
                        }
                        if(item.birthday != null){
                            item.age = calculateAge(fmtDate(item.birthday));
                            item.birthday = fmtDate(item.birthday);
                        }
                    });
                    this.setState({dataRight:listRight.data})
                }
            } catch (err) {
                this.errorMsg("请求失败");
            }
        };

        request();
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

    assignAction() {
        this.props.history.push(`${this.props.match.url}/assign/`, {ids: this.ids});
    }

    renderFunc(option) {
        return <span>{ option.key } - { option.label }</span>;
    }

    handleChange(value) {
        this.setState({value})
    }
    //确认分配  1分配  2取消分配
    toRight(type){
        const param={ids: [], assigneeId: this.state.id, type: type};

        if(type == 1){
            if(!this.state.chooseLeftRows || this.state.chooseLeftRows.length <= 0){
                this.errorMsg("请先选择学员");
                return ;
            }
            param.ids = this.state.chooseLeftRows;
        }else{
            if(!this.state.chooseRightRows || this.state.chooseRightRows.length <= 0){
                this.errorMsg("请先选择学员");
                return ;
            }
            param.ids = this.state.chooseRightRows;
        }

        const request = async () => {
            try {
                let data = await ajax('/academy/class/assignStu.do', {"assignVo":JSON.stringify(param)});
                if(data.code == 200){
                    this.successMsg("操作成功")
                }else{
                   this.errorMsg(data.detail)
                }
                this.reqListData();
            } catch (err) {
                this.errorMsg(err.msg ? err.msg : "请求失败");
            } finally {
                this.setState({isAnimating: false});
            }
        };

        request()
    }
    //列表选择
    selectRow(value,type) {
        var ids = [];
        if(value){
            value.map((leads) => (ids.push(leads.id)));
        }
        if(type == 1){
            this.setState({
                chooseLeftRows: ids
            });
        }else{
            this.setState({
                chooseRightRows: ids
            });
        }

    }

    successMsg(msg) {
        Message({
            message: msg,
            type: 'info'
        });
    }
    errorMsg(msg) {
        Message({
            message: msg,
            type: 'error'
        });
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
                    {/*<div className="btn-group float-right ml-4" role="group">
                        <PrevBtn id={this.state.id} ids={this.state.ids}/>
                        <NextBtn id={this.state.id} ids={this.state.ids}/>
                    </div>*/}
                    <div className="btn-group float-right ml-4" role="group">
                        <button onClick={() => {
                            this.props.history.push('/home/academy/class');
                        }} type="button" className="btn btn-light">返回
                        </button>
                    </div>
                    {/*<Commands
                        commands={this.commands}
                        assignAction={this.assignAction}
                    />*/}
                </h5>
                <div id="main" className="main p-3">
                    {/*<Progress isAnimating={this.state.isAnimating}/>*/}
                    {/*<Table list={this.state.list} goto={this.goToDetails}/>*/}
                    {/*<p>班级学员信息</p>*/}
                    <div className="row justify-content-md-center" style={{"height":"80%"}}>
                        {/*<Transfer
                            value={this.state.data}
                            renderContent={this.renderFunc}
                            titles={['所有学员', '分班学员']}
                            onChange={this.handleChange}
                            data={this.state.data}
                        >
                        </Transfer>*/}
                            {/*<div className="col col-5" style={{"margin-right":"20px"}}>
                                <div className="row">所有学员</div>
                                <div className="row" style={{"height":"100%"}}>
                                    <div className="col col-12" style={{"height":"100%","border":"1px solid"}}>
                                        <Table
                                            style={{width: '100%'}}
                                            columns={this.state.columns}
                                            data={this.state.list}
                                            border={true}
                                            fit={true}
                                            emptyText={"--暂无数据--"}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col col-5">
                                <div className="row">分班学员</div>
                                <div className="row" style={{"height":"100%"}}>
                                    <div className="col col-12" style={{"height":"100%","border":"1px solid"}}></div>
                                </div>
                            </div>*/}
                            {/*<div className="row" style={{"height":"100%"}}>*/}
                                <div className="col col-6">
                                    <div className="row" style={{paddingLeft:'15px',paddingBottom:'5px',color:'#868e96'}}>所有学员</div>
                                    <Table
                                        style={{width: '90%'}}
                                        height='90%'
                                        columns={this.state.columnsFrom}
                                        data={this.state.data}
                                        border={true}
                                        fit={true}
                                        emptyText={"--暂无数据--"}
                                        onSelectChange={(selection,type) => this.selectRow(selection,1) }
                                    />
                                </div>
                                <div className="col col-1" style={{paddingTop:'15%'}}>
                                    <Button className="el-button-nomargin" type="primary" icon="d-arrow-right" size="large" onClick={this.toRight.bind(this,1)} />
                                    <br/><br/>
                                    <Button className="el-button-nomargin" type="warning" icon="d-arrow-left" size="large" onClick={this.toRight.bind(this,2)} />
                                </div>
                                <div className="col col-5">
                                    <div className="row" style={{paddingLeft:'15px',paddingBottom:'5px',color:'#868e96'}}>分班学员</div>
                                    <Table
                                        style={{width: '100%'}}
                                        columns={this.state.columns}
                                        data={this.state.dataRight}
                                        border={true}
                                        fit={true}
                                        emptyText={"--暂无数据--"}
                                        onSelectChange={(selection,type) => this.selectRow(selection,2) }
                                    />
                                </div>
                            </div>
                        {/*</div>*/}
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb location_bottom">
                            <li className="breadcrumb-item"><Link
                                to={`/home/academy/class/${this.state.id}`}>班级基本信息</Link></li>
                            <li className="breadcrumb-item active">班级学员信息</li>
                            <li className="breadcrumb-item">
                                <Link to={{
                                    pathname: ``
                                }}>班级教师信息</Link>
                            </li>
                            <li className="breadcrumb-item">
                                <Link to={{
                                    pathname: ``
                                }}>班级课程表</Link>
                            </li>
                            <li className="breadcrumb-item"><Link to={``}>班级考勤信息</Link></li>
                            <li className="breadcrumb-item"><Link to={``}>班级异动信息</Link></li>
                        </ol>
                    </nav>
                </div>
            </div>
        )
    }
}

export default StudentAssignView;