import React from 'react'
import ReactDOM from "react-dom";
import {Redirect} from 'react-router-dom'

import Progress from "../Progress/Progress"
import DialogTips from "../Dialog/DialogTips";

import mainSize from "../../utils/mainSize";
import MD5Mixed from "../../utils/MD5Mixed"
import ajax from "../../utils/ajax";

class ChangePwd extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      redirectToReferrer: false,
      isAnimating: false,
      isChanged: false,
    };
    this.createDialogTips = this.createDialogTips.bind(this);
    this.changePwd = this.changePwd.bind(this);
  }

  componentDidMount() {
    mainSize();
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

  changePwd() {
    if (!this.form.checkValidity()) {
      return
    }

    const oriPass = MD5Mixed(MD5Mixed(this.form.oriPass.value));
    const newPass = MD5Mixed(MD5Mixed(this.form.newPass.value));
    const newPassRepeat = MD5Mixed(MD5Mixed(this.form.newPassRepeat.value));

    if (newPass !== newPassRepeat) {
      this.createDialogTips('两次输入不一致 ！')
      return
    }


    const request = async () => {
      try {
        await ajax('/user/changePassword.do', {oriPass, newPass});
        this.setState({isChanged: true})
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

  render() {
    if (this.state.redirectToReferrer) {
      return (
        <Redirect to={{
          pathname: '/login',
          state: {from: this.props.location}
        }}/>
      )
    }

    if (this.state.isChanged) {
      return <Redirect to="/login"/>
    }

    return (
      <div>
        <div id="main" className="main p-3">
          <Progress isAnimating={this.state.isAnimating}/>
          <div className="row justify-content-md-center">
            <div className="col col-md-5">
              <div className="card">
                <div className="card-header">修改密码</div>
                <div className="card-body">
                  <form ref={(dom) => {
                    this.form = dom
                  }}>
                    <div className="form-group">
                      <label htmlFor="name"><em className="text-danger">*</em>当前密码</label>
                      <input type="password" className="form-control" name="oriPass" required={true}/>
                    </div>
                    <div className="form-group">
                      <label htmlFor="name"><em className="text-danger">*</em>新密码</label>
                      <input type="password" className="form-control" name="newPass" required={true}/>
                    </div>
                    <div className="form-group">
                      <label htmlFor="name"><em className="text-danger">*</em>重复新密码</label>
                      <input type="password" className="form-control" name="newPassRepeat" required={true}/>
                    </div>
                  </form>
                  <button
                    type="submit"
                    className="btn btn-primary float-right"
                    onClick={this.changePwd}
                    disabled={this.state.isAnimating}
                  >
                    保存
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ChangePwd;