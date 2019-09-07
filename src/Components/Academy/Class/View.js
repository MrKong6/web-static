import React from 'react'
import ReactDOM from "react-dom";
import {Link, Redirect} from 'react-router-dom'

import DialogTips from "../../Dialog/DialogTips";
import Progress from "../../Progress/Progress";
import Commands from "../../Commands/Commands";

import fmtTitle from "../../../utils/fmtTitle";
import ajax from "../../../utils/ajax";
import mainSize from "../../../utils/mainSize";
import fmtDate from "../../../utils/fmtDate";
import {Message,MessageBox} from "element-react";

const NextBtn = ({id, ids}) => {
  const curIndex = ids.indexOf(id);

  if ((curIndex + 1) === ids.length) {
    return <button type="button" className="btn btn-light" disabled={true}>下一条</button>
  }

  return (
    <Link
      className="btn btn-light"
      to={{
        pathname: `/home/academy/class/${ids[curIndex + 1]}`,
        state: {ids: ids}
      }}
    >
      下一条
    </Link>
  )
};

const PrevBtn = ({id, ids}) => {
  const curIndex = ids.indexOf(id);

  if (curIndex === 0) {
    return <button type="button" className="btn btn-light" disabled={true}>上一条</button>
  }

  return (
    <Link
      className="btn btn-light"
      to={{
        pathname: `/home/academy/class/${ids[curIndex - 1]}`,
        state: {ids: ids}
      }}
    >
      上一条
    </Link>
  )
};

class View extends React.Component {
  constructor(props) {
    super(props);

    this.commands = this.props.commands.filter(command => (command.name !== 'Add' && command.name !== 'Assign'));
    this.title = fmtTitle(this.props.location.pathname);
    this.state = {
      group: this.props.changedCrmGroup,
      redirectToReferrer: false,
      redirectToList: false,
      isAnimating: false,
      id: this.props.match.params.contractId,
      data: null,
      ids: []
    };
    this.createDialogTips = this.createDialogTips.bind(this);
    this.modAction = this.modAction.bind(this);
    this.delAction = this.delAction.bind(this);
  }

  componentDidMount() {
    const request = async () => {
      try {
        let data = await ajax('/academy/class/query.do', {id: this.state.id});
        this.setState({data: data.data});
        console.log(data.data)
      } catch (err) {
        if (err.errCode === 401) {
          this.setState({redirectToReferrer: true})
        } else {
          this.createDialogTips(`${err.errCode}: ${err.errText}`);
        }
      }
    };

    request();
    mainSize();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.changedCrmGroup !== nextProps.changedCrmGroup) {
      this.setState({redirectToList: true})
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

  modAction() {
    this.props.history.push(`${this.props.match.url}/edit`, {ids: this.ids});
  }

  delAction() {
      MessageBox.confirm('此操作将永久删除教师, 是否继续?', '提示', {
          type: 'warning'
      }).then(() => {
          request();
      }).catch(() => {
          Message({
              type: 'info',
              message: '已取消删除'
          });
      });
      const request = async () => {
          try {
              await ajax('/academy/class/del.do', {id: this.state.id});
              this.setState({redirectToList: true});
              Message({
                  type: 'success',
                  message: '删除成功!'
              });
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

    if (this.state.redirectToList) {
      return (
        <Redirect to="/home/academy/class"/>
      )
    }

    if (!this.state.data) {
      return (
        <div>
          <h5 id="subNav">
            <i className={`fa ${this.title.icon}`} aria-hidden="true"/>
            &nbsp;{this.title.text}&nbsp;&nbsp;|&nbsp;&nbsp;

            <div className="btn-group float-right ml-4" role="group">
              <button onClick={() => {
                this.props.history.push('/home/academy/class');
              }} type="button" className="btn btn-light">返回
              </button>
            </div>
          </h5>

          <div id="main" className="main p-3">
            <div className="row justify-content-md-center">
              <div className="col col-12">
                <div className="card">
                  <div className="card-body">数据加载中...</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div>
        <h5 id="subNav">
          <i className={`fa ${this.title.icon}`} aria-hidden="true"/>
          &nbsp;{this.title.text}&nbsp;&nbsp;|&nbsp;&nbsp;
          <p className="d-inline text-muted">{this.state.data.code}</p>

          <div className="btn-group float-right ml-4" role="group">
            <PrevBtn id={this.state.id} ids={this.state.ids}/>
            <NextBtn id={this.state.id} ids={this.state.ids}/>
          </div>
          <div className="btn-group float-right ml-4" role="group">
            <button onClick={() => {
              this.props.history.push('/home/academy/class');
            }} type="button" className="btn btn-light">返回
            </button>
          </div>
          <Commands
            commands={this.commands}
            modAction={this.modAction}
            delAction={this.delAction}
          />
        </h5>

        <div id="main" className="main p-3">
          <Progress isAnimating={this.state.isAnimating}/>

          <div className="row justify-content-md-center">
            <div className="col col-12">
              <div className="card">
                <div className="card-body">
                  <p className="ht pb-3 b-b">基本信息</p>
                  <div className="row">
                    <div className="col">
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">班级编号</label>
                        <div className="col-7">
                          <input
                            type="text"
                            readOnly={true}
                            className="form-control-plaintext"
                            value={this.state.data.code}
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">升学前班级</label>
                        <div className="col-7">
                          <input
                            type="text"
                            readOnly={true}
                            className="form-control-plaintext"
                            value={this.state.data.beforeClassCode}
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">班级类型</label>
                        <div className="col-7">
                          <input
                            type="text"
                            readOnly={true}
                            className="form-control-plaintext"
                            value={this.state.data.typeName}
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">班级类别</label>
                        <div className="col-7">
                          <input
                            type="text"
                            readOnly={true}
                            className="form-control-plaintext"
                            value={this.state.data.rangeName}
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">校区</label>
                        <div className="col-7">
                          <input
                            type="text"
                            readOnly={true}
                            className="form-control-plaintext"
                            value={this.state.data.schoolArea}
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">班级状态</label>
                        <div className="col-7">
                          <input
                            type="text"
                            readOnly={true}
                            className="form-control-plaintext"
                            value={this.state.data.classStatusName}
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                          <label className="col-5 col-form-label font-weight-bold">色块</label>
                          <div
                              style={{
                                  width: 50,
                                  height: 50,
                                  marginTop: 20,
                                  backgroundColor: this.state.data.classColor ? this.state.data.classColor : null
                              }}
                          />
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">开班日期</label>
                        <div className="col-7">
                          <input
                            type="text"
                            readOnly={true}
                            className="form-control-plaintext"
                            value={fmtDate(this.state.data.startDate)}
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">结班日期</label>
                        <div className="col-7">
                          <input
                            type="text"
                            readOnly={true}
                            className="form-control-plaintext"
                            value={fmtDate(this.state.data.endDate)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">主教</label>
                        <div className="col-7">
                          <input
                            type="text"
                            readOnly={true}
                            className="form-control-plaintext"
                            value={this.state.data.mainTeacher}
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">教务</label>
                        <div className="col-7">
                          <input
                            type="text"
                            readOnly={true}
                            className="form-control-plaintext"
                            value={this.state.data.registrar}
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">计划人数</label>
                        <div className="col-7">
                          <input
                            type="text"
                            readOnly={true}
                            className="form-control-plaintext"
                            value={this.state.data.planNum}
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">开班人数</label>
                        <div className="col-7">
                          <input
                            type="text"
                            readOnly={true}
                            className="form-control-plaintext"
                            value={this.state.data.startNum}
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">实际人数</label>
                        <div className="col-7">
                          <input
                            type="text"
                            readOnly={true}
                            className="form-control-plaintext"
                            value={this.state.data.factNum}
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">创建时间</label>
                        <div className="col-7">
                          <input
                            type="text"
                            readOnly={true}
                            className="form-control-plaintext"
                            value={fmtDate(this.state.data.createOn)}
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                          <label className="col-5 col-form-label font-weight-bold">创建人</label>
                          <div className="col-7">
                              <input
                                  type="text"
                                  readOnly={true}
                                  className="form-control-plaintext"
                                  value={this.state.data.createBy}
                              />
                          </div>
                      </div>
                    </div>
                    <div className="col"/>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <nav aria-label="breadcrumb">
              <ol className="breadcrumb location_bottom">
                  <li className="breadcrumb-item">班级基本信息</li>
                  <li className="breadcrumb-item active">
                      <Link to={{pathname:`/home/academy/class/student/${this.state.id}`,
                              state:{stuName:this.state.data.code}}}>班级学员信息</Link>
                  </li>
                  <li className="breadcrumb-item">
                      <Link to={{
                          pathname: ``,
                          state: {stuName: this.state.data.code}
                      }}>班级教师信息</Link>
                  </li>
                  <li className="breadcrumb-item">
                      <Link to={{
                          pathname: ``,
                          state: {stuName: this.state.data.code}
                      }}>班级课程表</Link>
                  </li>
                  <li className="breadcrumb-item"><Link to={``}>班级考勤信息</Link></li>
                  <li className="breadcrumb-item"><Link to={``}>班级异动信息</Link></li>
              </ol>
          </nav>
        </div>
      </div>
    )
  }
}

export default View;