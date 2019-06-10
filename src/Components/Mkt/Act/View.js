import React from 'react'
import ReactDOM from "react-dom";
import {Link, Redirect} from 'react-router-dom'

import DialogTips from "../../Dialog/DialogTips";
import Progress from "../../Progress/Progress"
import Commands from "../../Commands/Commands";

import fmtTitle from "../../../utils/fmtTitle";
import ajax from "../../../utils/ajax";
import mainSize from "../../../utils/mainSize";
import fmtDate from "../../../utils/fmtDate";

const NextBtn = ({id, ids}) => {
  const curIndex = ids.indexOf(id);

  if ((curIndex + 1) === ids.length) {
    return <button type="button" className="btn btn-light" disabled={true}>下一条</button>
  }

  return (
    <Link
      className="btn btn-light"
      to={{
        pathname: `/mkt/act/${ids[curIndex + 1]}`,
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
        pathname: `/mkt/act/${ids[curIndex - 1]}`,
        state: {ids: ids}
      }}
    >
      上一条
    </Link>
  )
};

const chartInit = (data) => {
  const config = {
    tooltip: {
      trigger: 'item',
      formatter: "{a} <br/>{b} : {c}"
    },
    series: [
      {
        type: 'funnel',
        top: 0,
        left: 0,
        width: '100%',
        label: {
          normal: {
            position: 'inside',
            formatter: '{c}',
            textStyle: {
              color: '#fff'
            }
          },
          emphasis: {
            position: 'inside',
            formatter: '{c}'
          }
        },
        itemStyle: {
          normal: {
            opacity: 0.5,
            borderColor: '#fff',
            borderWidth: 2
          }
        },
        data: [
          {value: data.contracts, name: '签约客户量'},
          {value: data.leads, name: '转化机会量'},
          {value: data.opportunities, name: '获取线索量'}
        ]
      }
    ]
  };

  require.ensure(["echarts"], (require) => {
    const echarts = require('echarts');
    const myChart = echarts.init(document.getElementById('chart'));

    myChart.setOption(config);
  }, 'echarts')
};

class View extends React.Component {
  constructor(props) {
    super(props);

    this.commands = this.props.commands.filter(command => (command.name !== 'Add'));
    this.ids = this.props.location.state.ids;
    this.title = fmtTitle(this.props.location.pathname);
    this.state = {
      group: this.props.changedCrmGroup,
      redirectToReferrer: false,
      redirectToList: false,
      isAnimating: true,
      id: this.props.match.params.actId
    };
    this.createDialogTips = this.createDialogTips.bind(this);
    this.modAction = this.modAction.bind(this);
    this.delAction = this.delAction.bind(this);
  }

  componentDidMount() {
    const request = async () => {
      try {
        let data = await ajax('/mkt/activity/query.do', {id: this.state.id});

        this.setState({
          name: data.name,
          parentName: data.id === data.parentId ? '一级活动' : data.parentName,
          dateScope: fmtDate(data.startDate) + ' - ' + fmtDate(data.endDate),
          budget: data.budget,
          cost: data.cost,
          creatorName: data.creatorName,
          createTime: fmtDate(data.createTime),
          totalAmount: data.totalAmount,
          roi: data.roi
        });

        chartInit({
          contracts: data.contracts,
          leads: data.leads,
          opportunities: data.opportunities
        })
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
        await ajax('/mkt/activity/del.do', {id: this.state.id});
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
        <Redirect to="/mkt/act"/>
      )
    }

    return (
      <div>
        <h5 id="subNav">
          <i className={`fa ${this.title.icon}`} aria-hidden="true"/>
          &nbsp;{this.title.text}&nbsp;&nbsp;|&nbsp;&nbsp;
          <p className="d-inline text-muted">{this.state.name ? this.state.name : ''}</p>

          <div className="btn-group float-right ml-4" role="group">
            <PrevBtn id={this.state.id} ids={this.ids}/>
            <NextBtn id={this.state.id} ids={this.ids}/>
          </div>
          <div className="btn-group float-right ml-4" role="group">
            <button onClick={() => {
              this.props.history.push('/mkt/act');
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
            <div className="col col-md-8">
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    <div className="col-12 col-lg-6">
                      <dl>
                        <dt>活动名称</dt>
                        <dd className="b-l">{this.state.name ? this.state.name : '--'}</dd>

                        <dt>父级市场活动</dt>
                        <dd className="b-l">{this.state.parentName ? this.state.parentName : '--'}</dd>

                        <dt>时间周期</dt>
                        <dd className="b-l">{this.state.dateScope ? this.state.dateScope : '--'}</dd>

                        <dt>预算费用</dt>
                        <dd className="b-l">{this.state.budget ? this.state.budget : 0}</dd>

                        <dt>实际费用</dt>
                        <dd className="b-l">{this.state.cost ? this.state.cost : 0}</dd>

                        <dt>创建人</dt>
                        <dd className="b-l">{this.state.creatorName ? this.state.creatorName : '--'}</dd>

                        <dt>创建时间</dt>
                        <dd className="b-l">{this.state.createTime ? this.state.createTime : '--'}</dd>
                      </dl>
                    </div>
                    <div className="col-12 col-lg-6">
                      <div className='h6 pb-3 mb-0'>
                        <p className="mb-2">签约客户金额: {this.state.totalAmount ? this.state.totalAmount : 0}</p>
                        <p>投资回报率（ROI）: {this.state.roi ? this.state.roi : 0}</p>
                      </div>
                      <div id="chart" style={{height: '300px'}}/>
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