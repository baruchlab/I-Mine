//********************************
// iMiner dynamically created HTML
//********************************

function tag_html(tag,name,txt,value,units) {
	var html = '';
	html += '<'+tag+' id="'+name+'">\n';
	html += '\t' + data_html(txt,value+units) + '\n';
	html += '</'+tag+'>\n';
	return html;
}

function data_html(txt,value) {
	var html = '';
	html += '<h2>'+txt+'<'+'/h2><span class="data">'+value+'<'+'/span>';
	return html;
}

function select_html(clase,name,id,opts) {
	var html = '';
	html += '<select class="'+clase+'" id="'+id+'" name="'+name+'">\n';
	html += opts;
	html += '</select>\n';
	return html;
}

function option_html(value,text) {
	var html = '';
	html += '\t<option value="'+value+'">'+text+'</option>\n';
	return html;
}

function form_select_html() {
	var html = '';
	html += '\t\t\t\t<form id="select">\n';
	html += '\t\t\t\t\t<div id="about">'+write.about+'</div>\n';
	html += '\t\t\t\t\t<button class="button" type="button" value="new_user">'+write.new_miner+'</button>\n';
	html += '\t\t\t\t\t<button class="button" type="button" value="old_user">'+write.already_mining+'</button>\n';
	html += '\t\t\t\t</form>\n';
	return html;
}

function form_new_user_html() {
	var html = '';
	html += '\t\t\t\t<form id="new_user">\n';
	html += '\t\t\t\t\t<fieldset>\n';
	html += '\t\t\t\t\t\t<legend>'+write.name+'</legend>\n';
	html += '\t\t\t\t\t\t<input type="text" name="name" id="new_user_name" value="" />\n';
	html += '\t\t\t\t\t</fieldset>\n';
	html += '\t\t\t\t\t<fieldset>\n';
	html += '\t\t\t\t\t\t<legend>'+write.flag+'</legend>\n';
	html += '\t\t\t\t\t\t<div id="img_flag" class="valor_flag click"></div>\n';
	html += '\t\t\t\t\t</fieldset>\n';
	html += '\t\t\t\t\t<fieldset>\n';
	html += '\t\t\t\t\t\t<legend>'+write.location+'</legend>\n';
	html += '\t\t\t\t\t\t<input class="coords" type="text" name="lat" id="new_user_lat" value="" />\n';
	html += '\t\t\t\t\t\t<input class="coords" type="text" name="lng" id="new_user_lng" value="" />\n';
	html += '\t\t\t\t\t</fieldset>\n';
	html += '\t\t\t\t\t<input type="hidden" name="new_user" value="new_user" />\n';
	html += '\t\t\t\t\t<input class="submit" type="submit" name="submit" id="new_user_submit" value="'+write.play+'" />\n';
	html += '\t\t\t\t\t<button class="button" type="button" value="select">'+write.back+'</button>\n';
	html += '\t\t\t\t</form>\n';
	return html;
}

function form_old_user_html() {
	var html = '';
	html += '\t\t\t\t<form id="old_user">\n';
	html += '\t\t\t\t\t<fieldset>\n';
	html += '\t\t\t\t\t\t<legend>'+write.name+'</legend>\n';
	html += '\t\t\t\t\t\t<input type="text" name="name" id="old_user_name" value="" />\n';
	html += '\t\t\t\t\t</fieldset>\n';
	html += '\t\t\t\t\t<input type="hidden" name="old_user" value="old_user" />\n';
	html += '\t\t\t\t\t<input class="submit" type="submit" name="submit" id="old_user_submit" value="'+write.play+'" />\n';
	html += '\t\t\t\t\t<button class="button" type="button" value="select">'+write.back+'</button>\n';
	html += '\t\t\t\t</form>\n';
	return html;
}