import React from 'react'
import ReactDOM from 'react-dom'

import ContactList from "../../Contact/List";
import DialogTips from "../../Dialog/DialogTips";
import DialogAct from "../../Dialog/DialogAct"
import Source from '../../Dic/Source';
import Stages from '../../Dic/Stages';
import Status from '../../Dic/Status';
import Gender from '../../Dic/Gender';
import Relation from '../../Dic/Relation';
import Grade from '../../Dic/Grade';
import CourseType from '../../Dic/CourseType';
import CourseName from '../../Dic/CourseName';

import ajax from "../../../utils/ajax";

class Form extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      group: this.props.changedCrmGroup,
      channelId: null,
      channelText: null,
      option: null,
      data: null
    };
    this.createDialogTips = this.createDialogTips.bind(this);
    this.createActDialog = this.createActDialog.bind(this);
    this.acceptActDialog = this.acceptActDialog.bind(this);
    this.getFormValue = this.getFormValue.bind(this);
  }

  componentDidMount() {
    const request = async () => {
      try {
        let status = await ajax('/mkt/leads/status/list.do', {typeId: 1});
        let stage = await ajax('/mkt/leads/stage/list.do', {typeId: 1});
        let source = await ajax('/mkt/leads/source/list.do', {typeId: 1});
        let relation = await ajax('/mkt/relation/list.do');
        let gender = await ajax('/mkt/gender/list.do');
        let data = null;

        if (this.props.isEditor) {
          data = await ajax('/mkt/leads/query.do', {id: this.props.editorId});
        }

        this.setState({
          option: {status, stage, source, relation, gender},
          data: data
        }, () => {
          if (this.props.isEditor) {
            this.form.studentName.value = this.state.data.student.name;
            this.form.studentGenderId.value = this.state.data.student.genderId;
            this.form.age.value = this.state.data.student.age;
            this.form.classGrade.value = this.state.data.student.classGrade;
            this.form.schoolName.value = this.state.data.student.schoolName;
            this.form.parentName.value = this.state.data.parent.name;
            this.form.relation.value = this.state.data.parent.relation;
            this.form.cellphone.value = this.state.data.parent.cellphone;
            this.form.wechat.value = this.state.data.parent.wechat;
            this.form.address.value = this.state.data.parent.address;
            this.form.courseId.value = this.state.data.courseId ? this.state.data.courseId : '';
            this.form.courseName.value = this.state.data.courseName ? this.state.data.courseName : '';
            this.form.note.value = this.state.data.note;
            this.form.sourceId.value = this.state.data.sourceId;
            this.form.stageId.value = this.state.data.stageId;
            this.form.statusId.value = this.state.data.statusId;

            this.setState({
              channelId: this.state.data.channelId,
              channelText: this.state.data.channelName
            })
          }
        });
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

  componentWillUnmount() {
    if (this.tipsContainer) {
      document.body.removeChild(this.tipsContainer);
    }

    if (this.actContainer) {
      document.body.removeChild(this.actContainer);
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

  createActDialog() {
    if (this.act === undefined) {
      this.actContainer = document.createElement('div');
      ReactDOM.render(
        <DialogAct
          accept={this.acceptActDialog}
          changedCrmGroup={this.state.group}
          notRoot={true}
          defaults={this.state.channelId}
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
      channelId: selected.id,
      channelText: selected.name,
    })
  }

  getFormValue() {
    if (!this.form.checkValidity() || !this.state.channelId) {
      return
    }

    let query = {};

    query.channelId = this.state.channelId;

    for (let i = 0; i < this.form.length; i++) {
      if (this.form[i].tagName !== 'BUTTON' && !this.form[i].readOnly) {
        query[this.form[i].name] = this.form[i].value;
      }
    }

    return query;
  }

  render() {
    if (!this.state.option || (this.props.isEditor && !this.state.data)) {
      return (
        <form ref={(dom) => {
          this.form = dom
        }}>
          <div className="row justify-content-md-center">
            <div className="col col-12">
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
            <div className="col col-12">
              <div className="card">
                <div className="card-body">
                  <p className="ht pb-3 b-b">线索信息</p>
                  <div className="row">
                    <div className="col">
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">
                          <em className="text-danger">*</em>学员姓名
                        </label>
                        <div className="col-7">
                          <input type="text" className="form-control" name="studentName" required={true}/>
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">学员姓别</label>
                        <div className="col-7">
                          <Gender data={this.state.option.gender}/>
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">
                          <em className="text-danger">*</em>学员年龄
                        </label>
                        <div className="col-7">
                          <input type="text" className="form-control" name="age" required={true}/>
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">在读年级</label>
                        <div className="col-7">
                          <Grade/>
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">所在学校</label>
                        <div className="col-7">
                          <input type="text" className="form-control" name="schoolName"/>
                        </div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">
                          <em className="text-danger">*</em>家长姓名
                        </label>
                        <div className="col-7">
                          <input type="text" className="form-control" name="parentName" required={true}/>
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">
                          <em className="text-danger">*</em>与孩子关系
                        </label>
                        <div className="col-7">
                          <Relation data={this.state.option.relation}/>
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">
                          <em className="text-danger">*</em>联系电话
                        </label>
                        <div className="col-7">
                          <input type="text" className="form-control" name="cellphone" required={true}/>
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">微信号</label>
                        <div className="col-7">
                          <input type="text" className="form-control" name="wechat"/>
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">家庭住址</label>
                        <div className="col-7">
                          <input type="text" className="form-control" name="address"/>
                        </div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">课程类别</label>
                        <div className="col-7">
                          <CourseType/>
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">课程产品</label>
                        <div className="col-7">
                          <CourseName/>
                        </div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">备注</label>
                        <div className="col-7">
                          <textarea className="form-control" rows="3" name="note"/>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="ht pt-3 pb-3 b-t b-b">线索进程</p>
                  <div className="row">
                    <div className="col">
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">
                          <em className="text-danger">*</em>信息来源
                        </label>
                        <div className="col-7">
                          <Source data={this.state.option.source}/>
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">
                          <em className="text-danger">*</em>具体渠道
                        </label>
                        <div className="input-group col-7">
                          <input type="text" className="form-control" value={this.state.channelText} readOnly={true}/>
                          <span className="input-group-btn">
                            <button onClick={this.createActDialog} className="btn btn-secondary" type="button">
                              <i className="fa fa-pencil-square-o fa-lg" aria-hidden="true"/>
                            </button>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">
                          <em className="text-danger">*</em>线索阶段
                        </label>
                        <div className="col-7">
                          <Stages data={this.state.option.stage}/>
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">
                          <em className="text-danger">*</em>线索状态
                        </label>
                        <div className="col-7">
                          <Status data={this.state.option.status}/>
                        </div>
                      </div>
                    </div>
                    <div className="col"/>
                    <div className="col"/>
                  </div>
                  {
                    this.props.isEditor && this.state.data ? <ContactList
                      id={this.state.data.id}
                      canEdit={true}
                      groupName={this.props.contactOrgName}
                      userName={this.props.contactUserName}
                    /> : null
                  }
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