/*
Preact component for an OOUI button.
*/

import BaseComponent, { EventMap } from "./BaseComponent";

interface ButtonProps {
    label: string, // The text to display on the button
    on?: EventMap<OO.ui.ButtonWidget.EventMap>, // Event handlers
    configOptions?: OO.ui.ButtonWidget.ConfigOptions,
    updateDOMOnPropsChange?: boolean,
}

export default function Button(props: ButtonProps) {
    return (
        <BaseComponent
            widgetClass={OO.ui.ButtonWidget}
            configOptions={{
                label: props.label,
                ...props.configOptions,
            }}
            eventHandlers={props.on}
            widgetReflectsProps
            updateDOMOnPropsChange={props.updateDOMOnPropsChange}
            configUpdateCallback={(widget, newConfigOptions) => {
                widget.setLabel(newConfigOptions.label || "Button");
            }}
        />
    );

}