import React from 'react'
import ReactDOM from 'react-dom'

import ContactList from "../../Contact/List";
import DialogTips from "../../Dialog/DialogTips";
import DialogAct from "../../Dialog/DialogAct"
import Source from '../../Dic/Source';
import Stages from '../../Dic/Stages';
import Status from '../../Dic/Status';
import Gender from '../../Dic/Gender';
import Relation from '../../Dic/Relation';
import Grade from '../../Dic/Grade';
import CourseType from '../../Dic/CourseType';
import CourseName from '../../Dic/CourseName';
import {DatePicker, Popover} from 'element-react';

import ajax from "../../../utils/ajax";
import Age from "../../Dic/Age";
import ActHouver from "../../Dic/ActHouver";

class Form extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            group: this.props.changedCrmGroup,
            channelId: null,
            channelText: null,
            option: null,
            data: null,
            createTime: new Date()
        };
        this.createDialogTips = this.createDialogTips.bind(this);
        this.createActDialog = this.createActDialog.bind(this);
        this.acceptActDialog = this.acceptActDialog.bind(this);
        this.getFormValue = this.getFormValue.bind(this);
        this.checkAct = this.checkAct.bind(this);
    }

    componentDidMount() {
        const request = async () => {
            try {
                let status = await ajax('/mkt/leads/status/list.do', {typeId: 2});
                let stage = await ajax('/mkt/leads/stage/list.do', {typeId: 2});
                let source = await ajax('/mkt/leads/source/list.do', {typeId: 1});
                let relation = await ajax('/mkt/relation/list.do');
                let gender = await ajax('/mkt/gender/list.do');
                let data = null;

                if (this.props.isEditor) {
                    data = await ajax('/sales/oppor/query.do', {id: this.props.editorId});
                }

                this.setState({
                    option: {status, stage, source, relation, gender},
                    data: data
                }, () => {
                    if (this.props.isEditor) {
                        this.form.studentName.value = this.state.data.student.name;
                        this.form.studentGenderId.value = this.state.data.student.genderId || '';
                        if (this.state.data.student.age) {
                            let split = [];
                            split = this.state.data.student.age.split(".");
                            this.form.studentAgeYear.value = (split[0]);
                            this.form.studentAgeMonth.value = (split[1]);
                        }
                        this.form.classGrade.value = this.state.data.student.classGrade;
                        this.form.schoolName.value = this.state.data.student.schoolName;
                        this.form.parentName.value = this.state.data.parent ? this.state.data.parent.name : '';
                        this.form.relation.value = this.state.data.parent ? this.state.data.parent.relation : '';
                        this.form.cellphone.value = this.state.data.parent ? this.state.data.parent.cellphone : '';
                        this.form.wechat.value = this.state.data.parent ? this.state.data.parent.wechat : '';
                        this.form.address.value = this.state.data.parent ? this.state.data.parent.address : '';
                        this.form.courseId.value = this.state.data.courseId ? this.state.data.courseId : '';
                        this.form.courseTypeId.value = this.state.data.courseTypeId ? this.state.data.courseTypeId : '';
                        this.form.note.value = this.state.data.note;
                        this.form.sourceId.value = Number(this.state.data.sourceId);
                        this.form.stageId.value = this.state.data.stageId;
                        this.form.statusId.value = this.state.data.statusId;
                        this.state.createTime = new Date(this.state.data.createTime)

                        this.setState({
                            channelId: this.state.data.channelId,
                            channelText: this.state.data.channelName
                        })
                    }
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

        request()
    }

    componentWillUnmount() {
        if (this.tipsContainer) {
            document.body.removeChild(this.tipsContainer);
        }

        if (this.actContainer) {
            document.body.removeChild(this.actContainer);
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

    createActDialog() {
        if (this.act === undefined) {
            this.actContainer = document.createElement('div');
            ReactDOM.render(
                <DialogAct
                    accept={this.acceptActDialog}
                    changedCrmGroup={this.state.group}
                    notRoot={true}
                    defaults={this.state.channelId}
                    replace={this.props.replace}
                    from={this.props.from}
                    ref={(dom) => {
                        this.act = dom
                    }}
                />,
                document.body.appendChild(this.actContainer)
            );
        }

        this.act.dialog.modal('show');
    }

    acceptActDialog(selected) {
        this.setState({
            channelId: selected.id,
            channelText: selected.name,
        })
    }

    getFormValue() {
        if (!this.form.checkValidity()) {/* || !this.state.channelId*/
            return
        }

        let query = {};

        query.channelId = this.state.channelId;

        for (let i = 0; i < this.form.length; i++) {
            if (this.form[i].tagName !== 'BUTTON' && !this.form[i].readOnly) {
                query[this.form[i].name] = this.form[i].value;
            }
        }

        return query;
    }

    //选中活动
    checkAct(item) {
        this.setState({channelText: item.name, channelId: item.id});
    }

    render() {
        if (!this.state.option || (this.props.isEditor && !this.state.data)) {
            return (
                <form ref={(dom) => {
                    this.form = dom
                }}>
                    <div className="row justify-content-md-center">
                        <div className="col col-12">
                            <div className="card">
                                <div className="card-body">数据加载中...</div>
                            </div>
                        </div>
                    </div>
                </form>
            )
        } else {
            return (
                <form ref={(dom) => {
                    this.form = dom
                }}>
                    <div className="row justify-content-md-center">
                        <div className="col col-8">
                            <div className="card">
                                <div className="card-body">
                                    <p className="ht pb-3 b-b">机会信息</p>
                                    <div className="row">
                                        <div className="col">
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">
                                                    <em className="text-danger">*</em>学员姓名
                                                </label>
                                                <div className="col-7">
                                                    <input type="text" className="form-control" name="studentName" required={true}/>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">学员性别</label>
                                                <div className="col-7">
                                                    <Gender data={this.state.option.gender}/>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">
                                                    <em className="text-danger">*</em>学员年龄
                                                </label>
                                                <div className="col-4" data={this.state.option.gender}>
                                                    <Age data="1"/>
                                                </div>
                                                <div className="col-3.5" data={this.state.option.gender}>
                                                    <Age data="2"/>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">在读年级</label>
                                                <div className="col-7">
                                                    <Grade/>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">所在学校</label>
                                                <div className="col-7">
                                                    <input type="text" className="form-control" name="schoolName"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col">
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">
                                                    <em className="text-danger">*</em>家长姓名
                                                </label>
                                                <div className="col-7">
                                                    <input type="text" className="form-control" name="parentName" required={true}/>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">
                                                    <em className="text-danger">*</em>与孩子关系
                                                </label>
                                                <div className="col-7">
                                                    <Relation data={this.state.option.relation}/>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">
                                                    <em className="text-danger">*</em>联系电话
                                                </label>
                                                <div className="col-7">
                                                    <input type="text" className="form-control" name="cellphone" required={true}/>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">微信号</label>
                                                <div className="col-7">
                                                    <input type="text" className="form-control" name="wechat"/>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">家庭住址</label>
                                                <div className="col-7">
                                                    <input type="text" className="form-control" name="address"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col">
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label">课程类别</label>
                                                <div className="col-7">
                                                    <CourseType data={this.state.option.courseTypeId}/>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label">课程阶段</label>
                                                <div className="col-7">
                                                    <CourseName data={this.state.option.courseId} typeId={this.form.courseTypeId}/>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">备注</label>
                                                <div className="col-7">
                                                    <textarea className="form-control" rows="3" name="note"/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="ht pt-3 pb-3 b-t b-b">机会进程</p>
                                    <div className="row">
                                        <div className="col col-4">
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">
                                                    <em className="text-danger">*</em>信息来源
                                                </label>
                                                <div className="col-7">
                                                    <Source data={this.state.option.source}/>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">
                                                    {/*<em className="text-danger">*</em>*/}具体渠道
                                                </label>
                                                <div className="input-group col-7">
                                                    <Popover placement="right-end" trigger="click" width={400}
                                                             visible={this.state.visible} content={(
                                                        <ActHouver parent={this}/>
                                                    )}>
                                                        <input type="text" className="form-control" placeholder="请选择具体渠道"
                                                               style={{"width": "70%"}}
                                                               value={this.state.channelText} readOnly={true}/>
                                                    </Popover>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col col-4">
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">
                                                    <em className="text-danger">*</em>阶段
                                                </label>
                                                <div className="col-7">
                                                    <Stages data={this.state.option.stage}/>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">
                                                    <em className="text-danger">*</em>状态
                                                </label>
                                                <div className="col-7">
                                                    <Status data={this.state.option.status}/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col col-4">
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label">创建人</label>
                                                <div className="col-7">
                                                    <input
                                                        type="text"
                                                        readOnly={true}
                                                        className="form-control-plaintext"
                                                        value={this.state.data ? this.state.data.creatorName : this.state.group.cRealName}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label">创建时间</label>
                                                <div className="col-7">
                                                    <DatePicker
                                                        name="createTime"
                                                        value={this.state.createTime}
                                                        isShowTime={true}
                                                        placeholder="选择日期"
                                                        format="yyyy-MM-dd HH:mm"
                                                        isDisabled={true}
                                                        onChange={date => {
                                                            console.debug('DatePicker1 changed: ', date)
                                                            this.setState({createTime: date})
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col col-4">
                            {
                                this.props.isEditor && this.state.data ? <ContactList
                                    id={this.state.data.id}
                                    canEdit={true}
                                    groupName={this.state.data.organizationName}
                                    userName={this.state.data.executiveName}
                                /> : null
                            }
                        </div>
                    </div>
                </form>
            )
        }
    }
}

export default Form;