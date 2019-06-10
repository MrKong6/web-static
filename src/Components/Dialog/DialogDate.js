import React from 'react'

import DayPicker, {DateUtils} from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import isPhone from '../../utils/isPhone';
import {$} from "../../vendor";

class DialogDate extends React.Component {
  constructor(props) {
    super(props);

    this.dialogId = `d-${new Date().getTime()}`;
    this.state = {
      from: this.props.defaults.from,
      to: this.props.defaults.to,
    };
    this.handleDayClick = this.handleDayClick.bind(this);
    this.accept = this.accept.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  componentDidMount() {
    this.dialog = $(`#${this.dialogId}`);
  }

  handleDayClick(day) {
    const range = DateUtils.addDayToRange(day, this.state);
    this.setState(range);
  }

  accept() {
    if (this.state.from === undefined || this.state.to === undefined) {
      return;
    }

    this.props.accept(this.state);
    this.dialog.modal('hide');
  }

  cancel() {
    this.dialog.modal('hide');
  }

  render() {
    const {from, to} = this.state;
    const modifiers = {start: from, end: to};
    const modalWidth = isPhone() ? 'auto' : '580px';
    const style = {width: modalWidth};

    return (
      <div id={this.dialogId} className="modal fade" tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content" style={style}>
            <div className="modal-body">
              <DayPicker
                className="Selectable"
                numberOfMonths="2"
                selectedDays={[from, {from, to}]}
                modifiers={modifiers}
                onDayClick={this.handleDayClick}
              />
            </div>
            <div className="modal-footer">
              <button onClick={this.cancel} type="button" className="btn btn-secondary" data-dismiss="modal">取消</button>
              <button onClick={this.accept} type="button" className="btn btn-primary">确认</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default DialogDate;