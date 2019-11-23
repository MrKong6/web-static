import React from 'react'
import ReactDOM from "react-dom";
import {Link, Redirect} from 'react-router-dom'
import {Pagination, Table} from 'element-react';

import DialogTips from "../../Dialog/DialogTips";

import fmtTitle from "../../../utils/fmtTitle";
import ajax from "../../../utils/ajax";
import mainSize from "../../../utils/mainSize";
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
                pathname: `/home/education/class/${ids[curIndex + 1]}`,
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
                pathname: `/home/education/class/${ids[curIndex - 1]}`,
                state: {ids: ids}
            }}
        >
            上一条
        </Link>
    )
};

class TeacherView extends React.Component {
    constructor(props) {
        super(props);

        this.commands = this.props.commands.filter(command => (command.name !== 'Add' && command.name !== 'Mod'
            && command.name !== 'Del' && command.name !== 'Import' && command.name !== 'Export' && command.name !== 'ShowNormal'));
        this.first = !(this.props.sonView.filter(view => (view.id == '6-1-1')) == false) ? 'normal' : 'none';
        this.second = !(this.props.sonView.filter(view => (view.id == '6-1-2')) == false) ? 'normal' : 'none';
        this.third = !(this.props.sonView.filter(view => (view.id == '6-1-3')) == false) ? 'normal' : 'none';
        this.fourth = !(this.props.sonView.filter(view => (view.id == '6-1-4')) == false) ? 'normal' : 'none';
        this.fifth = !(this.props.sonView.filter(view => (view.id == '6-1-5')) == false) ? 'normal' : 'none';
        this.sixth = !(this.props.sonView.filter(view => (view.id == '6-1-6')) == false) ? 'normal' : 'none';
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
            columns: [
                {
                    label: "序号",
                    width: 100,
                    sortable: true,
                    type: 'index'
                },
                {
                    label: "编号",
                    prop: "code",
                },
                {
                    label: "姓名",
                    prop: "name",
                    showOverflowTooltip: true,
                    /*render: (row, column, data)=>{
                        return <span><Button type="text" size="small" onClick={this.goToDetails.bind(this, row.id)}>{row.name}</Button></span>
                    }*/
                },
                {
                    label: "英文名",
                    prop: "enName",
                },
                {
                    label: "性别",
                    prop: "genderText",
                },
                {
                    label: "出生日期",
                    prop: "birthday",
                },
                {
                    label: "年龄",
                    prop: "age",
                },
                {
                    label: "职位",
                    prop: "positionName",
                },
                {
                    label: "类型",
                    prop: "typeName",
                },
                {
                    label: "类别",
                    prop: "rangeName",
                },
                {
                    label: "备注",
                    prop: "comment",
                },
                /*{
                    label: "创建人",
                    prop: "createBy",
                },
                {
                    label: "创建时间",
                    prop: "createOn",
                    sortable: true
                },*/
            ],
            totalPage: 0,
            currentPage: 1,
            pageSize: 10,
            totalCount: 0,
        };
        this.createDialogTips = this.createDialogTips.bind(this);
    }

    componentDidMount() {
        const request = async () => {
            try {
                let list = await ajax('/academy/teacher/list.do', {
                    orgId: this.state.group.id, pageNum: this.state.currentPage,
                    pageSize: this.state.pageSize, classId: this.state.id
                });
                const ids = list.data.items.map((contract) => (contract.id));
                list.data.items.map(item => {
                    if (item.birthday != null) {
                        item.birthday = fmtDate(item.birthday);
                    }
                });
                this.setState({
                    list: list.data.items,
                    ids: ids,
                    totalPage: list.data.totalPage,
                    totalCount: list.data.count
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
        mainSize()
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
                <Redirect to="/home/education/class"/>
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
                            this.props.history.push('/home/education/class');
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
                    <p>班级教师信息</p>
                    <div className="row" style={{"height": '80%'}}>
                        <Table
                            style={{width: '100%'}}
                            className="leadlist_search"
                            columns={this.state.columns}
                            data={this.state.list}
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
                            <li className="breadcrumb-item" style={{"display":this.first}}>
                                <Link
                                    to={`/home/education/class/${this.state.id}`}>班级基本信息</Link></li>
                            <li className="breadcrumb-item active" style={{"display":this.second}}>
                                <Link to={{
                                    pathname: `/home/education/class/student/${this.state.id}`,
                                    state: {stuName: this.state.stuName}
                                }}>班级学员信息</Link>
                            </li>
                            <li className="breadcrumb-item" style={{"display":this.third}}>
                                班级教师信息
                            </li>
                            <li className="breadcrumb-item" style={{"display":this.fourth}}>
                                <Link to={{
                                    pathname: `/home/education/class/assignClass/${this.state.id}`,
                                    state: {stuName: this.state.stuName}
                                }}>班级课程表</Link>
                            </li>
                            <li className="breadcrumb-item" style={{"display":this.fifth}}>
                                <Link to={{
                                    pathname: `/home/education/class/clocked/${this.state.id}`,
                                    state: {stuName: this.state.stuName}
                                }}>班级考勤信息</Link></li>
                            <li className="breadcrumb-item" style={{"display":this.sixth}}>
                                <Link to={``}>班级异动信息</Link>
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>
        )
    }
}

export default TeacherView;