import ReactDOM from "react-dom";
import React from "react";
import permissionsProcess from "../../../utils/permissionsProcess";
import ajax from "../../../utils/ajax";
import mainSize from "../../../utils/mainSize";
import {Redirect} from "react-router-dom";
import Progress from "../../Progress/Progress";
import DialogTips from "../../Dialog/DialogTips";
import CONFIG from "../../../utils/config";
import fmtDate from "../../../utils/fmtDate";
import {Table,Button,MessageBox,Message,Tabs,Pagination} from "element-react";
import DialogCourse from "../../Dialog/DialogCourse";
import Commands from "../../Commands/Commands";

class SettingService extends React.Component {
    constructor(props) {
        super(props);

        this.commands = this.props.commands.filter(command => (command.name == 'Add'));
        this.state = {
            isAnimating: false,

            groupId: this.props.location.state && this.props.location.state.groupId ? this.props.location.state.groupId : this.props.profile.org.cId,
            groupName: this.props.location.state && this.props.location.state.groupId ? null : this.props.profile.org.cName,
            tabNum: 1,
            courseTypes: [],
            courseList: [],
            selectedCou: null,
            selectedCouText: null,
            columns: [
                {
                    type: 'index'
                },
                {
                    label: "所属组织",
                    prop: "orgName",
                    showOverflowTooltip: true,
                },
                {
                    label: "课程类别",
                    prop: "courseType",
                    sortable: true,
                },
                {
                    label: "课程阶段",
                    prop: "name",
                    sortable: true,
                    width: 180,
                    render: (row, column, data) => {
                        return <span><Button type="text" size="small"
                                             onClick={this.goToDetails.bind(this, row.id)}>{row.name}</Button></span>
                    }
                },
                {
                    label: "总课次",
                    prop: "classTime",
                },
                {
                    label: "总课时",
                    prop: "classHour",
                },
                {
                    label: "时长(min)",
                    prop: "time",
                }
            ],
            list:[],
            totalPage:0,
            currentPage:1,
            pageSize:200,
            totalCount:0,
            teacherColumns: [
                {
                    // label: "序号",
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
                    render: (row, column, data)=>{
                        return <span><Button type="text" size="small" onClick={this.goToDetails.bind(this, row.id)}>{row.name}</Button></span>
                    }
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
                    label: "学科",
                    prop: "courseName",
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
            roomColumns: [
                {
                    sortable: true,
                    type: 'index'
                },
                {
                    label: "教室编号",
                    prop: "code",
                    showOverflowTooltip: true,
                    render: (row, column, data)=>{
                        return <span><Button type="text" size="small" onClick={this.goToDetails.bind(this, row.id)}>{row.code}</Button></span>
                    }
                },
                {
                    label: "备注",
                    prop: "comment",
                    showOverflowTooltip: true,
                },
            ],
        };
        this.createDialogTips = this.createDialogTips.bind(this);
        this.refreshCourse = this.refreshCourse.bind(this);
        this.addCourseType = this.addCourseType.bind(this);
        this.addCourseTypeReq = this.addCourseTypeReq.bind(this);
        this.changeCourse = this.changeCourse.bind(this);
        this.goToDetails = this.goToDetails.bind(this);
        this.changeTab = this.changeTab.bind(this);
        this.addAction = this.addAction.bind(this);
    }

    componentDidMount() {
        const request = async () => {
            try {
                if(this.state.tabNum == 1){
                    let list = await ajax('/course/type/courseTypeList.do');
                    let selectedCou = null, selectedCouText = null;
                    if(list && list.length > 0){
                        selectedCou = list[0].id;
                        selectedCouText = list[0].name;
                    }
                    this.setState({courseTypes: list, selectedCou, selectedCouText});
                    this.refreshCourse(selectedCou);
                }else if(this.state.tabNum == 2){
                    let list = await ajax('/academy/teacher/list.do', {orgId: this.state.groupId,pageNum:this.state.currentPage,pageSize:(this.state.pageSize > 100 ? 10: this.state.pageSize)});
                    let ids = [];
                    if(list.data.items && list.data.items.length > 0){
                        ids = list.data.items.map((contract) => (contract.id));
                        list.data.items.map(item => {
                            if(item.birthday != null){
                                item.birthday = fmtDate(item.birthday);
                            }
                        });
                    }
                    this.setState({list: list.data.items  ? list.data.items : [], ids: ids,totalPage: list.data.totalPage,totalCount: list.data.count});
                }else if(this.state.tabNum == 3){
                    let list = await ajax('/academy/room/list.do', {orgId: this.state.groupId,pageNum:this.state.currentPage,pageSize:(this.state.pageSize > 100 ? 10: this.state.pageSize)});
                    if(list.data.items && list.data.items.length > 0){
                        list.data.items.map(item => {
                            if(item.createOn != null){
                                item.createOn = fmtDate(item.createOn);
                            }
                        });
                    }

                    this.setState({list: list.data.items ? list.data.items : [], totalPage: list.data.totalPage,totalCount: list.data.count});
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

    //改变课程类别
    changeCourse(evt){
        this.refreshCourse(evt.target.getAttribute("rid"));
        this.setState({selectedCou:Number(evt.target.getAttribute("rid")),selectedCouText:evt.target.textContent});
    }
    /**
     * 新增客户类别
     */
    addCourseType(typeName){
        if(typeName == 2){
            this.props.history.push(`${this.props.match.url}/create`, {selectedCou: this.state.selectedCou,
                selectedCouText: this.state.selectedCouText});
        }else{
            this.userContainer = document.createElement('div');
            ReactDOM.render(
                <DialogCourse
                    accept={this.addCourseTypeReq}
                    container={this.userContainer}
                    typeName={typeName}
                    selectedCou={this.state.selectedCou}
                    groupId={this.state.groupId}
                    groupName={this.state.groupName}
                    replace={this.props.history.replace}
                    from={this.props.location}
                    ref={(dom) => {
                        this.user = dom
                    }}
                />,
                document.body.appendChild(this.userContainer)
            );
            this.user.dialog.modal('show');
        }
    }
    addCourseTypeReq(selected){
        const request = async () => {
            try {
                let list = await ajax('/course/type/addCourseType.do', {orgId: this.state.groupId, name:selected.courseTypeName});
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

    //刷新课程列表
    refreshCourse(selectedCou){
        const request = async () => {
            try {
                let list = await ajax('/course/type/listAll.do', {orgId: this.state.groupId
                    ,pageNum:this.state.currentPage,pageSize:this.state.pageSize, courseType: selectedCou});
                if(list.data && list.data.items){
                    const ids = list.data.items.map((contract) => (contract.id));
                    this.setState({list: list.data && list.data.items ? list.data.items : null,
                        ids: ids,totalPage: list.data.totalPage,totalCount: list.data.count});
                }else{
                    this.setState({list: []});
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
    }
    //跳转详情
    goToDetails(evt) {
        let url = null,data = null;
        if(this.state.tabNum == 1){
            url = `${this.props.match.url}/${evt}`;
        }else if(this.state.tabNum == 2){
            this.state.list.map(item => {
                if(evt == item.id){
                    data = item;
                }
            });
            url = `/home/setting/academy/teacherView/${evt}`;
        }else if(this.state.tabNum == 3){
            this.state.list.map(item => {
                if(evt == item.id){
                    data = item;
                }
            });
            url = `/home/setting/academy/roomView/${evt}`;
        }

        this.props.history.push(url,{data:data});
    }
    //新增
    addAction(){
        if(this.state.tabNum != 1){
            let url = null;
            if(this.state.tabNum == 2){
                url = `/home/setting/academy/teacherView/add`;
            }else if(this.state.tabNum == 3){
                url = `/home/setting/academy/roomView/add`;
            }
            this.props.history.push(url, {ids: this.ids});
        }
    }
    //分页
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
    //切换标签页
    changeTab(evt){
        this.setState({tabNum:evt.props.name,currentPage:1,pageSize:200});
        this.state.tabNum = evt.props.name;
        this.state.pageSize = 200;
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
        
        return (
            <div>
                <h5 id="subNav">
                    <i className="fa fa-shield" aria-hidden="true"/>&nbsp;客户服务
                    <Commands
                        commands={this.commands}
                        addAction={this.addAction}
                    />
                </h5>
                <div id="main" className="main p-3">
                    <Progress isAnimating={this.state.isAnimating}/>
                    <Tabs type="card" value="1" onTabClick={this.changeTab.bind(this)}>
                        <Tabs.Pane label="课程管理" name="1">
                            <div className="row">
                                <div className="col-7">
                                    <Button type="text" onClick={this.addCourseType.bind(this,1)}>新增课程类别</Button>
                                </div>
                                <div className="col-5">
                                    <Button type="text" onClick={this.addCourseType.bind(this,2)}>新增课程</Button>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12 col-lg-2">
                                    {
                                        this.state.courseTypes ? this.state.courseTypes.map((cou) => (
                                            <p
                                                key={cou.id}
                                                rid={cou.id}
                                                className={`${this.state.selectedCou === cou.id ? 'text-light bg-primary' : 'text-dark'} m-0 p-1`}
                                                onClick={this.changeCourse}
                                            >
                                                {cou.name}
                                            </p>
                                        )) : null
                                    }
                                </div>
                                <div className="col-12 col-lg-5 col-xl-6">
                                    <p className={'h6 pb-3 mb-0'}>{this.state.selectedCouText || ''}</p>
                                    <Table
                                        style={{width: '100%'}}
                                        columns={this.state.columns}
                                        data={this.state.list}
                                        border={true}
                                        fit={true}
                                        emptyText={"--"}
                                    />
                                </div>
                            </div>
                        </Tabs.Pane>
                        <Tabs.Pane label="教师管理" name="2">
                            <Table
                                style={{width: '100%'}}
                                columns={this.state.teacherColumns}
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
                        <Tabs.Pane label="教室管理" name="3">
                            <Table
                                style={{width: '100%'}}
                                columns={this.state.roomColumns}
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

export default SettingService;