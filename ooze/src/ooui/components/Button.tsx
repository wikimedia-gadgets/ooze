/*
Preact component for an OOUI button.
*/

import { Component, createRef, Fragment, JSX } from "preact";
import { useEffect } from "preact/hooks";

interface ButtonProps {
    children?: string, // The text to display on the button
    onClick: () => void,
    configOptions?: OO.ui.ButtonWidget.ConfigOptions,
}

export default function Button(props: ButtonProps) {
    const wrapperRef = createRef<HTMLSpanElement>();

    // Construct the OOUI button widget for this component
    let buttonWidget:OO.ui.ButtonWidget;

    // When the component is mounted, render the OOUI button widget
    // into the span element
    useEffect(() => {
        if (!wrapperRef.current) return;

        // If buttonWidget is undefined, make a new one
        if (!buttonWidget) {
            buttonWidget = new OO.ui.ButtonWidget({
                label: props.children?.toString() ?? "Button",
                ...props.configOptions,
            });
    
            // Add the click handler to the OOUI button widget
            buttonWidget.on("click", props.onClick);
        }

        const buttonElement = buttonWidget.$element[0];
        wrapperRef.current?.appendChild(buttonElement);

        // When the component is unmounted, remove the OOUI button widget
        return () => {
            buttonWidget.off("click", props.onClick);
            const buttonElement = buttonWidget.$element[0];
            buttonElement.remove();
        };
    });
    // Return an empty span element to render into
    return <span ref={wrapperRef}>here i am</span>;
}