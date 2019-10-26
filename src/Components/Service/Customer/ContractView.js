import React from 'react'
import ReactDOM from "react-dom";
import {Link, Redirect} from 'react-router-dom'

import DialogTips from "../../Dialog/DialogTips";
import fmtTitle from "../../../utils/fmtTitle";
import ajax from "../../../utils/ajax";
import mainSize from "../../../utils/mainSize";
import fmtDate from "../../../utils/fmtDate";
import CONFIG from "../../../utils/config";
import List from "../Contract/List";
import {Button, Table, Tooltip} from "element-react";

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
      isEmpty: false,
      columns: [
            {
                // label: "序号",
                width: 100,
                sortable: true,
                type: 'index'
            },
            {
                label: "创建人",
                prop: "creatorName",
                width: 100,
                sortable: true
            },
            {
                label: "创建时间",
                prop: "createTime",
                width: 120,
                sortable: true
            },
            {
                label: "所属组织",
                prop: "orgName",
                width: 175,
                showOverflowTooltip: true,
            },
            {
                label: "所属用户",
                prop: "executiveName",
                width: 95
            },
            {
                label: "合同类型",
                prop: "typeId",
                width: 100
            },
            {
                label: "合同编号",
                prop: "code",
                width: 130,
            },
            {
                label: "签约时间",
                prop: "startDate",
                width: 120
            },
            {
                label: "到期时间",
                prop: "endDate",
                width: 120
            },
            {
                label: "学员姓名",
                prop: "stuName",
                width: 95,
            },
            {
                label: "家长姓名",
                prop: "parName",
                width: 95,
            },
            {
                label: "联系电话",
                prop: "parCellphone",
                width: 150,
                className: 'tabletd',
                render: function (data) {
                    return <Tooltip effect="dark" content={data.parCellphone}
                                    placement="top-start">
                        {data.parCellphone}
                    </Tooltip>
                }

            },
            {
                label: "课程类别",
                prop: "courseType",
                width: 95
            },
            {
                label: "课程",
                prop: "courseName",
                width: 95,
                className: 'tabletd',
                render: function (data) {

                    return <Tooltip effect="dark" content={data.courseName}
                                    placement="top-start">
                        {data.courseName}
                    </Tooltip>
                }
            },
            {
                label: "合同金额",
                prop: "contractPrice",
                width: 100
            },
            {
                label: "折扣金额",
                prop: "countPrice",
                width: 100,
                sortable: true
            },
            {
                label: "应付金额",
                prop: "finalPrice",
                width: 95
            },
            {
                label: "已付金额",
                prop: "paid",
                width: 120
            }
      ],
    };
    this.createDialogTips = this.createDialogTips.bind(this);
    this.goToDetails = this.goToDetails.bind(this);
  }

  componentDidMount() {
    const request = async () => {
      try {
        let list = await ajax('/service/customer/student/list.do', {orgId: this.state.group.id});
        let contractList = await ajax('/service/contract/queryListByStudentId.do', {id: this.state.id});
        const ids = list.data.map((student) => (student.id));
        const isEmpty = !contractList.length;

        contractList.map(item => {
            if(item.createTime != null){
                item.createTime = fmtDate(item.createTime);
            }
            if(item.startDate != null){
                item.startDate = fmtDate(item.startDate);
            }
            if(item.endDate != null){
                item.endDate = fmtDate(item.endDate);
            }
            if(item.typeId != null){
                item.typeId = CONFIG.TYPE_ID[item.typeId];
            }
        });

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

  goToDetails(evt) {
      const url = `${this.props.match.url}/${evt}`;

      this.props.history.push(url);
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
                    <Table
                        style={{width: '100%'}}
                        columns={this.state.columns}
                        data={this.state.contractList}
                        border={true}
                        fit={true}
                        emptyText={"--"}
                    />
                </div>
              </div>
            </div>
          </div>

          <nav aria-label="breadcrumb">
            <ol className="breadcrumb location_bottom">
              <li className="breadcrumb-item"><Link to={`/home/service/customer/student/${this.state.id}`}>学员信息</Link></li>
              <li className="breadcrumb-item">
                <Link to={{
                  pathname: `/home/service/customer/parent/${this.state.id}`,
                  state: {stuName: this.state.data.name}
                }}>家长信息</Link>
              </li>
              <li className="breadcrumb-item active">合同信息</li>
              <li className="breadcrumb-item">
                  <Link to={{
                      pathname: `/home/service/customer/account/${this.state.id}`,
                      state: {stuName: this.state.data.name}
                  }}>账户信息</Link>
              </li>
            </ol>
          </nav>
        </div>
      </div>
    )
  }
}

export default ContractView;