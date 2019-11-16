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
            classTimes: null,  //班次
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
        this.thAction = this.thAction.bind(this);
        this.refreshList = this.refreshList.bind(this);
    }

    componentDidMount() {
        let columnHeader = this.dataHeader;
        let teacherColumnHeader = this.dataTeacherHeader;
        const request = async () => {
            try {
                let data = await ajax('/academy/class/query.do', {id: this.state.id});
                let times = 60;
                if(data && data.data && data.data.classTime){
                    times = data.data.classTime;
                }
                for (let i = 1; i <= times; i++) {
                    columnHeader.push({
                        label: i+"",
                        prop: i+"",
                        render: (row, column, data)=>{
                            return <Tooltip effect="dark" content={row[column.prop] ? row[column.prop].allStr : ''}
                                                   placement="top-start">
                                        {row[column.prop] ? row[column.prop].sign : ''}
                                    </Tooltip>
                        }
                    });
                    teacherColumnHeader.push({
                        label: i+"",
                        prop: i+"",
                    });
                }
                //老师列表
                let roomList = await ajax('/academy/room/list.do', {orgId: this.state.group.id});
                let mainTeacherData = await ajax('/academy/teacher/list.do', {orgId: this.state.group.id,position:1});  //主教
                let helpTeacherData = await ajax('/academy/teacher/list.do', {orgId: this.state.group.id});  //助教   ,position:2  ,position:2
                this.setState({columns: columnHeader,teacherColumns:teacherColumnHeader,classTimes: times,mainTeacher:mainTeacherData.data.items,
                    helpTeacher:helpTeacherData.data.items,roomList:roomList.data.items});
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
    //签到签退
    thAction(evt) {
        if(evt.target.innerText && evt.target.innerText == '签到'){
            this.userContainer = document.createElement('div');
            ReactDOM.render(
                <DialogForClocked
                    accept={this.addCheckInEvent}
                    refresh={this.refreshList}
                    container={this.userContainer}
                    mainTeacher={this.state.mainTeacher}
                    helpTeacher={this.state.helpTeacher}
                    classId={this.state.id}
                    teacherId={this.state.teacherId}
                    roomList={this.state.roomList}
                    typeName="1"
                    changedCrmGroup={this.state.group}
                    data = {this.state.list}
                    classTimes = {this.state.classTimes}
                    replace={this.props.history.replace}
                    from={this.props.location}
                    ref={(dom) => {
                        this.user = dom
                    }}
                />,
                document.body.appendChild(this.userContainer)
            );
            this.user.dialog.modal('show');
        }else{
            this.userContainer = document.createElement('div');
            ReactDOM.render(
                <DialogForClocked
                    accept={this.addCheckInEvent}
                    refresh={this.refreshList}
                    container={this.userContainer}
                    mainTeacher={this.state.mainTeacher}
                    helpTeacher={this.state.helpTeacher}
                    classId={this.state.id}
                    teacherId={this.state.teacherId}
                    roomList={this.state.roomList}
                    typeName="2"
                    changedCrmGroup={this.state.group}
                    data = {this.state.list}
                    classTimes = {this.state.classTimes}
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

    render() {

        return (
            <div>
                <h5 id="subNav">
                    <i className={`fa ${this.title.icon}`} aria-hidden="true"/>
                    &nbsp;{this.title.text}&nbsp;&nbsp;|&nbsp;&nbsp;
                    <p className="d-inline text-muted">{this.state.stuName}</p>
                    <div className="btn-group float-right ml-4" role="group" style={{"display":this.state.show}}>
                        <button onClick={() => {
                            this.props.history.push('/home/education/class');
                        }} type="button" className="btn btn-light">返回
                        </button>
                    </div>
                    <div className="btn-group float-right" role="group">
                        <button onClick={this.thAction} type="button" className="btn btn-primary" id="btnChoose">
                            签到
                        </button>
                        {/*<button onClick={this.thAction} type="button" className="btn btn-warning" id="btnChoose">
                            签退
                        </button>*/}
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
                        {/*<span>学员考勤信息</span>*/}
                        <Table
                            style={{width: '100%'}}
                            className="leadlist_search"
                            columns={this.state.columns}
                            data={this.state.list}
                            border={true}
                            height='90%'
                            emptyText={"暂无数据"}
                        />
                        {/*<span>教师考勤信息</span>*/}
                        <br/><hr/><br/>
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
                            <li className="breadcrumb-item"><Link
                                to={`/home/education/class/${this.state.id}`}>班级基本信息</Link></li>
                            <li className="breadcrumb-item active">
                                <Link to={{
                                    pathname: `/home/education/class/student/${this.state.id}`,
                                    state: {stuName: this.state.stuName}
                                }}>班级学员信息</Link>
                            </li>
                            <li className="breadcrumb-item">
                                <Link to={{
                                    pathname: `/home/education/class/teacher/${this.state.id}`,
                                    state: {stuName: this.state.stuName}
                                }}>班级教师信息</Link>
                            </li>
                            <li className="breadcrumb-item">
                                <Link to={{
                                    pathname: `/home/education/class/assignClass/${this.state.id}`,
                                    state: {stuName: this.state.stuName}
                                }}>班级课程表</Link>
                            </li>
                            <li className="breadcrumb-item">班级考勤信息</li>
                            <li className="breadcrumb-item"><Link to={``}>班级异动信息</Link></li>
                        </ol>
                    </nav>
                </div>
            </div>
        )
    }
}

export default ClockedView;