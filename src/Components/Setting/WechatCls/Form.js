import React from 'react'
import ReactDOM from 'react-dom'
import 'react-day-picker/lib/style.css';

import DialogTips from "../../Dialog/DialogTips";

import ajax, {AJAX_PATH, ajaxGet} from "../../../utils/ajax";
import {Button, Select, Upload} from "element-react";
import * as Message from "element-react";

class Form extends React.Component {
    constructor(props) {
        super(props);
        debugger
        this.state = {
            group: this.props.changedCrmGroup,
            birthday: null,
            age: 0,
            option: null,
            courseList: [],
            courseTypeList: [],
            clsList: [],
            chooseCourseType: null,
            chooseCourseId: null,
            payList:[],
            imgUrl: null,
            indexUrl: null,
            obj: this.props.isEditor ? this.props.obj  : this.props.from.state.obj,
            teacherUrl: null
        };
        this.handleSelect = this.handleSelect.bind(this);
        this.createDialogTips = this.createDialogTips.bind(this);
        this.getFormValue = this.getFormValue.bind(this);
    }

    componentDidMount() {
        const request = async () => {
            try {
                /*let list = await ajaxGet('/wechat/getCouerseList.do', {orgId: this.state.group.id,pageNum:this.state.currentPage,pageSize:9999,type:2});
                if(list.data && list.data.items){
                    list = list.data.items;
                }
                let listCourse = await ajaxGet('/wechat/getCouerseList.do', {orgId: this.state.group.id,pageNum:this.state.currentPage,pageSize:9999,type:1});
                if(listCourse.data && listCourse.data.items){
                    listCourse = listCourse.data.items;
                }*/
                let data = null;
                if (this.props.isEditor) {
                    data = await ajaxGet('/wechat/getCls.do', {id: this.props.editorId});
                    data = data.data;
                }
                this.setState({
                    // courseList: list,
                    // courseTypeList: listCourse,
                    chooseCourseId: data ? Number(data.courseStageId) : null,
                    chooseCourseType: data ? Number(data.courseTypeId) : null,
                    imgUrl:data ? data.imgUrl : null,
                    indexUrl:data ? data.indexUrl : null
                }, () => {
                    if (this.props.isEditor) {
                        const keys = Object.keys(data);
                        keys.map(key => {
                            if (this.form[key]) {
                                this.form[key].value = data[key];
                            }
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

    handleSelect(value) {
        this.setState({chooseCourseType:value});
        const request = async () => {
            try {
                let listCourse = await ajaxGet('/wechat/getCouerseList.do', {orgId: this.state.group.id,pageNum:this.state.currentPage,pageSize:9999,type:2,parentId:value});
                if(listCourse.data && listCourse.data.items){
                    listCourse = listCourse.data.items;
                }
                this.setState({courseList: listCourse});
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

    handleClass(value) {
        this.setState({chooseCourseId:value});
    }

    getFormValue() {
        if (!this.form.checkValidity()) {
            return
        }

        let query = {};

        for (let i = 0; i < this.form.length; i++) {
            if (this.form[i].name) {
                if (this.form[i].name === 'startDate' || this.form[i].name === 'endDate') {
                    query[this.form[i].name] = new Date(this.form[i].value);
                } else {
                    query[this.form[i].name] = this.form[i].value;
                }
            }
        }
        query.courseStageId = this.state.obj.id;
        query.courseTypeId = this.state.obj.parentId;
        query.imgUrl = this.state.imgUrl;
        query.indexUrl = this.state.indexUrl;
        query.teacherUrl = this.state.teacherUrl;

        query.ordId = this.state.group.id;
        return query;
    }

    //新增分期
    addPayItem(){
        let payList = this.state.payList;
        let maxNum = 0;
        if(payList.length > 0){
            maxNum = payList[payList.length-1].payNum;
        }
        payList.push({
            "payNum":maxNum+1,
            "courseNum":null
        });
        this.setState({payList});
    }
    //上传成功时绑定方法
    upLoadSuccess(response, file, fileList){
        this.state.imgUrl = response.data.url;
    }

    //上传成功时绑定方法
    upLoadSuccess1(response, file, fileList){
        this.state.indexUrl = response.data.url;
    }

    //上传成功时绑定方法
    upLoadSuccess2(response, file, fileList){
        this.state.teacherUrl = response.data.url;
    }

    render() {

        return (
            <form ref={(dom) => {
                this.form = dom
            }}>
                <div className="row justify-content-md-center">
                    <div className="col col-12">
                        <div className="card">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col">
                                        <div className="form-group row">
                                            <label className="col-2 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>课程类别
                                            </label>
                                            <div className="col-7">
                                                <input type="text" className="form-control" value={this.state.obj.parentName} readOnly={true}/>
                                                {/*<Select value={this.state.chooseCourseType} clearable={true}
                                                        style={{"width": "100%"}} placeholder="请选择课程类别"
                                                        filterable={true}
                                                        onChange={this.handleSelect.bind(this)}>
                                                    {
                                                        this.state.courseTypeList.map(el => {
                                                            return <Select.Option key={el.id} label={el.name} value={el.id}/>
                                                        })
                                                    }
                                                </Select>*/}
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-2 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>课程阶段
                                            </label>
                                            <div className="col-7">
                                                <input type="text" className="form-control" value={this.state.obj.name} readOnly={true}/>

                                                {/*<Select value={this.state.chooseCourseId} clearable={true}
                                                        style={{"width": "100%"}} placeholder="请选择课程阶段"
                                                        filterable={true}
                                                        onChange={this.handleClass.bind(this)}>
                                                    {
                                                        this.state.courseList.map(el => {
                                                            return <Select.Option key={el.id} label={el.name} value={el.id}/>
                                                        })
                                                    }
                                                </Select>*/}
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-2 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>班级名称
                                            </label>
                                            <div className="col-7">
                                                <input type="text" className="form-control" name="clsname"/>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-2 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>总课时
                                            </label>
                                            <div className="col-7">
                                                <input type="text" className="form-control" name="courseHour"/>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-2 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>总课次
                                            </label>
                                            <div className="col-7">
                                                <input type="text" className="form-control" name="courseTime"/>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-2 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>单课时
                                            </label>
                                            <div className="col-7">
                                                <input type="text" className="form-control" name="time"/>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-2 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>校区
                                            </label>
                                            <div className="col-7">
                                                <input type="text" className="form-control" name="schoolArea"/>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-2 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>地址
                                            </label>
                                            <div className="col-7">
                                                <input type="text" className="form-control" name="address"/>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-2 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>学期
                                            </label>
                                            <div className="col-7">
                                                <input type="text" className="form-control" name="term"/>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-2 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>时段
                                            </label>
                                            <div className="col-7">
                                                <input type="text" className="form-control" name="timeInterval"/>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-2 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>授课老师
                                            </label>
                                            <div className="col-7">
                                                <input type="text" className="form-control" name="teacherName"/>
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label className="col-2 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>教师头像
                                            </label>
                                            <div className="col-7">
                                                {/*<input type="text" className="form-control" name="imgUrl"/>*/}
                                                <Upload
                                                    className="upload-demo"
                                                    action={AJAX_PATH + '/file/fileupload.do'}
                                                    onPreview={file => this.handlePreview(file)}
                                                    // onRemove={(file, fileList) => this.handleRemove(file, fileList)}
                                                    limit={1}
                                                    onExceed={(files, fileList) => {
                                                        Message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
                                                    }}
                                                    tip={<div className="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>}
                                                    onSuccess={this.upLoadSuccess2.bind(this)}
                                                >
                                                    <Button size="small" type="primary">点击上传</Button>
                                                </Upload>
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label className="col-2 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>详情头图
                                            </label>
                                            <div className="col-7">
                                                {/*<input type="text" className="form-control" name="imgUrl"/>*/}
                                                <Upload
                                                    className="upload-demo"
                                                    action={AJAX_PATH + '/file/fileupload.do'}
                                                    onPreview={file => this.handlePreview(file)}
                                                    // onRemove={(file, fileList) => this.handleRemove(file, fileList)}
                                                    limit={1}
                                                    onExceed={(files, fileList) => {
                                                        Message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
                                                    }}
                                                    tip={<div className="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>}
                                                    onSuccess={this.upLoadSuccess1.bind(this)}
                                                >
                                                    <Button size="small" type="primary">点击上传</Button>
                                                </Upload>
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label className="col-2 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>详情图片
                                            </label>
                                            <div className="col-7">
                                                {/*<input type="text" className="form-control" name="imgUrl"/>*/}
                                                <Upload
                                                    className="upload-demo"
                                                    action={AJAX_PATH + '/file/fileupload.do'}
                                                    onPreview={file => this.handlePreview(file)}
                                                    // onRemove={(file, fileList) => this.handleRemove(file, fileList)}
                                                    limit={1}
                                                    onExceed={(files, fileList) => {
                                                        Message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
                                                    }}
                                                    tip={<div className="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>}
                                                    onSuccess={this.upLoadSuccess.bind(this)}
                                                >
                                                    <Button size="small" type="primary">点击上传</Button>
                                                </Upload>
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label className="col-2 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>相关
                                            </label>
                                            <div className="col-7">
                                                <Select value={this.state.classId} clearable={true}
                                                        style={{"width": "100%"}} placeholder="请选择相关课程班级"
                                                        filterable={true}
                                                        onChange={this.handleSelect.bind(this)}>
                                                    {
                                                        this.state.clsList.map(el => {
                                                            return <Select.Option key={el.id} label={el.name} value={el.id}/>
                                                        })
                                                    }
                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="form-group row">
                                            <label className="col-2 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>价格
                                            </label>
                                            <div className="col-7">
                                                <input type="text" className="form-control" name="price"/>
                                            </div>
                                            {/*<div className="col-2">
                                                <Button type="primary" icon="plus" size='small'
                                                        onClick={this.addPayItem.bind(this)}>分期</Button>
                                            </div>*/}
                                        </div>
                                        {this.state.payList ? this.state.payList.map(function (evt) {
                                            return <div className="form-group row">
                                                <div className="col-2">
                                                    <label className="col-form-label font-weight-bold">
                                                        <em className="text-danger">*</em>{evt.payNum}期：
                                                    </label>
                                                </div>
                                                <div className="col-3">
                                                    <div className="form-group row">
                                                        <input type="text" className="form-control" name={evt.courseNum}
                                                               placeholder="请输入课时量" required={true} />
                                                    </div>
                                                </div>
                                            </div>
                                        }) : null
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        )
    }
}

export default Form;