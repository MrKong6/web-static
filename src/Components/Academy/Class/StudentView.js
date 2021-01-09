import React from 'react'
import ReactDOM from "react-dom";
import {Link, Redirect} from 'react-router-dom'
import {Button, Pagination, Table} from 'element-react';

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

class StudentView extends React.Component {
    constructor(props) {
        super(props);

        this.commands = this.props.commands.filter(command => (command.name !== 'Add' && command.name !== 'Mod'
            && command.name !== 'Del' && command.name !== 'Import' && command.name !== 'Export' && command.name !== 'ShowNormal'));
        this.first = !(this.props.sonView.filter(view => (view.id == '5-4-1' || view.id == '5-6-1')) == false) ? 'normal' : 'none';
        this.second = !(this.props.sonView.filter(view => (view.id == '5-4-2' || view.id == '5-6-2')) == false) ? 'normal' : 'none';
        this.third = !(this.props.sonView.filter(view => (view.id == '5-4-3' || view.id == '5-6-3')) == false) ? 'normal' : 'none';
        this.fourth = !(this.props.sonView.filter(view => (view.id == '5-4-4' || view.id == '5-6-4')) == false) ? 'normal' : 'none';
        this.fifth = !(this.props.sonView.filter(view => (view.id == '5-4-5' || view.id == '5-6-5')) == false) ? 'normal' : 'none';
        this.sixth = !(this.props.sonView.filter(view => (view.id == '5-4-6' || view.id == '5-6-6')) == false) ? 'normal' : 'none';

        let data = this.props.sonView.filter(view => (view.id.indexOf('5-4') != -1));
        this.title = fmtTitle(data && data.length > 0 ? this.props.location.pathname : '/home/academy/cls/in');

        this.state = {
            group: this.props.changedCrmGroup,
            redirectToReferrer: false,
            redirectToList: false,
            isAnimating: false,
            id: this.props.match.params.contractId,
            data: null,
            stuName: this.props.location.state.stuName,
            ids: [],
            columns: [
                {
                    width: 100,
                    sortable: true,
                    type: 'index'
                },
                {
                    label: "学员",
                    prop: "name",
                    render: (row, column, data) => {
                        return <span><Button type="text" size="small" style={{"color":row.classStatusTag ? "#A9A9A9" : "#007bff"}}
                                             onClick={this.goToDetails.bind(this, row.id)}>{row.name}</Button></span>
                    }
                },
                {
                    label: "学员编号",
                    prop: "code",
                    render: (row, column, data) =>{
                        return <span style={{"color":row.classStatusTag ? "#A9A9A9" : "#000000"}}>{row.code}</span>
                    }
                },
                {
                    label: "英文名",
                    prop: "enName",
                    render: (row, column, data) =>{
                        return <span style={{"color":row.classStatusTag ? "#A9A9A9" : "#000000"}}>{row.enName}</span>
                    }
                },
                {
                    label: "性别",
                    prop: "genderText",
                    render: (row, column, data) =>{
                        return <span style={{"color":row.classStatusTag ? "#A9A9A9" : "#000000"}}>{row.genderText}</span>
                    }
                },
                {
                    label: "出生年月",
                    prop: "birthday",
                    render: (row, column, data) =>{
                        return <span style={{"color":row.classStatusTag ? "#A9A9A9" : "#000000"}}>{row.birthday}</span>
                    }
                },
                {
                    label: "年龄",
                    prop: "age",
                    render: (row, column, data) =>{
                        return <span style={{"color":row.classStatusTag ? "#A9A9A9" : "#000000"}}>{row.age}</span>
                    }
                },
                {
                    label: "家长姓名",
                    prop: "parent.name",
                    render: (row, column, data) =>{
                        return <span style={{"color":row.classStatusTag ? "#A9A9A9" : "#000000"}}>{row.parent ? row.parent.name : ""}</span>
                    }
                },
                {
                    label: "与学员关系",
                    prop: "parent.relation",
                    render: (row, column, data) =>{
                        return <span style={{"color":row.classStatusTag ? "#A9A9A9" : "#000000"}}>{row.parent ? row.parent.relation : ""}</span>
                    }
                },
                {
                    label: "学员状态",
                    prop: "classStuStatusName",
                    render: (row, column, data) =>{
                        return <span style={{"color":row.classStatusTag ? "#A9A9A9" : "#000000"}}>{row.classStuStatusName}</span>
                    }
                },
                {
                    label: "异动状态",
                    prop: "classStatusTag",
                    render: (row, column, data) =>{
                        return <span style={{"color":row.classStatusTag ? "#A9A9A9" : "#000000"}}>{row.classStatusTag}</span>
                    }
                },
            ],
            totalPage: 0,
            currentPage: 1,
            pageSize: 10,
            totalCount: 0,
        };
        this.createDialogTips = this.createDialogTips.bind(this);
        this.assignAction = this.assignAction.bind(this);
        this.goToDetails = this.goToDetails.bind(this);
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
        this.props.history.push(`/home/academy/class/student/assign/${this.state.id}`, {ids: this.ids,stuName: this.state.stuName});
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
    //表格行内底色
    rowClassName(row, index) {
        if (row.transType === 1) {
            //已开班
            return 'back_table_tr_grew';
        }
        return '';
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
                    <div className="btn-group float-right ml-4" role="group">
                        <PrevBtn id={this.state.id} ids={this.state.ids}/>
                        <NextBtn id={this.state.id} ids={this.state.ids}/>
                    </div>
                    <div className="btn-group float-right ml-4" role="group">
                        <button onClick={() => {
                            this.props.history.push('/home/academy/class');
                        }} type="button" className="btn btn-light">返回
                        </button>
                    </div>
                    <Commands
                        commands={this.commands}
                        assignAction={this.assignAction}
                    />
                </h5>
                <div id="main" className="main p-3">
                    {/*<Progress isAnimating={this.state.isAnimating}/>*/}
                    {/*<Table list={this.state.list} goto={this.goToDetails}/>*/}
                    <p>班级学员信息</p>
                    <div className="row" style={{"height": '80%'}}>
                        <Table
                            style={{width: '100%'}}
                            className="leadlist_search"
                            columns={this.state.columns}
                            data={this.state.list}
                            rowClassName={this.rowClassName.bind(this)}
                            border={true}
                            fit={true}
                            height='80%'
                            emptyText={"暂无数据"}
                        />
                        <Pagination layout="total, sizes, prev, pager, next, jumper"
                                    total={this.state.totalCount}
                                    pageSizes={[10, 50, 100]}
                                    pageSize={this.state.pageSize}
                                    currentPage={this.state.currentPage}
                                    pageCount={this.state.totalPage}
                                    className={""}
                                    onCurrentChange={(currentPage) => this.pageChange(currentPage)}
                                    onSizeChange={(pageSize) => this.sizeChange(pageSize)}/>
                    </div>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb location_bottom">
                            <li className="breadcrumb-item"><Link
                                to={`/home/academy/class/${this.state.id}`} style={{"display":this.first}}>班级基本信息</Link></li>
                            <li className="breadcrumb-item active" style={{"display":this.second}}>班级学员信息</li>
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
                                <Link to={{
                                    pathname: `/home/academy/class/situation/${this.state.id}`,
                                    state: {stuName: this.state.stuName}
                                }}>班级异动信息</Link>
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>
        )
    }
}

export default StudentView;