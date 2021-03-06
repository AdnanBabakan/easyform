$.fn.extend({
	easyformDebug: function() {
		$(this).attr('data-easyform-debug', 'on');
	},
	easyform: function(inputs, options={}, submitCallBack=function() {}) {
		var thisElement = $(this);
		var debugMode = thisElement.data('easyform-debug');
		if(options.action) {
			$(this).attr('action', options.action);
		}
		if(options.method) {
			$(this).attr('method', options.method);
		}
		if(options.enctype) {
			$(this).attr('enctype', options.enctype);
		}
		if(options.styleClass) {
			$(this).attr('class', options.styleClass);
		} else {
			$(this).attr('class', 'easyform-default');
		}
		$.each(options.attrs, function() {
			thisElement.attr(this.name, this.value);
		});
		var elemntHTML = '<table class="easyform-default">';
		var idArray = [];
		var i = 0;
		let labelForLoop;
		let typeForLoop;
		let nameForLoop;
		let idForLoop;
		let attrForInputLoop;
		let valueForInputLoop;
		let placeholderForInputLoop;
		let idForRadioLoop;
		let isFormUploading;
		let isThereSubmitFunc;
		$.each(inputs, function() {
			i++;
			if($.inArray(this.id, idArray)!==-1 && this.id) {
				if(debugMode==="on") {
					elemntHTML += '<tr><td colspan="2" style="text-align: center;">Error for this input! [Input number ' + i + '] ( Check log )</td></tr>';
					console.log("Input with \'" + this.id + "\' id cannot be redefined! [Input number " + i + "] ( easyform )");
				}
			} else {
				idArray.push(this.id);
				if(!this.label) {
					labelForLoop = 'Input ' + i;
				} else {
					labelForLoop = this.label;
				}
				if(!this.type) {
					typeForLoop = 'text';
				} else {
					typeForLoop = this.type;
				}
				if(!this.name) {
					nameForLoop = 'input' + i;
				} else {
					nameForLoop = this.name;
				}
				if(!this.id) {
					idForLoop = 'input' + i;
				} else {
					idForLoop = this.id;
				}
				switch(typeForLoop) {
					default:
						if(debugMode==="on") {
							elemntHTML += '<tr><td colspan="2" style="text-align: center;">Error for this input! [Input number ' + i + '] ( Check log )</td></tr>';
							console.log("Input with \'" + typeForLoop + "\' type couldn't be found to be made. [Input number " + i + "] ( easyform )");
						}
					break;
					case 'text':
					case 'password':
					case 'email':
					case 'number':
					case 'file':
						attrForInputLoop = "";
						$.each(this.attrs, function() {
							attrForInputLoop += this.name + '="' + this.value + '"';
						});
						valueForInputLoop = "";
						if(this.value) {
							valueForInputLoop = 'value="' + this.value + '"';
						} else {
							valueForInputLoop = '';
						}
						if(this.placeholder) {
							placeholderForInputLoop = 'placeholder="' + this.placeholder + '"';
						} else {
							placeholderForInputLoop = '';
						}
						elemntHTML += '<tr><td><label for="' + idForLoop + '">' + labelForLoop + ': </label></td><td><input type="' + typeForLoop + '" name="' + nameForLoop + '" ' + valueForInputLoop + ' ' + placeholderForInputLoop + ' id="' + idForLoop + '" ' + attrForInputLoop + ' /></td></tr>';
						if(typeForLoop==="file") {
							isFormUploading = true;
						}
					break;
					case 'textarea':
						attrForInputLoop = "";
						$.each(this.attrs, function() {
							attrForInputLoop += this.name + '="' + this.value + '"';
						});
						if(this.placeholder) {
							placeholderForInputLoop = 'placeholder="' + this.placeholder + '"';
						} else {
							placeholderForInputLoop = '';
						}
						if(this.value) {
							valueForInputLoop = this.value;
						} else {
							valueForInputLoop = '';
						}
						elemntHTML += '<tr><td><label for="' + idForLoop + '">' + labelForLoop + ': </label></td><td><textarea name="' + nameForLoop + '" ' + placeholderForInputLoop + ' id="' + idForLoop + '" ' + attrForInputLoop + '>' + valueForInputLoop + '</textarea></td></tr>';
					break;
					case 'select':
						elemntHTML += '<tr><td><label for="' + idForLoop + '">' + labelForLoop + ': </label></td><td><select name="' + nameForLoop + '" id="' + idForLoop + '">';
						$.each(this.options, function() {
							if(this.id) {
								idForOptionLoop = 'id="' + this.id + '"';
							} else {
								idForOptionLoop = '';
							}
							elemntHTML += '<option value="' + this.value + '" ' + idForOptionLoop + '>' + this.text + '</option>';
						});
						elemntHTML += '</select></td></tr>';
					break;
					case 'radio':
						elemntHTML += '<tr><td><label for="' + idForLoop + '">' + labelForLoop + ': </label></td><td>';
						$.each(this.options, function() {
							elemntHTML += '<input type="' + typeForLoop + '" name="' + nameForLoop + '" value="' + this.value + '" id="' + idForLoop + '-' + this.value + '" /> <label for="' + idForLoop + '-' + this.value + '">' + this.text + '</label> ';
						});
						elemntHTML += '</td></tr>';
					break;
					case 'checkbox':
						elemntHTML += '<tr><td><label for="' + idForLoop + '">' + labelForLoop + ': </label></td><td>';
						$.each(this.options, function() {
							elemntHTML += '<input type="' + typeForLoop + '" name="' + nameForLoop + '[]" value="' + this.value + '" id="' + idForLoop + '-' + this.value + '" /> <label for="' + idForLoop + '-' + this.value + '">' + this.text + '</label> ';
						});
						elemntHTML += '</td></tr>';
					break;
					case 'button':
					case 'submit':
					case 'reset':
						attrForInputLoop = "";
						$.each(this.attrs, function() {
							attrForInputLoop += this.name + '="' + this.value + '"';
						});
						elemntHTML += '<tr><td colspan="2"><button type="' + typeForLoop + '" id="' + idForLoop + '" ' + attrForInputLoop + '>' + this.text + '</button></td></tr>';
					break;
					case 'submitFunc':
						if(isThereSubmitFunc) {
							if(debugMode==="on") {
								elemntHTML += '<tr><td colspan="2" style="text-align: center;">Error for this input! [Input number ' + i + '] ( Check log )</td></tr>';
								console.log("There can only be one submitFunc. [Input number " + i + "] ( easyform )");
							}
						} else {
							attrForInputLoop = "";
							$.each(this.attrs, function() {
								attrForInputLoop += this.name + '="' + this.value + '"';
							});
							elemntHTML += '<tr><td colspan="2"><button type="button" id="submitFunc" ' + attrForInputLoop + '>' + this.text + '</button></td></tr>';
							isThereSubmitFunc = true;
						}
					break;
				}
				if(isFormUploading && !options.enctype) {
					thisElement.attr('enctype', 'multipart/form-data');
				}
			}
		});
		elemntHTML += '</table>';
		thisElement.append(elemntHTML);
		if(i===0) {
			thisElement.html("Come on! Make a form so I can display it!");
		}
		thisElement.find('button#submitFunc').click(function() {
			var formData = [];
			thisElement.find('input').each(function() {
				var thisInputName = $(this).attr('name');
				var thisInputValue = $(this).val();
				formData.push({'name': thisInputName, 'value': thisInputValue});
			});
			submitCallBack(results=formData);
		});
	},
	easyformImportStyles: function() {
		const easyformStyles = 'form.easyform-default input, form.easyform-default textarea, form.easyform-default select, form.easyform-default button {\
									background: #ffffff;\
									width: auto;\
									height: auto;\
									padding: 3px;\
									border: 1px solid #cccccc;\
									border-radius: 4px;\
								}';
		$(this).append('<style>' + easyformStyles + '</style>');
	}
});
