import React from 'react'
import ReactDOM from 'react-dom'

import 'react-day-picker/lib/style.css';
import DialogTips from "../../Dialog/DialogTips";

import ajax from "../../../utils/ajax";
import formatWithTime from "../../../utils/fmtDate";
import calculateAge from "../../../utils/calculateAge";
import {DatePicker} from "element-react";
import './Through.css'

class Form extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            group: this.props.changedCrmGroup,
            birthday: null,
            age: 0,
            option: null,
            data: null,
            throughTime: null
        };
        this.changeBirthday = this.changeBirthday.bind(this);
        this.createDialogTips = this.createDialogTips.bind(this);
        this.getFormValue = this.getFormValue.bind(this);
    }

    componentDidMount() {
        const request = async () => {
            try {
                let throughStatus = await ajax('/service/through/throughStatus.do');
                let data = null;

                if (this.props.isEditor) {
                    data = await ajax('/service/through/query.do', {id: this.props.editorId});
                    data = data.data;
                }

                this.setState({
                    option: {throughStatus}
                }, () => {
                    if (this.props.isEditor) {
                        const keys = Object.keys(data);

                        keys.map(key => {
                            if (key === 'throughTime') {
                                this.state.throughTime = new Date(data[key]);
                            }
                            if (this.form[key]) {
                                if (key === 'throughTime') {
                                    this.form[key].value = formatWithTime(data[key]);
                                    this.state.throughTime = formatWithTime(data[key]);
                                } else {
                                    this.form[key].value = data[key];
                                }
                            }
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

    changeBirthday(day) {
        const birthday = day;
        const age = calculateAge(birthday);

        this.setState({birthday, age});
    }

    getFormValue() {
        //TODO 暂时注释掉校验
        // if (!this.form.checkValidity()) {
        //     return
        // }

        let query = {};
        query.throughTime = this.state.throughTime;
        for (let i = 0; i < this.form.length; i++) {
            if (this.form[i].name) {
                if (this.form[i].tagName !== 'BUTTON' && !this.form[i].readOnly) {
                    query[this.form[i].name] = this.form[i].value;
                }
                if (this.form[i].name === 'throughTime') {
                    query[this.form[i].name] = new Date(this.form[i].value);
                }
            }
        }

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
                                <p className="ht pb-3 b-b">基本信息</p>
                                <div className="row">
                                    <div className="col">
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>体验课场次
                                            </label>
                                            <div className="col-7">
                                                <input type="text" className="form-control" name="code"
                                                       required={true}/>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">状态</label>
                                            <div className="col-7">
                                                <select className="form-control"
                                                        name={this.props.throughStatus || "throughStatus"}>
                                                    {
                                                        this.state.option ? this.state.option.throughStatus.map(item => (
                                                            <option key={item.code}
                                                                    value={item.code}>{item.name}</option>
                                                        )) : null
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>时间
                                            </label>
                                            <div className="col-7">
                                                <DatePicker
                                                    name="throughTime"
                                                    value={this.state.throughTime}
                                                    width="100%"
                                                    className="allWidth"
                                                    isShowTime={true}
                                                    placeholder="选择日期"
                                                    format="yyyy-MM-dd HH:mm"
                                                    onChange={date => {
                                                        console.debug('DatePicker1 changed: ', date)
                                                        this.setState({throughTime: date})
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>主教
                                            </label>
                                            <div className="col-7">
                                                <input type="text" className="form-control" name="mainTeacher"
                                                       required={true} />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>助教
                                            </label>
                                            <div className="col-7">
                                                <input type="text" className="form-control" name="assistant"
                                                       required={true}/>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>课程顾问
                                            </label>
                                            <div className="col-7">
                                                <input type="text" className="form-control" name="adviser"
                                                       required={true}/>
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