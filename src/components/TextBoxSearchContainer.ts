import { Component, ReactElement, createElement } from "react";
import { findDOMNode } from "react-dom";
import * as dijitRegistry from "dijit/registry";
import * as dojoConnect from "dojo/_base/connect";
import * as classNames from "classnames";

import { TextBoxSearch, TextBoxSearchProps } from "./TextBoxSearch";
import { Utils, parseStyle } from "../utils/ContainerUtils";
import { DataSourceHelper, ListView } from "mendix-data-source-helper";
import { Alert } from "./Alert";

interface WrapperProps {
    class: string;
    style: string;
    friendlyId: string;
    mxform?: mxui.lib.form._FormBase;
    mxObject: mendix.lib.MxObject;
}

export interface ContainerProps extends WrapperProps {
    attributeList: SearchAttributes[];
    defaultQuery: string;
    entity: string;
    placeHolder: string;
}

export interface SearchAttributes {
    attribute: string;
}

export interface ContainerState {
    alertMessage?: string;
    listviewAvailable: boolean;
    targetListView?: ListView;
    targetNode?: HTMLElement;
    validationPassed?: boolean;
}

export default class SearchContainer extends Component<ContainerProps, ContainerState> {
    private dataSourceHelper: DataSourceHelper;

    constructor(props: ContainerProps) {
        super(props);

        this.state = {
            alertMessage: "",
            listviewAvailable: true
        };

        this.applySearch = this.applySearch.bind(this);
        this.connectToListView = this.connectToListView.bind(this);
        dojoConnect.connect(props.mxform, "onNavigation", this, this.connectToListView);
    }

    componentDidMount() {
        const filterNode = findDOMNode(this).parentNode as HTMLElement;
        const targetNode = Utils.findTargetNode(filterNode);
        if (targetNode) {
            DataSourceHelper.hideContent(targetNode);
        }
    }

    render() {
        return createElement("div", {
                className: classNames("widget-text-box-search", this.props.class),
                style: parseStyle(this.props.style)
            },
            createElement(Alert, {
                bootstrapStyle: "danger",
                className: "widget-text-box-search-alert",
                message: this.state.alertMessage
            }),
            this.renderTextBoxSearch()
        );
    }

    private renderTextBoxSearch(): ReactElement<TextBoxSearchProps> {
        if (!this.state.alertMessage) {
            return createElement(TextBoxSearch, {
                defaultQuery: this.props.defaultQuery,
                onTextChangeAction: this.applySearch,
                placeholder: this.props.placeHolder
            });
        }

        return null;
    }

    private applySearch(searchQuery: string) {
        // construct constraint based on search query
        const constraint = this.getConstraint(searchQuery);

        if (this.dataSourceHelper) {
            this.dataSourceHelper.setConstraint(this.props.friendlyId, constraint);
        }
    }

    private getConstraint(searchQuery: string) {
        const { targetListView } = this.state;
        const constraints: string[] = [];

        if (targetListView && targetListView._datasource) {
            this.props.attributeList.forEach(searchAttribute => {
                constraints.push(`contains(${searchAttribute.attribute},'${searchQuery}')`);
            });

            return "[" + constraints.join(" or ") + "]";
        }
    }

    private connectToListView() {
        const queryNode = findDOMNode(this).parentNode as HTMLElement;
        const targetNode = Utils.findTargetNode(queryNode);
        let targetListView: ListView | null = null;
        let errorMessage = "";

        if (targetNode) {
            targetListView = dijitRegistry.byNode(targetNode);
            if (targetListView) {
                try {
                    this.dataSourceHelper = new DataSourceHelper(targetNode, targetListView, this.props.friendlyId, DataSourceHelper.VERSION);
                } catch (error) {
                    errorMessage = error.message;
                }
            }
        }

        const validationMessage = Utils.validateCompatibility({
            ...this.props as ContainerProps,
            targetListView
        });

        this.setState({
            alertMessage: validationMessage || errorMessage,
            listviewAvailable: !!targetListView,
            targetListView,
            targetNode
        });
    }
}
