import React from "react";
import ReactDOM from "react-dom";
import {Redirect} from 'react-router-dom'

import DialogTips from "../../Dialog/DialogTips";
import Progress from "../../Progress/Progress"

import mainSize from "../../../utils/mainSize";
import fmtDate from '../../../utils/fmtDate';
import fmtTitle from '../../../utils/fmtTitle';
import CONFIG from '../../../utils/config';
import ajax, {AJAX_PATH} from "../../../utils/ajax";
import '../../Mkt/Leads/Leads.css'
import {Button, Table, Pagination, Upload, Input, Tooltip, Tabs, Message, Checkbox, Select} from 'element-react';
import {getContractColumns} from "../../../utils/commonTableColumns";
import Commands from "../../Commands/Commands";
import ajaxFile from "../../../utils/ajaxFile";
import {changeArrayItemToString} from "../../../utils/objectToArray";


/*
const Table = ({list, goto}) => {
    return (
        <table className="table table-bordered table-sm">
            <thead>
            <tr>
                <th>序号</th>
                <th>创建人</th>
                <th>创建时间</th>
                <th>所属组织</th>
                <th>所属用户</th>
                <th>合同类型</th>
                <th>合同编号</th>
                <th>签约时间</th>
                <th>到期时间</th>
                <th>学员姓名</th>
                <th>家长姓名</th>
                <th>联系电话</th>
                <th>课程类别</th>
                <th>课程</th>
                <th>合同金额</th>
                <th>折扣金额</th>
                <th>应付金额</th>
                <th>已付金额</th>
            </tr>
            </thead>
            <tbody>{TableItem(list, goto)}</tbody>
        </table>
    );
};

const TableItem = (data, goto) => {
    let table = [];

    if (data.length === 0) {
        return table;
    }

    data.map((item, index) => {
        table.push(
            <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.creatorName}</td>
                <td>{fmtDate(item.createTime)}</td>
                <td>{item.orgName}</td>
                <td>{item.executiveName}</td>
                <td>{CONFIG.TYPE_ID[item.typeId]}</td>
                <td>
                    <a onClick={goto} cid={item.id} href="javascript:;">{item.code}</a>
                </td>
                <td>{fmtDate(item.startDate)}</td>
                <td>{fmtDate(item.endDate)}</td>
                <td>{item.stuName}</td>
                <td>{item.parName}</td>
                <td>{item.parCellphone}</td>
                <td>{item.courseType}</td>
                <td>{item.courseName}</td>
                <td>{item.oriPrice}</td>
                <td>{item.discPrice}</td>
                <td>{item.finalPrice}</td>
                <td>{item.paid}</td>
            </tr>
        );
    });

    return table;
};
*/

class List extends React.Component {
    constructor(props) {
        super(props);

        this.commands = this.props.commands.filter((command) => (command.name === 'Import' || command.name === 'Export'));
        this.title = fmtTitle(this.props.location.pathname);
        this.createDialogTips = this.createDialogTips.bind(this);
        this.goToDetails = this.goToDetails.bind(this);
        this.exportAction = this.exportAction.bind(this);
        this.addAction = this.addAction.bind(this);
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
            courseTypeList: [],
            chooseCourseType: [],
            chooseCourseTypeIds: [],
        };
    }

    componentDidMount() {
        const request = async () => {
            try {
                let list = await ajax('/sales/contract/list.do', {orgId: this.state.group.id,pageNum:this.state.currentPage,
                    pageSize:this.state.pageSize,isIn:1,typeId:null,chooseCode: this.state.chooseCode, courseType: changeArrayItemToString(this.state.chooseCourseType)});
                let courseTypeList = await ajax('/course/type/courseTypeList.do');
                const ids = list.data.map((contract) => (contract.id));
                if(list.data){
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
                }
                this.setState({list: list.data, ids: ids,totalPage: list.totalPage,totalCount: list.count,courseTypeList});
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
                    let list = await ajax('/sales/contract/list.do', {orgId: nextProps.changedCrmGroup.id,pageNum:this.state.currentPage,pageSize:this.state.pageSize});
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

        this.tips.dialog.modal('show');
    }

    goToDetails(data) {
        const url = `${this.props.match.url}/${data}`;

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
    /**
     * 导出
     */
    exportAction() {
        ajaxFile('/service/contract/export.do',{orgId: this.state.group.id,isIn:1})
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

    addAction() {
        this.props.history.push(`${this.props.match.url}/create`, {ids: this.state.ids});
    }
    //课程类别筛选
    chooseCourseTypeSearch(chooseCourseType){
        this.state.chooseCourseType = chooseCourseType;
        this.state.currentPage = 1;
        this.componentDidMount();
    }
    //学员姓名和班级编号模糊搜索
    onChange(value){
        this.componentDidMount();
    }
    //切换tab
    changeTabs(value){
        this.state.typeId = value;
        this.componentDidMount();
    }

    onChangeCls(value){
        this.setState({
            chooseCode: value
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
                    </h5>
                <div id="main" className="main p-3">
                    <div>
                    <Commands 
                        commands={this.commands}
                        importAction={uploadConfig}
                        exportAction={this.exportAction}
                        addAction={this.addAction}
                    />
                    </div>
                    <Progress isAnimating={this.state.isAnimating}/>
                    <div className="row">
                        <Checkbox.Group value={this.state.chooseCourseType} onChange={this.chooseCourseTypeSearch.bind(this)}>
                            {
                                this.state.courseTypeList.map(function(item){
                                    return  <Checkbox key={item.id} label={item.name}></Checkbox>
                                })
                            }
                        </Checkbox.Group>
                    </div>
                    <div className="row">
                        <div className="col-3">
                            <Input placeholder="请输入学员姓名/合同编号"
                                   className={"leadlist_search"}
                                   value={this.state.chooseCode}
                                   onChange={this.onChangeCls.bind(this)}
                                   append={<Button type="primary" icon="search" onClick={this.onChange.bind(this)}>搜索</Button>}
                            />
                        </div>
                        <div className="col-2">
                            <Select value={this.state.chooseStatusName} placeholder="请选择合同类型" clearable={true} onChange={this.changeTabs} className={"leftMargin"}>
                                <Select.Option key={1} label='新招' value={1} />
                                <Select.Option key={2} label='续报' value={2} />
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