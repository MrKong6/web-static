import ReactDOM from "react-dom";
import React from "react";
import permissionsProcess from "../../../utils/permissionsProcess";
import ajax, {AJAX_PATH} from "../../../utils/ajax";
import mainSize from "../../../utils/mainSize";
import {Redirect} from "react-router-dom";
import Progress from "../../Progress/Progress";
import DialogTips from "../../Dialog/DialogTips";
import CONFIG from "../../../utils/config";
import fmtDate from "../../../utils/fmtDate";
import {Table, Button, MessageBox, Message, Tabs, Input, DatePicker, Select, Upload} from "element-react";
import DialogCourse from "../../Dialog/DialogCourse";
import historyBack from "../../../utils/historyBack";

class Form extends React.Component {
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
            logoUrl: null,
            listUrl: null,
        };
        this.createDialogTips = this.createDialogTips.bind(this);
    }

    componentDidMount() {
        const request = async () => {
            try {
                let courseType = await ajax('/wechat/getCourse.do', {id: this.props.selectedCou});
                let parentName = null,typeName=null,name=null;
                if(courseType.data){
                  parentName = courseType.data.name;
                  typeName = courseType.data.typeName;
                }
                debugger
                if (this.props.isEditor) {
                    //修改
                    let data = await ajax('/wechat/getCourse.do', {id: this.props.editorId});
                    data = data.data;
                    if(data){
                        parentName = data.parentName;
                        typeName = data.typeName;
                        name = data.name;
                    }
                    this.setState({data,courseType:courseType.data,parentName,typeName},()=>{
                        const keys = Object.keys(data);
                        keys.map(key => {
                            if (this.form[key]) {
                                this.form[key].value = data[key];
                            }
                        })
                    });
                }else{
                    //新增
                    this.setState({courseType:courseType.data,parentName,typeName});
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
            query.parentId = this.state.data.parentId;
            query.typeId = this.state.data.typeId;
        }else{
            query.parentId = this.state.courseType.id;
            query.typeId = this.state.courseType.typeId;
        }
        query.name = this.form["name"].value;
        query.logoUrl = this.state.logoUrl;
        query.listUrl = this.state.listUrl;
        return query;
    }

    //上传成功时绑定方法
    upLoadSuccess(response, file, fileList){
        this.state.logoUrl = response.data.url;
    }

    upLoadSuccess2(response, file, fileList){
        this.state.listUrl = response.data.url;
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
                                <em className="text-danger">*</em>课程类别名称
                            </label>
                            <div className="col-7">
                                <input type="text" className="form-control" name="name" value={this.state.name} />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-2 col-form-label font-weight-bold">
                                <em className="text-danger">*</em>目录缩略图
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
                                <em className="text-danger">*</em>列表头图
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
                    </div>
                </div>
            </form>
        )
    }
}

export default Form;