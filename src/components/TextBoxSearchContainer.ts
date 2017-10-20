import { Component, ReactElement, createElement } from "react";
import { findDOMNode } from "react-dom";
import * as dijitRegistry from "dijit/registry";
import * as dojoConnect from "dojo/_base/connect";
import * as classNames from "classnames";

import { TextBoxSearch, TextBoxSearchProps } from "./TextBoxSearch";
import { Utils, parseStyle } from "../utils/ContainerUtils";
import { Alert } from "./Alert";

interface WrapperProps {
    class: string;
    style: string;
    friendlyId: string;
    mxform?: mxui.lib.form._FormBase;
    mxObject: mendix.lib.MxObject;
}

export interface ContainerProps extends WrapperProps {
    attributetList: SearchAttributes[];
    defaultQuery: string;
    entity: string;
    placeHolder: string;
}

export interface SearchAttributes {
    attribute: string;
}

export interface ListView extends mxui.widget._WidgetBase {
    _datasource: { _constraints: string; };
    filter: { [key: string ]: string; };
    update: (obj?: mendix.lib.MxObject | null, callback?: () => void) => void;
}

export interface ContainerState {
    listviewAvailable: boolean;
    targetListView?: ListView;
    targetNode?: HTMLElement;
    validationPassed?: boolean;
}

export default class SearchContainer extends Component<ContainerProps, ContainerState> {

    constructor(props: ContainerProps) {
        super(props);

        this.state = { listviewAvailable: true };
        this.handleChange = this.handleChange.bind(this);
        // Ensures that the listView is connected so the widget doesn't break in mobile due to unpredictable render time
        this.connectToListView = this.connectToListView.bind(this);
        dojoConnect.connect(props.mxform, "onNavigation", this, this.connectToListView);
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

    private renderAlert() {
        const errorMessage = Utils.validate({
            ...this.props as ContainerProps,
            filterNode: this.state.targetNode,
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
        if (this.state.validationPassed) {

            return createElement(TextBoxSearch, {
                defaultQuery: this.props.defaultQuery,
                onTextChangeAction: this.handleChange,
                placeholder: this.props.placeHolder
            });
        }

        return null;
    }

    private handleChange(query: string) {
        const { targetListView, targetNode } = this.state;
        this.showLoader(targetNode);
        const constraints: string[] = [];
        if (targetListView && targetListView._datasource && targetNode) {
            const isReference = this.props.entity && Utils.itContains(this.props.entity, "/");
            this.props.attributetList.forEach(searchAttribute => {
                isReference
                    ?
                    targetListView._datasource._constraints = `${this.props.entity}[contains(${searchAttribute.attribute},'${query}')]`
                    :
                    constraints.push(`contains(${searchAttribute.attribute},'${query}')`);
            });
            targetListView._datasource._constraints = "[" + constraints.join(" or ") + "]";
            targetListView.update(null, () => {
                this.hideLoader(targetNode);
            });
        }
    }

    private showLoader(node?: HTMLElement) {
        if (node) {
            node.classList.add("widget-text-box-search-loading");
        }
    }

    private hideLoader(node?: HTMLElement) {
        if (node) {
            node.classList.remove("widget-text-box-search-loading");
        }
    }

    private connectToListView() {
        const filterNode = findDOMNode(this).parentNode as HTMLElement;
        const targetNode = Utils.findTargetNode(filterNode);
        let targetListView: ListView | null = null;

        if (targetNode) {
            this.setState({ targetNode });
            targetListView = dijitRegistry.byNode(targetNode);
            if (targetListView) {
                targetListView.filter = {};
                this.setState({ targetListView });
            }
        }
        const validateMessage = Utils.validate({
            ...this.props as ContainerProps,
            filterNode: targetNode,
            targetListView,
            validate: true
        });
        this.setState({ listviewAvailable: false, validationPassed: !validateMessage });
    }
}
