import React from "react";
import { NavLink } from "react-router-dom";
import { $ } from "../../vendor";

import DialogGroup from "../Dialog/DialogGroup"

import isPhone from "../../utils/isPhone";
import SCHOOLPAL_CONFIG from "../../utils/config";
import ReactDOM from "react-dom";
import './Drawer.css'
import { Button, Message } from "element-react";

const GroupDialogBBtn = ({ groupName, action }) => (
    <div>
        <div className="item groups">
            <a href="javascript:;" className="d-block" onClick={action}>
                {groupName}
                <i className="fa fa-ellipsis-v fa-fw float-right" aria-hidden="true" />
            </a>
        </div>
        <div className="divider" />
    </div>
);

const MenuItem = ({ item, path }) => {
    if (path) {
        return (
            <NavLink
                key={item.cId}
                to={`/${SCHOOLPAL_CONFIG.AUTH[item.cId].PATH}`}
                className="d-block"
                activeClassName="active"
            >
                <i
                    className={`fa ${SCHOOLPAL_CONFIG.AUTH[item.cId].ICON_CLASS
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
                className={`fa ${SCHOOLPAL_CONFIG.AUTH[item.cId].ICON_CLASS
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
    console.log(menuData);
    menuData.map(item => {
        if (item.children && item.children.length) {
            let children = [];
            //Special:如果是统计分析  则不展开
            let hrefUrl = "#" + item.cId;
            if (item.cAction != '/ajax/statistic/') {
                children.push(Menu(item.children));
                menu.push(
                    <div key={item.cId} data-children=".item">
                        <div className="item">
                            <a data-toggle="collapse" href={`${hrefUrl}`} data-parent="#accordion" aria-expanded="true"
                                aria-controls="accordion" className="d-block">
                                <i
                                    className={`fa ${SCHOOLPAL_CONFIG.AUTH[item.cId].ICON_CLASS
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
            } else {
                menu.push(
                    <div key={item.cId} data-children=".item">
                        <div className="item">
                            <a className="d-block" href='/home/statistic'>
                                <i
                                    className={`fa ${SCHOOLPAL_CONFIG.AUTH[item.cId].ICON_CLASS
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
                    <MenuItem path={SCHOOLPAL_CONFIG.AUTH[item.cId].PATH} item={item} />
                </div>
            );
        }
    });
    console.log(menu);
    return menu;
};


class Drawer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            groupId: this.props.profile.org.cId,
            groupName: this.props.profile.org.cName,
            menuList: this.props.menu,
            focusClsId: 0,  //选中底部导航对应的id  1:OMS; 2:微校通
            focusName: ''
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

        this.clickCard(1, 'OMS');

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

    //设置全局组织信息
    acceptGroupDialog(selected, orgList) {
        console.log(selected);
        this.setState({
            groupId: selected.id,
            groupName: selected.name
        });
        window.sessionStorage.setItem("orgId", selected.id);

        $("#orgName").empty();
        orgList.map(item => {
            $("#orgName").append("<option value='" + item.id + "'>" + item.name + "</option>");
        });
        this.props.changed(selected)
    }
    //改变功能菜单
    changeFunctionList() {

    }

    clickCard(routeType, routeTypeName) {
        //1.改变样式
        //2.改变功能菜单数据
        let data = this.props.menu.filter(item => item.routeType == routeType);
        this.setState({ menuList: data, focusClsId: routeType, focusName: routeTypeName });
    }

    render() {
        // console.log(this.props.menu);
        return (
            <div id="drawer" className="aside-bar">
                <div className="drawer">
                    <div className="drawer-spacer">
                        <img src="http://www.risecenter.com/images/index/rise_logo.png" alt="" />
                    </div>
                    <div className="biank">
                        {/* 判断是否为管理系统 */}
                    {!this.props.hasChangeGroupBtn ?
                          <div class="interface">
                              {/* {this.state.focusName} */}
                              {this.state.focusClsId == 1 ? 'OMS系统' : '微校通系统'}
                            </div>
                        : null}
                        <div id="accordion" role="tablist">
                            {this.props.hasChangeGroupBtn ?
                                <GroupDialogBBtn groupName={this.state.groupName} action={this.createGroupsDialog} /> : null}
                            <Menu data={this.state.menuList} />
                        </div>
                        {/* <Button type="" style={{"paddingLeft":"21px","fontSize":"18px", "padding":"9px","margin":"0px","width":"73px","dorder":"none"}} onClick={this.changeFunctionList.bind(this,1)}>OMS</Button>&nbsp;&nbsp;
                        <Button type="" style={{"fontSize":"18px", "padding":"8px","margin":"-8px","width":"73px","dorder":"none"}} onClick={this.changeFunctionList.bind(this,1)}>微校通</Button>&nbsp;&nbsp;
                        <Button type="" style={{"fontSize":"18px", "padding":"8px","margin":"0px","width":"73px","dorder":"none"}} onClick={this.changeFunctionList.bind(this,1)}>更多</Button> */}
                         {/* 判断下方系统账户 */}
                        {!this.props.hasChangeGroupBtn ?
                            <ul class="version">
                                <li>
                                    <a href="#" class={this.state.focusClsId == 1 ? 'active-card' : 'card'} onClick={this.clickCard.bind(this, 1, 'OMS系统')}>OMS</a>
                                </li>
                                <li>
                                    <a href="#" class={this.state.focusClsId == 2 ? 'active-card' : 'card'} onClick={this.clickCard.bind(this, 2, '微校通系统')}>微校通</a>
                                </li>
                                <li onclick="off()">
                                    <a href="#" class={this.state.focusClsId == 3 ? 'active-card' : 'card1'} >...</a>
                                </li>
                            </ul>
                            : null}
                        {/* <!--   2.4 switch  --> */}
                        {/* <div id="switch" class="expand">
            <ul>
              <li>程序内容</li>
              <li>程序内容</li>
              <li>程序内容</li>
            </ul>
          </div>   */}
                    </div>
                </div>
            </div>

        );
    }
}

export default Drawer;
