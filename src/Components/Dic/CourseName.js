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
        this.changeCourse = this.changeCourse.bind(this);
        this.changeFirstCourse = this.changeFirstCourse.bind(this);
    }

    componentWillUnmount() {
        if(this.eventEmitter){
            emitter.removeListener('changeCourseType',this.eventEmitter._events.changeCourseType);
        }
    }
    componentDidMount() {
        // debugger;
        /*if (this.state.list.length) {
            return;
        }*/

        const request = async () => {

            try {
                let list = await ajax('/course/type/listAll.do',{courseType:this.state.typeId ? this.state.typeId : 0});
                this.state.list = list.data.items ? list.data.items : [];
                this.setState({list : list.data.items});
                this.changeFirstCourse((list.data.items && list.data.items.length) > 0 ? list.data.items[0].id : null);
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

    changeCourse(evt){
        this.changeFirstCourse(evt.target.value);
    }

    changeFirstCourse(id){
        if(!this.props || !this.props.parent){
            return ;
        }
        if(id == null){
            this.props.parent.changeCourse(this, null);
        }else{
            this.state.list.map(item => {
                if(item.id == id){
                    this.props.parent.changeCourse(this, item);
                    return;
                }
            });
        }

    }

    render() {
        return (
            <select name="courseId" className="form-control" onChange={this.changeCourse}>
                {
                    this.state.list ? this.state.list.map(item => (
                        <option key={item.id} value={item.id}>{item.name}</option>
                    )) : null
                }
            </select>
        )
    }
}


export default CourseName;