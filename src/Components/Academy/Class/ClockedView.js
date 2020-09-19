import React from 'react'
import ReactDOM from "react-dom";
import {Link, Redirect} from 'react-router-dom'
import {Pagination, Table, Tooltip} from 'element-react';
import DialogTips from "../../Dialog/DialogTips";
import fmtTitle from "../../../utils/fmtTitle";
import ajax from "../../../utils/ajax";
import mainSize from "../../../utils/mainSize";
import DialogForClocked from "../../Dialog/DialogForClocked";

class ClockedView extends React.Component {


    constructor(props) {
        super(props);
        this.dataHeader = [
            {
                label: "序号",
                prop: 'idx',
                fixed: 'left',
            },
            {
                label: "学员",
                prop: "name",
                fixed: 'left',
            },
            {
                label: "英文名",
                prop: "enName",
                fixed: 'left',
            },
        ];
        this.dataTeacherHeader = [
            {
                width: 100,
                sortable: true,
                type: 'index',
                fixed: 'left',
            },
            {
                label: "名称",
                prop: "name",
                fixed: 'left',
            },
        ];
        this.commands = this.props.commands.filter(command => (command.name == 'ShowNormal'));
        this.first = !(this.props.sonView.filter(view => (view.id == '5-4-1')) == false) ? 'normal' : 'none';
        this.second = !(this.props.sonView.filter(view => (view.id == '5-4-2')) == false) ? 'normal' : 'none';
        this.third = !(this.props.sonView.filter(view => (view.id == '5-4-3')) == false) ? 'normal' : 'none';
        this.fourth = !(this.props.sonView.filter(view => (view.id == '5-4-4')) == false) ? 'normal' : 'none';
        this.fifth = !(this.props.sonView.filter(view => (view.id == '5-4-5')) == false) ? 'normal' : 'none';
        this.sixth = !(this.props.sonView.filter(view => (view.id == '5-4-6')) == false) ? 'normal' : 'none';
        this.title = fmtTitle(this.props.location.pathname);
        this.state = {
            group: this.props.changedCrmGroup,
            redirectToReferrer: false,
            redirectToList: false,
            isAnimating: false,
            id: this.props.match.params.contractId,
            teacherId: this.props.profile.teacherId,
            data: null,  //学生签到数据
            teacherClockList:[], //教师签到数据
            stuName: this.props.location.state.stuName,
            classTimes: null,  //班次   课次
            hourTime: 2, //每天多少课时
            show: 'normal',
            ids: [],
            mainTeacher: [],
            helpTeacher: [],
            columns: [
                {
                    label: "序号",
                    fixed: 'left',
                    prop: 'idx',
                },
                {
                    label: "学员",
                    prop: "name",
                    fixed: 'left',
                },
                {
                    label: "英文名",
                    prop: "enName",
                    fixed: 'left',
                },
            ],
            teacherColumns: [
                {
                    width: 100,
                    sortable: true,
                    type: 'index',
                    fixed: 'left',
                },
                {
                    label: "名称",
                    prop: "name",
                    fixed: 'left',
                },
            ],
            totalPage: 0,
            currentPage: 1,
            pageSize: 10,
            totalCount: 0,
        };
        this.createDialogTips = this.createDialogTips.bind(this);
        this.refreshList = this.refreshList.bind(this);
    }

    componentDidMount() {
        let columnHeader = this.dataHeader;
        let teacherColumnHeader = this.dataTeacherHeader;
        const request = async () => {
            try {
                let data = await ajax('/academy/class/query.do', {id: this.state.id});
                let classAssignList = await ajax('/academy/class/assignClassList.do', {classId: this.state.id});
                let times = 60,hourTime = 2, weekNum = 0;
                let classTime = 0;
                if(data.data.courses && data.data.courses.length > 0){
                    data.data.courses.map(item => {
                        if(item.classHour && item.classHourPerWeek && item.classHourPerWeek > 0){
                            let wn = item.classHour / item.classHourPerWeek;
                            if(wn > weekNum){
                                weekNum = wn;
                                classTime = item.classTime;
                            }
                        }
                    });
                }
                if(classAssignList.data && classAssignList.data.length > 0){
                    let head = [], objTwo = {};//label:null,subColumns:[]
                    for (let i = 1; i <= weekNum; i++) {
                        let obj={label: "周次(" + i + ")"};
                        let sub = [];
                        classAssignList.data.map(item => {
                            if(i == item.weekTime){
                                //周次相同
                                let midArray = sub.filter(vv => (("课次(" + item.currentClassTime + ")") == vv.label));
                                if(sub && sub.length > 0){
                                    if(midArray.length > 0){
                                        //课次已存在
                                        midArray[0].subColumns.push({
                                            label: item.courseName + item.currentClassHour,
                                            prop: item.courseName + item.currentClassHour+"",
                                            width: 160,
                                            render: (row, column, data)=>{
                                                if(row[column.prop] && row[column.prop].sign){
                                                    return <Tooltip effect="dark" content={row[column.prop] ? row[column.prop].allStr : ''}
                                                                    placement="top-start">
                                                        {row[column.prop] ? row[column.prop].sign : ''}
                                                    </Tooltip>
                                                }
                                            }
                                        });
                                    }else{
                                        sub.push(
                                            {
                                                label: "课次(" + item.currentClassTime + ")",
                                                subColumns:[
                                                    {
                                                        label: item.courseName + item.currentClassHour,
                                                        prop: item.courseName + item.currentClassHour+"",
                                                        width: 160,
                                                        render: (row, column, data)=>{
                                                            if(row[column.prop] && row[column.prop].sign){
                                                                return <Tooltip effect="dark" content={row[column.prop] ? row[column.prop].allStr : ''}
                                                                                placement="top-start">
                                                                    {row[column.prop] ? row[column.prop].sign : ''}
                                                                </Tooltip>
                                                            }
                                                        }
                                                    }
                                                ]
                                            }
                                        )
                                    }
                                }else{
                                    sub.push(
                                        {
                                            label: "课次(" + item.currentClassTime + ")",
                                            subColumns:[
                                                {
                                                    label: item.courseName + item.currentClassHour,
                                                    prop: item.courseName + item.currentClassHour+"",
                                                    width: 160,
                                                    render: (row, column, data)=>{
                                                        if(row[column.prop] && row[column.prop].sign){
                                                            return <Tooltip effect="dark" content={row[column.prop] ? row[column.prop].allStr : ''}
                                                                            placement="top-start">
                                                                {row[column.prop] ? row[column.prop].sign : ''}
                                                            </Tooltip>
                                                        }
                                                    }
                                                }
                                            ]
                                        }
                                    )
                                }
                            }
                        });
                        obj.subColumns = sub;
                        columnHeader.push(obj);
                    }

                }
                /*console.log()
                for (let i = 1; i <= times; i+=2) {
                    columnHeader.push({
                        label: "课次(" + (i + 1)/2 + ")",
                        subColumns: [
                            {
                                label: i+"",
                                prop: i+"",
                                render: (row, column, data)=>{
                                    if(row[column.prop] && row[column.prop].sign){
                                        return <Tooltip effect="dark" content={row[column.prop] ? row[column.prop].allStr : ''}
                                                        placement="top-start">
                                            {row[column.prop] ? row[column.prop].sign : ''}
                                        </Tooltip>
                                    }
                                }
                            },
                            {
                                label: i+1+"",
                                prop: i+1+"",
                                render: (row, column, data)=>{
                                    if(row[column.prop] && row[column.prop].sign){
                                        return <Tooltip effect="dark" content={row[column.prop] ? row[column.prop].allStr : ''}
                                                        placement="top-start">
                                            {row[column.prop] ? row[column.prop].sign : ''}
                                        </Tooltip>
                                    }
                                }
                            }
                        ]
                    });
                    teacherColumnHeader.push({
                        label: i+"",
                        prop: i+"",
                    });
                }*/
                //老师列表
                let roomList = await ajax('/academy/room/list.do', {orgId: this.state.group.id});
                let mainTeacherData = await ajax('/academy/teacher/list.do', {orgId: this.state.group.id,position:1});  //主教
                let helpTeacherData = await ajax('/academy/teacher/list.do', {orgId: this.state.group.id});  //助教   ,position:2  ,position:2
                this.setState({columns: columnHeader,teacherColumns:teacherColumnHeader,classTimes: classTime,mainTeacher:mainTeacherData.data.items,
                    helpTeacher:helpTeacherData.data.items,roomList:roomList.data.items,hourTime});
                debugger
                this.refreshList();
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

    refreshList() {
        const request = async () => {
            let dataList = await ajax('/student/clocked/list.do', {classId: this.state.id});
            let teacherDataList = await ajax('/student/clocked/teacherClockList.do', {classId: this.state.id});
            if(dataList){
                //如果是移动端
                let show = 'normal';
                if(navigator.userAgent.match(/mobile/i)) {
                    show = 'none';
                }
                if(!dataList){
                    dataList = [];
                }else{
                    let idx = 1;
                    dataList.map(item => {
                        item.idx = idx++;
                    })
                }

                if(teacherDataList && teacherDataList.length > 0){
                    teacherDataList.map(item => {
                        item.type='teacher';
                        dataList.push(item);
                    });
                }
                this.setState({list: dataList,show:show,teacherClockList:teacherDataList});  //,teacherClockList:teacherDataList
            }
        };
        request();
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
                    <p className="d-inline text-muted">{this.state.stuName}</p>
                    <div className="btn-group float-right ml-4" role="group">
                        <button onClick={() => {
                            this.props.history.push('/home/academy/class');
                        }} type="button" className="btn btn-light">返回
                        </button>
                    </div>
                    {/*<Commands
                        commands={this.commands}
                        thAction={this.thAction}
                    />*/}
                </h5>
                <div id="main" className="main p-3">
                    {/*<Progress isAnimating={this.state.isAnimating}/>*/}
                    {/*<Table list={this.state.list} goto={this.goToDetails}/>*/}
                    {/*<p>班级学员信息</p>*/}
                    <div className="row" style={{"height": '80%'}}>
                        <Table
                            style={{width: '100%'}}
                            className="leadlist_search"
                            columns={this.state.columns}
                            data={this.state.list}
                            border={true}
                            fit={true}
                            height='90%'
                            emptyText={"暂无数据"}
                        />
                        <br/><hr/><br/><br/><br/>
                        {/*<Table
                            style={{width: '100%'}}
                            className="leadlist_search"
                            columns={this.state.teacherColumns}
                            data={this.state.teacherClockList}
                            border={true}
                            fit={true}
                            height='40%'
                            emptyText={"暂无数据"}
                        />*/}
                    </div>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb location_bottom">
                            <li className="breadcrumb-item" style={{"display":this.first}}><Link
                                to={`/home/academy/class/${this.state.id}`}>班级基本信息</Link></li>
                            <li className="breadcrumb-item active" style={{"display":this.second}}>
                                <Link to={{
                                    pathname: `/home/academy/class/student/${this.state.id}`,
                                    state: {stuName: this.state.stuName}
                                }}>班级学员信息</Link>
                            </li>
                            <li className="breadcrumb-item" style={{"display":this.third}}>
                                <Link to={{
                                    pathname: `/home/academy/class/teacher/${this.state.id}`,
                                    state: {stuName: this.state.stuName}
                                }}>班级教师信息</Link>
                            </li>
                            <li className="breadcrumb-item" style={{"display":this.fourth}}>
                                <Link to={{
                                    pathname: `/home/academy/class/assignClass/${this.state.id}`,
                                    state: {stuName: this.state.stuName}
                                }}>班级课程表</Link>
                            </li>
                            <li className="breadcrumb-item" style={{"display":this.fifth}}>班级考勤信息</li>
                            <li className="breadcrumb-item" style={{"display":this.sixth}}>
                                <Link to={{
                                    pathname: `/home/academy/class/situation/${this.state.id}`,
                                    state: {stuName: this.state.stuName}
                                }}>班级异动信息</Link>
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>
        )
    }
}

export default ClockedView;