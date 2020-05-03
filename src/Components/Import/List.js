import React from "react";
import ReactDOM from "react-dom";

import DialogTips from "../Dialog/DialogTips";

import mainSize from "../../utils/mainSize";
import ajax, {AJAX_PATH} from "../../utils/ajax";
import {Button, Message, Steps, Upload} from "element-react";
import "./Import.css"

class List extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isAnimating: true,
            redirectToReferrer: false,
            userId:this.props.profile.cId,
            groupId: this.props.location.state && this.props.location.state.groupId ? this.props.location.state.groupId : this.props.profile.org.cId,
            groupName: this.props.location.state && this.props.location.state.groupId ? this.props.location.state.groupId : this.props.profile.org.cName,
            active: 0,
            canNext: true,
            dataParam: {'type':4,'orgId':this.props.location.state && this.props.location.state.groupId ? this.props.location.state.groupId : this.props.profile.org.cId,"userId":this.props.profile.cId,"importType":2,"uploadType":1},
            actionUrl: AJAX_PATH + '/file/import.do',
            downloadUrl:'http://39.106.40.83:8084/template/contract_template.xlsx',
        };
        this.createDialogTips = this.createDialogTips.bind(this);
        this.importSuccess = this.importSuccess.bind(this);
        this.exportAction = this.exportAction.bind(this);
        this.next = this.next.bind(this);
    }

    componentDidMount() {
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

    next() {
        let active = this.state.active + 1;
        let downloadUrl = 'http://39.106.40.83:8084/template/contract_template.xlsx';
        if (active > 3) {
            active = 0;
        }
        switch(active){
            case 1:
                downloadUrl = 'http://39.106.40.83:8084/template/student_template.xlsx';
                break;
            case 2:
                downloadUrl = 'http://39.106.40.83:8084/template/account_template.xlsx';
                break;
            case 3:
                downloadUrl = 'http://39.106.40.83:8084/template/class_template.xlsx';
                break;
        }
        this.setState({active,downloadUrl,canNext:true,
            dataParam: {'type':4,'orgId':this.state.groupId,"userId":this.state.userId,"importType":2,"uploadType":active+1},});
    }

    importSuccess(response) {
        if(response.code && response.code == 200){
            this.successMsg("导入成功");
            this.setState({canNext:false})
            this.componentDidMount();
        }else{
            this.errorMsg(response.detail);
        }
    };

    successMsg(msg) {
        Message({
            message: msg,
            type: 'info'
        });
    }
    errorMsg(msg) {
        Message({
            message: msg,
            duration: 0,
            showClose: true,
            type: 'error'
        });
    }

    exportAction(){

    }

    render() {

        return (
            <div>
                <h5 id="subNav">
                    <i className="fa fa-sitemap" aria-hidden="true"/>&nbsp;迁移向导
                </h5>
                <div id="main" className="main p-3">
                    <div className="mid">
                        <Steps space={200} active={this.state.active} finishStatus="success">
                            <Steps.Step title="合同导入"></Steps.Step>
                            <Steps.Step title="学员导入"></Steps.Step>
                            <Steps.Step title="账户导入"></Steps.Step>
                            <Steps.Step title="班级导入"></Steps.Step>
                        </Steps>

                        <Upload className="upload-demo"
                            showFileList = {false}
                            withCredentials={true}
                            data={this.state.dataParam}
                            action= {this.state.actionUrl}
                            onSuccess= {(response) => this.importSuccess(response)}
                          >
                            <Button type="primary" size="large" icon="upload2">导入</Button>
                        </Upload>
                        <br/><br/><br/>
                        <a type="warning" href={this.state.downloadUrl} target="view_window">模板下载</a>
                        <br/><br/><br/>
                        <Button onClick={() => this.next()} >下一步</Button>{/*disabled={this.state.canNext} */}
                    </div>
                </div>
            </div>
        )
    }
}

export default List