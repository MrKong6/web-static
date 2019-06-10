import React from 'react'
import ReactDOM from "react-dom";
import {Redirect} from 'react-router-dom'

import Form from "./Form";
import DialogTips from "../../Dialog/DialogTips";
import Progress from "../../Progress/Progress"

import mainSize from "../../../utils/mainSize";
import historyBack from "../../../utils/historyBack";
import fmtTitle from '../../../utils/fmtTitle';
import ajax from "../../../utils/ajax";

class Create extends React.Component {
  constructor(props) {
    super(props);

    this.title = fmtTitle(this.props.location.pathname);
    this.ids = this.props.location.state.ids;
    this.state = {
      group: this.props.changedCrmGroup,
      redirectToReferrer: false,
      redirectToList: false,
      isAnimating: false,
      isCreated: false,
      createdId: null
    };
    this.createDialogTips = this.createDialogTips.bind(this);
    this.create = this.create.bind(this);
  }

  componentDidMount() {
    mainSize();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.changedCrmGroup.id !== nextProps.changedCrmGroup.id) {
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

  create() {
    const query = this.form.getFormValue();

    if (!query) {
      return;
    }

    query.organizationId = this.state.group.id;

    this.setState({isAnimating: true});

    const request = async () => {
      try {
        let rs = await ajax('/mkt/leads/add.do', query);

        this.setState({isCreated: true, createdId: rs})
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

    if (this.state.redirectToList) {
      return (
        <Redirect to="/mkt/leads"/>
      )
    }

    if (this.state.isCreated) {
      let ids = this.ids;

      ids.push(this.state.createdId);

      return (
        <Redirect to={{
          pathname: `/mkt/leads/${this.state.createdId}`,
          state: {ids: ids}
        }}/>
      )
    }

    return (
      <div>
        <h5 id="subNav">
          <i className={`fa ${this.title.icon}`} aria-hidden="true"/>
          &nbsp;{this.title.text}&nbsp;&nbsp;|&nbsp;&nbsp;
          <p className="d-inline text-muted">{this.title.text}创建</p>
          <div className="btn-group float-right" role="group">
            <button onClick={() => {
              historyBack(this.props.history)
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
            changedCrmGroup={this.state.group}
            replace={this.props.history.replace}
            from={this.props.location}
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