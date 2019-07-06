import React from "react";
import {Button, Upload} from 'element-react';

const Add = ({action}) => (
    <Button type="primary" icon="plus" onClick={action}>新建</Button>
);

const Mod = ({action}) => (
    <button onClick={action} type="button" className="btn btn-primary">
        <i className="fa fa-pencil" aria-hidden="true"/>&nbsp;&nbsp;编辑
    </button>
);

const Del = ({action}) => (
    <button type="button" className="btn btn-danger" onClick={action}>
        <i className="fa fa-trash-o" aria-hidden="true"/>&nbsp;&nbsp;删除
    </button>
);

const Auth = ({action}) => (
    <button onClick={action} className="btn btn-danger">
        <i className="fa fa-shield" aria-hidden="true"/>&nbsp;&nbsp;授权
    </button>
);

const Import = ({action}) => (
    <Upload {...action}>
        <Button type="primary" size="large" icon="upload2">导入</Button>
    </Upload>
);

const Defaults = ({text, action}) => (
    <button onClick={action} type="button" className="btn btn-primary">
        {text}
    </button>
);

const Transfer = ({action,param}) => (
    <Button className="el-button-nomargin" type="warning" icon="d-arrow-right" onClick={action} param={param}>转移到</Button>
);

const Export = ({action}) => (
    <Button type="warning" icon="document" onClick={action}>下载</Button>
);

const Commands = (props) => {
    const list = props.commands.map(command => (command.name));
    return (
        <div className="btn-group float-right" role="group">
            {
                list.map((command, index) => {
                    switch (command) {
                        case "Add":
                            return <Add key={index} action={props.addAction}/>;
                        case "Mod":
                            return <Mod key={index} action={props.modAction}/>;
                        case "Del":
                            return <Del key={index} action={props.delAction}/>;
                        case "Auth":
                            return <Auth key={index} action={props.authAction}/>;
                        case "Import":
                            return <Import key={index} action={props.importAction}/>;
                        case "Export":
                            return <Export key={index} action={props.exportAction}/>;
                        case 'Assign':
                            return <Defaults key={index} action={props.assignAction} text="分配给"/>;
                        case 'Convert':
                            return <Defaults key={index} action={props.convertAction} text="转化为"/>;
                        case 'Sign':
                            return <Defaults key={index} action={props.SignAction} text="创建合同"/>;
                        case 'Transfer':
                            return <Transfer key={index} action={props.assignAction} param={props.assignParams} text="转移到"/>;
                        default:
                            return null;
                    }
                })
            }
        </div>
    )
};

export default Commands;