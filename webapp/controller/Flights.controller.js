sap.ui.define([
    "student/com/sap/training/advancedsapui5/fullscreen/controller/BaseController"
],
function (Controller) {
    "use strict";

    return Controller.extend("student.com.sap.training.advancedsapui5.fullscreen.controller.Flights", {
        
        /**
         * Ciclo de vida: Inicialização do Controller.
         * Configura o roteamento para detectar a rota "flights" e estabelece os listeners do modelo OData
         * para controlar o estado 'busy' (indicador de carregamento) da View automaticamente.
         */
        onInit: function () {
            var oRouter = this.getRouter();
            oRouter.getRoute("flights").attachMatched(this._onObjectMatched, this);

            var oModel = this.getOwnerComponent().getModel();
            
            oModel.attachRequestSent(function(oEvent){
                this.getView().setBusy(true);
            }, this);
            
            oModel.attachRequestCompleted(function(oEvent){
                this.getView().setBusy(false);
            }, this);
        },

        /**
         * Manipulador disparado quando a URL corresponde à rota de detalhes do voo.
         * Atualiza o layout para duas colunas (Master-Detail) usando o modelo 'appView' e 
         * vincula a View ao caminho específico da companhia aérea recebida via parâmetro (carrid).
         * @param {sap.ui.base.Event} oEvent - Evento contendo os argumentos da rota.
         */
        _onObjectMatched: function (oEvent) {
            var oArgs = oEvent.getParameter("arguments");
            this._sCarrierId = oArgs.carrid; 
            var oView = this.getView();

            // Atualiza o FlexibleColumnLayout para exibir a coluna de detalhes expandida
            oView.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");

            oView.bindElement({
                path: "/UX_C_Carrier_TP('" + this._sCarrierId +"')",
                events: {
                    change: this._onBindingChange.bind(this) 
                }
            });
        },

        /**
         * Valida a integridade do binding após a tentativa de carregamento.
         * Caso o ID da URL não exista no backend, exibe a página de 'Não Encontrado'.
         * Se existir, comunica ao ListSelector para destacar o item correspondente na lista master.
         */
        _onBindingChange: function () {
            var oView = this.getView();
            var oElementBinding = oView.getElementBinding();
            
            if(!oElementBinding.getBoundContext()){
                this.getRouter().getTargets().display("notFound");
                this.getOwnerComponent().oListSelector.cleanMasterListSelection();
                return;
            }
            
            var sPath = oElementBinding.getPath();
            this.getOwnerComponent().oListSelector.selectAListItem(sPath);
        },

        /**
         * Manipulador do botão fechar (X) da coluna de detalhes.
         * Redefine o layout para apenas uma coluna (escondendo os detalhes) e 
         * navega de volta para a rota principal "Overview".
         */
        handleClose: function(){
            var oView = this.getView();
            oView.getModel("appView").setProperty("/layout", "OneColumn");
            this.getRouter().navTo("Overview", {}, true);
        }
    });
});