import React from 'react'
import ReactDOM from "react-dom";
import {Redirect} from 'react-router-dom'

import AssignForm from "./Form";
import DialogTips from "../../Dialog/DialogTips";
import Progress from "../../Progress/Progress"

import mainSize from "../../../utils/mainSize";
import historyBack from "../../../utils/historyBack";
import fmtTitle from '../../../utils/fmtTitle';
import ajax from "../../../utils/ajax";
import {Message} from "element-react";

class Create extends React.Component {
    constructor(props) {
        super(props);
        this.title = fmtTitle(this.props.location.pathname);
        this.state = {
            group: this.props.changedCrmGroup,
            redirectToReferrer: false,
            redirectToList: false,
            isAnimating: false,
            isCreated: false,
            createdId: null
        };
        this.state.group.cRealName = this.props.profile.cRealname;
        this.createDialogTips = this.createDialogTips.bind(this);
        this.create = this.create.bind(this);
    }

    componentDidMount() {
        mainSize();
    }

   /* componentWillReceiveProps(nextProps) {
        if (this.props.changedCrmGroup.id !== nextProps.changedCrmGroup.id) {
            this.setState({redirectToList: true})
        }
    }*/

    /*componentWillUnmount() {
        if (this.tipsContainer) {
            document.body.removeChild(this.tipsContainer);
        }
    }*/

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

    create() {
        const selected = this.form.getFormValue();
        console.log(selected);
        if (!selected) {
            return;
        }
        //确认添加自定义事件
            // if(selected.id){
            //     this.delAssignClass(selected.id,selected.showXunhuanDate);
            // }
            const request = async () => {
                try {
                    let param =  {classId: selected.chooseClass,
                        teacherId: selected.teacherId,registrarId: selected.registrarId,roomId: selected.chooseRoom,course: selected.course,
                        startTime: selected.startTime,endTime: selected.endTime,comment: selected.comment,xunhuanEndDate:selected.xunhuanEndDate,
                        loopTrue:selected.loopTrue, loopId:selected.loopId,
                        loopStartTime: selected.loopStartTime, classTime:selected.classTime,classCourseDtos: selected.classCourseDtos
                    };
                    await ajax('/academy/class/assignClass.do',{"assignVo":JSON.stringify(param)});
                    Message({
                        message: "成功",
                        type: 'info'
                    });
                    this.setState({redirectToList:true});
                } catch (err) {

                } finally {
                    this.setState({isAnimating: false});
                }
            };
            request();
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
                <Redirect to='/home/academy/assignclass'/>
            )
        }

        return (
            <div>
                <h5 id="subNav">
                    <i className={`fa ${this.title.icon}`} aria-hidden="true"/>
                    &nbsp;{this.title.text}&nbsp;&nbsp;|&nbsp;&nbsp;
                    <p className="d-inline text-muted">{this.props.location.state.classCode}</p>
                    <div className="btn-group float-right" role="group">
                        <button onClick={() => {
                            historyBack(this.props.history)
                        }} type="button" className="btn btn-light">取消
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            onClick={this.create}
                            disabled={this.state.isAnimating}
                        >
                            保存
                        </button>
                    </div>
                </h5>

                <div id="main" className="main p-3">
                    <Progress isAnimating={this.state.isAnimating}/>

                    <AssignForm
                        isEditor={false}
                        classId={this.props.location.state.classId}
                        changedCrmGroup={this.state.group}
                        replace={this.props.history.replace}
                        from={this.props.location}
                        ref={(dom) => {
                            this.form = dom
                        }}
                    />
                </div>
            </div>
        )
    }
}

export default Create;