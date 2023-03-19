import { createRef } from "preact";
import { useEffect, useMemo } from "preact/hooks";

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

export default function BaseComponent<T extends OO.ui.Widget, CT extends OO.ui.Widget.ConfigOptions>(props: BaseComponentProps<T, CT>) {
    const wrapperRef = createRef<HTMLSpanElement>();

    // Construct the OOUI widget for this component
    let widget:T;

    // Memoize the widget so that it doesn't get recreated
    // every time the component is rendered
    widget = useMemo(() => {
        const newWidget = new props.widgetClass((props.configOptions as CT));

        // Remember the focus state of the widget
        // so that it can be restored when the component is re-rendered

        return newWidget;
    }, [props.widgetClass]);



    // When the component is mounted, render the OOUI widget
    // into the span element
    useEffect(() => {
        if (!wrapperRef.current) return;

        // If widget is undefined, make a new one
        if (!widget) {
            widget = new props.widgetClass((props.configOptions as CT));
        }

        const widgetElement = widget.$element[0];
        wrapperRef.current?.appendChild(widgetElement);

        // Add event handlers
        if (props.eventHandlers) {
            for (const [eventName, handler] of Object.entries(props.eventHandlers)) {
                widget.on(eventName, handler);
            }
        }

        // When the component is unmounted, remove the OOUI widget
        return () => {
            // Remove event handlers
            if (props.eventHandlers) {
                for (const [eventName, handler] of Object.entries(props.eventHandlers)) {
                    widget.off(eventName, handler);
                }
            }

            const widgetElement = widget.$element[0];
            widgetElement.remove();
        };
    });
    // Return an empty span element to render into
    return <span data-ooze-wrapper ref={wrapperRef}></span>;
}