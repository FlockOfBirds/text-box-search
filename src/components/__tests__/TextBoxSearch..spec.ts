import { mount, shallow } from "enzyme";
import { createElement } from "react";

import { TextBoxSearch, TextBoxSearchProps } from "../TextBoxSearch";

describe("TextBoxSearch", () => {
    const renderSearchBar = (props: TextBoxSearchProps) => shallow(createElement(TextBoxSearch, props));
    const mountSearchBar = (props: TextBoxSearchProps) => mount(createElement(TextBoxSearch, props));
    const textSearchProps: TextBoxSearchProps = {
        defaultQuery: "",
        onTextChangeAction:  jasmine.any(Function) as any,
        placeholder: "search"
    };

    it("renders the structure correctly", () => {
        const searchBar = renderSearchBar(textSearchProps);

        expect(searchBar).toBeElement(
            createElement("div", { className: "search-bar" },
                createElement("input", {
                    className: "form-control",
                    onChange: jasmine.any(Function) as any,
                    placeholder: textSearchProps.placeholder,
                    value: textSearchProps.defaultQuery
                }),
                createElement("button",
                    {
                        className: "",
                        onClick: jasmine.any(Function) as any
                    },
                    createElement("span", { className: "glyphicon glyphicon-remove" })
                )
            )
        );
    });

    it("renders with the specified placeholder", () => {
        const newSearchProps: TextBoxSearchProps = {
            defaultQuery: "query",
            onTextChangeAction:  jasmine.any(Function) as any,
            placeholder: "search"
        };
        const searchBar = renderSearchBar(newSearchProps);

        expect(searchBar).toBeElement(
            createElement("div", { className: "search-bar" },
                createElement("input", {
                    className: "form-control",
                    onChange: jasmine.any(Function) as any,
                    placeholder: textSearchProps.placeholder,
                    value: ""
                }),
                createElement("button", { className: "btn-transparent" },
                    createElement("span", { className: "glyphicon glyphicon-remove" })
                )
            )
        );
    });

    describe("input", () => {
        it("accepts value", (done) => {
            const newValue = "Kenya";
            const barProps: TextBoxSearchProps = {
                ...textSearchProps,
                onTextChangeAction: value => value
            };
            spyOn(barProps, "onTextChangeAction").and.callThrough();
            const wrapper = renderSearchBar(barProps);
            const input: any = wrapper.find("input");

            input.simulate("change", { currentTarget: { value: newValue } });

            setTimeout(() => {
                expect(barProps.onTextChangeAction).toHaveBeenCalledWith(newValue);
                done();
            }, 1000);
        });

        it("renders with specified default query", () => {
            const newSearchProps: TextBoxSearchProps = {
                defaultQuery: "Birds",
                onTextChangeAction: jasmine.any(Function) as any,
                placeholder: "search"
            };
            const searchBar = renderSearchBar(newSearchProps);
            const textSearxhInstance = searchBar.instance() as any;
            textSearxhInstance.componentDidMount();

            expect(searchBar.state().query).toEqual("Birds");
        });

        it("updates when the search value changes", (done) => {
            const newValue = "NET";
            const barProps: TextBoxSearchProps = {
                ...textSearchProps,
                onTextChangeAction: value => value
            };
            spyOn(barProps, "onTextChangeAction").and.callThrough();
            const wrapper = renderSearchBar(barProps);
            const input: any = wrapper.find("input");

            input.simulate("change", { currentTarget: { value: "SA" } });

            setTimeout(() => {
                expect(barProps.onTextChangeAction).toHaveBeenCalledWith("SA");

                input.simulate("change", { currentTarget: { value: newValue } });

                setTimeout(() => {
                    expect(barProps.onTextChangeAction).toHaveBeenCalledWith(newValue);
                    done();
                }, 1000);
            }, 1000);
        });

        it("is cleared when the remove button is clicked", () => {
            const wrapper = mountSearchBar(textSearchProps);
            const input: any = wrapper.find("input");
            const button: any = wrapper.find("button");

            input.node.value = "Change";
            input.simulate("change");

            expect(input.get(0).value).toBe("Change");

            button.simulate("click");

            expect(input.get(0).value).toBe("");
        });
    });
});
