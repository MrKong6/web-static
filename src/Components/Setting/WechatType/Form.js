import React from 'react'
import ReactDOM from 'react-dom'
import 'react-day-picker/lib/style.css';

import DialogTips from "../../Dialog/DialogTips";

import ajax from "../../../utils/ajax";
import calculateAge from "../../../utils/calculateAge";
import {Select} from "element-react";

class Form extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            group: this.props.changedCrmGroup,
            birthday: null,
            age: 0,
            option: null,
            data: null,
            classRanges:[],
            courseType: null
        };
        this.changeSelect = this.changeSelect.bind(this);
        this.createDialogTips = this.createDialogTips.bind(this);
        this.getFormValue = this.getFormValue.bind(this);
    }

    componentDidMount() {
        const request = async () => {
            try {
                let data = null;
                let classRanges = await ajax('/wechat/classRange.do', {id: this.props.editorId});
                if (this.props.isEditor) {
                    data = await ajax('/wechat/getType.do', {id: this.props.editorId});
                    data = data.data
                    this.setState({
                        data: data,
                        courseType: data.typeId,
                        classRanges: classRanges
                    }, () => {
                        const keys = Object.keys(data);
                        keys.map(key => {
                            if (this.form[key]) {
                                this.form[key].value = data[key];
                            }
                            if(key =='name' && this.form[key]){
                                this.form['ename'].value = data[key];
                            }
                        })
                    });
                } else {
                  this.setState({
                      classRanges: classRanges
                  });
                }


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

    changeSelect(courseType) {
        this.setState({courseType:courseType});
    }

    getFormValue() {
        if (!this.form.checkValidity()) {
            return
        }

        let query = {};

        for (let i = 0; i < this.form.length; i++) {
            if (this.form[i].name) {
                if (this.form[i].name === 'startDate' || this.form[i].name === 'endDate') {
                    query[this.form[i].name] = new Date(this.form[i].value);
                } else {
                    query[this.form[i].name] = this.form[i].value;
                }
            }
        }
        query.name = query.ename;
        query.ordId = this.state.group.id;
        query.typeId = this.state.courseType;
        return query;
    }

    render() {

        return (
            <form ref={(dom) => {
                this.form = dom
            }}>
                <div className="row justify-content-md-center">
                    <div className="col col-12">
                        <div className="card">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col">
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>年级类别
                                            </label>
                                            <div className="col-7">
                                                <Select value={this.state.courseType} placeholder="课程" name={"code"}
                                                        filterable={true}
                                                        clearable={true} style={{"width": "100%"}}
                                                        onChange={this.changeSelect.bind(this)}
                                                >
                                                    {
                                                        this.state.classRanges && this.state.classRanges.length > 0 ? this.state.classRanges.map(el => {
                                                            return <Select.Option key={el.code}
                                                                                  label={el.name}
                                                                                  value={el.code}/>
                                                        }) : null
                                                    }
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>年级名称
                                            </label>
                                            <div className="col-7">
                                                <input type="text" className="form-control" name="ename" required={true}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        )
    }
}

export default Form;