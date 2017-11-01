import { Component, ReactElement, createElement } from "react";
import { findDOMNode } from "react-dom";
import * as dijitRegistry from "dijit/registry";
import * as dojoConnect from "dojo/_base/connect";
import * as classNames from "classnames";

import { TextBoxSearch, TextBoxSearchProps } from "./TextBoxSearch";
import { Utils, parseStyle } from "../utils/ContainerUtils";
import { DataSourceHelper, ListView } from "data-source-helper";
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

export interface ContainerState {
    alertMessage?: string;
    listviewAvailable: boolean;
    targetListView?: ListView;
    targetNode?: HTMLElement;
    validationPassed?: boolean;
}

export default class SearchContainer extends Component<ContainerProps, ContainerState> {
    private dataSourceHelper: DataSourceHelper;
    private errorMessage: string;

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
        this.errorMessage = Utils.validate({
            ...this.props as ContainerProps,
            filterNode: this.state.targetNode,
            targetListView: this.state.targetListView,
            validate: !this.state.listviewAvailable
        });

        return createElement(Alert, {
            bootstrapStyle: "danger",
            className: "widget-text-box-search-alert",
            message: this.errorMessage
        });
    }

    private renderTextBoxSearch(): ReactElement<TextBoxSearchProps> {
        if (this.state.validationPassed) {

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
            const isReference = this.props.entity && Utils.itContains(this.props.entity, "/");
            this.props.attributetList.forEach(searchAttribute => {
                isReference
                    ?
                    constraints.push(`${this.props.entity}[contains(${searchAttribute.attribute},'${searchQuery}')]`)
                    :
                    constraints.push(`contains(${searchAttribute.attribute},'${searchQuery}')`);
            });
            return "[" + constraints.join(" or ") + "]";
        }
    }

    private connectToListView() {
        if (!this.state.validationPassed) {
            const queryNode = findDOMNode(this).parentNode as HTMLElement;
            const targetNode = Utils.findTargetNode(queryNode);
            let targetListView: ListView | null = null;

            if (targetNode) {
                targetListView = dijitRegistry.byNode(targetNode);
                if (targetListView) {
                    if (!targetListView.__customWidgetDataSourceHelper) {
                        try {
                            targetListView.__customWidgetDataSourceHelper = new DataSourceHelper(targetListView, this.props.friendlyId);
                        } catch (error) {
                            this.setState({
                                alertMessage: error.message,
                                targetListView,
                                targetNode
                            });
                        }
                    }
                    this.dataSourceHelper = targetListView.__customWidgetDataSourceHelper as DataSourceHelper;
                    const versionCompatibilityMessage = this.dataSourceHelper
                                                            .versionCompatibility(DataSourceHelper.VERSION, this.props.friendlyId);

                    const validateMessage = Utils.validate({
                        ...this.props as ContainerProps,
                        filterNode: targetNode,
                        targetListView,
                        validate: !this.state.listviewAvailable
                    });

                    this.setState({
                        alertMessage: versionCompatibilityMessage,
                        listviewAvailable: false,
                        targetListView,
                        targetNode,
                        validationPassed: !validateMessage
                    });
                }
            }
        }
    }
}
