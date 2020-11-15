import React from 'react'
import ajax from "../../utils/ajax";
import ReactDOM from "react-dom";
import DialogTips from "../Dialog/DialogTips";
import emitter from '../../utils/events';
import {$} from "../../vendor";

/*const CourseType = ({name}) => (
  <select name={name || "courseId"} className="form-control">
    <option value="">请选择</option>
      <option value="16122700000002">Rise start</option>
      <option value="16122700000003">Rise on</option>
      <option value="16122700000004">Rise up</option>
  </select>
);*/


class CourseType extends React.Component{
    constructor(props) {
        super(props)

        this.state = {
            redirectToReferrer: false,
            list: this.props.data || []
        }
    }

    componentDidMount() {
        if (this.state.list.length) {
            return;
        }

        const request = async () => {
            try {
                let list = await ajax('/course/type/courseTypeList.do');

                this.setState({list});
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
        /*if(this.eventEmitter){
            emitter.removeListener(this.eventEmitter);
        }*/
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

    changeType = (evt) => {
        debugger
        if(evt.target.value){
            emitter.emit('changeCourseType', evt.target.value);
        }
    };

    render() {
        return (
            <select name="courseTypeId" className="form-control" onChange={this.changeType}>
                {
                    this.state.list.map(item => (
                        <option key={item.id} value={item.id}>{item.name}</option>
                    ))
                }
            </select>
        )
    }
}

export default CourseType;