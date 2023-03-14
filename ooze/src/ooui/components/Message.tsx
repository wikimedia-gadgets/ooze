/*
Wrapper for the OOUI MessageWidget.
*/

import BaseComponent, { EventMap } from "./BaseComponent";
export interface MessageProps {
    children?: string, // The text to display in the message
    on?: EventMap<OO.ui.MessageWidget.EventMap>, // Event handlers
    configOptions?: OO.ui.MessageWidget.ConfigOptions,
}
export default function Message(props: MessageProps) {
    return (
        <BaseComponent
            widgetClass={OO.ui.MessageWidget}
            configOptions={{
                label: props.children,
                ...props.configOptions,
            }}
            eventHandlers={props.on}
        />
    );
}