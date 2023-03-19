/*
Preact component for an OOUI button.
*/

import BaseComponent, { EventMap } from "./BaseComponent";

interface ButtonProps {
    children?: string, // The text to display on the button
    on?: EventMap<OO.ui.ButtonWidget.EventMap>, // Event handlers
    configOptions?: OO.ui.ButtonWidget.ConfigOptions,
}

export default function Button(props: ButtonProps) {
    return (
        <BaseComponent
            widgetClass={OO.ui.ButtonWidget}
            configOptions={{
                label: props.children,
                ...props.configOptions,
            }}
            eventHandlers={props.on}
            updateDOMOnPropsChange={true}
        />
    );

}