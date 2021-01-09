import React from 'react'
import ReactDOM from "react-dom";
import {Link, Redirect} from 'react-router-dom'

import DialogTips from "../../Dialog/DialogTips";
import Progress from "../../Progress/Progress";
import Commands from "../../Commands/Commands";

import fmtTitle from "../../../utils/fmtTitle";
import ajax from "../../../utils/ajax";
import mainSize from "../../../utils/mainSize";
import formatWithTime from "../../../utils/fmtDate";
import {Button, Message, Pagination, Table} from "element-react";
import {MessageBox} from "element-react";

const NextBtn = ({id, ids}) => {
    const curIndex = ids.indexOf(id);

    if ((curIndex + 1) === ids.length) {
        return <button type="button" className="btn btn-light" disabled={true}>下一条</button>
    }

    return (
        <Link
            className="btn btn-light"
            to={{
                pathname: `/home/sales/through/${ids[curIndex + 1]}`,
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
                pathname: `/home/sales/through/${ids[curIndex - 1]}`,
                state: {ids: ids}
            }}
        >
            上一条
        </Link>
    )
};

class ThroughStudentView extends React.Component {
    constructor(props) {
        super(props);

        // this.commands = this.props.commands.filter(command => (command.name !== 'Add'));
        this.title = fmtTitle(this.props.location.pathname);
        this.state = {
            group: this.props.changedCrmGroup,
            redirectToReferrer: false,
            redirectToList: false,
            isAnimating: false,
            id: this.props.match.params.contractId,
            data: {stuName: this.props.location.state.stuName},
            ids: [],
            columns: [
                {
                    label: "序号",
                    type: 'index',
                },
                {
                    label: "学员姓名",
                    prop: "student.name",
                    sortable: true,
                    render: (row, column, data)=>{
                        return <span><Button type="text" size="small" onClick={this.goToDetails.bind(this, row.id)}>{row.student.name}</Button></span>
                    }
                },
                {
                    label: "性别",
                    prop: "student.genderText",
                },
                {
                    label: "年龄",
                    prop: "student.age",
                },
                {
                    label: "家长姓名",
                    prop: "parent.name",
                    /*render: (row, column, data)=>{
                        return <span><Button type="text" size="small" onClick={this.goToDetails.bind(this, row.id)}>{row.parent.name}</Button></span>
                    }*/
                },
                {
                    label: "与学员关系",
                    prop: "parent.relation",
                },
                {
                    label: "电话号码",
                    prop: "parent.cellphone",
                },
                {
                    label: "状态",
                    prop: "throughStateName",
                },
                {
                    label: "操作",
                    width: 150,
                    fixed: 'right',
                    render: (row, column, index)=>{
                        return <span>
                            <Button type="info" size="small" onClick={this.signRow.bind(this, row.id)}>签到</Button>
                            <Button type="danger" size="small" onClick={this.deleteRow.bind(this, row.id)}>移除</Button>
                        </span>
                    }
                }
            ],
            totalPage:0,
            currentPage:1,
            pageSize:10,
            totalCount:0,
        };
        this.createDialogTips = this.createDialogTips.bind(this);
        this.goToDetails = this.goToDetails.bind(this);
        this.deleteRow = this.deleteRow.bind(this);
    }

    componentDidMount() {
        const request = async () => {
            try {
                let list = await ajax('/sales/oppor/list.do', {orgId: this.state.group.id, typeId: 2,fromWay:3,
                    pageNum:this.state.currentPage,pageSize:this.state.pageSize,cellphone:this.state.cellphone,
                    isIn:((this.props.history.location.pathname.indexOf('/home/sales/opporpublic') == -1)  ? 1 : 0),
                    stageId:this.state.chooseStageName,statusId:this.state.chooseStatusName,throughId:this.state.id,through:1});
                list.data.map(item => {
                    if(item.createTime != null){
                        item.createTime = formatWithTime(item.createTime);
                    }
                });
                this.setState({list: list.data, totalPage: list.totalPage,totalCount: list.count});
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

    goToDetails(id) {
        this.props.history.push(`/home/sales/oppor/${id}`);
    }
    //移除
    deleteRow(columnId){
        MessageBox.confirm('此操作将从体验课移除该学员, 是否继续?', '提示', {
            type: 'warning'
        }).then(() => {
            request();
        }).catch(() => {
            Message({
                type: 'info',
                message: '已取消删除'
            });
        });
        const request = async () => {
            try {
                let list = await ajax('/sales/oppor/removeThAssign.do', {id:columnId,throughId:this.state.id,type:2});
                this.componentDidMount();
            } catch (err) {
                if (err.errCode === 401) {
                    this.setState({redirectToReferrer: true})
                } else {
                    this.createDialogTips(`${err.errCode}: ${err.errText}`);
                }
            }
        };
    }
    //签到
    signRow(columnId){
        const request = async () => {
            try {
                let list = await ajax('/sales/oppor/signInThAssign.do', {id:columnId,throughId:this.state.id,type:2,orgId:this.state.group.id});
                this.componentDidMount();
            } catch (err) {
                if (err.errCode === 401) {
                    this.setState({redirectToReferrer: true})
                } else {
                    this.createDialogTips(`${err.errCode}: ${err.errText}`);
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
                <Redirect to="/home/sales/through"/>
            )
        }

        return (
            <div>
                <h5 id="subNav">
                    <i className={`fa ${this.title.icon}`} aria-hidden="true"/>
                    &nbsp;{this.title.text}&nbsp;&nbsp;|&nbsp;&nbsp;
                    <p className="d-inline text-muted">{this.state.data.stuName}</p>

                    <div className="btn-group float-right ml-4" role="group">
                        <PrevBtn id={this.state.id} ids={this.state.ids}/>
                        <NextBtn id={this.state.id} ids={this.state.ids}/>
                    </div>
                    <div className="btn-group float-right ml-4" role="group">
                        <button onClick={() => {
                            this.props.history.push('/home/sales/through');
                        }} type="button" className="btn btn-light">返回
                        </button>
                    </div>
                    {/*<Commands
                        commands={this.commands}
                        modAction={this.modAction}
                        delAction={this.delAction}
                    />*/}
                </h5>

                <div id="main" className="main p-3">
                    <Progress isAnimating={this.state.isAnimating}/>
                    <Table
                        style={{width: '100%',"margin-bottom":"30px"}}
                        columns={this.state.columns}
                        data={this.state.list}
                        border={true}
                        fit={true}
                        emptyText={"--"}
                        height='80%'
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

                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb location_bottom">
                            <li className="breadcrumb-item active"><Link
                                to={`/home/sales/through/${this.state.id}`}>体验课基本信息</Link></li>
                            <li className="breadcrumb-item">体验课学员信息</li>
                        </ol>
                    </nav>
                </div>
            </div>
        )
    }
}

export default ThroughStudentView;