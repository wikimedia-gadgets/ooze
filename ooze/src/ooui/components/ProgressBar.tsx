// Wrapper for the OOUI ProgressBarWidget.

import BaseComponent, { EventMap } from "./BaseComponent";
export interface ProgressBarProps {
    progress: number | false, // The progress to display in the progress bar
    configOptions?: OO.ui.ProgressBarWidget.ConfigOptions,
    pending?: boolean,
}

export default function ProgressBar(props: ProgressBarProps) {
    return (
        <BaseComponent
            widgetClass={OO.ui.ProgressBarWidget}
            configOptions={{
                progress: props.progress,
                ...props.configOptions,
                pending: props.pending,
            }}
            widgetReflectsProps
            configUpdateCallback={(widget, newConfigOptions) => {
                if (newConfigOptions.pending) {
                    widget.pushPending();
                } else {
                    widget.popPending();
                }
            }}
        />
    );
}