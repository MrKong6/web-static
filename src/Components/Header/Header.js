import React from "react";
import ReactDOM from "react-dom";
import {Link, Redirect} from 'react-router-dom'
import {$} from "../../vendor";

import DialogTips from "../Dialog/DialogTips";
import ajax from "../../utils/ajax";

const toggleDrawer = () => {
  $('#drawer').toggle();
};

class Header extends React.Component {
  constructor(props) {
    super(props)

    this.state = {isLogout: false};
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
      <nav id="nav" className="navbar navbar-dark bg-primary">
        <button onClick={toggleDrawer} className="btn btn-link">
          <i className="fa fa-bars" aria-hidden="true"/>
        </button>
        <ul className="navbar-nav"/>

        <div className="dropdown">
          <button id="menu-button" className="btn btn-link dropdown-toggle" data-toggle="dropdown">
            {`${this.props.profile.cRealname}`}
          </button>
          <div className="dropdown-menu" aria-labelledby="menu-button">
            <Link to="/changepwd" className="dropdown-item">修改密码</Link>
            <a onClick={this.createDialogTips} href="javascript:void(0)" className="dropdown-item">登出系统</a>
          </div>
        </div>
      </nav>
    )
  }
}

export default Header;
