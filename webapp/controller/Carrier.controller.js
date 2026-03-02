sap.ui.define([
    "student/com/sap/training/advancedsapui5/fullscreen/controller/BaseController",
    "sap/ui/Device"
],
function (Controller, Device) {
    "use strict";

    return Controller.extend("student.com.sap.training.advancedsapui5.fullscreen.controller.Carrier", {
        
        /**
         * Ciclo de vida: Inicialização do Controller.
         * Configura a referência da lista local e utiliza o EventDelegate para garantir que o
         * ListSelector (no Component.js) conheça esta lista antes mesmo da View ser exibida.
         * Também registra os listeners de rota para navegação automática e tratamento de erros (bypassed).
         */
        onInit: function () {
            var oList = this.byId("list");
            this._oList = oList;

            this.getView().addEventDelegate({
                onBeforeFirstShow: function(){
                    this.getOwnerComponent().oListSelector.setBoundMasterList(this._oList);
                }.bind(this) 
            });

            this.getRouter().getRoute("Overview").attachPatternMatched(this._onListMatched, this);
            this.getRouter().attachBypassed(this.onBypassed, this);  
        },

        /**
         * Função utilitária para disparar a navegação.
         * @param {string} sCarrierId - O ID da companhia aérea.
         * @param {boolean} bReplace - Define se a navegação deve substituir o histórico do browser 
         * (evitando que o botão "voltar" entre em loop entre lista e detalhe).
         */
        _navigateToCarrierDetails: function (sCarrierId, bReplace) {
            this.getRouter().navTo("flights", {
                carrid: sCarrierId
            }, bReplace);
        },

        /**
         * Prepara a exibição dos detalhes. 
         * Define a estratégia de histórico (bReplace): em celulares, permitimos o histórico para que 
         * o botão físico 'voltar' funcione; em desktops (Master-Detail), substituímos o histórico.
         * @param {sap.m.ListItemBase} oItem - O item da lista selecionado.
         */
        _showDetail: function(oItem){
            // Se NÃO for celular, bReplace será true (comportamento de coluna dividida)
            var bReplace = !Device.system.phone;
            var sCarrierId = oItem.getBindingContext().getProperty("Carrid");
            this._navigateToCarrierDetails(sCarrierId, bReplace);
        },

        /**
         * Event handler disparado ao clicar ou selecionar um item na lista.
         * Identifica o item vindo do evento e chama a lógica de exibição de detalhes.
         */
        onSelect: function(oEvent){
            this._showDetail(oEvent.getParameter("listItem") || oEvent.getSource());
        },

        /**
         * Handler disparado quando o roteador não encontra match para a URL.
         * Garante que visualmente nenhum item pareça selecionado na lista.
         */
        onBypassed: function(){
            this._oList.removeSelections(true);
        },

        /**
         * Executado quando a rota principal "Overview" é carregada.
         * Verifica se a lista está em modo de seleção; se estiver, aguarda o carregamento dos dados
         * via ListSelector e navega automaticamente para o primeiro item disponível.
         */
        _onListMatched: function(){
            this.getListSelector().oWhenListLoadingIsDone.then(
                function(mParams){
                    // Se a lista não permitir seleção (mode="None"), interrompe a navegação automática.
                    if (mParams.list.getMode() === "None"){
                        return;
                    }
                    
                    // Extrai o Carrid do primeiro item da lista para carregar o detalhe inicial.
                    var sObjectId = mParams.oFirstListItem.getBindingContext().getProperty("Carrid");
                    this._navigateToCarrierDetails(sObjectId, true);
                }.bind(this)
            );
        },
    });
});