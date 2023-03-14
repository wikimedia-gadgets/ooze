/*
Preact component for an OOUI button.
*/

import { Component, createRef, Fragment, JSX } from "preact";

interface ButtonProps {
    children?: string, // The text to display on the button
    onClick: () => void,
}

export default function Button(props: ButtonProps) {
    const wrapperRef = createRef<HTMLSpanElement>();

    // Construct the OOUI button widget for this component
    const buttonWidget = new OO.ui.ButtonWidget({
        label: props.children?.toString() ?? "Button",
    });

    // On unmount, remove the OOUI button widget from the DOM
    // and remove the click handler
    Component.prototype.componentWillUnmount = () => {
        buttonWidget.off("click", props.onClick);
        const buttonElement = buttonWidget.$element[0];
        buttonElement.remove();
    };

    // Add the click handler to the OOUI button widget
    buttonWidget.on("click", props.onClick);

    // Return an empty span element to render into
    return <span ref={ref => {
        wrapperRef.current = ref;
        // Remove all old children
        while (ref?.firstChild) {
            ref.removeChild(ref.firstChild);
        }
        // Replace the contents of the span with the OOUI button widget
        ref?.appendChild(buttonWidget.$element[0]);
    }} />;
}