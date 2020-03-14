import React from "react";
import ReactDOM from "react-dom";
import {Redirect,Link } from 'react-router-dom'

import DialogTips from "../../Dialog/DialogTips";
import Progress from "../../Progress/Progress"

import mainSize from "../../../utils/mainSize";
import fmtTitle from '../../../utils/fmtTitle';
import ajax, {AJAX_PATH} from "../../../utils/ajax";
import '../../Mkt/Leads/Leads.css'
import {Table, Pagination, Message, Input, Select, Button} from 'element-react';
import calculateAge from "../../../utils/calculateAge";
import CONFIG from "../../../utils/config";
import fmtDate from "../../../utils/fmtDate";
import ajaxFile from "../../../utils/ajaxFile";
import Commands from "../../Commands/Commands";

class List extends React.Component {
    constructor(props) {
        super(props);

        this.commands = this.props.commands.filter((command) => (command.name === 'Import' || command.name === 'Export'|| command.id === '3-2-3'));
        this.title = fmtTitle(this.props.location.pathname);
        this.state = {
            group: this.props.changedCrmGroup,
            userId:this.props.profile.cId,
            list: [],
            ids: [],
            isAnimating: true,
            redirectToReferrer: false,
            columns: [
                {
                    type: 'selection',
                    width: 20,
                },
                {
                    label: "序号",
                    type: 'index',
                    fixed: 'left',
                },
                {
                    label: "学员编号",
                    prop: "code",
                    fixed: 'left',
                },
                {
                    label: "学员姓名",
                    prop: "name",
                    fixed: 'left',
                    render: (row, column, data)=>{
                        return <span><Link to={`/home/service/customer/student/${row.id}`}>{row.name}</Link></span>
                    }
                },
                {
                    label: "英文名",
                    prop: "enName",
                    fixed: 'left',
                    render: (row, column, data)=>{
                        return <span><Link to={`/home/service/customer/student/${row.id}`}>{row.enName}</Link></span>
                    }
                },
                {
                    label: "状态",
                    prop: "classStatusName",
                },
                {
                    label: "性别",
                    prop: "genderText",
                    sortable: true
                },
                {
                    label: "出生年月",
                    prop: "birthday",
                    sortable: true
                },
                {
                    label: "年龄",
                    prop: "age",
                    showOverflowTooltip: true,
                },
                {
                    label: "证件类型",
                    prop: "idType",
                },
                {
                    label: "证件号码",
                    prop: "idCode",
                },
                {
                    label: "在读年级",
                    prop: "classGrade",
                },
                {
                    label: "学校类型",
                    prop: "schoolType",
                },
                {
                    label: "所在学校",
                    prop: "schoolName",
                }
            ],
            totalPage:0,
            currentPage:1,
            pageSize:10,
            totalCount:0,
            chooseRows:[],
            statusName:[],
            chooseStatusName:"",
            cellphone:null
        };
        this.createDialogTips = this.createDialogTips.bind(this);
        this.exportAction = this.exportAction.bind(this);
        this.delAction = this.delAction.bind(this);
        this.chooseStatusSearch = this.chooseStatusSearch.bind(this);
    }

   /* goToDetails(data) {

        const url = `${this.props.match.url}/${data}`;
        /!*debugger
        this.props.history.push(url);*!/
        ReactDOM.render(
            <Link to={url}></Link>,
            document.body.appendChild(this.tipsContainer)
        );
    }*/

    componentDidMount() {
        const request = async () => {
            try {
                let list = await ajax('/service/customer/student/list.do', {orgId: this.state.group.id,pageNum:this.state.currentPage,
                    pageSize:this.state.pageSize,cellphone:this.state.cellphone,classStatus:this.state.chooseStatusName});
                let statusList = await ajax('/service/customer/student/classStatus.do', {orgId: this.state.group.id,pageNum:this.state.currentPage,pageSize:this.state.pageSize});
                list.data.map(item => {
                    if(item.idType != null){
                        item.idType = CONFIG.DOCUMENT[item.idType];
                    }
                    if(item.birthday != null){
                        item.age = calculateAge(fmtDate(item.birthday));
                        item.birthday = fmtDate(item.birthday);
                    }
                });
                this.setState({list: list.data,totalPage: list.totalPage,totalCount: list.count,statusName:statusList});
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
                    let list = await ajax('/service/customer/student/list.do', {orgId: nextProps.changedCrmGroup.id,pageNum:this.state.currentPage,pageSize:this.state.pageSize});

                    this.setState({
                        group: nextProps.changedCrmGroup,
                        list: list.data,totalPage: list.totalPage,totalCount: list.count
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
        ajaxFile('/service/customer/student/export.do',{orgId: this.state.group.id,typeId:4})
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
            type: 'error',
            duration: 30000  //30s
        });
    }

    /**
     * 列表选择
     * @param value
     */
    selectRow(value) {
        var ids = [];
        if(value){
            value.map((leads) => (ids.push(leads.id)));
        }
        this.setState({
            chooseRows: ids
        });
    }
    delAction(){
        console.log(this.state.chooseRows);
        if(!this.state.chooseRows || this.state.chooseRows.length <= 0){
            this.errorMsg("请先选择要删除的对象！")
        }else{
            const request = async () => {
                try {
                    const param={ids: this.state.chooseRows};

                    await ajax('/service/customer/student/batchDel.do', {"assignVo":JSON.stringify(param)});
                    this.successMsg("删除成功！")
                    this.componentDidMount();
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
    onChange(key, value) {
        this.setState({
            cellphone: value
        });
    }
    chooseStatusSearch(chooseStatusName){
        // debugger;
        this.state.chooseStatusName = chooseStatusName;
        this.state.currentPage = 1;
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
        const uploadConfig = {
            className:"upload-demo",
            showFileList:false,
            withCredentials:true,
            data:{'type':4,'orgId':this.state.group.id,"userId":this.state.userId,"importType":2},
            action: AJAX_PATH + '/service/customer/student/import.do',
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
                        delAction={this.delAction}
                    />
                </h5>
                <div id="main" className="main p-3">
                    <Progress isAnimating={this.state.isAnimating}/>
                    {/*<Table list={this.state.list} path={this.props.match.url}/>*/}
                    <Input placeholder="请输入学生姓名"
                           className={"leadlist_search"}
                           value={this.state.cellphone}
                           style={{width: '20%'}}
                           onChange={this.onChange.bind(this, 'cellphone')}
                           append={<Button type="primary" icon="search" onClick={this.componentDidMount.bind(this)}>搜索</Button>}
                    />
                    <Select value={this.state.chooseStatusName} placeholder="请选择状态" clearable={true} onChange={this.chooseStatusSearch} className={"leftMargin"}>
                        {
                            this.state.statusName.map(el => {
                                return <Select.Option key={el.code} label={el.name} value={el.code} />
                            })
                        }
                    </Select>
                    <Table
                        style={{width: '100%'}}
                        columns={this.state.columns}
                        data={this.state.list}
                        border={true}
                        fit={true}
                        emptyText={"--"}
                        height='80%'
                        onSelectChange={(selection) => this.selectRow(selection) }
                    />
                    <Pagination layout="total, sizes, prev, pager, next, jumper"
                                total={this.state.totalCount}
                                pageSizes={[10, 50, 100]}
                                pageSize={this.state.pageSize}
                                currentPage={this.state.currentPage}
                                pageCount={this.state.totalPage}
                                className={"page_bottom"}
                                onCurrentChange={(currentPage) => this.pageChange(currentPage)}
                                onSizeChange={(pageSize) => this.sizeChange(pageSize)}/>
                </div>
            </div>
        )
    }
}

export default List;