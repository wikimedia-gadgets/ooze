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

    // If true, the widget will be updated when props.configOptions changes
    // Warning: This will unfocus any focused elements inside the widget,
    // so only use on widgets that don't have focusable elements
    // Instead, see the configUpdateCallback prop
    updateDOMOnPropsChange?: boolean, 

    // If set and updateDOMOnPropsChange is false, this function will be called
    // when the props change so that the configuration can be updated by the parent component
    configUpdateCallback?: (widget: T, newConfigOptions: CT) => void,
}

export default function BaseComponent<T extends OO.ui.Widget, CT extends OO.ui.Widget.ConfigOptions>(props: BaseComponentProps<T, CT>) {
    const wrapperRef = createRef<HTMLSpanElement>();

    // Construct the OOUI widget for this component
    let widget:T;

    // Memoize the widget so that it doesn't get recreated
    // if the component is re-rendered
    widget = useMemo(() => {
        const newWidget = new props.widgetClass((props.configOptions as CT));
        return newWidget;
    }, [props.widgetClass]);

    // When props.configOptions changes, update the widget
    useEffect(() => {
        if (!widget || !wrapperRef.current) return;

        // Don't run if updateDOMOnPropsChange is true AND configUpdateCallback isn't set
        if (!props.updateDOMOnPropsChange && !props.configUpdateCallback) return;

        // If configUpdateCallback is set, call it
        // yes, this can and will cause an infinite loop if you don't add state checks
        if (props.configUpdateCallback) {

            props.configUpdateCallback(widget, props.configOptions as CT);

            return;
        }

        // Remove all event handlers
        if (props.eventHandlers) {
            for (const [eventName, handler] of Object.entries(props.eventHandlers)) {
                widget.off(eventName, handler);
            }
        }

        // Update the widget
        const newWidget = new props.widgetClass((props.configOptions as CT));
        // Add event handlers to the new widget
        if (props.eventHandlers) {
            for (const [eventName, handler] of Object.entries(props.eventHandlers)) {
                newWidget.on(eventName, handler);
            }
        }

        // Clear the wrapper element
        wrapperRef.current.innerHTML = "";

        // Update the widget
        widget = newWidget;

        // Render the new widget
        const widgetElement = widget.$element[0];
        wrapperRef.current?.appendChild(widgetElement);

    }, [props.configOptions, props.eventHandlers, props.widgetClass]);



    // When the component is mounted, render the OOUI widget
    // into the span element
    useEffect(() => {
        if (!wrapperRef.current || !widget) return;
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
    }, [props.widgetClass]);
    // Return an empty span element to render into
    return <span data-ooze-wrapper ref={wrapperRef}></span>;
}