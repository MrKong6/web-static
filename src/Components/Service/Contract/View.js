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
import CONFIG from "../../../utils/config";
import calculateAge from "../../../utils/calculateAge";

const NextBtn = ({id, ids}) => {
  const curIndex = ids.indexOf(id);

  if ((curIndex + 1) === ids.length) {
    return <button type="button" className="btn btn-light" disabled={true}>下一条</button>
  }

  return (
    <Link
      className="btn btn-light"
      to={{
        pathname: `/sales/oppor/${ids[curIndex + 1]}`,
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
        pathname: `/sales/oppor/${ids[curIndex - 1]}`,
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
        let data = await ajax('/service/contract/query.do', {id: this.state.id});
        let list = await ajax('/service/contract/list.do', {orgId: this.state.group.id});
        const ids = list.map((contract) => (contract.id));

        this.setState({data, ids});
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
    const request = async () => {
      try {
        await ajax('/service/contract/del.do', {id: this.state.id});
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
        <Redirect to="/service/contract"/>
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
                this.props.history.push('/sales/contract');
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
              this.props.history.push('/sales/contract');
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
                        <label className="col-5 col-form-label font-weight-bold">学员姓名</label>
                        <div className="col-7">
                          <input
                            type="text"
                            readOnly={true}
                            className="form-control-plaintext"
                            value={this.state.data.stuName}
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">学员姓别</label>
                        <div className="col-7">
                          <input
                            type="text"
                            readOnly={true}
                            className="form-control-plaintext"
                            value={this.state.data.stuGenderText}
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">出生年月</label>
                        <div className="col-7">
                          <input
                            type="text"
                            readOnly={true}
                            className="form-control-plaintext"
                            value={fmtDate(this.state.data.stuBirthday)}
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">学员年龄</label>
                        <div className="col-7">
                          <input
                            type="text"
                            readOnly={true}
                            className="form-control-plaintext"
                            value={calculateAge(this.state.data.stuBirthday)}
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">在读年级</label>
                        <div className="col-7">
                          <input
                            type="text"
                            readOnly={true}
                            className="form-control-plaintext"
                            value={this.state.data.stuGrade}
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">所在学校</label>
                        <div className="col-7">
                          <input
                            type="text"
                            readOnly={true}
                            className="form-control-plaintext"
                            value={this.state.data.stuSchoolName}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">证件类型</label>
                        <div className="col-7">
                          <input
                            type="text"
                            readOnly={true}
                            className="form-control-plaintext"
                            value={CONFIG.DOCUMENT[this.state.data.stuIdType]}
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">证件号码</label>
                        <div className="col-7">
                          <input
                            type="text"
                            readOnly={true}
                            className="form-control-plaintext"
                            value={this.state.data.stuIdCode}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">家长姓名</label>
                        <div className="col-7">
                          <input
                            type="text"
                            readOnly={true}
                            className="form-control-plaintext"
                            value={this.state.data.parName}
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">与孩子关系</label>
                        <div className="col-7">
                          <input
                            type="text"
                            readOnly={true}
                            className="form-control-plaintext"
                            value={this.state.data.relation}
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">联系电话</label>
                        <div className="col-7">
                          <input
                            type="text"
                            readOnly={true}
                            className="form-control-plaintext"
                            value={this.state.data.parCellphone}
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">微信号</label>
                        <div className="col-7">
                          <input
                            type="text"
                            readOnly={true}
                            className="form-control-plaintext"
                            value={this.state.data.parWechat}
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">电子邮箱</label>
                        <div className="col-7">
                          <input
                            type="text"
                            readOnly={true}
                            className="form-control-plaintext"
                            value={this.state.data.parEmail}
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">家庭住址</label>
                        <div className="col-7">
                          <input
                            type="text"
                            readOnly={true}
                            className="form-control-plaintext"
                            value={this.state.data.parAddress}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col"/>
                  </div>
                  <p className="ht pt-3 pb-3 b-t b-b">合同信息</p>
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
                        <label className="col-5 col-form-label font-weight-bold">课程产品</label>
                        <div className="col-7">
                          <input
                            type="text"
                            readOnly={true}
                            className="form-control-plaintext"
                            value={this.state.data.courseName}
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">课时</label>
                        <div className="col-7">
                          <input
                            type="text"
                            readOnly={true}
                            className="form-control-plaintext"
                            value={this.state.data.courseHours}
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">课次</label>
                        <div className="col-7">
                          <input
                            type="text"
                            readOnly={true}
                            className="form-control-plaintext"
                            value={this.state.data.courseTimes}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">合同金额</label>
                        <div className="col-7">
                          <input
                            type="text"
                            readOnly={true}
                            className="form-control-plaintext"
                            value={this.state.data.oriPrice}
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">折扣金额</label>
                        <div className="col-7">
                          <input
                            type="text"
                            readOnly={true}
                            className="form-control-plaintext"
                            value={this.state.data.discPrice}
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">应付金额</label>
                        <div className="col-7">
                          <input
                            type="text"
                            readOnly={true}
                            className="form-control-plaintext"
                            value={this.state.data.finalPrice}
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">已付金额</label>
                        <div className="col-7">
                          <input
                            type="text"
                            readOnly={true}
                            className="form-control-plaintext"
                            value={this.state.data.paid}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">合同编号</label>
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
                        <label className="col-5 col-form-label font-weight-bold">合同类型</label>
                        <div className="col-7">
                          <input
                            type="text"
                            readOnly={true}
                            className="form-control-plaintext"
                            value={CONFIG.TYPE_ID[this.state.data.typeId]}
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">签约日期</label>
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
                        <label className="col-5 col-form-label font-weight-bold">到期日期</label>
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
                        <label className="col-5 col-form-label font-weight-bold">所属组织</label>
                        <div className="col-7">
                          <input
                            type="text"
                            readOnly={true}
                            className="form-control-plaintext"
                            value={this.state.data.orgName}
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">所属用户</label>
                        <div className="col-7">
                          <input
                            type="text"
                            readOnly={true}
                            className="form-control-plaintext"
                            value={this.state.data.executiveName}
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
                            value={this.state.data.creatorName}
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
                            value={fmtDate(this.state.data.createTime)}
                          />
                        </div>
                      </div>
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