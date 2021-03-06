import React from "react";
import ReactDOM from "react-dom";
import {Link, Redirect} from 'react-router-dom'
import {$} from "../../vendor";

import DialogTips from "../Dialog/DialogTips";
import ajax, {IMG_URL, ROUTE_TO_FMS} from "../../utils/ajax";
import {Button, ColorPicker} from "element-react";

const toggleDrawer = () => {
    $('#drawer').toggle();
};

class Header extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isLogout: false,
            imgUrl: IMG_URL + this.props.profile.qrCode,
            routeToFms: ROUTE_TO_FMS
        };
        this.logout = this.logout.bind(this);
        this.createDialogTips = this.createDialogTips.bind(this);
    }

    componentWillUnmount() {
        if (this.tipsContainer) {
            document.body.removeChild(this.tipsContainer);
        }
    }

    createDialogTips() {
        if (this.tips === undefined) {
            this.tipsContainer = document.createElement('div');

            ReactDOM.render(
                <DialogTips
                    accept={this.logout}
                    title="请确认"
                    text={"是否要退出本系统？"}
                    ref={(dom) => {
                        this.tips = dom
                    }}
                />,
                document.body.appendChild(this.tipsContainer)
            );
        } else {
            this.tips.setText('是否要退出本系统？');
        }

        this.tips.dialog.modal('show');
    }

    logout() {
        ajax('/user/logout.do');

        this.tips.dialog.on('hidden.bs.modal', () => {
            this.setState({isLogout: true});
        });
    }

    render() {
        if (this.state.isLogout) {
            return <Redirect to="/login"/>
        }

        return (
            <nav id="nav" className="navbar navbar-dark " style={{"height":"40.1px" ,"border-bottom": "1px solid rgba(0, 0, 0, 0.12)"}} >
                <button onClick={toggleDrawer} className="btn btn-link" style={{"margin-top":"-10px","color":"rgba(0,0,0,0.7)"}}>
                    <i className="fa fa-bars" aria-hidden="true"/>
                </button>

                <div style={{"position":"absolute","right":"140px","background":"white","border-radius":"5px","padding":"7px"}}>
                    <a href={this.state.routeToFms} target="_blank">FMS</a>
                </div>
                <div className="dropdown">
                    <button id="menu-button" className="btn btn-link dropdown-toggle" data-toggle="dropdown"  style={{"margin-top":"-10px"}} >
                        {`${this.props.profile.cRealname}`}
                    </button>
                    <div className="dropdown-menu" aria-labelledby="menu-button">
                        <Link to="/home/changepwd" className="dropdown-item">修改密码</Link>
                        <a onClick={this.createDialogTips} href="javascript:void(0)" className="dropdown-item">登出系统</a>
                        <hr/>
                        <div>
                            <img src={this.state.imgUrl} alt="" width="120px" height="120px" style={{"marginLeft":"10px"}} />
                        </div>
                    </div>
                </div>
            </nav>
        )
    }
}

export default Header;
