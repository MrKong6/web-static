import React from "react";
import {Redirect} from 'react-router-dom'

import mainSize from "../../../utils/mainSize";
import fmtTitle from '../../../utils/fmtTitle';
import ajax from "../../../utils/ajax";
import '../../Mkt/Leads/Leads.css'
import {Table, Pagination, Select} from 'element-react';
import {formatWithTime} from "../../../utils/fmtDate";
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
                    type: 'expand',
                    expandPannel: function(data){
                        if(data.orderList && data.orderList.length > 0){
                            return (
                                <table className="table table-sm">
                                    <tr>
                                        <th style={{"border": 0}}>课程类别</th>
                                        <th style={{"border": 0}}>学员姓名</th>
                                        <th style={{"border": 0}}>性别</th>
                                        <th style={{"border": 0}}>在读年级</th>
                                        <th style={{"border": 0}}>预约时间</th>
                                        <th style={{"border": 0}}>家庭住址</th>
                                    </tr>
                                    <tbody>
                                    {
                                        data.orderList.map(function (evt) {
                                            return <tr key={evt.id}>
                                                <td style={{"border": 0}}>{evt.typeName}</td>
                                                <td style={{"border": 0}}>{evt.name}</td>
                                                <td style={{"border": 0}}>{evt.genderText}</td>
                                                <td style={{"border": 0}}>{evt.grade}</td>
                                                <td style={{"border": 0}}>{evt.createOn ? formatWithTime(evt.createOn) : ""}</td>
                                                <td style={{"border": 0}}>{evt.address}</td>
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
                    type: 'index'
                },
                {
                    label: "访问时间",
                    prop: "time",
                    width: 150,
                    showOverflowTooltip: true,
                },
                {
                    label: "访问状态",
                    prop: "visitStatusName",
                    showOverflowTooltip: true,
                    width: 100,
                },
                {
                    label: "阶段",
                    prop: "stageName",
                    showOverflowTooltip: true,
                    width: 100,
                },
                {
                    label: "地域",
                    prop: "location",
                    width: 150,
                    sortable: true,
                },
                {
                    label: "来源",
                    prop: "sourceName",
                    width: 100,
                    render: (row, column, data) => {
                        return <span>Wechat In</span>
                    }
                },
                {
                    label: "渠道",
                    prop: "sourceActivityName",
                    sortable: true,
                    width: 100,
                },
                {
                    label: "码类别",
                    prop: "sourceActivityType",
                    width: 120,
                },
                {
                    label: "课程",
                    prop: "courseType",
                    width: 100,
                },
                {
                    label: "访问IP",
                    prop: "visitIp",
                    width: 100,
                },
                {
                    label: "访客标识码",
                    prop: "visitCert",
                    width: 100,
                },
                {
                    label: "访客设备型号",
                    prop: "phoneVersion",
                    width: 100,
                },
                {
                    label: "注册手机号",
                    prop: "visitPhone",
                    width: 150,
                },
                {
                    label: "学员昵称",
                    prop: "name",
                    width: 50,
                },
                {
                    label: "性别",
                    prop: "gender",
                },
                {
                    label: "在读年级",
                    prop: "grade",
                },
                {
                    label: "详细来源",
                    prop: "sourceDetail",
                },

            ],
            totalPage:0,
            currentPage:1,
            pageSize:10,
            totalCount:0,
            userList:[],
            chooseUser: this.props.location.state && this.props.location.state.phone ? this.props.location.state.phone : null,
            chooseApp: '1'

        };
    }

    componentDidMount() {
        const request = async () => {
            try {
                let list = await ajax('/wechat/getVisitRecordList.do', {orgId: this.state.group.id,phone:this.state.chooseUser,pageNum:this.state.currentPage,pageSize:this.state.pageSize,recordType:this.state.chooseApp});
                let userList = await ajax('/wechat/getWechatUserList.do', {orgId: this.state.group.id,pageNum:1,pageSize:9999});

                if(list.data && list.data.items){
                    const ids = list.data.items.map((contract) => (contract.id));
                    list.data.items.map(item => {
                        if(item.time != null){
                            item.time = formatWithTime(item.time);
                        }
                    });
                    this.setState({list: list.data && list.data.items ? list.data.items : [],
                        ids: ids,totalPage: list.data.totalPage,totalCount: list.data.count,
                        userList: userList.data && userList.data.items ? userList.data.items : [],});

                }else{
                    this.setState({list: [],userList: userList.data && userList.data.items ? userList.data.items : [],
                        totalPage: 0,totalCount: 0});
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

    goToDetails(evt) {
        const url = `${this.props.match.url}/${evt}`;

        this.props.history.push(url);
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

    chooseUser(value){
        this.state.chooseUser = value;
        this.setState({chooseUser:value});
        this.componentDidMount();
    }

    chooseApp(value){
        this.state.chooseApp = value;
        this.setState({chooseApp:value});
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
                    <div className="row" style={{"marginBottom":"10px"}}>
                        <div className="col-2">
                            <Select value={this.state.chooseUser} placeholder="请选择注册用户" clearable={true}
                                    onChange={this.chooseUser.bind(this)}>
                                {
                                    this.state.userList.map(el => {
                                        return <Select.Option key={el.phone} label={el.name} value={el.phone}/>
                                    })
                                }
                            </Select>
                        </div>
                        <div className="col-2">
                            <Select value={this.state.chooseApp} placeholder="请选择小程序来源" clearable={true}
                                    onChange={this.chooseApp.bind(this)}>
                                <Select.Option key='1' label='优学荟' value='1'/>
                                <Select.Option key='10' label='荟活动' value='10'/>
                            </Select>
                        </div>
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