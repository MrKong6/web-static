import React from "react";
import {$} from '../../vendor';

class DialogTips extends React.Component {
  constructor(props) {
    super(props)

    this.dialogId = `d-${new Date().getTime()}`;
    this.state = {text: this.props.text};
    this.setText = this.setText.bind(this);
    this.accept = this.accept.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  componentDidMount() {
    this.dialog = $(`#${this.dialogId}`);
  }

  setText(text) {
    console.log(text)
    this.setState({text: text});
  }

  cancel() {
    this.dialog.modal('hide')
  }

  accept() {
    if (this.props.accept) {
      this.props.accept();
    }

    this.dialog.modal('hide')
  }

  render() {
    return (
      <div id={this.dialogId} className="modal fade" tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{this.props.title}</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <p>{this.state.text}</p>
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

export default DialogTips;