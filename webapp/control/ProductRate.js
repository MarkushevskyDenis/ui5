sap.ui.define([
    "sap/ui/core/Control",
    "sap/m/Input",
    "sap/m/Button"
], function (Control, Input, Button) {

    "use strict";


    return Control.extend("ui5demo.control.ProductRate", {

        metadata: {
            properties: { value: { type: "string", defaultValue: "" }, id: {type: "string", defaultValue: "inputId"} },
            aggregations: {
                _input: { type: "sap.m.Input", multiple: false, visibility: "hidden" },
                _button: { type: "sap.m.Button", multiple: false, visibility: "hidden" }
            },
            events: {
                valueSubmit : {
                parameters : {
                    value : {type : "string"}
                }
            }
}
        },

        init: function () {
            this.setAggregation("_input", new Input({
				value : this.getValue(),
				liveChange : this._onInput.bind(this)
			}).addStyleClass("sapUiTinyMarginEnd"));

			this.setAggregation("_button", new Button({
                text : "click",
                press : this._onSubmit.bind(this),
				enabled : false
			}));

        },
        
        _onSubmit : function() {
			this.fireEvent("valueSubmit", {
				value : this.getValue()
			});
			this.getAggregation("_button").setEnabled(false);
		},

		_onInput : function(oEvent) {
			this.setValue(oEvent.getParameter("value"));
			this.getAggregation("_button").setEnabled(true);
		},


        renderer: function (oRm, oControl) {
            oRm.write("<div");
			oRm.writeControlData(oControl);
			oRm.addClass("sapUiSmallMarginBeginEnd");
			oRm.writeClasses();
			oRm.write(">");

			oRm.renderControl(oControl.getAggregation("_input"));
			oRm.renderControl(oControl.getAggregation("_button"));

			oRm.write("</div>");

        }

    });
});
