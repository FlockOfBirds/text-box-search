import { ContainerProps, ListView } from "../components/TextBoxSearchContainer";

export const parseStyle = (style = ""): {[key: string]: string} => {
    try {
        return style.split(";").reduce<{[key: string]: string}>((styleObject, line) => {
            const pair = line.split(":");
            if (pair.length === 2) {
                const name = pair[0].trim().replace(/(-.)/g, match => match[1].toUpperCase());
                styleObject[name] = pair[1].trim();
            }
            return styleObject;
        }, {});
    } catch (error) {
        // tslint:disable-next-line no-console
        window.console.log("Failed to parse style", style, error);
    }

    return {};
};

export class Utils {
    static validate(props: ContainerProps & { filterNode: HTMLElement; targetListView: ListView; validate: boolean, isModeler?: boolean}): string {
        const widgetName = "text-box-search";
        // validate filter values if filterby = attribute, then value should not be empty or "" or " ".
        if (!props.filterNode) {
            return `${widgetName}: unable to find a listview with to attach to`;
        }

        if (props.isModeler) {
            return "";
        } else if (!(props.targetListView && props.targetListView._datasource)) {
            return `${widgetName}: unable to find a listview with to attach to`;
        }

        return "";
    }

    static isCompatible(targetListView: ListView): boolean {
        return !!(targetListView && targetListView._datasource);
    }

    static findTargetNode(filterNode: HTMLElement): HTMLElement | null {
        let targetNode: HTMLElement | null = null ;

        while (!targetNode && filterNode) {
            targetNode = filterNode.querySelectorAll(`.mx-listview`)[0] as HTMLElement;
            if (targetNode || filterNode.isEqualNode(document) || filterNode.classList.contains("mx-incubator")
                || filterNode.classList.contains("mx-offscreen")) {
                break;
            }

            filterNode = filterNode.parentNode as HTMLElement;
        }

        return targetNode;
    }

    static itContains(array: string[] | string, element: string) {
        return array.indexOf(element) > -1;
    }
}
