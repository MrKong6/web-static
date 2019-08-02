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
        pathname: `/home/service/customer/contract/${ids[curIndex + 1]}`,
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
        pathname: `/home/service/customer/contract/${ids[curIndex - 1]}`,
        state: {ids: ids}
      }}
    >
      上一条
    </Link>
  )
};

class AccountView extends React.Component {
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
        let list = await ajax('/service/customer/student/list.do', {orgId: this.state.group.id});
        let contractList = await ajax('/service/contract/queryListByStudentId.do', {id: this.state.id});
        const ids = list.data.map((student) => (student.id));
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
        <Redirect to="/home/service/customer"/>
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
                this.props.history.push('/home/service/customer');
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
          <p className="d-inline text-muted">{this.state.data.name}</p>

          <div className="btn-group float-right ml-4" role="group">
            <PrevBtn id={this.state.id} ids={this.state.ids}/>
            <NextBtn id={this.state.id} ids={this.state.ids}/>
          </div>
          <div className="btn-group float-right ml-4" role="group">
            <button onClick={() => {
              this.props.history.push('/home/service/customer');
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
                  <table className="table table-bordered table-sm noBorder tableWidth">
                    <thead>
                    <tr>
                      <th>项目</th>
                      <th>序号</th>

                      <th>日期</th>
                      <th>摘要</th>
                      <th>收入</th>
                      <th>支出</th>
                      <th>余额</th>
                    </tr>
                    </thead>
                    <tbody>
                      <tr>
                          <td style={{"border":0}}>初始建账主账户</td>
                          <td style={{"border":0}}>1</td>
                          <td style={{"border":0}}>2019/01/26</td>
                          <td style={{"border":0}}>结转定金</td>
                          <td style={{"border":0}}>¥0.00</td>
                          <td style={{"border":0}}></td>
                          <td style={{"border":0}}>¥0.00</td>
                      </tr>
                      <tr>
                          <td style={{"border":0}}></td>
                          <td style={{"border":0}}>2</td>
                          <td style={{"border":0}}>2019/01/26</td>
                          <td style={{"border":0}}>结转定金</td>
                          <td style={{"border":0}}>¥0.00</td>
                          <td style={{"border":0}}></td>
                          <td style={{"border":0}}>¥0.00</td>
                      </tr>
                      <tr>
                          <td style={{"border":0}}></td>
                          <td style={{"border":0}}>2</td>
                          <td style={{"border":0}}>2019/01/26</td>
                          <td style={{"border":0}}>结转定金</td>
                          <td style={{"border":0}}>¥0.00</td>
                          <td style={{"border":0}}></td>
                          <td style={{"border":0}}>¥0.00</td>
                      </tr>
                      <tr>
                          <td style={{"border":0}}></td>
                          <td style={{"border":0}}>2</td>
                          <td style={{"border":0}}>2019/01/26</td>
                          <td style={{"border":0}}>结转定金</td>
                          <td style={{"border":0}}>¥0.00</td>
                          <td style={{"border":0}}></td>
                          <td style={{"border":0}}>¥0.00</td>
                      </tr>
                      <tr style={{"border-top": "1px solid black","border-bottom": "1px solid black"}}>
                          <td style={{"border":0}}></td>
                          <td style={{"border":0}}></td>
                          <td style={{"border":0}}></td>
                          <td style={{"border":0}}></td>
                          <td style={{"border":0}}></td>
                          <td style={{"border":0}}>¥0.00</td>
                          <td style={{"border":0}}>¥0.00</td>
                      </tr>
                      <tr>
                          <td style={{"border":0,"border-top": "hidden"}}>课时消耗子账户</td>
                          <td style={{"border":0,"border-left":"1px solid black"}}>0</td>
                          <td style={{"border":0}}></td>
                          <td style={{"border":0}}>课时费</td>
                          <td style={{"border":0}}>¥6210.00</td>
                          <td style={{"border":0}}></td>
                          <td style={{"border":0,"border-right":"1px solid black"}}>¥0.00</td>
                      </tr>
                      <tr>
                          <td style={{"border":0}}></td>
                          <td style={{"border":0,"border-left":"1px solid black"}}>1</td>
                          <td style={{"border":0}}></td>
                          <td style={{"border":0}}></td>
                          <td style={{"border":0}}></td>
                          <td style={{"border":0}}></td>
                          <td style={{"border":0,"border-right":"1px solid black"}}>¥0.00</td>
                      </tr>
                      <tr>
                          <td style={{"border":0}}></td>
                          <td style={{"border":0,"border-left":"1px solid black"}}>2</td>
                          <td style={{"border":0}}></td>
                          <td style={{"border":0}}></td>
                          <td style={{"border":0}}></td>
                          <td style={{"border":0}}></td>
                          <td style={{"border":0,"border-right":"1px solid black"}}>¥0.00</td>
                      </tr>
                      <tr>
                          <td style={{"border":0}}></td>
                          <td style={{"border":0,"border-left":"1px solid black"}}>3</td>
                          <td style={{"border":0}}></td>
                          <td style={{"border":0}}></td>
                          <td style={{"border":0}}></td>
                          <td style={{"border":0}}></td>
                          <td style={{"border":0,"border-right":"1px solid black"}}>¥0.00</td>
                      </tr>
                      <tr style={{"border-bottom": "1px solid black","border-bottom": "1px solid black"}}>
                          <td style={{"border":0,"border-bottom": "hidden"}}></td>
                          <td style={{"border":0,"border-left":"1px solid black"}}>4</td>
                          <td style={{"border":0}}></td>
                          <td style={{"border":0}}></td>
                          <td style={{"border":0}}></td>
                          <td style={{"border":0}}></td>
                          <td style={{"border":0,"border-right":"1px solid black"}}>¥0.00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to={`/home/service/customer/student/${this.state.id}`}>学员信息</Link></li>
              <li className="breadcrumb-item">
                <Link to={{
                  pathname: `/home/service/customer/parent/${this.state.id}`,
                  state: {stuName: this.state.data.name}
                }}>家长信息</Link>
              </li>
              <li className="breadcrumb-item">
                  <Link to={{
                      pathname: `/home/service/customer/contract/${this.state.id}`,
                      state: {stuName: this.state.data.name}
                  }}>合同信息</Link>
              </li>
              <li className="breadcrumb-item">
                  账户信息
              </li>
            </ol>
          </nav>
        </div>
      </div>
    )
  }
}

export default AccountView;