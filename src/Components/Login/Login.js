import React from 'react'
import ReactDOM from "react-dom";
import {Redirect} from 'react-router-dom'
import './Login.css'

import Progress from "../Progress/Progress"
import DialogTips from "../Dialog/DialogTips";
import MD5Mixed from "../../utils/MD5Mixed"
import ajax from "../../utils/ajax";

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isAnimating: false,
      redirectToReferrer: false,
    };
    this.login = this.login.bind(this);
    this.createDialogTips = this.createDialogTips.bind(this);
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

  login(evt) {
    if (this.form.checkValidity()) {
      evt.preventDefault()
    }

    this.setState({isAnimating: true});

    const userName = this.form.userName.value;
    const userPwd = this.form.userPwd.value;
    let mixedPWD;

    this.setState({submitLoading: 'block'});

    const request = async () => {
      try {
        let salt = await ajax('/user/salt.do');

        mixedPWD = MD5Mixed(MD5Mixed(MD5Mixed(userPwd)) + salt);

        await ajax('/user/login.do', {
          loginName: userName,
          mixedPWD: mixedPWD
        });
        this.setState({redirectToReferrer: true});
      } catch (err) {
        this.createDialogTips(`${err.errCode}: ${err.errText}`);
      } finally {
        this.setState({isAnimating: false});
      }
    };

    request();
  }

  render() {
    const {from} = this.props.location.state || {from: {pathname: '/'}};

    if (this.state.redirectToReferrer) {
      return (
        <Redirect to={from}/>
      )
    }

    return (
      <div className="container">
        <div className="login">
          <div className="card border-0">
            <Progress isAnimating={this.state.isAnimating}/>
            <div className="card-body">
              <h4 className="card-title">登陆校客系统</h4>
              <form
                ref={(dom) => {
                  this.form = dom
                }}
                onSubmit={this.login}
              >
                <div className="form-group">
                  <label htmlFor="userName">用户名</label>
                  <input
                    type="text"
                    className="form-control"
                    id="userName"
                    placeholder="Enter user name"
                    required={true}
                  />
                  <small className="form-text text-muted">&nbsp;</small>
                </div>
                <div className="form-group">
                  <label htmlFor="userPwd">密码</label>
                  <input
                    type="password"
                    className="form-control"
                    id="userPwd"
                    placeholder="Enter user password"
                    required={true}
                  />
                  <small className="form-text text-muted">&nbsp;</small>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary float-right"
                  disabled={this.state.isAnimating}
                >
                  登&nbsp;&nbsp;陆
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Login;