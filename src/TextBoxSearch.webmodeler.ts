import { Component, ReactElement, createElement } from "react";
import { findDOMNode } from "react-dom";
import * as classNames from "classnames";
import { Alert } from "./components/Alert";

import { TextBoxSearch, TextBoxSearchProps } from "./components/TextBoxSearch";
import { ContainerProps, ContainerState } from "./components/TextBoxSearchContainer";
import { Utils, parseStyle } from "./utils/ContainerUtils";

// tslint:disable-next-line class-name
export class preview extends Component<ContainerProps, ContainerState> {

    constructor(props: ContainerProps) {
        super(props);

        this.state = { listviewAvailable: true };
    }

    render() {
        return createElement("div",
            {
                className: classNames("widget-text-box-search", this.props.class),
                style: parseStyle(this.props.style)
            },
            this.renderAlert(),
            this.renderTextBoxSearch()
        );
    }

    componentDidMount() {
        this.validateConfigs();
    }

    componentWillReceiveProps(_newProps: ContainerProps) {
        this.validateConfigs();
    }

    private validateConfigs() {
        // validate filter values if filterby is attribute, then value should not be empty or "" or " ".
        const routeNode = findDOMNode(this) as HTMLElement;
        const targetNode = Utils.findTargetNode(routeNode);

        if (targetNode) {
            this.setState({ targetNode });
        }
        this.setState({ listviewAvailable: true });
    }

    private renderAlert() {
        const errorMessage = Utils.validate({
            ...this.props as ContainerProps,
            filterNode: this.state.targetNode,
            isModeler: true,
            targetListView: this.state.targetListView,
            validate: !this.state.listviewAvailable
        });

        return createElement(Alert, {
            bootstrapStyle: "danger",
            className: "widget-text-box-search-alert",
            message: errorMessage
        });
    }

    private renderTextBoxSearch(): ReactElement<TextBoxSearchProps> {
        return createElement(TextBoxSearch, {
            defaultQuery: "",
            onTextChangeAction: () => { return; }
        });
    }
}

export function getPreviewCss() {
    return require("./components/ui/TextBoxSearch.scss");
}
