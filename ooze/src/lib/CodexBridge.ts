// Bridges all Codex Vue components to Web Components - to be used in Svelte

import { createApp, h, type DefineComponent } from "vue";
// @ts-ignore - yep this is annoying
import wrapper from "vue3-webcomponent-wrapper";

// Codex components
import { CdxButton, CdxIcon, CdxToggleButton } from '@wikimedia/codex';

export default class CodexBridge {
    // No real type checking here - keep an eye out.
    static components: Record<string, any> = {
        "cdx-button": CdxButton,
        "cdx-toggle-button": CdxToggleButton,
        "cdx-icon": CdxIcon,
    }

    public static async init() {
        for (const key in this.components) {
            if (!Object.prototype.hasOwnProperty.call(this.components, key)) {
                continue;
            }

            const CustomElement = wrapper(this.components[key], createApp, h);
            window.customElements.define(key, CustomElement);
        }
    }
}