/*
Preact component for an OOUI button.
*/

import { Component, createRef, Fragment, JSX } from "preact";
import { useEffect } from "preact/hooks";
import BaseComponent from "./BaseComponent";

interface ButtonProps {
    children?: string, // The text to display on the button
    on?: { [key: string]: (event: any) => void }, // Event handlers
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
        />
    );

}