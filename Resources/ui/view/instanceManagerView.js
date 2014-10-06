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
    	lastItemChoosed = null, itemConected = null, currentURL; // TODO inicializar itemConected desde la DB

    // Variables para la configuración
    var configurationFormContainer, configurationFormTitle,
    	configurationFormSubmitButton, configurationFormBackButton,
    	configurationFormIntancesContainer,
    	configurationFormIntancesConectionView,
    	configurationFormIntancesConectionViewList,
    	configurationFormIntancesTitle,
    	configurationFormIntancesAddButton,
    	configurationFormSettingsContainer,
    	sectionsConectionListView,
    	configButtonHandler;

	// Variables para el Formulario de Instancias
	var instanceFormContainer, instanceFormNameTextField, 
		instanceFormUrlTextField, instanceFormSubmitButton, 
		instanceFormBackButton;

    var createNewConection = function createNewConection(event, name, url, index){
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
                hintText: "Nombre de la Instancia"
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
                hintText: "URL de la Instancia"
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
				title: (index!=null) ? 'Editar Instancia' : 'Guardar Instancia',
				left: '5%',
                bottom: parseInt((instanceFormContainer.getHeight()*7)/100)
			}
		));

		instanceFormSubmitButton.submit = function submit(){
	        if(instanceFormNameTextField.value.length === 0) showMessageError('El nombre la instancia no puede estar vacía');
	        //else if(instanceFormNameTextField.value.length > 30) showMessageError('El nombre la instancia no puede contener más de 30 caracteres');
	        else if(instanceFormUrlTextField.value.length === 0) showMessageError('La URL de la instancia no puede estar vacía');
	        else{
        		var urlStan = instanceFormUrlTextField.value;
        		if (instanceFormUrlTextField.value[instanceFormUrlTextField.value.length-1]!='/') {
        			urlStan += '/';
        		}

	        	var listaConexiones = Ti.UI.createListSection();

	        	listaConexiones.setItems([ 
		    		{conection: { text: instanceFormNameTextField.value}, url: { text: urlStan }},
		    	]);

        		// Si es una edición, se edita la línea
        		if(index!=null) {
        			configurationFormIntancesConectionViewList.sections[0].updateItemAt(index, listaConexiones.getItemAt(0));
        		}
        		// Si no es una edición se crea la línea
        		else {
			    	configurationFormIntancesConectionViewList.sections[0].appendItems(listaConexiones.getItems());
		    	}

		    	//createConfiguration();
		    	instanceFormContainer.animate({duration : 500, delay : 0, opacity : 0}, function() {
					configurationFormContainer.setOpacity(1);
			    	// Se elimina el formulario
					destroyNewConection();
				});
			}
		};

		instanceFormSubmitButton.addEventListener('click', instanceFormSubmitButton.submit);
		instanceFormContainer.add(instanceFormSubmitButton);

		// Botón de enviar
		instanceFormBackButton = Ti.UI.createButton(Yaast.MergeObject(
			theme.button, {
				title: 'Volver',
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
		            buttonNames : ['Aceptar', 'Cancelar'],
		            message : '¿Está seguro que quiere volver sin guardar? Los datos introducidos no se guardarán',
		            title : '-- W4T --'
		        });
		        dialog.addEventListener('click', function(conf) {
		        	if(conf.index !== conf.source.cancel){
		        		createConfiguration();
		        		destroyNewConection();
		        	}
		            dialog.hide();
		            dialog = null;
		        });
		        dialog.show();
			}
			else{
				createConfiguration();
				destroyNewConection();
			}
		};

		instanceFormBackButton.addEventListener('click', instanceFormBackButton.submit);
		instanceFormContainer.add(instanceFormBackButton);

		parentWindow.add(instanceFormContainer);
    };

   	var destroyNewConection = function destroyNewConection(){
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
				title: 'Guardar Configuración',
				height: parseInt((Ti.Platform.displayCaps.platformHeight*7)/100, 10),
		    	font: {
		            fontSize: parseInt((Ti.Platform.displayCaps.platformHeight*6)/100, 10)
		        }
			}
		));

		configurationFormSubmitButton.submit = function submit(e){
			configurationFormContainer.animate({duration : 500, delay : 0, opacity : 0}, function() {
				logo.setOpacity(1);
				systemLabel.setOpacity(1);
				// Config update
				Yaast.Sandbox.appConfig.currentURL = currentURL;
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
				title: 'Volver a la página anterior',
				height: parseInt((Ti.Platform.displayCaps.platformHeight*7)/100, 10),
		    	font: {
		            fontSize: parseInt((Ti.Platform.displayCaps.platformHeight*6)/100, 10)
		        }
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
        		left: '2%',
        		width: parseInt((parentWindow.getWidth())-(parseInt((parentWindow.getWidth()*4)/100, 10)), 10),
        		//width: parseInt((parentWindow.getWidth()/2)-(parseInt((parentWindow.getWidth()*3)/100, 10)), 10), FIXME
        		bottom: parseInt((parentWindow.getHeight()*20)/100, 10),
        	}
        ));

        // Instance Label
	    configurationFormIntancesTitle = Ti.UI.createLabel(theme.instanceTitle);
	    configurationFormIntancesContainer.add(configurationFormIntancesTitle);

	     // Conection Adder Label
	    configurationFormIntancesAddButton = Ti.UI.createButton(Yaast.MergeObject(
			theme.button, {
				top: 12,
        		right: '3%',
				title: 'Añadir',
				height: parseInt((Ti.Platform.displayCaps.platformHeight*7)/100, 10),
		    	font: {
		            fontSize: parseInt((Ti.Platform.displayCaps.platformHeight*6)/100, 10)
		        }
			}
		));

		configurationFormIntancesAddButton.submit = function submit(e){
			configurationFormContainer.animate({duration : 500, delay : 0, opacity : 0}, function() {
				createNewConection(e, null, null, null);
			});
		};

	    configurationFormIntancesAddButton.addEventListener('click', configurationFormIntancesAddButton.submit);
	    configurationFormIntancesContainer.add(configurationFormIntancesAddButton);

        // Conection View
        configurationFormIntancesConectionView = Ti.UI.createView(theme.conectionView);

		configurationFormIntancesConectionViewList = Ti.UI.createListView({
	        templates: {
	            'template':theme.conectionListViewTemplate, // Template por Defecto
	            'template_conected':theme.conectionListViewTemplateConected, // Tema conectado contraido
	            'choosed':theme.conectionListViewTemplateChoosed, // Template para Elegido
	            'choosed_conected':theme.conectionListViewTemplateChoosedConected, // Template para Elegido Conectado
	            'choosedPublic':theme.conectionListViewTemplatePublicChoosed, // Template para Elegido Publico
	            'choosedPublic_conected':theme.conectionListViewTemplateChoosedPublicConected, // Template para Elegido Publico Conectado
	        },
	        defaultItemTemplate: 'template'
    	});

    	sectionsConectionListView = [];

    	var listaConexionesPrivadas = Ti.UI.createListSection();
    	listaConexionesPrivadas.setItems([ // TODO coger la información de la db
    		{template: (itemConected!=null && itemConected[1]==1)?'template_conected':'template', 
    			conection: { text: 'Wirecloud CoNWeT'}, url: { text: 'http://wirecloud.conwet.fi.upm.es/' }, id: { text: '1' }}
    	]);
    	var hViewPrivadas = Ti.UI.createView(theme.headerView);
    	hViewPrivadas.add(Ti.UI.createLabel(Yaast.MergeObject(
			theme.headerViewLabel, {
				text: 'Personales'
			})
		));
    	listaConexionesPrivadas.setHeaderView(hViewPrivadas);
    	sectionsConectionListView.push(listaConexionesPrivadas);

    	var listaConexionesPublicas = Ti.UI.createListSection();
    	listaConexionesPublicas.setItems([ // TODO coger la información de la db
    		{conection: { text: 'Wirecloud CoNWeT'}, url: { text: 'http://wirecloud.conwet.fi.upm.es/' }, id: { text: '1' }},
    		{conection: { text: 'Mashups Fi Lab 2'}, url: { text: 'http://wirecloud2.conwet.fi.upm.es' }, id: { text: '2' }}
    	]);
    	var hViewPublicas = Ti.UI.createView(theme.headerView);
    	hViewPublicas.add(Ti.UI.createLabel(Yaast.MergeObject(
			theme.headerViewLabel, {
				text: 'Públicas'
			})
		));
    	listaConexionesPublicas.setHeaderView(hViewPublicas);
    	sectionsConectionListView.push(listaConexionesPublicas);

    	configurationFormIntancesConectionViewList.sections = sectionsConectionListView;

    	configurationFormIntancesConectionViewList.changeConection = function changeConection(e){
	    	var item = e.section.getItemAt(e.itemIndex);

			if(e.bindId!=null && e.bindId=='delete_conection'){
				if(itemConected==null 
					|| e.sectionIndex!=itemConected[0] 
					|| (e.sectionIndex==itemConected[0] && e.itemIndex!=itemConected[1])){
					var dialog = Ti.UI.createAlertDialog({
			            cancel : 1,
			            buttonNames : ['Aceptar', 'Cancelar'],
			            message : '¿Está seguro que quiere eliminar la instancia \"'+item.conection.text+'\"? No se podrá recuperar',
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
			            buttonNames : ['Aceptar', 'Cancelar'],
			            message : 'Quiere eliminar una instancia a la que está conectado, ¿quiere continuar?',
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
			else if(e.bindId!=null && e.bindId=='edit_conection'){
				configurationFormContainer.animate({duration : 500, delay : 0, opacity : 0}, function() {
	    			createNewConection(e, item.conection.text, item.url.text, e.itemIndex);
	    		});
			}
			else if(e.bindId!=null && ( e.bindId=='conect_button' || e.bindId=='conect_button_icon' )){
				// Si había conexión anteriormente y no corresponde consigo mismo
				if(itemConected!=null && (itemConected[0] != e.sectionIndex 
						|| (itemConected[0] == e.sectionIndex && itemConected[1] != e.itemIndex))){
					var dialog = Ti.UI.createAlertDialog({
			            cancel : 1,
			            buttonNames : ['Aceptar', 'Cancelar'],
			            message : 'Ya había establecido conexión con otra instancia, ¿quiere continuar?',
			            title : '-- W4T --'
			        });
			        dialog.addEventListener('click', function(conf) {
			        	if(conf.index !== conf.source.cancel){
			        		var lastConected = configurationFormIntancesConectionViewList
			        			.sections[itemConected[0]].getItemAt(itemConected[1]);
		    				lastConected.template = 'template';
		    				configurationFormIntancesConectionViewList
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
    			}
			}
    		else{
	    		// Actualizamos el index anterior
	    		if(lastItemChoosed!=null){
	    			var lastItem = configurationFormIntancesConectionViewList
			        			.sections[lastItemChoosed[0]].getItemAt(lastItemChoosed[1]);
	    			if(itemConected!=null && lastItemChoosed[0]==itemConected[0] && lastItemChoosed[1]==itemConected[1]){
	    				lastItem.template = 'template_conected';
	    			}
	    			else{
	    				lastItem.template = 'template';
	    			}
	    			configurationFormIntancesConectionViewList
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
				    configurationFormIntancesConectionViewList
			        			.sections[lastItemChoosed[0]].updateItemAt(lastItemChoosed[1], item);  
				    configurationFormIntancesConectionViewList.scrollToItem(e.sectionIndex, e.itemIndex);
	    		}
	    		// Se cancelan todas las conexiones
	    		else{
	    			lastItemChoosed = null;
	    		}
    		}
    	};
    	configurationFormIntancesConectionViewList.addEventListener('itemclick', configurationFormIntancesConectionViewList.changeConection);

    	configurationFormIntancesConectionView.add(configurationFormIntancesConectionViewList);
		configurationFormIntancesContainer.add(configurationFormIntancesConectionView);

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

				sectionsConectionListView = null;
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

		        if(configurationFormIntancesConectionView!=null){
		        	 if(configurationFormIntancesConectionViewList!=null){
				        configurationFormIntancesConectionViewList.removeEventListener('itemclick', 
				        	configurationFormIntancesConectionViewList.changeConection);
				        delete configurationFormIntancesConectionViewList.changeConection;
				        configurationFormIntancesConectionView.remove(configurationFormIntancesConectionViewList);
				        configurationFormIntancesConectionViewList = null;
			        }
		        	configurationFormIntancesContainer.remove(configurationFormIntancesConectionView);
					configurationFormIntancesConectionView = null;
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
	    destroyNewConection();

	    // Contenedor de Opciones
		destroyConfiguration();

		theme = null;
		_self = null;
	};

	createConfiguration();
	return _self;

};

module.exports = instanceManagerView;
