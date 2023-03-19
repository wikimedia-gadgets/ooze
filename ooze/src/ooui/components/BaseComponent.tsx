import { useCallback, useImperativeHandle, useRef } from "preact/hooks";
import { forwardRef, JSX } from "preact/compat";

// Type for events 
export type EventMap<T> = {
    [key in keyof T]?: (value: T[key]) => void
}

/*
Renders any OOUI widget into a Preact component.
T: The type of the OOUI widget
CT: The type of the config options for the OOUI widget
*/

interface BaseComponentProps<T extends OO.ui.Widget, CT extends OO.ui.Widget.ConfigOptions> {
    widgetClass: new (configOptions: CT) => T,
    configOptions?: CT,
    eventHandlers?: { // Usage: <BaseComponent eventHandlers={{ click: (event) => { console.log("Clicked!") } }} />
        [key: string]: (event: any) => void,
    },
}

// Derived at least somewhat from https://gerrit.wikimedia.org/r/plugins/gitiles/react.ooui/+/refs/heads/master/src/ooui.js

export default function BaseComponent<T extends OO.ui.Widget, CT extends OO.ui.Widget.ConfigOptions>(props: BaseComponentProps<T, CT>): JSX.Element {
    const oouiComponent = forwardRef((refProps, ref) => {
        const objectRef = useRef<T | null>(null); // The actual widget object
        const eventsRef = useRef<{[key: string]: (event: any) => void} | null>({});

        const containerRef = useCallback(node => { // l150
            if (node === null) {
                return;
            }

            // Remove event handlers - T225975 - l161
            if (props.eventHandlers) {
                for (const [eventName, handler] of Object.entries(props.eventHandlers)) {
                    objectRef.current?.off(eventName, handler);
                }
            }

            // Construct the OOUI widget for this component
            // T225854 - l169
            objectRef.current = new props.widgetClass((props.configOptions as CT));

            // If there are no children in this node, then we can just append the widget
            if (node.children?.length === 0 && objectRef.current?.$element) {
                for (const element of objectRef.current.$element) {
					node.appendChild(element);
				}
            }

            // Add events to ref
            eventsRef.current = props.eventHandlers || {};

            // Add all the event handlers
            for (const [eventName, handler] of Object.entries(eventsRef.current)) {
                objectRef.current.on(eventName, handler);
            }

            // We should be done
        }, [props.widgetClass, props.configOptions, props.eventHandlers]);

        useImperativeHandle(ref, () => objectRef.current);
        console.log(ref);
        // Return an empty span element to render into
        return <span data-ooze-wrapper ref={ref}></span>;
    });
        
    return oouiComponent;  
}
