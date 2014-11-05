/**
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.3.0GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 *
 */

"use strict";

var instanceManagerView = function (parentWindow, logo, systemLabel, formCallback) {

	// Variables Comunes
    var theme = require('ui/style/instanceManagerViewStyle'), 
    	lastItemChoosed = null, itemConected = null, currentURL, currentInstanceName; // TODO inicializar itemConected desde la DB

    // Variables para la configuración
    var configurationFormContainer, configurationFormTitle,
    	configurationFormSubmitButton, configurationFormBackButton,
    	configurationFormIntancesContainer,
    	configurationFormIntancesConnectionView,
    	configurationFormIntancesConnectionViewList,
    	configurationFormIntancesTitle,
    	configurationFormIntancesAddButton,
    	configurationFormSettingsContainer,
    	sectionsConnectionListView,
    	configButtonHandler;

	// Variables para el Formulario de Instancias
	var instanceFormContainer, instanceFormNameTextField, 
		instanceFormUrlTextField, instanceFormSubmitButton, 
		instanceFormBackButton;

    var createNewConnection = function createNewConnection(event, name, url, index){
    	instanceFormContainer = Ti.UI.createView(Yaast.MergeObject(
        	theme.containerView, {
        		left: '20%',
        		width: '60%'
        	}
        ));

        instanceFormNameTextField = Ti.UI.createTextField(Yaast.MergeObject(
            theme.inputTextField, {
                top: parseInt(instanceFormContainer.getHeight() * 0.15, 10),
                keyboardType: Ti.UI.KEYBOARD_DEFAULT,
                returnKeyType: Ti.UI.RETURNKEY_NEXT,
                hintText: "Instance Name"
            }
        ));
        if(name!=null){
        	instanceFormNameTextField.value = name;
        }
        instanceFormNameTextField.returnNameTextField = function returnNameTextField() {
            instanceFormNameTextField.blur();
        };
        instanceFormNameTextField.addEventListener('return', instanceFormNameTextField.returnNameTextField);
        instanceFormContainer.add(instanceFormNameTextField);
        
        instanceFormUrlTextField = Ti.UI.createTextField(Yaast.MergeObject(
            theme.inputTextField, {
                top: parseInt(instanceFormContainer.getHeight() * 0.4, 10),
                keyboardType: Ti.UI.KEYBOARD_URL,
                returnKeyType: Ti.UI.RETURNKEY_DONE,
                hintText: "Instance URL"
            }
        ));

        if(url!=null){
        	instanceFormUrlTextField.value = url;
        }
        else{
        	instanceFormUrlTextField.value = 'https://';
        }

        instanceFormUrlTextField.returnUrlTextField = function returnUrlTextField() {
            instanceFormUrlTextField.blur();
        };
        instanceFormUrlTextField.addEventListener('return', instanceFormUrlTextField.returnUrlTextField);
		instanceFormContainer.add(instanceFormUrlTextField);

		// Botón de enviar
		instanceFormSubmitButton = Ti.UI.createButton(Yaast.MergeObject(
			theme.button, {
				title: (index!=null) ? 'Edit Instance' : 'Save Instance',
				left: '5%',
                bottom: parseInt((instanceFormContainer.getHeight()*7)/100)
			}
		));

		instanceFormSubmitButton.submit = function submit(){
	        if(instanceFormNameTextField.value.length === 0) showMessageError("The instance name can't be empty");
	        //else if(instanceFormNameTextField.value.length > 30) showMessageError('El nombre la instancia no puede contener más de 30 caracteres');
	        else if(instanceFormUrlTextField.value.length === 0) showMessageError("The instance URL can't be empty");
	        else{
        		var urlStan = instanceFormUrlTextField.value;
        		if (instanceFormUrlTextField.value[instanceFormUrlTextField.value.length-1]!='/') {
        			urlStan += '/';
        		}

	        	var listaConexiones = Ti.UI.createListSection();

	        	listaConexiones.setItems([ 
		    		{connection: { text: instanceFormNameTextField.value}, url: { text: urlStan }},
		    	]);

        		// Si es una edición, se edita la línea
        		if(index!=null) {
        			configurationFormIntancesConnectionViewList.sections[0].updateItemAt(index, listaConexiones.getItemAt(0));
        		}
        		// Si no es una edición se crea la línea
        		else {
			    	configurationFormIntancesConnectionViewList.sections[0].appendItems(listaConexiones.getItems());
		    	}

		    	//createConfiguration();
		    	instanceFormContainer.animate({duration : 500, delay : 0, opacity : 0}, function() {
					configurationFormContainer.setOpacity(1);
			    	// Se elimina el formulario
					destroyNewConnection();
				});
			}
		};

		instanceFormSubmitButton.addEventListener('click', instanceFormSubmitButton.submit);
		instanceFormContainer.add(instanceFormSubmitButton);

		// Botón de enviar
		instanceFormBackButton = Ti.UI.createButton(Yaast.MergeObject(
			theme.button, {
				title: 'Back',
				right: '5%',
                bottom: parseInt((instanceFormContainer.getHeight()*7)/100)
			}
		));
		instanceFormBackButton.submit = function submit(){
			if((instanceFormNameTextField.value!=null 
					&& instanceFormNameTextField.value.length>0) 
				|| (instanceFormUrlTextField.value!=null 
					&& instanceFormUrlTextField.value.length>0)){
				var dialog = Ti.UI.createAlertDialog({
		            cancel : 1,
		            buttonNames : ['Acept', 'Cancel'],
		            message : 'Do you want exit without saving changes?',
		            title : '-- W4T --'
		        });
		        dialog.addEventListener('click', function(conf) {
		        	if(conf.index !== conf.source.cancel){
		        		createConfiguration();
		        		destroyNewConnection();
		        	}
		            dialog.hide();
		            dialog = null;
		        });
		        dialog.show();
			}
			else{
				createConfiguration();
				destroyNewConnection();
			}
		};

		instanceFormBackButton.addEventListener('click', instanceFormBackButton.submit);
		instanceFormContainer.add(instanceFormBackButton);

		parentWindow.add(instanceFormContainer);
    };

   	var destroyNewConnection = function destroyNewConnection(){
		if(instanceFormContainer != null){
			parentWindow.remove(instanceFormContainer);

			if(instanceFormNameTextField!=null){
		    	instanceFormNameTextField.removeEventListener('return', instanceFormNameTextField.returnNameTextField);
		        delete instanceFormNameTextField.returnNameTextField;
		        instanceFormContainer.remove(instanceFormNameTextField);
		        instanceFormNameTextField = null;
	       	}

	        if(instanceFormUrlTextField!=null){
		        instanceFormUrlTextField.removeEventListener('return', instanceFormUrlTextField.returnUrlTextField);
		        delete instanceFormUrlTextField.returnNameTextField;
		        instanceFormContainer.remove(instanceFormUrlTextField);
		        instanceFormUrlTextField = null;
	        }

	        if(instanceFormSubmitButton!=null){
		        instanceFormSubmitButton.removeEventListener('click', instanceFormSubmitButton.submit);
		        delete instanceFormSubmitButton.submit;
		        instanceFormContainer.remove(instanceFormSubmitButton);
		        instanceFormSubmitButton = null;
	        }

	        if(instanceFormBackButton!=null){
		        instanceFormBackButton.removeEventListener('click', instanceFormBackButton.submit);
		        delete instanceFormBackButton.returnNameTextField;
		        instanceFormContainer.remove(instanceFormBackButton);
		        instanceFormBackButton = null;
	        }

	        instanceFormContainer = null;
       	}
    };

	/** Private Function to create Form Configuration */
    var createConfiguration = function createConfiguration() {
		// TODO we need to refactor this method
    	configurationFormContainer = Ti.UI.createView(theme.view);

    	configurationFormTitle = Ti.UI.createLabel(theme.configurationFormTitle);
		configurationFormContainer.add(configurationFormTitle);

    	configurationFormSubmitButton = Ti.UI.createButton(Yaast.MergeObject(
			theme.button, {
				bottom: parseInt(((parentWindow.getHeight()*9)/100), 10),
        		right: '52%',
				title: 'Save config',
				height: parseInt((Ti.Platform.displayCaps.platformHeight*7)/100, 10),
		    	/* font: {
		            fontSize: parseInt((Ti.Platform.displayCaps.platformHeight*6)/100, 10)
		       } */
			}
		));

		configurationFormSubmitButton.submit = function submit(e){
			configurationFormContainer.animate({duration : 500, delay : 0, opacity : 0}, function() {
				logo.setOpacity(1);
				systemLabel.setOpacity(1);
				// Config update
				Yaast.Sandbox.currentURL = currentURL;
				Yaast.Sandbox.appConfig.config.lastInstanceName = currentInstanceName;
				Yaast.Sandbox.appConfig.config.lastInstanceURL = currentURL;
				formCallback();
				destroyConfiguration();
			});
		};
	    configurationFormSubmitButton.addEventListener('click', configurationFormSubmitButton.submit);
	    configurationFormContainer.add(configurationFormSubmitButton);

    	configurationFormBackButton = Ti.UI.createButton(Yaast.MergeObject(
			theme.button, {
				bottom: parseInt(((parentWindow.getHeight()*9)/100), 10),
        		left: '52%',
				title: 'back',
				height: parseInt((Ti.Platform.displayCaps.platformHeight*7)/100, 10),
		    	/* font: {
		            fontSize: parseInt((Ti.Platform.displayCaps.platformHeight*6)/100, 10)
		        }*/
			}
		));
		configurationFormBackButton.submit = function submit(){
			configurationFormContainer.animate({duration : 500, delay : 0, opacity : 0}, function() {
				logo.setOpacity(1);
				systemLabel.setOpacity(1);
				
				formCallback();
				destroyConfiguration();
			});
			
		};
	    configurationFormBackButton.addEventListener('click', configurationFormBackButton.submit);
	    configurationFormContainer.add(configurationFormBackButton);

    	// Panel de Instancias
    	configurationFormIntancesContainer = Ti.UI.createView(Yaast.MergeObject(
        	theme.containerView, {
        		height: parentWindow.getHeight()-parseInt(((parentWindow.getHeight()*8)/100)*4, 10),
        		left: '10%',
        		width : '80%',
        		/* width: parseInt((parentWindow.getWidth())-(parseInt((parentWindow.getWidth()*4)/100, 10)), 10), */
        		//width: parseInt((parentWindow.getWidth()/2)-(parseInt((parentWindow.getWidth()*3)/100, 10)), 10), FIXME
        		bottom: parseInt((parentWindow.getHeight()*20)/100, 10),
        	}
        ));

        // Instance Label
	    configurationFormIntancesTitle = Ti.UI.createLabel(theme.instanceTitle);
	    configurationFormIntancesContainer.add(configurationFormIntancesTitle);

	     // Connection Adder Label
	    configurationFormIntancesAddButton = Ti.UI.createButton(Yaast.MergeObject(
			theme.button, {
				top: 12,
        		right: '3%',
				title: 'Añadir',
				height: parseInt((Ti.Platform.displayCaps.platformHeight*7)/100, 10),
		    	/* font: {
		            fontSize: parseInt((Ti.Platform.displayCaps.platformHeight*6)/100, 10)
		       } */
			}
		));

		configurationFormIntancesAddButton.submit = function submit(e){
			configurationFormContainer.animate({duration : 500, delay : 0, opacity : 0}, function() {
				createNewConnection(e, null, null, null);
			});
		};

	    configurationFormIntancesAddButton.addEventListener('click', configurationFormIntancesAddButton.submit);
	    configurationFormIntancesContainer.add(configurationFormIntancesAddButton);

        // Connection View
        configurationFormIntancesConnectionView = Ti.UI.createView(theme.connectionView);

		configurationFormIntancesConnectionViewList = Ti.UI.createListView({
	        templates: {
	            'template':theme.connectionListViewTemplate, // Template por Defecto
	            'template_conected':theme.connectionListViewTemplateConected, // Tema conectado contraido
	            'choosed':theme.connectionListViewTemplateChoosed, // Template para Elegido
	            'choosed_conected':theme.connectionListViewTemplateChoosedConected, // Template para Elegido Conectado
	            'choosedPublic':theme.connectionListViewTemplatePublicChoosed, // Template para Elegido Publico
	            'choosedPublic_conected':theme.connectionListViewTemplateChoosedPublicConected, // Template para Elegido Publico Conectado
	        },
	        defaultItemTemplate: 'template'
    	});

    	sectionsConnectionListView = [];

    	var listaConexionesPrivadas = Ti.UI.createListSection();
    	listaConexionesPrivadas.setItems([ // TODO coger la información de la db
    		{template: (itemConected!=null && itemConected[1]==1)?'template_conected':'template', 
    			connection: { text: 'Wirecloud CoNWeT'}, url: { text: 'https://wirecloud.conwet.fi.upm.es/' }, id: { text: '1' }}
    	]);
    	var hViewPrivadas = Ti.UI.createView(theme.headerView);
    	hViewPrivadas.add(Ti.UI.createLabel(Yaast.MergeObject(
			theme.headerViewLabel, {
				text: 'Private'
			})
		));
    	listaConexionesPrivadas.setHeaderView(hViewPrivadas);
    	sectionsConnectionListView.push(listaConexionesPrivadas);

    	var listaConexionesPublicas = Ti.UI.createListSection();
    	listaConexionesPublicas.setItems([ // TODO coger la información de la db
    		{connection: { text: 'Wirecloud CoNWeT'}, url: { text: 'https://wirecloud.conwet.fi.upm.es/' }, id: { text: '1' }},
    		{connection: { text: 'Mashups Fi Lab 2'}, url: { text: 'http://wirecloud2.conwet.fi.upm.es' }, id: { text: '2' }}
    	]);
    	var hViewPublicas = Ti.UI.createView(theme.headerView);
    	hViewPublicas.add(Ti.UI.createLabel(Yaast.MergeObject(
			theme.headerViewLabel, {
				text: 'Public'
			})
		));
    	listaConexionesPublicas.setHeaderView(hViewPublicas);
    	sectionsConnectionListView.push(listaConexionesPublicas);

    	configurationFormIntancesConnectionViewList.sections = sectionsConnectionListView;

    	configurationFormIntancesConnectionViewList.changeConnection = function changeConnection(e){
	    	var item = e.section.getItemAt(e.itemIndex);

			if(e.bindId!=null && e.bindId=='delete_connection'){
				if(itemConected==null 
					|| e.sectionIndex!=itemConected[0] 
					|| (e.sectionIndex==itemConected[0] && e.itemIndex!=itemConected[1])){
					var dialog = Ti.UI.createAlertDialog({
			            cancel : 1,
			            buttonNames : ['Acept', 'Cancel'],
			            message : 'The instance \"'+item.connection.text+'\" will be removed',
			            title : '-- W4T --'
			        });
			        dialog.addEventListener('click', function(conf) {
			        	if(conf.index !== conf.source.cancel){
			        		e.section.deleteItemsAt(e.itemIndex, 1);
	    							
	    					lastItemChoosed = null;
	    					
	    					if(itemConected!=null){
	    						if(e.sectionIndex==itemConected[0] 
	    							&& itemConected[1]>e.itemIndex){
	    								
	    							itemConected[1]--;
	    						}
	    					}

	    					// TODO eliminar de la db
			        	}
			            dialog.hide();
			            dialog = null;
			        });
			        dialog.show();
		       	}
		       	else{
		       		var dialog = Ti.UI.createAlertDialog({
			            cancel : 1,
			            buttonNames : ['Acept', 'Cancel'],
			            message : 'The current instance \"'+item.connection.text+'\" will be removed.',
			            title : '-- W4T --'
			        });
			        dialog.addEventListener('click', function(conf) {
			        	if(conf.index !== conf.source.cancel){
			        		e.section.deleteItemsAt(e.itemIndex, 1);
			        		
			        		lastItemChoosed = null;
	    					
	    					itemConected = null;
	    					
	    					// TODO eliminar de la db
			        	}
			            dialog.hide();
			            dialog = null;
			        });
			        dialog.show();
		       	}
			}
			else if(e.bindId!=null && e.bindId=='edit_connection'){
				configurationFormContainer.animate({duration : 500, delay : 0, opacity : 0}, function() {
	    			createNewConnection(e, item.connection.text, item.url.text, e.itemIndex);
	    		});
			}
			else if(e.bindId!=null && ( e.bindId=='conect_button' || e.bindId=='conect_button_icon' )){
				// Si había conexión anteriormente y no corresponde consigo mismo
				if(itemConected!=null && (itemConected[0] != e.sectionIndex 
						|| (itemConected[0] == e.sectionIndex && itemConected[1] != e.itemIndex))){
					var dialog = Ti.UI.createAlertDialog({
			            cancel : 1,
			            buttonNames : ['Aceptar', 'Cancelar'],
			            message : 'Do you want to change the \"'+item.connection.text+'\" instance?',
			            title : '-- W4T --'
			        });
			        dialog.addEventListener('click', function(conf) {
			        	if(conf.index !== conf.source.cancel){
			        		var lastConected = configurationFormIntancesConnectionViewList
			        			.sections[itemConected[0]].getItemAt(itemConected[1]);
		    				lastConected.template = 'template';
		    				configurationFormIntancesConnectionViewList
		    					.sections[itemConected[0]]
		    					.updateItemAt(itemConected[1], lastConected);
		    				itemConected = null;
		    				
		    				var itemChoosed = e.section.getItemAt(e.itemIndex);
		    				if(e.sectionIndex==1){
		    					itemChoosed.template = 'choosedPublic_conected';
		    				}
		    				else{
			    				itemChoosed.template = 'choosed_conected';
			    			}
			    			e.section.updateItemAt(e.itemIndex, itemChoosed); 
			    			
			    			itemConected = [e.sectionIndex, e.itemIndex];
			    			// TODO add in DB
			    			currentURL = itemChoosed.url.text;
			    			currentInstanceName = itemChoosed.connection.text;
			    		}
			    		dialog.hide();
		           		dialog = null;
	    			});
		        	dialog.show();
				}
				// Si no había anterior
				else if(itemConected==null){
					var itemChoosed = e.section.getItemAt(e.itemIndex);
					if(e.sectionIndex==1){
    					itemChoosed.template = 'choosedPublic_conected';
    				}
    				else{
	    				itemChoosed.template = 'choosed_conected';
	    			}
	    			e.section.updateItemAt(e.itemIndex, itemChoosed); 
	    			
	    			itemConected = [e.sectionIndex, e.itemIndex]; // TODO save in the DB
	    			currentURL = itemChoosed.url.text;
	    			currentInstanceName = itemChoosed.connection.text;
				}
			}
			else if(e.bindId!=null && ( e.bindId=='disconect_button' || e.bindId=='disconect_button_icon' )){
				if(itemConected!=null && itemConected[0]==e.sectionIndex && itemConected[1]==e.itemIndex){
					var itemChoosed = e.section.getItemAt(e.itemIndex);
					if(e.sectionIndex==1){
    					itemChoosed.template = 'choosedPublic';
    				}
    				else{
	    				itemChoosed.template = 'choosed';
	    			}
	    			e.section.updateItemAt(e.itemIndex, itemChoosed); 
	    			
	    			itemConected = null; // TODO delete in the DB
	    			currentURL = null;
	    			currentInstanceName = null;
    			}
			}
    		else{
	    		// Actualizamos el index anterior
	    		if(lastItemChoosed!=null){
	    			var lastItem = configurationFormIntancesConnectionViewList
			        			.sections[lastItemChoosed[0]].getItemAt(lastItemChoosed[1]);
	    			if(itemConected!=null && lastItemChoosed[0]==itemConected[0] && lastItemChoosed[1]==itemConected[1]){
	    				lastItem.template = 'template_conected';
	    			}
	    			else{
	    				lastItem.template = 'template';
	    			}
	    			configurationFormIntancesConnectionViewList
			        			.sections[lastItemChoosed[0]].updateItemAt(lastItemChoosed[1], lastItem);
	    		}

	    		// Si no son iguales seleccionamos al siguiente, si lo son nos deseleccionamos de todos.
	    		if(lastItemChoosed==null || ((e.sectionIndex != lastItemChoosed[0]) || (e.sectionIndex == lastItemChoosed[0] && e.itemIndex != lastItemChoosed[1]))){
		    		lastItemChoosed = [e.sectionIndex, e.itemIndex];
		    		if(itemConected!=null && lastItemChoosed[0]==itemConected[0] && lastItemChoosed[1]==itemConected[1]){
	    				if(e.sectionIndex == 1){
	    					item.template = 'choosedPublic_conected';
	    				}
	    				else{
		    				item.template = 'choosed_conected';
		    			}
	    			}
	    			else{
	    				if(e.sectionIndex == 1){
	    					item.template = 'choosedPublic';
	    				}
	    				else{
		    				item.template = 'choosed';
		    			}
	    			}
				    configurationFormIntancesConnectionViewList
			        			.sections[lastItemChoosed[0]].updateItemAt(lastItemChoosed[1], item);  
				    configurationFormIntancesConnectionViewList.scrollToItem(e.sectionIndex, e.itemIndex);
	    		}
	    		// Se cancelan todas las conexiones
	    		else{
	    			lastItemChoosed = null;
	    		}
    		}
    	};
    	configurationFormIntancesConnectionViewList.addEventListener('itemclick', configurationFormIntancesConnectionViewList.changeConnection);

    	configurationFormIntancesConnectionView.add(configurationFormIntancesConnectionViewList);
		configurationFormIntancesContainer.add(configurationFormIntancesConnectionView);

		configurationFormContainer.add(configurationFormIntancesContainer);

	   	 	// Configuraciones Extra TODO
	   	 	configurationFormSettingsContainer = Ti.UI.createView(Yaast.MergeObject(
	        	theme.containerView, {
	        		height: parentWindow.getHeight()-parseInt(((parentWindow.getHeight()*8)/100)*4, 10),
	        		right: '2%',
	        		opacity: 0,
	        		width: 1, 
	        		//width: parseInt((parentWindow.getWidth()/2)-(parseInt((parentWindow.getWidth()*3)/100, 10)), 10), FIXME
	        		bottom: parseInt((parentWindow.getHeight()*20)/100, 10),
	        	}
	        ));

	    configurationFormContainer.add(configurationFormSettingsContainer);

		parentWindow.add(configurationFormContainer);

	};

	var destroyConfiguration = function destroyConfiguration(){

    	if(configurationFormContainer!=null){

	        parentWindow.remove(configurationFormContainer);

	        if(configurationFormTitle!=null){
				configurationFormContainer.remove(configurationFormTitle);
	        	configurationFormTitle = null;
	        }

	        if(configurationFormSubmitButton!=null){
		        configurationFormSubmitButton.removeEventListener('click', configurationFormSubmitButton.submit);
		        delete configurationFormSubmitButton.submit;
		        configurationFormContainer.remove(configurationFormSubmitButton);
		        configurationFormSubmitButton = null;
	        }

	        if(configurationFormBackButton!=null){
		        configurationFormBackButton.removeEventListener('click', configurationFormBackButton.submit);
		        delete configurationFormBackButton.submit;
		        configurationFormContainer.remove(configurationFormBackButton);
		        configurationFormBackButton = null;
	        }
        	
        	if(configurationFormIntancesContainer!=null){

				sectionsConnectionListView = null;
				lastItemChoosed = null;

		    	if(configurationFormIntancesTitle!=null){
					configurationFormIntancesContainer.remove(configurationFormIntancesTitle);
					configurationFormIntancesTitle = null;
				}

				if(configurationFormIntancesAddButton!=null){
			        configurationFormIntancesAddButton.removeEventListener('click', configurationFormIntancesAddButton.submit);
			        delete configurationFormIntancesAddButton.submit;
			        configurationFormIntancesContainer.remove(configurationFormIntancesAddButton);
			        configurationFormIntancesAddButton = null;
		        }

		        if(configurationFormIntancesConnectionView!=null){
		        	 if(configurationFormIntancesConnectionViewList!=null){
				        configurationFormIntancesConnectionViewList.removeEventListener('itemclick', 
				        	configurationFormIntancesConnectionViewList.changeConnection);
				        delete configurationFormIntancesConnectionViewList.changeConnection;
				        configurationFormIntancesConnectionView.remove(configurationFormIntancesConnectionViewList);
				        configurationFormIntancesConnectionViewList = null;
			        }
		        	configurationFormIntancesContainer.remove(configurationFormIntancesConnectionView);
					configurationFormIntancesConnectionView = null;
		        }
		        configurationFormContainer.remove(configurationFormIntancesContainer);
		        configurationFormIntancesContainer = null;
	    	}

	    	if(configurationFormSettingsContainer!=null){
        		// TODO
        		configurationFormContainer.remove(configurationFormSettingsContainer);
		        configurationFormSettingsContainer = null;
       		}	

       		configurationFormContainer = null;
       }
	};

	/** Destroy  */
	var _self = {};
	_self.destroy = function destroy() {

	    // Contenedor de Formulario de Instancias
	    destroyNewConnection();

	    // Contenedor de Opciones
		destroyConfiguration();

		theme = null;
		_self = null;
	};

	createConfiguration();
	return _self;

};

module.exports = instanceManagerView;
