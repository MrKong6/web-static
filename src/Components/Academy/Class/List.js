import React from "react";
import ReactDOM from "react-dom";
import {Redirect} from 'react-router-dom'
import DialogTips from "../../Dialog/DialogTips";
import mainSize from "../../../utils/mainSize";
import fmtTitle from '../../../utils/fmtTitle';
import ajax, {AJAX_PATH} from "../../../utils/ajax";
import {Button, Table, Pagination, Message, Tooltip, Select, Input,Progress} from 'element-react';
import fmtDate from "../../../utils/fmtDate";
import Commands from "../../Commands/Commands";
import ajaxFile from "../../../utils/ajaxFile";
import '../../Mkt/Leads/Leads.css'
import "../../App/common.css"

class List extends React.Component {
    constructor(props) {
        super(props);
        this.commands = this.props.commands.filter((command) => (command.name === 'Add' || command.name === 'Import'
            || command.name === 'Export'));
        this.title = fmtTitle(this.props.location.pathname);
        this.createDialogTips = this.createDialogTips.bind(this);
        this.goToDetails = this.goToDetails.bind(this);
        this.addAction = this.addAction.bind(this);
        this.exportAction = this.exportAction.bind(this);
        this.importSuccess = this.importSuccess.bind(this);
        this.chooseStatusSearch = this.chooseStatusSearch.bind(this);
        this.onChange = this.onChange.bind(this);
        this.rowClassName = this.rowClassName.bind(this);
        this.state = {
            group: this.props.changedCrmGroup,
            list: [],
            ids: [],
            classStatus: [],
            chooseStatusName: null,
            chooseClassName: null,
            isAnimating: true,
            redirectToReferrer: false,
            columns: [
                {
                    width: 100,
                    sortable: true,
                    type: 'index',
                    fixed: 'left',
                },
                {
                    label: "班级编号",
                    prop: "code",
                    width: 120,
                    sortable: true,
                    fixed: 'left',
                    render: (row, column, data) => {
                        return <span><Button type="text" size="small"
                                             onClick={this.goToDetails.bind(this, row.id)}>{row.code}</Button></span>
                    }
                },
                {
                    label: "(校区名称)",
                    prop: "schoolArea",
                    width: 120,
                },
                {
                    label: "班级状态",
                    prop: "classStatusName",
                    width: 95,
                    /*render: (row, column, data) => {
                        return <span><Button type="text" size="small"
                                             onClick={this.goToDetails.bind(this, row.id)}>{row.code}</Button></span>
                    }*/
                },
                {
                    label: "班级类型",
                    prop: "typeName",
                    width: 95
                },
                {
                    label: "班级类别",
                    prop: "rangeName",
                    width: 95
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
                    label: "计划人数",
                    prop: "planNum",
                    width: 95
                },
                {
                    label: "实际人数",
                    prop: "factNum",
                    width: 95
                },
                {
                    label: "主教",
                    prop: "mainTeacherName",
                    width: 95,
                    className:'tabletd',
                    render: function (data) {
                        return <Tooltip effect="dark" content={data.mainTeacherName}
                                        placement="top-start">
                            {data.mainTeacherName}
                        </Tooltip>
                    }
                },
                {
                    label: "客服",
                    prop: "registrar",
                    width: 95,
                },
                {
                    label: "课程类别",
                    prop: "courseType",
                    width: 95
                },
                {
                    label: "课程阶段",
                    prop: "courseRange",
                    width: 100
                },
                {
                    label: "课程表",
                    prop: "course",
                    width: 100
                },
                {
                    label: "开课日期",
                    prop: "courseStartDate",
                    width: 120
                },
                {
                    label: "结课日期",
                    prop: "courseEndDate",
                    width: 120
                },
                {
                    label: "课程进度",
                    prop: "courseProcess",
                    width: 120,
                    render: (row, column, data) => {
                        return <Progress strokeWidth={18} percentage={row.courseProcess} textInside />
                    }
                },
                {
                    label: "总课次",
                    prop: "classTime",
                    width: 120
                },
                {
                    label: "总课时",
                    prop: "classHour",
                    width: 120
                },
                {
                    label: "消耗课时",
                    prop: "useCourseHour",
                    width: 120
                },
                {
                    label: "剩余课时",
                    prop: "noUseCourseHour",
                    width: 120
                },
                {
                    label: "备注",
                    prop: "beforeClassCode",
                    width: 95,
                    className:'tabletd',
                    render: function (data) {
                        return <Tooltip effect="dark" content={data.beforeClassCode}
                                        placement="top-start">
                            {data.beforeClassCode}
                        </Tooltip>
                    }
                },
                {
                    label: "创建人",
                    prop: "createBy",
                    width: 100
                },
                {
                    label: "创建时间",
                    prop: "createOn",
                    width: 130,
                    sortable: true
                },
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
                let list = await ajax('/academy/class/list.do', {orgId: this.state.group.id,pageIndex:this.state.currentPage,
                    limit:this.state.pageSize,statusId:this.state.chooseStatusName,classCode:this.state.chooseClassName});
                let allClassStatus = await ajax('/academy/class/classStatus.do');
                let ids = [];
                if(list.data && list.data.items){
                    ids = list.data.items.map((contract) => (contract.id));
                    list.data.items.map(item => {
                        if(item.createOn != null){
                            item.createOn = fmtDate(item.createOn);
                        }
                        if(item.startDate != null){
                            item.startDate = fmtDate(item.startDate);
                        }
                        if(item.endDate != null){
                            item.endDate = fmtDate(item.endDate);
                        }
                        if(item.courseStartDate != null){
                            item.courseStartDate = fmtDate(item.courseStartDate);
                        }
                        if(item.courseEndDate != null){
                            item.courseEndDate = fmtDate(item.courseEndDate);
                        }
                    });
                }

                this.setState({list: list.data.items, ids: ids,totalPage: list.data.totalPage,totalCount: list.data.count,classStatus:allClassStatus});
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

    componentDidUpdate(){
        //如果是移动端
        /*if(navigator.userAgent.match(/mobile/i)) {
            let classDom = document.getElementsByClassName('el-button');
            classDom[0].style.padding="0px";
            /!*for (var i = 0; i < classDom.length; i++) {
                classDom[i].style.padding="auto";
            }*!/
        }*/
    }

    /*componentWillReceiveProps(nextProps) {
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

            //request();
        }
    }*/

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

    exportAction() {
        ajaxFile('/academy/class/export.do',{orgId: this.state.group.id,fromWay:2,
            isIn:((this.props.history.location.pathname.indexOf('/home/mkt/leadspublic') == -1)  ? 1 : 0)})
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
    importSuccess() {
        this.componentDidMount();
        this.successMsg("导入成功")
    };
    chooseStatusSearch(chooseStatusName){
        this.state.chooseStatusName = chooseStatusName;
        /*window.sessionStorage.setItem("chooseStatusName",chooseStatusName);*/
        this.state.currentPage = 1;
        this.componentDidMount();
    }

    onChange(key, value) {
        this.setState({
            chooseClassName: value
        });
    }

    //表格行内底色
    rowClassName(row, index) {
        if (row.classStatus === 1) {
            //已开班
            return 'back_table_tr_yellow';
        } else if (row.classStatus === 3) {
            //已结课
            return 'back_table_tr_grew';
        }else if (row.classStatus === 4) {
            //已结班
            return 'back_table_tr_orange';
        }
        return '';
    }

    render() {
        const uploadConfig = {
            className:"upload-demo",
            showFileList:false,
            withCredentials:true,
            data:{'type':1,'orgId':this.state.group.id,"importType":3},
            action: AJAX_PATH + '/academy/class/import.do',
            onSuccess: (response, file, fileList) => {
                if(response.code && response.code == 200){
                    this.successMsg("导入成功");
                    this.componentDidMount();
                }else{
                    this.errorMsg(response.detail);
                }
            }
        };
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
                        exportAction={this.exportAction}
                        importAction={uploadConfig}
                    />
                </h5>
                <div id="main" className="main p-3">
                    {/*<Progress isAnimating={this.state.isAnimating}/>*/}
                    {/*<Table list={this.state.list} goto={this.goToDetails}/>*/}
                    <div class="row">
                        <div className="col-3">
                            <Input placeholder="请输入班级编号"
                                   className={"leadlist_search"}
                                   value={this.state.chooseClassName}
                                   onChange={this.onChange.bind(this, 'className')}
                                   append={<Button type="primary" icon="search" onClick={this.componentDidMount.bind(this)}>搜索</Button>}
                            />
                        </div>
                        <div className="col-2">
                            <Select value={this.state.chooseStatusName} placeholder="请选择状态" clearable={true}
                                    onChange={this.chooseStatusSearch}>
                                {
                                    this.state.classStatus.map(el => {
                                        return <Select.Option key={el.code} label={el.name} value={el.code}/>
                                    })
                                }
                            </Select>
                        </div>
                    </div>
                    <Table
                        style={{width: '100%',"margin-bottom":"30px"}}
                        columns={this.state.columns}
                        data={this.state.list}
                        rowClassName={this.rowClassName.bind(this)}
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
                                className={"page_bottom"}
                                onCurrentChange={(currentPage) => this.pageChange(currentPage)}
                                onSizeChange={(pageSize) => this.sizeChange(pageSize)}/>
                </div>
            </div>
        )
    }
}

export default List;