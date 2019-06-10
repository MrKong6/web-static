import React from 'react'
import ReactDOM from "react-dom";
import {Link, Redirect} from 'react-router-dom'

import DialogTips from "../../Dialog/DialogTips";
import fmtTitle from "../../../utils/fmtTitle";
import ajax from "../../../utils/ajax";
import mainSize from "../../../utils/mainSize";
import fmtDate from "../../../utils/fmtDate";
import CONFIG from "../../../utils/config";

const NextBtn = ({id, ids}) => {
  const curIndex = ids.indexOf(id);

  if ((curIndex + 1) === ids.length) {
    return <button type="button" className="btn btn-light" disabled={true}>下一条</button>
  }

  return (
    <Link
      className="btn btn-light"
      to={{
        pathname: `/sales/customer/contract/${ids[curIndex + 1]}`,
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
        pathname: `/sales/customer/contract/${ids[curIndex - 1]}`,
        state: {ids: ids}
      }}
    >
      上一条
    </Link>
  )
};

class ContractView extends React.Component {
  constructor(props) {
    super(props);

    this.title = fmtTitle(this.props.location.pathname);
    this.state = {
      group: this.props.changedCrmGroup,
      redirectToReferrer: false,
      redirectToList: false,
      id: this.props.match.params.studentId,
      ids: [],
      data: {name: this.props.location.state.stuName},
      contractList: [],
      isEmpty: false
    };
    this.createDialogTips = this.createDialogTips.bind(this);
  }

  componentDidMount() {
    const request = async () => {
      try {
        let list = await ajax('/sales/customer/student/list.do', {organizationId: this.state.group.id});
        let contractList = await ajax('/sales/contract/queryListByStudentId.do', {id: this.state.id});
        const ids = list.map((student) => (student.id));
        const isEmpty = !contractList.length;

        this.setState({ids, contractList, isEmpty});
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
        <Redirect to="/sales/customer"/>
      )
    }

    if (!this.state.isEmpty && !this.state.contractList.length) {
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

    if (this.state.isEmpty && !this.state.contractList.length) {
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
                  <div className="card-body">无合同记录...</div>
                </div>
              </div>
            </div>

            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to={`/sales/customer/student/${this.state.id}`}>学员信息</Link></li>
                <li className="breadcrumb-item">
                  <Link to={{
                    pathname: `/sales/customer/parent/${this.state.id}`,
                    state: {stuName: this.state.data.name}
                  }}>家长信息</Link>
                </li>
                <li className="breadcrumb-item active">合同信息</li>
              </ol>
            </nav>
          </div>
        </div>
      )
    }

    return (
      <div>
        <h5 id="subNav">
          <i className={`fa ${this.title.icon}`} aria-hidden="true"/>
          &nbsp;{this.title.text}&nbsp;&nbsp;|&nbsp;&nbsp;
          <p className="d-inline text-muted">{this.state.data.name}</p>

          <div className="btn-group float-right ml-4" role="group">
            <PrevBtn id={this.state.id} ids={this.state.ids}/>
            <NextBtn id={this.state.id} ids={this.state.ids}/>
          </div>
          <div className="btn-group float-right ml-4" role="group">
            <button onClick={() => {
              this.props.history.push('/sales/customer');
            }} type="button" className="btn btn-light">返回
            </button>
          </div>
        </h5>

        <div id="main" className="main p-3">
          <div className="row justify-content-md-center mb-2">
            <div className="col col-12">
              <div className="card border-top-0">
                <div className="card-body">
                  <p className="ht pb-3 b-b">合同信息</p>
                  <table className="table table-bordered table-sm table-responsive">
                    <thead>
                    <tr>
                      <th>序号</th>
                      <th>创建人</th>
                      <th>创建时间</th>
                      <th>所属组织</th>
                      <th>所属用户</th>
                      <th>合同类型</th>
                      <th>合同编号</th>
                      <th>签约时间</th>
                      <th>到期时间</th>
                      <th>学员姓名</th>
                      <th>家长姓名</th>
                      <th>联系电话</th>
                      <th>课程类别</th>
                      <th>课程</th>
                      <th>合同金额</th>
                      <th>折扣金额</th>
                      <th>应付金额</th>
                      <th>已付金额</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                      this.state.contractList.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item.creatorName}</td>
                          <td>{fmtDate(item.createTime)}</td>
                          <td>{item.orgName}</td>
                          <td>{item.executiveName}</td>
                          <td>{CONFIG.TYPE_ID[item.type]}</td>
                          <td>{item.code}</td>
                          <td>{fmtDate(item.startDate)}</td>
                          <td>{fmtDate(item.endDate)}</td>
                          <td>{item.stuName}</td>
                          <td>{item.parName}</td>
                          <td>{item.parCellphone}</td>
                          <td>{item.courseType}</td>
                          <td>{item.courseName}</td>
                          <td>{item.oriPrice}</td>
                          <td>{item.discPrice}</td>
                          <td>{item.finalPrice}</td>
                          <td>{item.paid}</td>
                        </tr>
                      ))
                    }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to={`/sales/customer/student/${this.state.id}`}>学员信息</Link></li>
              <li className="breadcrumb-item">
                <Link to={{
                  pathname: `/sales/customer/parent/${this.state.id}`,
                  state: {stuName: this.state.data.name}
                }}>家长信息</Link>
              </li>
              <li className="breadcrumb-item active">合同信息</li>
            </ol>
          </nav>
        </div>
      </div>
    )
  }
}

export default ContractView;