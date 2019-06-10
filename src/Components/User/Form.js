import React from 'react'
import ReactDOM from "react-dom";

import DialogTips from "../Dialog/DialogTips";

import ajax from "../../utils/ajax";
import MD5Mixed from "../../utils/MD5Mixed";

class Form extends React.Component {
  constructor(props) {
    super(props);

    this.RANK_ADMIN = 4;
    this.RANK_MANGER = 1;
    this.state = {
      businessRoles: [],
      sysRoles: [],
      selectedRoles: [],
      data: null
    };
    this.createDialogTips = this.createDialogTips.bind(this);
    this.changedRole = this.changedRole.bind(this);
    this.getFormValue = this.getFormValue.bind(this);
  }

  componentDidMount() {
    const request = async () => {
      try {
        let roles = await ajax('/org/listRoles.do', {id: this.props.groupId});
        let businessRoles = [];
        let sysRoles = [];

        roles.map((role) => {
          if (role.cRankId === this.RANK_ADMIN) {
            sysRoles.push(role);
          } else {
            businessRoles.push(role);
          }
        });

        this.setState({businessRoles, sysRoles});

        if (this.props.isEditor) {
          let data = await ajax('/sys/user/query.do', {id: this.props.editorId});
          const selectedRoles = data.roles.map(role => (role.cId));

          this.setState({selectedRoles, data}, () => {
            this.form.loginName.value = data.cLoginName;
            this.form.realName.value = data.cRealName;
            this.form.phone.value = data.cPhone;
            this.form.email.value = data.cEmail;
            this.form.nickName.value = data.cNickName;
            this.form.im.value = data.cQq;
          })
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

  changedRole(evt) {
    let adminAndManger = [];
    let tempRoles = [];

    for (let i = 0; i < this.form.rank.length; i++) {
      adminAndManger.push(this.form.rank[i].value)
    }

    if (evt.target.getAttribute('type') === 'radio') {
      tempRoles.push(evt.target.value);
    } else {
      const temp = this.state.selectedRoles.filter((role) => (!adminAndManger.includes(role)));

      if (temp.includes(evt.target.value)) {
        tempRoles = temp.filter((role) => (role !== evt.target.value))
      } else {
        tempRoles = tempRoles.concat(temp);
        tempRoles.push(evt.target.value);
      }
    }

    this.setState({
      selectedRoles: tempRoles
    })
  }

  getFormValue() {
    if (!this.form.checkValidity() || (!this.state.isAdmin && !this.state.selectedRoles.length)) {
      return null;
    }

    let query = {};

    for (let i = 0; i < this.form.length; i++) {
      if (this.form[i].name) {
        if (this.form[i].name === 'loginPass') {
          if (!this.props.isEditor || this.form[i].value) {
            query[this.form[i].name] = MD5Mixed(MD5Mixed(this.form[i].value));
          }
        } else {
          query[this.form[i].name] = this.form[i].value;
        }
      }
    }

    query.roles = this.state.selectedRoles.join(',');

    return query;
  }

  render() {
    if (this.props.isEditor && !this.state.data) {
      return (
        <form ref={(dom) => {
          this.form = dom
        }}>
          <div className="row justify-content-md-center">
            <div className="col col-md-8">
              <div className="card">
                <div className="card-body">数据加载中...</div>
              </div>
            </div>
          </div>
        </form>
      )
    }

    return (
      <form ref={(dom) => {
        this.form = dom
      }}>
        <div className="row justify-content-md-center">
          <div className="col col-md-8">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-12 col-lg-8">
                    <p className={'h6 pb-3 mb-0'}>用户信息</p>
                    <div className="form-group">
                      <label htmlFor="group"><em className="text-danger">*</em>所属组织</label>
                      <input
                        type="text"
                        className="form-control"
                        name="group"
                        value={this.props.groupName}
                        disabled={true}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="loginName"><em className="text-danger">*</em>用户名</label>
                      <input type="text" className="form-control" name="loginName" readOnly={this.props.isEditor}
                             required={true}/>
                    </div>
                    <div className="form-group">
                      <label htmlFor="loginPass"><em className="text-danger">*</em>登陆密码</label>
                      <input type="password" className="form-control" name="loginPass" required={!this.props.isEditor}/>
                    </div>
                    <div className="form-group">
                      <label htmlFor="realName"><em className="text-danger">*</em>姓名</label>
                      <input type="text" className="form-control" name="realName" required={true}/>
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone"><em className="text-danger">*</em>电话号码</label>
                      <input type="text" className="form-control" pattern="^1\d{10}$" name="phone" required={true}/>
                    </div>
                    <div className="form-group">
                      <label htmlFor="email"><em className="text-danger">*</em>电子邮箱</label>
                      <input type="text" className="form-control" name="email" required={true}/>
                    </div>
                    <div className="form-group">
                      <label htmlFor="nickName">昵称</label>
                      <input type="text" className="form-control" name="nickName"/>
                    </div>
                    <div className="form-group">
                      <label htmlFor="im">IM(QQ...)</label>
                      <input type="text" className="form-control" name="im"/>
                    </div>
                  </div>
                  <div className="col-12 col-lg-4">
                    <p className={'h6 pb-3 mb-0'}>用户角色</p>
                    {
                      this.state.businessRoles.map(role => {
                        if (role.cRankId === this.RANK_ADMIN || role.cRankId === this.RANK_MANGER) {
                          return (
                            <div className="form-check">
                              <input
                                id={role.cId}
                                className="form-check-input"
                                type="radio"
                                name="rank"
                                value={role.cId}
                                onChange={this.changedRole}
                                checked={this.state.selectedRoles.includes(role.cId)}
                              />
                              <label className="form-check-label" htmlFor={role.cId}>
                                {role.cName}
                              </label>
                            </div>
                          )
                        } else {
                          return (
                            <div key={role.cId} className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value={role.cId}
                                id={role.cId}
                                onChange={this.changedRole}
                                checked={this.state.selectedRoles.includes(role.cId)}
                              />
                              <label className="form-check-label" htmlFor={role.cId}>
                                {role.cName}
                              </label>
                            </div>
                          )
                        }
                      })
                    }
                    <br/>
                    {
                      this.state.sysRoles.map(role => (
                        <div className="form-check">
                          <input
                            id={role.cId}
                            className="form-check-input"
                            type="radio"
                            name="rank"
                            value={role.cId}
                            onChange={this.changedRole}
                            checked={this.state.selectedRoles.includes(role.cId)}
                          />
                          <label className="form-check-label" htmlFor={role.cId}>
                            {role.cName}
                          </label>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    )
  }
}

export default Form;