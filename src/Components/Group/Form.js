import React from 'react'
import ReactDOM from 'react-dom'

import DialogGroup from "../Dialog/DialogGroup"
import Area from "../Area/Area";

class Form extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      parentId: (!this.props.isEditor && this.props.parentGroup) ? this.props.parentGroup.id : "",
      parentName: (!this.props.isEditor && this.props.parentGroup) ? this.props.parentGroup.name : "",
      areaCodeArray: [],
      areaTextArray: []
    };

    this.createGroupsDialog = this.createGroupsDialog.bind(this);
    this.acceptGroupDialog = this.acceptGroupDialog.bind(this);
    this.getFormValue = this.getFormValue.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data) {
      const areaCodeArray = [];
      const areaTextArray = [];

      areaCodeArray.push(nextProps.data.cStateCode);
      areaCodeArray.push(nextProps.data.cCityCode);
      areaTextArray.push(nextProps.data.cState);
      areaTextArray.push(nextProps.data.cCity);

      this.setState({
        parentId: nextProps.data.parentOrg.cId,
        parentName: nextProps.data.parentOrg.cName,
        areaCodeArray: areaCodeArray,
        areaTextArray: areaTextArray
      }, () => {
        this.form.name.value = nextProps.data.cName;
        this.form.code.value = nextProps.data.cCode;
        this.form.address.value = nextProps.data.cAddress;
        this.form.owner.value = nextProps.data.cOwner;
        this.form.phone.value = nextProps.data.cOwnerPhone;
      })
    }
  }

  componentWillUnmount() {
    if (this.groupContainer) {
      document.body.removeChild(this.groupContainer);
    }
  }

  createGroupsDialog() {
    if (this.group === undefined) {
      this.groupContainer = document.createElement('div');

      ReactDOM.render(
        <DialogGroup
          accept={this.acceptGroupDialog}
          defaults={this.state.parentId}
          replace={this.props.replace}
          from={this.props.from}
          ref={(dom) => {
            this.group = dom
          }}
        />,
        document.body.appendChild(this.groupContainer)
      );
    }

    this.group.dialog.modal('show');
  }

  acceptGroupDialog(selected) {
    this.setState({
      parentId: selected.id,
      parentName: selected.name
    })
  }

  getFormValue() {
    if (!this.form.checkValidity() || !this.state.parentId || !this.area.getArea().areaCodeArray.length) {
      return
    }

    let query = {};

    for (let i = 0; i < this.form.length; i++) {
      if (this.form[i].tagName !== 'BUTTON' && !this.form[i].readOnly) {
        query[this.form[i].name] = this.form[i].value;
      }
    }

    query.parentId = this.state.parentId;
    query.state = this.area.getArea().areaTextArray[0];
    query.city = this.area.getArea().areaTextArray[1];
    query.county = this.area.getArea().areaTextArray[2] || "";

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
                    <label htmlFor="name"><em className="text-danger">*</em>组织名称</label>
                    <input type="text" className="form-control" name="name" required={true}/>
                  </div>
                  <div className="form-group">
                    <label htmlFor="name"><em className="text-danger">*</em>组织代码</label>
                    <input type="text" className="form-control" name="code" required={true}/>
                  </div>
                  <div className="form-group">
                    <label htmlFor="name"><em className="text-danger">*</em>父级组织</label>
                    <div className="input-group">
                      <input type="text" className="form-control" value={this.state.parentName} readOnly={true}/>
                      <span className="input-group-btn">
                        <button onClick={this.createGroupsDialog} className="btn btn-secondary" type="button">
                          <i className="fa fa-pencil-square-o fa-lg" aria-hidden="true"/>
                        </button>
                      </span>
                    </div>
                  </div>
                  <div className="form-group">
                    <label><em className="text-danger">*</em>所在地区</label>
                    <Area
                      ref={(dom) => {
                        this.area = dom
                      }}
                      defaults={this.state.areaCodeArray}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="address"><em className="text-danger">*</em>详细地址</label>
                    <textarea name="address" className="form-control" rows="3" required={true}/>
                  </div>
                  <div className="form-group">
                    <label htmlFor="owner"><em className="text-danger">*</em>负责人</label>
                    <input type="text" className="form-control" name="owner" required={true}/>
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone"><em className="text-danger">*</em>联系电话</label>
                    <input type="text" className="form-control" name="phone" pattern="^1\d{10}$" required={true}/>
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