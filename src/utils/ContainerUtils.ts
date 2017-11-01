import { ContainerProps } from "../components/TextBoxSearchContainer";
import { ListView } from "data-source-helper";

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

const showAlert = (friendlyId: string, message: string) => `Custom widget ${friendlyId} Error in configuration: ${message}`;

export class Utils {
    static validate(props: ContainerProps & { filterNode: HTMLElement; targetListView: ListView; validate: boolean, isModeler?: boolean}): string {

        if (!(props.targetListView && props.targetListView._datasource)) {
            return showAlert(props.friendlyId, "is not compatible with a specified list");
        }
        if (!props.filterNode) {
            return showAlert(props.friendlyId, "unable to find a list view on the page");
        }
        if (props.isModeler) {
            return "";
        }
        if (props.targetListView && !Utils.isCompatible(props.targetListView)) {
            return showAlert(props.friendlyId, "this Mendix version is incompatible");
        }

        return "";
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

    static isCompatible(targetListView: ListView): boolean {
        return !!(targetListView &&
            targetListView.update &&
            targetListView.datasource &&
            targetListView.datasource.type &&
            (targetListView.datasource.type === "database" || targetListView.datasource.type === "xpath") &&
            targetListView._datasource &&
            targetListView._datasource._entity &&
            targetListView._datasource._sorting);
    }

    static itContains(array: string[] | string, element: string) {
        return array.indexOf(element) > -1;
    }
}
