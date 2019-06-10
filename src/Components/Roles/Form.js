import React from 'react'
import ReactDOM from "react-dom";

import DialogTips from "../Dialog/DialogTips";

import ajax from "../../utils/ajax";

class Form extends React.Component {
  constructor(props) {
    super(props)

    this.FUNC_ADMIN = "7";
    this.RANK_ADMIN = 4;
    this.RANK_MANGER = 1;

    this.state = {
      isAdmin: false,
      isManger: false,

      funcDic: [],
      rankDic: [],

      selectedRole: "",
      selectedFunc: []
    };
    this.createDialogTips = this.createDialogTips.bind(this);
    this.changedAdmin = this.changedAdmin.bind(this);
    this.changedFunc = this.changedFunc.bind(this);
    this.changedRole = this.changedRole.bind(this);
    this.getFormValue = this.getFormValue.bind(this);
  }

  componentDidMount() {
    const request = async () => {
      try {
        let funcDic = await ajax('/func/listAllFuncs.do');
        let rankDic = await ajax('/role/ranks.do');

        funcDic = funcDic.filter(func => (func.cId === func.cRootId && func.cId !== this.FUNC_ADMIN));
        rankDic = rankDic.filter(rank => (rank.cId !== this.RANK_ADMIN));

        this.setState({funcDic, rankDic})
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

  componentWillReceiveProps(nextProps) {
    if (nextProps.data && this.props.data !== nextProps.data) {
      let state = {};

      state.isAdmin = nextProps.data.cRankId === this.RANK_ADMIN;

      if (!state.isAdmin) {
        state.selectedRole = nextProps.data.cRankId;
        state.selectedFunc = nextProps.data.rootFuncs.map(func => (func.cId))
      }

      this.setState({...state}, () => {
        this.form.group.value = nextProps.data.cOrgName;
        this.form.name.value = nextProps.data.cName;
        this.form.desc.value = nextProps.data.cDesc;
      });
    }
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

  changedAdmin() {
    this.setState({
      isAdmin: true,
      selectedRole: "",
      selectedFunc: []
    })
  }

  changedFunc(evt) {
    let tempFunc = [];

    if (this.state.selectedFunc.includes(evt.target.value)) {
      if (this.state.selectedRole && this.state.isManger) {
        tempFunc = this.state.selectedFunc.filter((func) => (func !== evt.target.value));
      }
    } else {
      if (this.state.selectedRole && this.state.isManger) {
        tempFunc = tempFunc.concat(this.state.selectedFunc);
      }

      tempFunc.push(evt.target.value);
    }

    this.setState({
      selectedFunc: tempFunc
    });

    if (tempFunc.length) {
      this.setState({isAdmin: false})
    }
  }

  changedRole(evt) {
    const isManger = parseInt(evt.target.value) === this.RANK_MANGER;
    let tempFunc = [];

    if (!isManger && this.state.selectedFunc.length > 1) {
      tempFunc = this.state.selectedFunc.shift();
      this.setState({
        selectedFunc: tempFunc
      })
    }

    this.setState({
      isManger,
      isAdmin: false,
      selectedRole: parseInt(evt.target.value)
    })
  }

  getFormValue() {
    if (!this.form.checkValidity() || (!this.state.isAdmin && (!this.state.selectedFunc.length || !this.state.selectedRole))) {
      return
    }

    let query = {};

    query.name = this.form.name.value;
    query.desc = this.form.desc.value;

    if (this.state.isAdmin) {
      query.strFuncIds = this.FUNC_ADMIN;
      query.rankId = this.RANK_ADMIN;
    } else {
      query.strFuncIds = this.state.selectedFunc.join(',');
      query.rankId = this.state.selectedRole;
    }

    return query;
  }

  render() {
    if (this.props.isEditor && !this.props.data) {
      return (
        <form ref={(dom) => {
          this.form = dom
        }}>
          <div className="row justify-content-md-center">
            <div className="col col-md-6">
              <div className="card">
                <div className="card-body">数据加载中...</div>
              </div>
            </div>
          </div>
        </form>
      )
    } else {
      return (
        <form ref={(dom) => {
          this.form = dom
        }}>
          <div className="row justify-content-md-center">
            <div className="col col-md-5">
              <div className="card">
                <div className="card-body">
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
                    <label htmlFor="group"><em className="text-danger">*</em>角色职能</label>
                    <div>
                      {
                        this.state.funcDic.map((func) => (
                          <div key={func.cId} className="form-check form-check-inline">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              value={func.cId}
                              id={`func-${func.cId}`}
                              onChange={this.changedFunc}
                              checked={this.state.selectedFunc.includes(func.cId)}
                            />
                            <label className="form-check-label" htmlFor={`func-${func.cId}`}>
                              {func.cNameShort}
                            </label>
                          </div>
                        ))
                      }
                      <div className="form-check form-check-inline">
                        <input
                          id="funcAdmin"
                          className="form-check-input"
                          type="radio"
                          name="funcAdmin"
                          value={this.FUNC_ADMIN}
                          onChange={this.changedAdmin}
                          checked={this.state.isAdmin}
                        />
                        <label className="form-check-label" htmlFor="funcAdmin">
                          系统
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="group"><em className="text-danger">*</em>角色职级</label>
                    <div>
                      {
                        this.state.rankDic.map((rank) => (
                          <div key={rank.cId} className="form-check form-check-inline">
                            <input
                              id={`option-${rank.cId}`}
                              className="form-check-input"
                              type="radio"
                              name="rank"
                              value={rank.cId}
                              onChange={this.changedRole}
                              checked={rank.cId === this.state.selectedRole ? true : false}
                            />
                            <label className="form-check-label" htmlFor={`option-${rank.cId}`}>
                              {rank.cName}
                            </label>
                          </div>
                        ))
                      }
                      <div className="form-check form-check-inline">
                        <input
                          id="rankAdmin"
                          className="form-check-input"
                          type="radio"
                          name="rankAdmin"
                          value={this.RANK_ADMIN}
                          onChange={this.changedAdmin}
                          checked={this.state.isAdmin}
                        />
                        <label className="form-check-label" htmlFor="rankAdmin">
                          系统管理员
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="name"><em className="text-danger">*</em>角色名称</label>
                    <input type="text" className="form-control" name="name" required={true}/>
                  </div>
                  <div className="form-group">
                    <label htmlFor="name">角色描述</label>
                    <textarea name="desc" className="form-control" rows="3"></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      )
    }
  }
}

export default Form;