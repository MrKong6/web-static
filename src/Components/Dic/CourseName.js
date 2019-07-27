import React from 'react'
import ajax from "../../utils/ajax";
import ReactDOM from "react-dom";
import DialogTips from "../Dialog/DialogTips";
import emitter from "../../utils/events";
/*const CourseName = ({name}) => (
    <select name={name || "courseName"} className="form-control">
        <option value="">请选择</option>
        <option value="K1(Pre-K)">K1(Pre-K)</option>
        <option value="K2(K)">K2(K)</option>
        <option value="K3(Pre-Rise)">K3(Pre-Rise)</option>
    </select>
);*/
class CourseName extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            redirectToReferrer: false,
            typeId: this.props.typeId,
            list: this.props.data || []
        }
        this.eventEmitter = emitter.addListener('changeCourseType', (message) => {
            if(message){
                this.state.typeId = message;
            }
            this.componentDidMount();
        });
    }

    componentWillUnmount() {
        emitter.removeListener(this.eventEmitter);
    }


    componentDidMount() {
        // debugger;
        /*if (this.state.list.length) {
            return;
        }*/

        const request = async () => {

            try {
                let list = await ajax('/course/session/queryListByTypeId.do',{id:this.state.typeId ? this.state.typeId : 0});

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

        request();
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

    render() {
        return (
            <select name="courseId" className="form-control">
                {
                    this.state.list.map(item => (
                        <option key={item.id} value={item.id}>{item.name}</option>
                    ))
                }
            </select>
        )
    }
}


export default CourseName;