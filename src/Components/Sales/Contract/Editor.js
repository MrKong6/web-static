import React from "react";
import ReactDOM from "react-dom";
import {Redirect} from 'react-router-dom'

import Form from "./Form";
import DialogTips from "../../Dialog/DialogTips";
import Progress from "../../Progress/Progress"

import historyBack from "../../../utils/historyBack";
import mainSize from "../../../utils/mainSize";
import ajax from "../../../utils/ajax";
import fmtTitle from "../../../utils/fmtTitle";

class Editor extends React.Component {
  constructor(props) {
    super(props);

    this.title = fmtTitle(this.props.location.pathname);
    this.ids = this.props.location.state.ids;
    this.state = {
      group: this.props.changedCrmGroup,
      redirectToReferrer: false,
      redirectToList: false,
      isAnimating: false,
      isUpdated: false,
      id: this.props.match.params.contractId,
    };
    this.createDialogTips = this.createDialogTips.bind(this);
    this.updated = this.updated.bind(this);
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

  updated() {
    let query = this.form.getFormValue();

    if (!query) {
      return;
    }

    this.setState({isAnimating: true});
    query.organizationId = this.state.group.id;
    query.id = this.state.id;

    const request = async () => {
      try {
        await ajax('/sales/contract/mod.do', query);
        this.setState({isUpdated: true})
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
        <Redirect to="/sales/contract"/>
      )
    }

    if (this.state.isUpdated) {
      return (
        <Redirect to={{
          pathname: `/sales/contract/${this.state.id}`,
          state: {ids: this.ids}
        }}/>
      )
    }

    return (
      <div>
        <h5 id="subNav">
          <i className={`fa ${this.title.icon}`} aria-hidden="true"/>
          &nbsp;{this.title.text}&nbsp;&nbsp;|&nbsp;&nbsp;
          <p className="d-inline text-muted">{this.title.text}编辑</p>
          <div className="btn-group float-right" role="group">
            <button onClick={() => {
              historyBack(this.props.history)
            }} type="button" className="btn btn-light">取消
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              onClick={this.updated}
              disabled={this.state.isAnimating}
            >
              保存
            </button>
          </div>
        </h5>

        <div id="main" className="main p-3">
          <Progress isAnimating={this.state.isAnimating}/>

          <Form
            isEditor={true}
            editorId={this.state.id}
            changedCrmGroup={this.state.group}
            ref={(dom) => {
              this.form = dom
            }}
          />
        </div>
      </div>
    )
  }
}

export default Editor;
