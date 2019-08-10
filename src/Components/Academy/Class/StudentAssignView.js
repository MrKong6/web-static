import React from 'react'
import ReactDOM from "react-dom";
import {Link, Redirect} from 'react-router-dom'
import {Button, Transfer} from 'element-react';

import DialogTips from "../../Dialog/DialogTips";
import Commands from "../../Commands/Commands";

import fmtTitle from "../../../utils/fmtTitle";
import ajax from "../../../utils/ajax";
import mainSize from "../../../utils/mainSize";

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
            data: [
                {
                    key: 1234,
                    label: `备选项`,
                }
            ],
            ids: [],
            columns: [
                {
                    label: "序号",
                    width: 100,
                    sortable: true,
                    type: 'index'
                },
                {
                    label: "校区名称",
                    prop: "schoolArea",
                    width: 100,
                    sortable: true
                },
                {
                    label: "班级编号",
                    prop: "code",
                    width: 120,
                    sortable: true,
                    render: (row, column, data) => {
                        return <span><Button type="text" size="small"
                                             onClick={this.goToDetails.bind(this, row.id)}>{row.code}</Button></span>
                    }
                },
                {
                    label: "升学前班级",
                    prop: "beforeClassCode",
                    width: 95,
                    showOverflowTooltip: true,
                },
                {
                    label: "班级类型",
                    prop: "typeName",
                    width: 95
                },
                {
                    label: "班级类别",
                    prop: "rangeName",
                    width: 100
                },
                {
                    label: "班级状态",
                    prop: "classStatusName",
                    width: 130,
                    /*render: (row, column, data) => {
                        return <span><Button type="text" size="small"
                                             onClick={this.goToDetails.bind(this, row.id)}>{row.code}</Button></span>
                    }*/
                },
                {
                    label: "开班日期",
                    prop: "startDate",
                    width: 120
                },
                {
                    label: "结班日期",
                    prop: "endDate",
                    width: 120
                },
                {
                    label: "主教",
                    prop: "mainTeacher",
                    width: 95,
                },
                {
                    label: "教务",
                    prop: "registrar",
                    width: 95,
                },
                {
                    label: "计划人数",
                    prop: "planNum",
                    // className: 'tabletd',
                    // render: function (data) {
                    //     return <Tooltip effect="dark" content={data.parCellphone}
                    //                     placement="top-start">
                    //         {data.parCellphone}
                    //     </Tooltip>
                    // }

                },
                {
                    label: "开班人数",
                    prop: "startNum",
                },
                {
                    label: "实际人数",
                    prop: "factNum",
                    /*className: 'tabletd',
                    render: function (data) {

                        return <Tooltip effect="dark" content={data.courseName}
                                        placement="top-start">
                            {data.courseName}
                        </Tooltip>
                    }*/
                },
                {
                    label: "创建人",
                    prop: "createBy",
                    width: 100
                },
                {
                    label: "创建时间",
                    prop: "createOn",
                    width: 100,
                    sortable: true
                },
                /*
                {
                    label: "应付金额",
                    prop: "finalPrice",
                    width: 95
                },
                {
                    label: "已付金额",
                    prop: "paid",
                    width: 120
                }*/
            ],
            totalPage: 0,
            currentPage: 1,
            pageSize: 10,
            totalCount: 0,
            value: null
        };
        this.createDialogTips = this.createDialogTips.bind(this);
        this.assignAction = this.assignAction.bind(this);
        this.renderFunc = this.renderFunc.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        // const request = async () => {
        //     try {
        //         let data = await ajax('/academy/class/query.do', {id: this.state.id});
        //
        //         console.log(data.data)
        //     } catch (err) {
        //         if (err.errCode === 401) {
        //             this.setState({redirectToReferrer: true})
        //         } else {
        //             this.createDialogTips(`${err.errCode}: ${err.errText}`);
        //         }
        //     }
        // };
        //
        // request();
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
        this.props.history.push(`${this.props.match.url}/assign/`, {ids: this.ids});
    }

    renderFunc(option) {
        return <span>{ option.key } - { option.label }</span>;
    }

    handleChange(value) {
        this.setState({value})
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
                    <div className="row justify-content-md-center" style={{"height":"80%"}}>
                        {/*<Transfer
                            value={this.state.data}
                            renderContent={this.renderFunc}
                            titles={['所有学员', '分班学员']}
                            onChange={this.handleChange}
                            data={this.state.data}
                        >
                        </Transfer>*/}

                            <div className="col col-5" style={{"margin-right":"20px"}}>
                                <div className="row">所有学员</div>
                                <div className="row" style={{"height":"100%"}}>
                                    <div className="col col-12" style={{"height":"100%","border":"1px solid"}}></div>
                                </div>
                            </div>
                            <div className="col col-5">
                                <div className="row">分班学员</div>
                                <div className="row" style={{"height":"100%"}}>
                                    <div className="col col-12" style={{"height":"100%","border":"1px solid"}}></div>
                                </div>
                            </div>
                    </div>
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