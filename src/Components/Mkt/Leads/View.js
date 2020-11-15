import React from 'react'

import fmtTitle from "../../../utils/fmtTitle";
import mainSize from "../../../utils/mainSize";
import LeadsView from "../../Dic/LeadsView";

class View extends React.Component {
    constructor(props) {
        super(props);
        this.ids = this.props.location.state.ids;
        this.commands = this.props.commands.filter(command => (command.name !== 'Add' && command.name !== 'Import' && command.name !== 'Export' && command.name !== 'Mod'));
        this.title = fmtTitle(this.props.location.pathname);
        this.state = {
            group: this.props.changedCrmGroup,
            redirectToReferrer: false,
            redirectToList: false,
            redirectToConvert: false,
            isAnimating: false,
            typeId: 1, //线索
            fromWay: 2,
        };
        this.back = this.back.bind(this);
    }

    componentDidMount() {
        mainSize();
    }

    back(){
        let link = "/home/mkt/leads";
        if (this.props.location.pathname.indexOf("leadspublic") != -1) {
            link = "/home/mkt/leadspublic";
        }
        this.props.history.push(link);
    }

    render() {
        let link = "/home/mkt/leads";
        if (this.props.location.pathname.indexOf("leadspublic") != -1) {
            link = "/home/mkt/leadspublic";
        }
        return (
            <LeadsView
                opporId={this.props.match.params.leadsId}
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