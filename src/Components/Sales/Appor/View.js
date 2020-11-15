import React from 'react'

import fmtTitle from "../../../utils/fmtTitle";
import mainSize from "../../../utils/mainSize";
import "./Appor.css"
import LeadsView from "../../Dic/LeadsView";

class View extends React.Component {
    constructor(props) {
        super(props);
        this.commands = this.props.commands.filter(command => (command.name !== 'Add' && command.name !== 'Import' && command.name !== 'Export' && command.name !== 'Mod'));
        this.title = fmtTitle(this.props.location.pathname);
        this.state = {
            group: this.props.changedCrmGroup,
            typeId: 2, //访客类型
            fromWay: 3,//访客
        };
        this.SignAction = this.SignAction.bind(this);
        this.back = this.back.bind(this);
    }

    componentDidMount() {
        mainSize();
    }

    SignAction(data, oriId) {
        this.props.history.push('/home/sales/contract/create', {data: data, oriId: oriId});
    }

    back(){
        let link = "/home/sales/oppor";
        if (this.props.location.pathname.indexOf("opporpublic") != -1) {
            link = "/home/sales/opporpublic";
        }
        this.props.history.push(link);
    }

    render() {

        let link = "/home/sales/oppor";
        if (this.props.location.pathname.indexOf("opporpublic") != -1) {
            link = "/home/sales/opporpublic";
        }

        return (
            <LeadsView
                opporId={this.props.match.params.opporId}
                pathName={this.props.location.pathname}
                commands={this.commands}
                group={this.state.group}
                accept={this.goToDetails}
                fromWay={this.state.fromWay}
                typeId={this.state.typeId}
                profile={this.props.profile}
                SignAction={this.SignAction}
                back={this.back}
                location={this.props.location}
                link={link}
            />
        )
    }
}

export default View;