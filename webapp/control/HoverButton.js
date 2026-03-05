sap.ui.define([
    "sap/m/Button",
    "sap/m/ButtonRenderer"
],

function (Button, ButtonRenderer) {
    "use strict";

    return Button.extend("student.com.sap.training.advancedsapui5.fullscreen.control.HoverButton", {
        metadata: {
            properties: {
                "allowHover": {
                    type: "boolean",
                    defaultValue: false
                },
                "hoverText": {
                    type: "string"
                }
            },
            events: {
                "hover": {}
            }
        },
        onmouseover: function(evt) {
            if(this.getAllowHover()){
                this.fireHover();
            }
        },
        renderer: ButtonRenderer
    });
});