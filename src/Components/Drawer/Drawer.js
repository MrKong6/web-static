import React from "react";
import {NavLink} from "react-router-dom";
import {$} from "../../vendor";

import DialogGroup from "../Dialog/DialogGroup"

import isPhone from "../../utils/isPhone";
import SCHOOLPAL_CONFIG from "../../utils/config";
import ReactDOM from "react-dom";
import './Drawer.css'
import {Button} from "element-react";

const GroupDialogBBtn = ({groupName, action}) => (
    <div>
        <div className="item groups">
            <a href="javascript:;" className="d-block" onClick={action}>
                {groupName}
                <i className="fa fa-ellipsis-v fa-fw float-right" aria-hidden="true"/>
            </a>
        </div>
        <div className="divider"/>
    </div>
);

const MenuItem = ({item, path}) => {
    if (path) {
        return (
            <NavLink
                key={item.cId}
                to={`/${SCHOOLPAL_CONFIG.AUTH[item.cId].PATH}`}
                className="d-block"
                activeClassName="active"
            >
                <i
                    className={`fa ${
                        SCHOOLPAL_CONFIG.AUTH[item.cId].ICON_CLASS
                        } fa-fw`}
                    aria-hidden="true"
                />
                {item.cNameLong}
            </NavLink>
        )
    }

    return (
        <a>
            <i
                className={`fa ${
                    SCHOOLPAL_CONFIG.AUTH[item.cId].ICON_CLASS
                    } fa-fw`}
                aria-hidden="true"
            />
            {item.cNameLong}
        </a>
    )
};

const Menu = data => {
    const menuData = data.data || data;
    let menu = [];
    menuData.map(item => {
        if (item.children && item.children.length) {
            let children = [];
            //Special:如果是统计分析  则不展开
            let hrefUrl = "#" + item.cId;
            if(item.cAction != '/ajax/statistic/'){
                children.push(Menu(item.children));
                menu.push(
                    <div key={item.cId} data-children=".item">
                        <div className="item">
                            <a data-toggle="collapse" href={`${hrefUrl}`} data-parent="#accordion" aria-expanded="true"
                               aria-controls="accordion" className="d-block">
                                <i
                                    className={`fa ${
                                        SCHOOLPAL_CONFIG.AUTH[item.cId].ICON_CLASS
                                        } fa-fw`}
                                    aria-hidden="true"
                                />
                                {item.cNameLong}
                            </a>
                            <div id={item.cId} className="collapse" role="tabpanel">
                                {children}
                            </div>
                        </div>
                    </div>
                );
            }else{
                menu.push(
                    <div key={item.cId} data-children=".item">
                        <div className="item">
                            <a className="d-block" href='/home/statistic'>
                                <i
                                    className={`fa ${
                                        SCHOOLPAL_CONFIG.AUTH[item.cId].ICON_CLASS
                                        } fa-fw`}
                                    aria-hidden="true"
                                />
                                {item.cNameLong}
                            </a>
                        </div>
                    </div>
                );
            }

        } else {
            menu.push(
                <div className="item">
                    <MenuItem path={SCHOOLPAL_CONFIG.AUTH[item.cId].PATH} item={item}/>
                </div>
            );
        }
    });

    return menu;
};

class Drawer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            groupId: this.props.profile.org.cId,
            groupName: this.props.profile.org.cName
        };
        this.createGroupsDialog = this.createGroupsDialog.bind(this);
        this.acceptGroupDialog = this.acceptGroupDialog.bind(this);
    }

    componentDidMount() {
        this.drawer = $('#drawer');

        if (isPhone()) {
            $('#drawer').hide();
        } else {
            $('#drawer').show();
        }

        window.addEventListener('resize', () => {
            if (isPhone()) {
                $('#drawer').hide();
            } else {
                $('#drawer').show();
            }
        })
    }

    componentWillUnmount() {
        if (this.groupContainer) {
            document.body.removeChild(this.groupContainer);
        }
    }

    createGroupsDialog() {
        if (this.group === undefined) {
            this.groupContainer = document.createElement('div');
            ReactDOM.render(
                <DialogGroup
                    accept={this.acceptGroupDialog}
                    defaults={this.state.groupId}
                    ref={(dom) => {
                        this.group = dom
                    }}
                />,
                document.body.appendChild(this.groupContainer)
            );
        }

        this.group.dialog.modal('show');
    }

    acceptGroupDialog(selected) {
        this.setState({
            groupId: selected.id,
            groupName: selected.name
        });

        this.props.changed(selected)
    }
    //改变功能菜单
    changeFunctionList(){

    }

    render() {
        // console.log(this.props.menu);
        return (
            <div id="drawer" className="aside-bar">
                <div className="drawer">
                    <div className="drawer-spacer">
                        <img src="http://www.risecenter.com/images/index/rise_logo.png" alt=""/>
                    </div>
                    <div id="accordion" role="tablist">
                        {this.props.hasChangeGroupBtn ?
                            <GroupDialogBBtn groupName={this.state.groupName} action={this.createGroupsDialog}/> : null}
                        <Menu data={this.props.menu}/>
                    </div>
                    {/*<div className="function_panel">
                        <Button type="text" style={{"paddingLeft":"10px","fontSize":"18px","border":"none"}} onClick={this.changeFunctionList.bind(this,1)}>OMS</Button>&nbsp;&nbsp;|
                        <Button type="text" style={{"fontSize":"18px"}} onClick={this.changeFunctionList.bind(this,1)}>微校通</Button>&nbsp;&nbsp;|
                        <Button type="text" style={{"fontSize":"18px"}} onClick={this.changeFunctionList.bind(this,1)}>小程序</Button>
                    </div>*/}
                </div>
            </div>
        );
    }
}

export default Drawer;
