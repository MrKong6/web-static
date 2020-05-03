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
import {Table, Button, MessageBox, Message, Pagination, Tabs} from "element-react";
import DialogCourse from "../../Dialog/DialogCourse";
import Commands from "../../Commands/Commands";

class SettingService extends React.Component {
    constructor(props) {
        super(props);
        this.commands = this.props.commands.filter((command) => (command.name === 'Add'));

        this.state = {
            isAnimating: false,

            groupId: this.props.location.state && this.props.location.state.groupId ? this.props.location.state.groupId : this.props.profile.org.cId,
            groupName: this.props.location.state && this.props.location.state.groupId ? null : this.props.profile.org.cName,
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
                },
                {
                    label: "单课时费",
                    prop: "price",
                },
                {
                    label: "总课时费",
                    prop: "amount",
                }
            ],
            list:[],
            totalPage:0,
            currentPage:1,
            pageSize:10,
            totalCount:0,
        };
        this.createDialogTips = this.createDialogTips.bind(this);
        this.refreshCourse = this.refreshCourse.bind(this);
        // this.addCourseType = this.addCourseType.bind(this);
        // this.addCourseTypeReq = this.addCourseTypeReq.bind(this);
        this.changeCourse = this.changeCourse.bind(this);
        this.goToDetails = this.goToDetails.bind(this);
        this.pageChange = this.pageChange.bind(this);
        this.sizeChange = this.sizeChange.bind(this);
        this.addAction = this.addAction.bind(this);
    }

    componentDidMount() {
        this.refreshCourse();
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

    //刷新课程列表
    refreshCourse(selectedCou){
        const request = async () => {
            try {
                let list = await ajax('/course/type/listAll.do', {orgId: this.state.groupId
                    ,pageNum:this.state.currentPage,pageSize:this.state.pageSize, courseType: selectedCou, type: 1});
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
        const url = `${this.props.match.url}/${evt}`;

        this.props.history.push(url);
    }

    pageChange(currentPage){
        this.state.currentPage = currentPage;
        // this.setState({currentPage:currentPage});
        this.componentDidMount();
    }

    sizeChange(pageSize){
        this.state.pageSize = pageSize;
        this.componentDidMount();
    }

    addAction(){
        this.props.history.push(`${this.props.match.url}/create`, {ids: this.state.ids});
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
                    <Tabs type="card" value="1">
                        <Tabs.Pane label="课程价格" name="1">
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
                        <Tabs.Pane label="折扣优惠" name="2">折扣优惠</Tabs.Pane>
                    </Tabs>
                </div>
            </div>
        )
    }
}

export default SettingService;