import React from "react";
import ReactDOM from "react-dom";
import {Redirect} from 'react-router-dom'

import DialogTips from "../../Dialog/DialogTips";
import Progress from "../../Progress/Progress"

import mainSize from "../../../utils/mainSize";
import fmtTitle from '../../../utils/fmtTitle';
import ajax, {AJAX_PATH} from "../../../utils/ajax";
import '../../Mkt/Leads/Leads.css'
import {Button, Table, Pagination, Upload, Input, Tooltip, Tabs, Message} from 'element-react';
import CONFIG from "../../../utils/config";
import fmtDate from "../../../utils/fmtDate";
import Commands from "../../Commands/Commands";
import ajaxFile from "../../../utils/ajaxFile";

class List extends React.Component {
    constructor(props) {
        super(props);
        this.commands = this.props.commands.filter((command) => (command.name === 'Import' || command.name === 'Export'));
        if(this.props.location){
            this.title = fmtTitle(this.props.location.pathname);
        }else{
            this.title={"icon":"","text":""}
        }
        this.createDialogTips = this.createDialogTips.bind(this);
        this.goToDetails = this.goToDetails.bind(this);
        this.changeTabs = this.changeTabs.bind(this);
        this.exportAction = this.exportAction.bind(this);

        this.state = {
            group: this.props.changedCrmGroup,
            list: [],
            ids: [],
            typeId: 1,
            isAnimating: true,
            redirectToReferrer: false,
            columns: [
                {
                    // label: "序号",
                    width: 100,
                    sortable: true,
                    type: 'index',
                    fixed: true,
                },
                {
                    label: "创建人",
                    prop: "creatorName",
                    width: 100,
                    sortable: true,
                    fixed: true,
                },
                {
                    label: "创建时间",
                    prop: "createTime",
                    width: 120,
                    sortable: true,
                    fixed: true,
                },
                {
                    label: "所属组织",
                    prop: "orgName",
                    width: 175,
                    showOverflowTooltip: true,
                    fixed: true,
                },
                {
                    label: "所属用户",
                    prop: "executiveName",
                    width: 95,
                    fixed: true,
                },
                {
                    label: "合同编号",
                    prop: "code",
                    width: 130,
                    fixed: true,
                    render: (row, column, data) => {
                        return <span><Button type="text" size="small"
                                             onClick={this.goToDetails.bind(this, row.id)}>{row.code}</Button></span>
                    }
                },
                {
                    label: "合同类型",
                    prop: "typeName",
                    width: 100,
                },
                {
                    label: "学员姓名",
                    prop: "stuName",
                    width: 95,
                },
                {
                    label: "家长姓名",
                    prop: "parName",
                    width: 95,
                },
                {
                    label: "联系电话",
                    prop: "parCellphone",
                    width: 150,
                    className: 'tabletd',
                    render: function (data) {
                        return <Tooltip effect="dark" content={data.parCellphone}
                                        placement="top-start">
                            {data.parCellphone}
                        </Tooltip>
                    }

                },
                {
                    label: "课程类别",
                    prop: "courseType",
                    width: 95
                },
                {
                    label: "课程",
                    prop: "courseName",
                    width: 95,
                    className: 'tabletd',
                    render: function (data) {

                        return <Tooltip effect="dark" content={data.courseName}
                                        placement="top-start">
                            {data.courseName}
                        </Tooltip>
                    }
                },
                {
                    label: "合同金额(元)",
                    prop: "contractPrice",
                    width: 100
                },
                {
                    label: "折扣金额(元)",
                    prop: "countPrice",
                    width: 100,
                    sortable: true
                },
                {
                    label: "应付金额(元)",
                    prop: "finalPrice",
                    width: 95
                },
                {
                    label: "已付金额(元)",
                    prop: "paid",
                    width: 120
                },
                {
                    label: "课时费(元)",
                    prop: "oriPrice",
                    width: 100,
                    sortable: true
                },
                {
                    label: "培训资料费(元)",
                    prop: "discPrice",
                    width: 95
                },
                {
                    label: "其他费用(元)",
                    prop: "otherPrice",
                    width: 120
                },
                {
                    label: "总课时",
                    prop: "courseHours",
                    width: 95
                },
                {
                    label: "总课次",
                    prop: "courseTimes",
                    width: 120
                }
            ],
            totalPage:0,
            currentPage:1,
            pageSize:10,
            totalCount:0,
        };
    }

    componentDidMount() {
        const request = async () => {
            try {
                let list = await ajax('/service/contract/list.do', {orgId: this.state.group.id,
                    pageNum:this.state.currentPage,pageSize:this.state.pageSize,typeId:this.state.typeId});
                const ids = list.data.map((contract) => (contract.id));
                list.data.map(item => {
                    if(item.createTime != null){
                        item.createTime = fmtDate(item.createTime);
                    }
                    if(item.startDate != null){
                        item.startDate = fmtDate(item.startDate);
                    }
                    if(item.endDate != null){
                        item.endDate = fmtDate(item.endDate);
                    }
                    if(item.typeId != null){
                        item.typeId = CONFIG.TYPE_ID[item.typeId];
                    }
                });
                this.setState({list: list.data, ids: ids,totalPage: list.totalPage,totalCount: list.count});
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
        if (this.props.changedCrmGroup.id !== nextProps.changedCrmGroup.id) {
            this.setState({isAnimating: true});

            const request = async () => {
                try {
                    let list = await ajax('/service/contract/list.do', {orgId: nextProps.changedCrmGroup.id,pageNum:this.state.currentPage,pageSize:this.state.pageSize});
                    const ids = list.data.map((contract) => (contract.id));

                    this.setState({
                        group: nextProps.changedCrmGroup,
                        list: list.data,
                        ids: ids,totalPage: list.totalPage,totalCount: list.count
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
        //兼容学员管理
        if(this.tips && this.tips.dialog){
            this.tips.dialog.modal('show');
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
    //切换tab
    changeTabs(tab){
        this.state.typeId = tab.props.name;
        this.componentDidMount();
    }
    /**
     * 导出
     */
    exportAction() {
        ajaxFile('/service/contract/export.do',{orgId: this.state.group.id})
    };

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
        const uploadConfig = {
            className:"upload-demo",
            showFileList:false,
            withCredentials:true,
            data:{'type':4,'orgId':this.state.group.id,"userId":this.state.userId},
            action: AJAX_PATH + '/service/contract/import.do',
            onSuccess: (response, file, fileList) => {
                if(response.code && response.code == 200){
                    this.successMsg("导入成功");
                    this.componentDidMount();
                }else{
                    this.errorMsg(response.detail);
                }
            }
        };

        return (
            <div>
                <h5 id="subNav">
                    <i className={`fa ${this.title.icon}`} aria-hidden="true"/>&nbsp;{this.title.text}
                    <Commands
                        commands={this.commands}
                        importAction={uploadConfig}
                        exportAction={this.exportAction}
                    />
                </h5>
                <div id="main" className="main p-3">
                    <Progress isAnimating={this.state.isAnimating}/>
                    {/*<Table list={this.state.list} goto={this.goToDetails}/>*/}

                    <Tabs activeName="1" onTabClick={this.changeTabs.bind(this)}>{/*(tab) => console.log(tab.props.name)*/}
                        <Tabs.Pane label="新招" name="1">
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
                        </Tabs.Pane>
                        <Tabs.Pane label="续报" name="2">
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
                        </Tabs.Pane>
                    </Tabs>
                </div>
            </div>
        )
    }
}

export default List;