import React from 'react'
import ReactDOM from "react-dom";
import {Redirect} from 'react-router-dom'

import Form from "./Form"
import DialogTips from "../Dialog/DialogTips";
import Progress from "../Progress/Progress"

import mainSize from "../../utils/mainSize";
import ajax from "../../utils/ajax";

class Create extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      redirectToReferrer: false,
      isAnimating: false,
      isCreated: false
    };
    this.createDialogTips = this.createDialogTips.bind(this);
    this.create = this.create.bind(this);
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

  create() {
    let query = this.form.getFormValue();

    if (!query) {
      return;
    }

    query.orgId = this.props.location.state.groupId;
    this.setState({isAnimating: true});

    const request = async () => {
      try {
        let check = await ajax('/sys/user/checkName.do', {loginName: query.loginName});

        if (check) {
          this.createDialogTips('登陆名已存在 !');
          return;
        }

        await ajax('/sys/user/add.do', query);
        this.setState({isCreated: true})
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

    if (this.state.isCreated) {
      return (
        <Redirect to={{
          pathname: '/users',
          state: {groupId: this.props.location.state.groupId}
        }}/>
      )
    }

    return (
      <div>
        <h5 id="subNav">
          <i className="fa fa-users" aria-hidden="true"/>
          &nbsp;用户管理&nbsp;&nbsp;|&nbsp;&nbsp;
          <p className="d-inline text-muted">新建用户</p>
          <div className="btn-group float-right" role="group">
            <button onClick={() => {
              this.props.history.push('/users', {groupId: this.props.location.state.groupId});
            }} type="button" className="btn btn-light">取消
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              onClick={this.create}
              disabled={this.state.isAnimating}
            >
              保存
            </button>
          </div>
        </h5>

        <div id="main" className="main p-3">
          <Progress isAnimating={this.state.isAnimating}/>

          <Form
            isEditor={false}
            groupId={this.props.location.state.groupId}
            groupName={this.props.location.state.groupName}
            ref={(dom) => {
              this.form = dom
            }}
          />
        </div>
      </div>
    )
  }
}

export default Create;