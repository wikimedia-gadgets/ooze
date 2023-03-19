/*
Text input component
*/

import BaseComponent, { EventMap } from "./BaseComponent";

interface TextInputProps {
    value?: string, // The text to display in the text input
    // Event handlers from OO.ui.TextInputWidget.EventMap
    on?: EventMap<OO.ui.TextInputWidget.EventMap>,
    configOptions?: OO.ui.TextInputWidget.ConfigOptions,
}

export default function TextInput(props: TextInputProps) {
    return (
        <BaseComponent
            widgetClass={OO.ui.TextInputWidget}
            configOptions={{
                value: props.value,
                ...props.configOptions,
            }}
            eventHandlers={props.on}
            widgetReflectsProps
            configUpdateCallback={(widget, newConfigOptions) => {
                console.log("hi")
                widget.setTitle(newConfigOptions.value || "Button");
            }}
        />
    );

}