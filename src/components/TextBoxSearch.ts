import { ChangeEvent, Component, createElement } from "react";

import "./ui/TextBoxSearch.scss";

export interface TextBoxSearchProps {
    defaultQuery: string;
    placeholder?: string;
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
        return createElement("div", { className: "search-bar" },
            createElement("input", {
                className: "form-control",
                onChange: this.handleOnChange,
                placeholder: this.props.placeholder,
                value: this.state.query
            }),
            createElement("button", {
                    className: `btn-transparent ${this.state.query ? "visible" : "hidden"}`,
                    onClick: this.resetQuery
                },
                createElement("span", { className: "glyphicon glyphicon-remove" })
            )
        );
    }

    componentDidMount() {
        this.setState({ query: this.props.defaultQuery });
    }

    componentDidUpdate(_prevProps: TextBoxSearchProps, prevState: TextBoxSearchState) {
        if (this.state.query !== prevState.query) {
            setTimeout(() => {
                this.props.onTextChangeAction(this.state.query);
            }, this.geTimeOut());
        }
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
        return this.props.defaultQuery ? 0 : 500;
    }

    private resetQuery() {
        this.setState({ query: "" });
    }
}
