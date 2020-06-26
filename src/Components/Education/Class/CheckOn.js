import React from "react";
import ReactDOM from "react-dom";
import {Redirect} from 'react-router-dom'
import DialogTips from "../../Dialog/DialogTips";
import Progress from "../../Progress/Progress"

import historyBack from "../../../utils/historyBack";
import mainSize from "../../../utils/mainSize";
import ajax from "../../../utils/ajax";
import fmtTitle from "../../../utils/fmtTitle";
import {formatWithDateAndTime, formatWithOnlyTime, getTimeFourByDate} from "../../../utils/fmtDate";
import {Checkbox, DatePicker, Message, Select, TimePicker} from "element-react";
import {deepClone} from "../../../utils/objectToArray";

class Editor extends React.Component {
    constructor(props) {
        super(props);

        this.title = fmtTitle(this.props.location.pathname);
        this.ids = this.props.location.state.ids;
        let dataList = this.props.location.state.data;
        if (dataList && dataList.length > 0) {
            dataList = dataList.filter(item => !(item.type && item.type == 'teacher'))
            let idx = 1;
            dataList.map(item => {
                item.vos = [];
                item.index = idx++;
            });
        }
        console.log(dataList);
        this.state = {
            group: this.props.changedCrmGroup,
            startTime: formatWithOnlyTime(new Date().getTime()),
            endTime: formatWithOnlyTime(new Date().getTime()),
            isEdit: this.props.location.state.data ? true : false,
            checked: false,
            hasCheckedCount: 0,//已经签退过的人数
            date: null,//formatWithOnlyTime(new Date().getTime()),
            classTimes: this.props.location.state.classTimes,
            selectedClassTime: null,
            classTimeList: [],
            mainTeacher: this.props.location.state.mainTeacher ? this.props.location.state.mainTeacher : [],
            helpTeacher: this.props.location.state.helpTeacher ? this.props.location.state.helpTeacher : [],
            roomList: this.props.location.state.roomList,
            chooseRoom: null,
            chooseMainTeacher: this.props.location.state.teacherId,
            chooseHelpTeacher: [],
            maxClassTime: 1,
            maxClassTimeDate: null,
            maxClassTimeRoomId: null,
            data: dataList ? dataList : [],
            hourTime: this.props.location.state.hourTime,
            courseLst:[/*{
                check: false,
                ch: 1,
                time: getTimeFourByDate(new Date()),
                rc:'R1',
                tn1:'主教',
                tn2:'助教',
            },{
                check: false,
                ch: 2,
                time: getTimeFourByDate(new Date()),
                rc:'R2',
                tn1:'主教2',
                tn2:'助教2',
            }*/],
        };
        this.createDialogTips = this.createDialogTips.bind(this);
        this.updated = this.updated.bind(this);
        this.changedCommonDate = this.changedCommonDate.bind(this);
        this.changeChecked = this.changeChecked.bind(this);
        this.changeClassTime = this.changeClassTime.bind(this);
        this.chooseClassTeacherInfo = this.chooseClassTeacherInfo.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
    }

    componentDidMount() {
        const request = async () => {
            try {
                //事件列表
                let maxVo = await ajax('/student/clocked/getRecentClassTime.do', {classId: this.props.location.state.classId});
                this.setState({
                    classTimeList: maxVo,
                });

            } catch (err) {
                if (err.errCode === 401) {
                    this.setState({redirectToReferrer: true})
                } else {
                    // this.createDialogTips(`${err.errCode}: ${err.errText}`);
                }
            } finally {
                this.setState({isAnimating: false});
            }
        };
        request();
        mainSize();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.changedCrmGroup.id !== nextProps.changedCrmGroup.id) {
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

    updated() {
        this.accept();
    }

    //签到 签退
    accept(evt) {
        //校验是否都选择了
        if (!this.state.date) {
            //此时是教务没有排课导致日期没有  弹出错误提示
            this.dialog.modal('hide');
            Message({
                message: "请联系相关人员排课，排课后方可录入考勤信息！",
                type: 'error'
            });
            return;
        }
        let dataList = this.state.data;
        /*let pushData = [];
        if (dataList && dataList.length > 0) {
            //封装数据提交格式  把没必要的数据去掉
            dataList.map(item => {
                if (item.startTime) {
                    item.startTime = formatWithDateAndTime(this.state.date, item.startTime);
                    pushData.push({
                        "checkInToday": item.checkInToday,
                        "classId": item.classId,
                        "checkOutToday": item.checkOutToday,
                        "maxClassTime": item.maxClassTime,
                        "name": item.name,
                        "id": item.id,
                        "situation": item.situation,
                        "idx": item.idx,
                        "index": item.index,
                        "startTime": item.startTime,
                        "endTime": item.endTime,
                        "classTime": this.state.selectedClassTime,
                    });
                }
            });
        }*/
        dataList.map(item => {
            item.vos.map(vo => {
                vo.time = null;
            });
        });
        let commitVo = {
            "vos": dataList,
            "classId": this.props.location.state.classId
        };
        const request = async () => {
            try {
                let response = await ajax('/student/clocked/clockedAdd.do', {"clockedAddVo": JSON.stringify(commitVo)});
                historyBack(this.props.history)
            } catch (err) {
                Message({
                    type: 'error',
                    message: 'err'
                });
            }

        };
         request();
    }

    cancel() {
        this.dialog.modal('hide');
        this.props.refresh();
    }

    closed() {
        if (this.groupContainer) {
            document.body.removeChild(this.groupContainer);
        }
        document.body.removeChild(this.props.container);
    }

    //统一选择签到时间
    changedCommonDate(evt) {
        let chooseDate = formatWithDateAndTime(this.state.date.getTime(), evt);
        this.setState({date: chooseDate});
        /*if(evt){
            let chooseDate = formatWithDateAndTime(this.state.startTime.getTime(),evt.getTime());
            let dataList = this.state.data;
            if(dataList && dataList.length > 0){
                dataList.map(item => {
                    if(item.checkInToday && item.checkInToday == 1){
                        if(this.props.typeName && this.props.typeName == '2'){
                            //签退时间
                            item.endTime = chooseDate;
                            this.setState({data:dataList,endTime:chooseDate});
                        }else{
                            item.startTime = chooseDate;
                            this.setState({data:dataList,startTime:chooseDate});
                        }
                    }
                })
            }
        }*/
    }

    //统一选择签到
    changeChecked(evt) {
        /*let dataList = this.state.data;
        if (dataList && dataList.length > 0) {
            dataList.map(item => {
                item.checkInToday = evt ? 1 : 2;
            })
            this.setState({data: dataList, checked: evt});
        }*/
    }

    //更改签到次数
    changeClassTime(evt) {
        let dataList = this.state.data;
        const request = async () => {
            try {
                //事件列表
                let courseList = await ajax('/academy/class/getCourseHourByClassTime.do', {classId: this.props.location.state.classId,classTime: evt});
                let dataList = this.state.data,date = null;
                if(courseList.data && courseList.data.length > 0){
                    courseList.data.map(item => {
                        if(item.time){
                            item.time = getTimeFourByDate(item.time);
                            date = item.rdate;
                            item.checkInToday = 2;
                        }
                    });
                    if(dataList && dataList.length > 0){
                        dataList.map(item => {
                            item.vos =deepClone(courseList.data);
                            item.vos.map(vo => {
                                vo.rdate = new Date();
                                vo.checkInToday = item[vo.courseName + vo.ch] ? item[vo.courseName + vo.ch].clocked : 2;
                                //由下面反向选择上面
                                if(vo.checkInToday == 1){
                                    courseList.data.map(itemTwo => {
                                        if(itemTwo.checkInToday != 1 && itemTwo.ch == vo.ch && itemTwo.courseId == vo.courseId){
                                            itemTwo.check = true;
                                        }
                                    });
                                }
                            });
                        });
                    }
                }
                this.setState({
                    courseLst: courseList.data,
                    data: dataList,
                    date: date,
                });
            } catch (err) {
                if (err.errCode === 401) {
                    this.setState({redirectToReferrer: true})
                } else {
                    // this.createDialogTips(`${err.errCode}: ${err.errText}`);
                }
            } finally {
                this.setState({isAnimating: false});
            }
        };
        request();
        //获取该课次下对应的课时
        if (dataList && dataList.length > 0) {
            let existTime = null;
            let hasCheckedCount = 0;
            let teacherId = this.props.teacherId, roomId = 0, helpTeacherId = [];
            if (evt == this.state.maxClassTime) {
                //即选择最大课次后自动关联排课的教室和日期
                existTime = (this.state.maxClassTimeDate ? formatWithOnlyTime(this.state.maxClassTimeDate) : formatWithOnlyTime(new Date()));     //null
                roomId = this.state.maxClassTimeRoomId;
                dataList.map(item => {
                    item.checkInToday = 2;
                    item.startTime = existTime;
                    item.endTime = existTime;
                })
            } else {
                dataList.map(item => {
                    if (item[evt]) {
                        //即历史签到过该次数
                        console.log(item[evt]);
                        item.checkInToday = item[evt].clocked;
                        if (item[evt].startTime) {
                            item.startTime = formatWithOnlyTime(item[evt].startTime);
                            existTime = item.startTime;
                        } else {
                            item.startTime = null;
                        }
                        if (item[evt].endTime) {
                            item.endTime = formatWithOnlyTime(item[evt].endTime);
                        } else {
                            item.endTime = null;
                        }
                        if (item.startTime && item.endTime) {
                            hasCheckedCount += 1;
                        }
                        if (item[evt].teacherId > 0) {
                            teacherId = item[evt].teacherId;
                            roomId = item[evt].roomId;
                            if (item[evt].helpTeacherId && item[evt].helpTeacherId.indexOf(",") != -1) {
                                let array = item[evt].helpTeacherId.split(",");
                                array.map(aa => {
                                    helpTeacherId.push(Number(aa))
                                });
                            } else {
                                if (item[evt].helpTeacherId) {
                                    helpTeacherId.push(Number(item[evt].helpTeacherId));
                                }
                            }
                        }
                        if (item.checkInToday != 1) {
                            //没有签过到
                            item.startTime = formatWithOnlyTime(new Date());
                            item.endTime = formatWithOnlyTime(new Date());
                        }
                    } else {
                        item.checkInToday = 2;
                        item.startTime = formatWithOnlyTime(new Date());
                        item.endTime = formatWithOnlyTime(new Date());
                    }
                })
                if (!existTime) {
                    //既没有历史签到过
                    existTime = formatWithOnlyTime(new Date());
                }
            }
            this.setState({
                data: dataList,
                date: existTime,
                selectedClassTime: evt,
                hasCheckedCount: hasCheckedCount,
                chooseMainTeacher: teacherId,
                chooseRoom: roomId ? parseInt(roomId) : 0,
                chooseHelpTeacher: helpTeacherId
            });
        }
    }

    //选择教室  主教 助教
    chooseClassTeacherInfo(type, evt) {
        if (type == 1) {
            //教室
            this.state.chooseRoom = evt;
        } else if (type == 2) {
            //教室
            this.state.chooseMainTeacher = evt;
        } else if (type == 3) {
            //教室
            this.state.chooseHelpTeacher = evt;
        }
    }

    // 更新表单值  ch:课时数
    handleSelect(key, ch, courseId, value) {
        debugger
        if(key == 'check'){
            let data = this.state.data;
            let courseLst = this.state.courseLst;
            if(data && data.length > 0 && !value){
                data.map(item => {
                    if(item.vos && item.vos.length > 0){
                        item.vos.map(vo => {
                            if(ch == vo.ch){
                                vo.checkInToday = value ? 1 : 2;
                            }
                        });
                    }
                });
            }
            if(courseLst && courseLst.length > 0){
                courseLst.map(item => {
                    if(ch == item.ch && item.courseId == courseId){
                        item.check = value;
                    }
                });
            }
            this.setState({courseLst:courseLst})  //data:data,
        }else if (key == 'innerCheck'){
            //选择下面的签到
            let dataList = this.state.data;
            let courseLst = this.state.courseLst;
            if(dataList){
                dataList.map(dt => {
                    if(dt.vos && dt.id == ch) {
                        dt.vos.map(vo => {
                            courseLst.map(item => {
                                if (item.check && item.ch == vo.ch && item.courseId == vo.courseId) {
                                    vo.checkInToday = value ? 1 : 2;
                                }
                            });
                        });
                    }
                });
                this.setState({data:dataList});
            }
        }else if (key == 'innerRdate'){
            //选择下面的签到
            let dataList = this.state.data,date = this.state.date;
            let courseLst = this.state.courseLst;
            if(dataList){
                dataList.map(dt => {
                    if(dt.vos && dt.id == ch) {
                        dt.vos.map(vo => {
                            courseLst.map(item => {
                                if (item.check && item.ch == vo.ch && item.courseId == vo.courseId) {
                                    debugger
                                    vo.rdate = formatWithDateAndTime(date,value);
                                }
                            });
                        });
                    }
                });
                this.setState({data:dataList});
            }
        }
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
                <Redirect to="/home/education/class"/>
            )
        }

        if (this.state.isUpdated) {
            return (
                <Redirect to={{
                    pathname: `/home/education/class/${this.state.id}`,
                    state: {ids: this.ids}
                }}/>
            )
        }
        let that = this;
        return (
            <div>
                <h5 id="subNav">
                    <i className={`fa ${this.title.icon}`} aria-hidden="true"/>
                    &nbsp;{this.title.text}&nbsp;&nbsp;|&nbsp;&nbsp;
                    <p className="d-inline text-muted">{this.title.text}编辑</p>
                    <div className="btn-group float-right" role="group">
                        <button onClick={() => {
                            historyBack(this.props.history)
                        }} type="button" className="btn btn-light">取消
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            onClick={this.updated}
                            disabled={this.state.isAnimating}
                        >
                            保存
                        </button>
                    </div>
                </h5>

                <div id="main" className="main p-3">
                    <Progress isAnimating={this.state.isAnimating}/>
                    <div className="row">
                        <div className="col-1" style={{padding: 0}}>
                            <Select value={this.state.selectedClassTime} placeholder="课次"
                                    onChange={this.changeClassTime} required={true}>
                                {
                                    that.state.classTimeList.map(el => {
                                        return <Select.Option key={el} label={el} value={el}/>
                                        /*disabled={(el > this.state.maxClassTime)}*/
                                    })
                                }
                            </Select>
                        </div>
                        <label className="col-1 col-form-label"
                               style={{"textAlign": "center", "color": "red"}}>课时</label>
                        <label className="col-2 col-form-label"
                               style={{"textAlign": "center", "color": "red"}}>上课时间</label>
                        <label className="col-1 col-form-label"
                               style={{"textAlign": "center", "color": "red"}}>教室</label>
                        <label className="col-1 col-form-label"
                               style={{"textAlign": "center", "color": "red"}}>主教</label>
                        <label className="col-1 col-form-label"
                               style={{"textAlign": "center", "color": "red"}}>助教</label>
                    </div>
                    {
                        that.state.courseLst.map(function(val){
                            return <div className="row">
                                    <div className="col-1"></div>
                                    <div className="col-1" style={{"textAlign": "center"}}>
                                        <Checkbox checked={val.check == 1} onChange={that.handleSelect.bind(this,'check',val.ch, val.courseId)}>{val.ch + val.courseName}</Checkbox>
                                    </div>
                                    <label className="col-2 col-form-label"
                                           style={{"textAlign": "center", "color": "red"}}>{val.time}</label>
                                    <label className="col-1 col-form-label"
                                           style={{"textAlign": "center", "color": "red"}}>{val.rc}</label>
                                    <label className="col-1 col-form-label"
                                           style={{"textAlign": "center", "color": "red"}}>{val.tn1}</label>
                                    <label className="col-1 col-form-label"
                                           style={{"textAlign": "center", "color": "red"}}>{val.tn2}</label>
                                </div>
                        })
                    }

                    <hr/>
                    <div className="row">
                        <label className="col-1 col-form-label"
                               style={{ "color": "red"}}>姓名</label>
                        {
                            that.state.courseLst.map(function(val){
                                return <div className="col-2">
                                            <div className="row">
                                                <div className="col-4 col-form-label">
                                                    课时{val.ch + val.courseName}
                                                    {/*<Checkbox>课时{val.ch}</Checkbox>*/}
                                                </div>
                                                <label className="col-8 col-form-label"
                                                       style={{ "color": "red"}}>签到时间</label>
                                            </div>
                                        </div>
                            })
                        }

                        {/*<div className="col-1 col-form-label">
                            <Checkbox>课时9</Checkbox>
                        </div>
                        <label className="col-2 col-form-label"
                               style={{"color": "red"}}>签到时间</label>*/}
                    </div>
                    {
                        that.state.data.map(function (val) {
                            let i = 1;
                            return <div className="form-group row">
                                <label className="col-1 col-form-label"
                                       style={{"textAlign": "left"}}>{val.index + '.'} {val.name}</label>
                                {
                                   val.vos.map(function(valInner){
                                        return <div className="col-2">
                                            <div className="row">
                                                <div className="col-4 col-form-label">
                                                    <Checkbox checked={valInner.checkInToday == 1}
                                                              disabled={valInner.situation == 1}
                                                              onChange={that.handleSelect.bind(this,'innerCheck',val.id, valInner.courseId)}
                                                              >签到</Checkbox>
                                                    {/*onChange={check => {
                                                        val.checkInToday = check ? 1 : 2;
                                                    }}*/}
                                                </div>
                                                <div className="col-8">
                                                    <TimePicker
                                                        selectableRange="08:30:00 - 21:30:00"
                                                        value={valInner.rdate}
                                                        onChange={that.handleSelect.bind(this,'innerRdate',val.id, valInner.courseId)}
                                                        placeholder="选择时间"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    })
                                }
                            </div>
                        })
                    }
                </div>
            </div>
        )
    }
}

export default Editor;
