sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History"
], function(Controller, History){
    "use strict";

    return Controller.extend("student.com.sap.training.advancedsapui5.fullscreen.controller.BaseController", {

        getRouter: function() {
            return this.getOwnerComponent().getRouter();
        },

        getListSelector: function() {
            return this.getOwnerComponent().oListSelector;
        },

        getResourceBundle: function() {
            return this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },

        onNavBack: function() {
            var sPreviousHash = History.getInstance().getPreviousHash();

            if(sPreviousHash !== undefined){
                // Vai para entrada anterior
                history.go(-1);   
            } else {
                // Voltamos com um historico em adiante
                var bReplace = true;
                this.getRouter().navTo("Overview", {}, bReplace);
            };
        }

    });
});