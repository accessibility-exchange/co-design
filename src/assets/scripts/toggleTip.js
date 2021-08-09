import { createPopper } from "@popperjs/core";

export default () => ({
    toggled: false,
    instance: false,
    toggle() {
        this.instance = createPopper(this.$refs.trigger, this.$refs.definition, {
            modifiers: [
                {
                    name: "offset",
                    options: {
                        offset: [0, 20]
                    }
                }
            ]
        });
        this.toggled = !this.toggled;
        this.$nextTick(() => {
            this.instance.update();
        });
    }
});