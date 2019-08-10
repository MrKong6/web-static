import React from 'react'
import ReactDOM from 'react-dom'

import DialogDate from '../../Dialog/DialogDate';
import DialogAct from "../../Dialog/DialogAct"

import fmtDate from '../../../utils/fmtDate'

class Form extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      group: this.props.changedCrmGroup,
      parentId: 'root',
      parentName: '作为一级活动',
      startDate: undefined,
      endDate: undefined
    };
    this.createActDialog = this.createActDialog.bind(this);
    this.acceptActDialog = this.acceptActDialog.bind(this);
    this.createDateDialog = this.createDateDialog.bind(this);
    this.acceptDateDialog = this.acceptDateDialog.bind(this);
    this.getFormValue = this.getFormValue.bind(this);
  }

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.data && nextProps.data) {
      this.setState({
        parentId: nextProps.data.parentId,
        parentName: nextProps.data.parentName,
        startDate: new Date(nextProps.data.startDate),
        endDate: new Date(nextProps.data.endDate)
      }, () => {
        this.form.name.value = nextProps.data.name;
        this.form.budget.value = nextProps.data.budget;
        this.form.cost.value = nextProps.data.cost;
      });
    }
  }

  componentWillUnmount() {
    if (this.tipsContainer) {
      document.body.removeChild(this.tipsContainer);
    }

    if (this.actContainer) {
      document.body.removeChild(this.actContainer);
    }
  }

  createActDialog() {
    if (this.act === undefined) {
      this.actContainer = document.createElement('div');
      ReactDOM.render(
        <DialogAct
          accept={this.acceptActDialog}
          changedCrmGroup={this.state.group}
          defaults={this.state.parentId}
          replace={this.props.replace}
          from={this.props.from}
          ref={(dom) => {
            this.act = dom
          }}
        />,
        document.body.appendChild(this.actContainer)
      );
    }

    this.act.dialog.modal('show');
  }

  acceptActDialog(selected) {
    this.setState({
      parentId: selected.id,
      parentName: selected.name,
      startDate: null,
      endDate: null
    })
  }

  createDateDialog() {
    if (this.date === undefined) {
      this.dateContainer = document.createElement('div');
      ReactDOM.render(
        <DialogDate
          accept={this.acceptDateDialog}
          defaults={{
            from: this.state.startDate,
            to: this.state.endDate
          }}
          ref={(dom) => {
            this.date = dom
          }}
        />,
        document.body.appendChild(this.dateContainer)
      );
    }

    this.date.dialog.modal('show');
  }

  acceptDateDialog({from, to}) {
    this.setState({
      startDate: from,
      endDate: to
    })
  }

  getFormValue() {
    if (!this.form.checkValidity() || (!this.state.startDate && !this.state.endDate)) {
      return
    }

    let query = {};

    if (this.state.parentId !== 'root') {
      query.parentId = this.state.parentId;
    }

    query.startDate = this.state.startDate;
    query.endDate = this.state.endDate;

    for (let i = 0; i < this.form.length; i++) {
      if (this.form[i].tagName !== 'BUTTON' && !this.form[i].readOnly) {
        query[this.form[i].name] = this.form[i].value;
      }
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
                    <label htmlFor="name"><em className="text-danger">*</em>活动名称</label>
                    <input type="text" className="form-control" name="name" required={true}/>
                  </div>
                  <div className="form-group">
                    <label htmlFor="name"><em className="text-danger">*</em>父级市场活动</label>
                    <div className="input-group">
                      <input type="text" className="form-control" value={this.state.parentName} readOnly={true}/>
                      <span className="input-group-btn">
                        <button onClick={this.createActDialog} className="btn btn-secondary" type="button">
                          <i className="fa fa-pencil-square-o fa-lg" aria-hidden="true"/>
                        </button>
                      </span>
                    </div>
                  </div>
                  <div data-toggle="datepicker" className="form-group">
                    <label htmlFor="startDate"><em className="text-danger">*</em>时间范围</label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        value={this.state.startDate ? `${fmtDate(this.state.startDate)} 至 ${fmtDate(this.state.endDate)}` : ''}
                        readOnly={true}
                      />
                      <span className="input-group-btn">
                        <button onClick={this.createDateDialog} className="btn btn-secondary" type="button">
                          <i className="fa fa-calendar-o fa-lg" aria-hidden="true"/>
                        </button>
                      </span>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="budget">预算费用</label>
                    <input type="text" className="form-control" name="budget"/>
                  </div>
                  <div className="form-group">
                    <label htmlFor="cost">实际费用</label>
                    <input type="text" className="form-control" name="cost"/>
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