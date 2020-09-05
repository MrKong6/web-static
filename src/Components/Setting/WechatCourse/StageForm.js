import ReactDOM from "react-dom";
import React from "react";
import permissionsProcess from "../../../utils/permissionsProcess";
import ajax, {AJAX_PATH, ajaxGet} from "../../../utils/ajax";
import mainSize from "../../../utils/mainSize";
import {Redirect} from "react-router-dom";
import Progress from "../../Progress/Progress";
import DialogTips from "../../Dialog/DialogTips";
import CONFIG from "../../../utils/config";
import fmtDate from "../../../utils/fmtDate";
import {Table, Button, MessageBox, Message, Tabs, Input, DatePicker, Select, Upload} from "element-react";
import DialogCourse from "../../Dialog/DialogCourse";
import historyBack from "../../../utils/historyBack";
import {changeArrayItemToInt, changeArrayItemToString, changeStringToArrayInt} from "../../../utils/objectToArray";

class StageForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isAnimating: false,

            groupId: this.props.changedCrmGroup.groupId,
            groupName: this.props.changedCrmGroup.groupName,
            courseTypes: [],
            courseList: [],
            selectedCou: null,
            selectedCouText: null,
            selectedCourse: null,
            courseType: null,
            typeName: null,
            parentName: null,
            imgurl: null,
            types:[],
            parentId: null,
            typeId: []
        };
        this.createDialogTips = this.createDialogTips.bind(this);
    }

    componentDidMount() {
        const request = async () => {
            try {
                let courseType = await ajax('/wechat/getCourse.do', {id: this.props.selectedCou});
                let list = await ajax("/wechat/getTypeList.do", {orgId: this.state.groupId,pageNum:1,pageSize:9999});
                let typeList = await ajaxGet('/wechat/getCouerseList.do', {orgId: this.state.groupId,pageNum:1,pageSize:9999,type:1});
                let courseTypes = [];
                if(typeList.data && typeList.data.items){
                    courseTypes = typeList.data.items;
                }

                let parentName = null,typeName=null,name=null;
                if(courseType.data){
                    parentName = courseType.data.name;
                    typeName = courseType.data.typeName;
                }
                if (this.props.isEditor) {
                    //修改
                    let data = await ajax('/wechat/getCourse.do', {id: this.props.editorId});
                    data = data.data;
                    if(data){
                        parentName = data.parentName;
                        typeName = data.typeName;
                        name = data.name;
                    }
                    this.setState({types: (list && list.data ? list.data.items : []),courseTypes,
                        name,parentId: data.parentId,typeId: data.typeId ? changeStringToArrayInt(data.typeId) : [],imgurl:data.logoUrl,
                        data,courseType:courseType.data,parentName,typeName},()=>{
                            this.form["sonName"].value = data["name"];
                        });
                }else{
                    //新增
                    this.setState({types: (list && list.data ? list.data.items : []),courseTypes, courseType:courseType.data,parentName,typeName});
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

    getFormValue() {
        let query = {};
        if(this.state.data){
            query.id = this.state.data.id;
        }
        //处理年级
        query.typeId = changeArrayItemToString(this.state.chooseTypeId);
        if(this.state.chooseTypeId.length > 0){
            let tyNames = [];
            this.state.types.map(tt => {
                this.state.chooseTypeId.map(t2 => {
                    if(tt.id == t2){
                        tyNames.push(tt.name);
                    }
                });
            });
            if(tyNames.length > 0){
                query.typeName = changeArrayItemToString(tyNames);
            }
        }
        query.parentId = this.state.parentId;
        query.name = this.form["sonName"].value;
        query.logoUrl = this.state.imgurl;
        return query;
    }

    //上传成功时绑定方法
    upLoadSuccess(response, file, fileList){
        this.state.imgurl = response.data.url;
    }

    //改变年级下拉框
    changeType(type, evt) {
        if(type == 1){
            this.state.chooseTypeId = evt;
            this.setState({chooseTypeId:evt});
        }else{
            this.state.parentId = evt;
            this.setState({parentId:evt});
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

        return (
            <form ref={(dom) => {
                this.form = dom
            }}>
                <div className="row">
                    <div className="col">
                        <div className="form-group row">
                            <label className="col-2 col-form-label font-weight-bold">
                                <em className="text-danger">*</em>年级
                            </label>
                            <div className="col-7">
                                <Select value={this.state.typeId} placeholder="年级"
                                        filterable={true} multiple={true} name={"typeId"}
                                        clearable={true} style={{"width": "100%"}}
                                        onChange={this.changeType.bind(this,1)}
                                >
                                    {
                                        this.state.types && this.state.types.length > 0 ? this.state.types.map(el => {
                                            return <Select.Option key={el.id}
                                                                  label={el.name}
                                                                  value={el.id}/>
                                        }) : null
                                    }
                                </Select>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-2 col-form-label font-weight-bold">
                                <em className="text-danger">*</em>课程类别
                            </label>
                            <div className="col-7">
                                <Select value={this.state.parentId} placeholder="课程"
                                        filterable={true} name={"parentId"}
                                        clearable={true} style={{"width": "100%"}}
                                        onChange={this.changeType.bind(this,2)}
                                >
                                    {
                                        this.state.courseTypes && this.state.courseTypes.length > 0 ? this.state.courseTypes.map(el => {
                                            return <Select.Option key={el.id}
                                                                  label={el.name}
                                                                  value={el.id}/>
                                        }) : null
                                    }
                                </Select>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-2 col-form-label font-weight-bold">
                                <em className="text-danger">*</em>课程阶段
                            </label>
                            <div className="col-7">
                                <input type="text" className="form-control" name="sonName" />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-2 col-form-label font-weight-bold">
                                <em className="text-danger">*</em>阶段图标
                            </label>
                            <div className="col-7">
                                {/*<input type="text" className="form-control" name="imgUrl"/>*/}
                                <Upload
                                    className="upload-demo"
                                    action={AJAX_PATH + '/file/uploadCourseImg.do'}
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
                    </div>
                </div>
            </form>
        )
    }
}

export default StageForm;