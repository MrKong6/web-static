import React from 'react'
import ReactDOM from "react-dom";
import {Link, Redirect} from 'react-router-dom'

import DialogTips from "../../Dialog/DialogTips";
import Progress from "../../Progress/Progress";
import Commands from "../../Commands/Commands";

import fmtTitle from "../../../utils/fmtTitle";
import ajax from "../../../utils/ajax";
import mainSize from "../../../utils/mainSize";

const NextBtn = ({id, ids}) => {
  const curIndex = ids.indexOf(id);

  if ((curIndex + 1) === ids.length) {
    return <button type="button" className="btn btn-light" disabled={true}>下一条</button>
  }

  return (
    <Link
      className="btn btn-light"
      to={{
        pathname: `/service/course/${ids[curIndex + 1]}`,
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
        pathname: `/service/course/${ids[curIndex - 1]}`,
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

    this.commands = this.props.commands.filter(command => (command.name !== 'Add'));
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
        let data = await ajax('/course/type/query.do', {id: this.state.id});
        let list = await ajax('/course/type/listAll.do', {orgId: this.state.group.id});
        const ids = list.data.items.map((contract) => (contract.id+''));

        this.setState({data:data.data, ids:ids});
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
    this.props.history.push(`${this.props.match.url}/edit`, {selectedCou: this.state.data.courseTypeId,
        selectedCouText: this.state.data.courseType,data:this.state.data});
  }

  delAction() {
    const request = async () => {
      try {
          await ajax('/course/type/del.do', {id: this.state.id});
        this.setState({redirectToList: true});
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
        <Redirect to="/home/setting/service"/>
      )
    }

    if (!this.state.data) {
      return (
        <div>
          <h5 id="subNav">
            <i className={`fa ${this.title.icon}`} aria-hidden="true"/>
            &nbsp;{this.title.text}&nbsp;&nbsp;&nbsp;&nbsp;

            <div className="btn-group float-right ml-4" role="group">
              <button onClick={() => {
                this.props.history.push('/home/setting/service');
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
          <p className="d-inline text-muted">{this.state.data.stuName}</p>

          <div className="btn-group float-right ml-4" role="group">
            <PrevBtn id={this.state.id} ids={this.state.ids}/>
            <NextBtn id={this.state.id} ids={this.state.ids}/>
          </div>
          <div className="btn-group float-right ml-4" role="group">
            <button onClick={() => {
              this.props.history.push('/home/setting/service');
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
                  <div className="row">
                    <div className="col">
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">课程类别</label>
                        <div className="col-7">
                          <input
                            type="text"
                            readOnly={true}
                            className="form-control-plaintext"
                            value={this.state.data.courseType}
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">课程阶段</label>
                        <div className="col-7">
                          <input
                            type="text"
                            readOnly={true}
                            className="form-control-plaintext"
                            value={this.state.data.name}
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">总课时</label>
                        <div className="col-7">
                          <input
                            type="text"
                            readOnly={true}
                            className="form-control-plaintext"
                            value={this.state.data.classHour}
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">总课次</label>
                        <div className="col-7">
                          <input
                            type="text"
                            readOnly={true}
                            className="form-control-plaintext"
                            value={this.state.data.classTime}
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                          <label className="col-5 col-form-label font-weight-bold">时长(min)</label>
                          <div className="col-7">
                              <input
                                  type="text"
                                  readOnly={true}
                                  className="form-control-plaintext"
                                  value={this.state.data.time}
                              />
                          </div>
                      </div>
                    </div>
                    <div className="col">
                        <div className="form-group row">
                            <label className="col-5 col-form-label font-weight-bold">单课时费</label>
                            <div className="col-7">
                                <input
                                    type="text"
                                    readOnly={true}
                                    className="form-control-plaintext"
                                    value={this.state.data.price}
                                />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-5 col-form-label font-weight-bold">总课时费</label>
                            <div className="col-7">
                                <input
                                    type="text"
                                    readOnly={true}
                                    className="form-control-plaintext"
                                    value={this.state.data.amount}
                                />
                            </div>
                        </div>
                        {this.state.data.fields ? this.state.data.fields.map(function (evt) {
                            return <div className="form-group row">
                                <div className="col-2">
                                    <label className="col-form-label font-weight-bold">
                                        <em className="text-danger">*</em>{evt.periodNum}期：
                                    </label>
                                </div>
                                <div className="col-3">
                                    <div className="form-group row">
                                        <input type="text" className="form-control" name={evt.clsName}
                                               placeholder="课时数" value={evt.classHour} readOnly={true}/>
                                    </div>
                                </div>
                                <div className="col-3">
                                    <div className="form-group row">
                                        <input type="text" className="form-control" name={evt.clsName}
                                               placeholder="金额" value={evt.amount} readOnly={true}/>
                                    </div>
                                </div>
                            </div>
                        }) : null
                        }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default View;