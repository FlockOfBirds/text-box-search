import { ChangeEvent, Component, createElement } from "react";

import "./ui/TextBoxSearch.scss";

export interface TextBoxSearchProps {
    defaultQuery: string;
    placeholder?: string;
    showSearchBar?: boolean;
    onTextChangeAction: (query: string) => void;
}

interface TextBoxSearchState {
    query: string;
}

export class TextBoxSearch extends Component<TextBoxSearchProps, TextBoxSearchState> {

    constructor(props: TextBoxSearchProps) {
        super(props);

        this.state = { query: "" };
        this.resetQuery = this.resetQuery.bind(this);
        this.handleOnChange = this.handleOnChange.bind(this);
    }

    render() {
        if (this.props.showSearchBar) {
            return createElement("div", { className: "search-bar" },
                createElement("span", { className: "glyphicon glyphicon-search" }),
                createElement("input", {
                    className: "form-control",
                    onChange: this.handleOnChange,
                    placeholder: this.props.placeholder,
                    value: this.state.query
                }),
                createElement("button",
                    {
                        className: `btn-transparent ${this.state.query ? "visible" : "hidden"}`,
                        onClick: this.resetQuery
                    },
                    createElement("span", { className: "glyphicon glyphicon-remove" })
                )
            );
        } else {
            return null;
        }
    }

    componentDidMount() {
        this.setState({ query: this.props.defaultQuery });
    }

    private handleOnChange(event: ChangeEvent<HTMLSelectElement>) {
        const query = event.currentTarget.value;
        if (this.state.query !== query) {
            setTimeout(() => {
                this.props.onTextChangeAction(query);
            }, this.geTimeOut());
        }
        this.setState({ query });
    }

    private geTimeOut(): number {
        return this.props.showSearchBar === false || this.props.defaultQuery ? 0 : 500;
    }

    private resetQuery() {
        this.setState({ query: "" });
    }
}
