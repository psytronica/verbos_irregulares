/*
* Verbos irregulares v1.0
* Автор: Мара Черкасова
* Email: mara.scorpio@yandex.ru
*/

var ZE_SCREEN  = 1;

var ZE_CURRENT = {"modo": "", "tiempo" : "", "persona" : ""};
var ZE_LOCK = {"modo": false, "tiempo" : false, "persona" : false};


var ZE_VERBO=[];
var ZE_FORMA="";

var ZE_HISTORY = [];
var ZE_HISTORY_INDEX = 0;

var MAX_HISTORY_LEN = 50;

var MODOS = {"Indicativo": {
            'simple': ['Presente', 'Pretérito imperfecto', 'Pretérito perfecto simple', 'Futuro'],
            'compuesto': ['Pretérito perfecto compuesto', 'Pretérito pluscuamperfecto', 'Pretérito anterior', 'Futuro perfecto']
        },
        "Subjuntivo": {
            'simple': ['Presente', 'Pretérito imperfecto', 'Futuro'],
            'compuesto': ['Pretérito perfecto', 'Pretérito pluscuamperfecto', 'Futuro perfecto']
        },
        "Condicional": {
            'simple': ["Condicional"],
            'compuesto': ['Condicional compuesto']
        },
        "Imperativo": {
            'simple': ["Afirmativo", "Negativo"]
        }
};

var PERSONAS=['yo', 'tú', 'él', 'nosotros', 'vosotros', 'ellos'];

var PERSONAS_SE=['me', 'te', 'se', 'nos', 'os', 'se'];

HABER = {"Indicativo": {

            'Pretérito perfecto compuesto': ['he', 'has', 'ha', 'hemos', 'habéis', 'han'],
            'Pretérito pluscuamperfecto': ['había', 'habías', 'había', 'habíamos', 'habíais', 'habían'],
            'Pretérito anterior': ['hube', 'hubiste', 'hubo', 'hubimos', 'hubisteis', 'hubieron'],
            'Futuro perfecto': ['habré', 'habrás', 'habrá', 'habremos', 'habréis', 'habrán']
        },
        "Subjuntivo": {

            'Pretérito perfecto': ['haya', 'hayas', 'haya', 'hayamos', 'hayáis', 'hayan'],
            'Pretérito pluscuamperfecto': ['hubiera', 'hubieras', 'hubiera', 'hubiéramos', 'hubierais', 'hubieran'],
            'Futuro perfecto': ['hubiere', 'hubieres', 'hubiere', 'hubiéremos', 'hubiereis', 'hubieren']

        },
        "Condicional": {
            'Condicional compuesto': ['habría', 'habrías', 'habría', 'habríamos', 'habríais', 'habrían']

        }
};


ZE_REPLACES = {'a':'á', 'i':'í', 'e' : 'é', 'n': 'ñ', 'o': 'ó', 'u': 'ú'}
ZE_REPLACES2 = {":u": 'ü', "~n": 'ñ'};


var ZE_ORDER_MODOS=[2, 1, 0, 3];

jQuery(document).ready(function(){

	ze_change_screen();

	ze_get_MTP();

	ze_list_fill();

	ze_list_actions();

	ze_get_verbo();

	ze_history_add();
});

function zempty_obj(obj){
	return (jQuery.type(obj) === "object"  && jQuery.isEmptyObject(obj));
}
function zfill_obj(obj){
	return (jQuery.type(obj) === "object"  && !jQuery.isEmptyObject(obj));
}
function zempty(el){
	return (el == "" || zempty_obj[el]);
}
function zin(obj, el){
	return (jQuery.type(obj) === "object"  && jQuery.type(obj[el]) !== "undefined");
}
function ze_if_sel_all(){
	return (ZE_SELECTED == "ALL" || zempty(ZE_SELECTED));
}

function ze_in_array(el, arr){
	for(i in arr){ if(arr[i] == el) return true; }
	return false;
}

function ze_get_MTP(){

	var possible_MTP = [];

	var sel_all = ze_if_sel_all();

	for(var modo in MODOS){

		if(!ZE_LOCK["modo"] && ZE_LOCK["persona"] 
			&& ZE_CURRENT["persona"] == PERSONAS[0] && modo == "Imperativo" ){
			continue;
		}

		if(zfill_obj(ZE_SELECTED) && zempty(ZE_SELECTED[modo])) continue;

		var zmd = (zin(ZE_SELECTED, modo))? ZE_SELECTED[modo] : false;
		var mall = (sel_all || zmd == "ALL");

		if(!ZE_LOCK["modo"] || modo == ZE_CURRENT["modo"]){
		
			var marr = (modo == "Imperativo")? 
				MODOS[modo]["simple"] : MODOS[modo]["simple"].concat(MODOS[modo]["compuesto"]);

			for(tnum in marr){
				stiempo = marr[tnum];
				stnum = tnum+"";

				if(ZE_LOCK["tiempo"] && stiempo != ZE_CURRENT["tiempo"]) continue;

				if(!mall && !zin(zmd, stnum)) continue;

				var tall = (mall || (zin(zmd, stnum) && zmd[stnum] == "ALL"));

				for(pnum in PERSONAS){

					spnum = pnum+"";

					if (ZE_LOCK["persona"] && PERSONAS[pnum]!= ZE_CURRENT["persona"]) continue;
					
					if (pnum == 0 && modo == "Imperativo") continue;

					if (!tall && !ze_in_array( spnum, zmd[stnum] )) continue;

						possible_MTP.push([modo,stiempo,PERSONAS[pnum]]);
					
				}
					

			}
		}
	}
	var cur_MTP = Math.floor(Math.random()*possible_MTP.length);

	jQuery(["modo", "tiempo", "persona"]).each(function(i, xtype){
		ZE_CURRENT[xtype] = possible_MTP[cur_MTP][i];
	});

}


function ze_in(xval, xtype){

	var sel_all = ze_if_sel_all();

	if(xtype == "modo"){
		return (sel_all || !zfill_obj(ZE_SELECTED) || !zempty(ZE_SELECTED[xval]));
	}

	xtype = xtype+"";

	var modo = ZE_CURRENT["modo"];
	var zmd = (zin(ZE_SELECTED, modo))? ZE_SELECTED[modo] : false;
	var mall = (sel_all || zmd == "ALL");	

	if(xtype == "tiempo"){
		return (mall || zin(zmd, xval));
	}


	var marr = (modo == "Imperativo")? 
		MODOS[modo]["simple"] : MODOS[modo]["simple"].concat(MODOS[modo]["compuesto"]);

	var stnum = "";
	for (tnum in marr){
		if(marr[tnum] == ZE_CURRENT["tiempo"]){
			stnum = tnum+"";
			break;
		}
		
	}


	var tall = (mall || (zin(zmd, stnum) && zmd[stnum] == "ALL"));

	return (tall || ze_in_array( xval, zmd[stnum] ));

}


function ze_get_values(xtype){
	if(xtype=="modo"){

		var mds = [];
		for(var modo in MODOS){
			if(ze_in(modo, "modo")) mds.push(modo);
		}

		return mds;

	}else if(xtype=="tiempo"){

		return ze_get_tiempo_values();
	}else{

		return ze_get_persona_values();
	}
}



function ze_get_tiempo_values(){

	var modo = ZE_CURRENT["modo"];

	var marr = (modo == "Imperativo")? 
		MODOS[modo]["simple"] : MODOS[modo]["simple"].concat(MODOS[modo]["compuesto"]);

	var tps = [];
	for (var tnum in marr){

		if(ze_in(tnum, "tiempo")) tps.push(marr[tnum]);
	}

	return tps;
}

function ze_get_persona_values(){

	var ps = [];
	for ( pnum in PERSONAS ){
		if(ZE_CURRENT["modo"] == "Imperativo" && pnum == 0) continue;

		if(ze_in(pnum, "persona")) ps.push(PERSONAS[pnum]);
	}

	return ps;
}

function ze_list_fill(){

	jQuery(["modo", "tiempo", "persona"]).each(function(i, xtype){
		ze_create_list(xtype, ze_get_values(xtype));
	});

}

function ze_create_list_cont(xvalues){

	var cont = "";
	for(var i=0; i < xvalues.length; i++){
		cont+='<div onclick="ze_sel_val(this)">'+xvalues[i]+"</div>";
	}
	return cont;

}

function ze_create_list(xtype, xvalues){

	var xlist = jQuery('#ze_list_'+xtype);
	xlist.append('<div class="ze_list_title">'+ZE_CURRENT[xtype]+'</div>');
	var cont ='<div class="ze_list_content">' + ze_create_list_cont(xvalues) + '</div>';
	xlist.append(cont);
}

function ze_change_list(xtype, isnext){

	var cont_dom = jQuery('#ze_list_'+xtype+' .ze_list_content');

	var xps = ze_get_values(xtype);
	
	var cont = ze_create_list_cont(xps);
	cont_dom.html(cont);


	if(isnext){
		jQuery('#ze_list_'+xtype+' .ze_list_title').text(ZE_CURRENT[xtype]);
		return;
	}



	var in_arr = false;
	for(var i=0; i< xps.length; i++){
		if(xps[i] == ZE_CURRENT[xtype]){
			in_arr = true;
			break;
		}
	}

	if(!in_arr){

		ZE_CURRENT[xtype] = jQuery('#ze_list_'+xtype+ ' .ze_list_content div').first().text();

		jQuery('#ze_list_'+xtype+' .ze_list_title').text(ZE_CURRENT[xtype]);
	}

}

function ze_go_prev(){
	if(ZE_HISTORY_INDEX<2) return;
	ZE_HISTORY_INDEX--;
	var hist = ZE_HISTORY[ZE_HISTORY_INDEX-1];
	ZE_CURRENT["modo"] = hist[0];
	ZE_CURRENT["tiempo"] = hist[1];
	ZE_CURRENT["persona"] = hist[2];

	ZE_FORMA = hist[4];

	jQuery('#ze_list_modo .ze_list_title').text(ZE_CURRENT['modo']);
	ze_change_list('tiempo');
	ze_change_list('persona');

	jQuery('#ze_verbo').text(hist[3]);
	jQuery('#ze_answer').text(ZE_FORMA);
}


function ze_go_next(){
	ze_get_MTP();

	jQuery('#ze_list_modo .ze_list_title').text(ZE_CURRENT['modo']);
	ze_change_list('tiempo', true);
	ze_change_list('persona', true);

	ze_get_verbo();

	jQuery('#ze_text').val("");
	jQuery('#ze_text').removeClass("zellow").removeClass("zegreen");

	ze_history_add();
}


function ze_list_actions(){

	jQuery(document).click(function(event) {
		var target = event.target || event.srcElement;
	    if ( !jQuery(target).hasClass(".ze_list_wrapper") &&
	     !jQuery(target).closest( ".ze_list_wrapper" ).length ) {
	        jQuery('.ze_list_content').hide();
	    }
	});
	jQuery('.ze_list_title').click(function(){
		jQuery(this).parents('.ze_list_wrapper').
			find('.ze_list_content').toggle();
	});

	jQuery('.ze_td_lock img').click(function(){
		var xtype = this.getAttribute("rel");
		ZE_LOCK[xtype] = !ZE_LOCK[xtype];
		var lockimg = (!ZE_LOCK[xtype])? "un" : "";
		this.src = jQuery("#ze_img_"+lockimg+"lock_src").val();
	});

	jQuery('#ze_anterior').click(function(){
		ze_go_prev();
	});
	jQuery('#ze_siguiente').click(function(){
		ze_go_next();
	});


	jQuery('#ze_show_answer').click(function(){
		jQuery('#respuesta_wrapper').toggleClass('hide');
	});

	jQuery('#ze_text').click(function(){
		ze_change_text();
	}).keyup(function(){
		ze_change_text();
	});

	jQuery(document).keypress(function(e) {
	    if(e.which == 13 && ZE_SCREEN == 1) {
	        ze_go_next();
	    }
	});


}

function ze_sel_val(self){

	jQuery(self).parent().hide();

	var text_before = jQuery(self).parents('.ze_list_wrapper').
		find('.ze_list_title').text();

	if(text_before!= self.innerHTML){
		jQuery(self).parents('.ze_list_wrapper').
			find('.ze_list_title').text(self.innerHTML);
		var xtype = jQuery(self).closest(".ze_list_wrapper")[0].id.substring(8);

		ZE_CURRENT[xtype] = self.innerHTML;

		if(xtype == "modo"){
			ze_change_list("tiempo");
		}
		if(xtype != "persona"){
			ze_change_list("persona");
		}
	}
	ze_get_verbo_form();
}

function ze_get_verbo(){
	var verbo_num  = Math.floor(Math.random()*ZE_FORMAS.length);
	ZE_VERBO  = ZE_FORMAS[verbo_num];
	ze_get_verbo_form();
}

function ze_get_verbo_form(){

	jQuery("#ze_verbo").text(ZE_VERBO[1]);

	db_num = {"modo": "", "tiempo" : "", "persona" : ""}
	k = 0;
	for (modo in MODOS){
		if(modo == ZE_CURRENT["modo"]){
			for (kk in ZE_ORDER_MODOS){
				if (ZE_ORDER_MODOS[kk] == k){
					db_num["modo"] = kk+"";
				}
			}
			break
		}
		k++;
	}

	k = 0;
	for (tnum in MODOS[ZE_CURRENT["modo"]]["simple"]){
		tiempo = MODOS[ZE_CURRENT["modo"]]["simple"][tnum];
		if( tiempo == ZE_CURRENT["tiempo"]){
			db_num["tiempo"] = k+"";
			break;
		}
		k++;
	}


	k=0;
	for (pnum in PERSONAS){
		if(PERSONAS[pnum] == ZE_CURRENT["persona"]){
			db_num["persona"] = k+"";
			break;
		}
		k++;
	}

	if(db_num["tiempo"] !=""){
		ZE_FORMA = ZE_CONJUGACIONES[ZE_VERBO[0]][db_num["modo"]+db_num["tiempo"]+db_num["persona"]]
	}else{
		ZE_FORMA = HABER[ZE_CURRENT["modo"]][ZE_CURRENT["tiempo"]][pnum]+ " " + ZE_VERBO[2];
	}

	ZE_FORMA = addNoSe(ZE_VERBO[1], ZE_CURRENT["tiempo"], ZE_FORMA, pnum);

	jQuery("#ze_answer").text(ZE_FORMA);


}

function addNoSe(verbo, tiempo, formass, person_num){

	var fms = formass.split(";");
	var f = [];
	for (k in fms){

		forma = jQuery.trim(fms[k]);

	    if (verbo.substring(verbo.length-2) == "se" && tiempo != "Afirmativo"){
	        forma = PERSONAS_SE[person_num] + " " + forma 
	    }
	    if (tiempo == "Negativo"){
	        forma = "no " + forma;
	    }
	    f.push(forma);

	}
            
    return f.join("; ");
}

function ze_change_text(){
	var txt = jQuery("#ze_text").val().toLowerCase();

	for(rfrom in ZE_REPLACES){
		rto = ZE_REPLACES[rfrom];
		if (txt.indexOf("'"+rfrom) > -1){
			txt = txt.replace("'"+rfrom, rto);
			jQuery("#ze_text").val(txt);
		}
		if (txt.indexOf("."+rfrom) > -1){
			txt = txt.replace("."+rfrom, rto);
			jQuery("#ze_text").val(txt);
		}

	}
	for(rfrom in ZE_REPLACES2){
		rto = ZE_REPLACES2[rfrom];
		if (txt.indexOf(rfrom) > -1){
			txt = txt.replace(rfrom, rto);
			jQuery("#ze_text").val(txt);
		}

	}

	var trimtxt = jQuery.trim(txt);
	var fms = ZE_FORMA.split(";");

	var equal = false;
	for(fnum in fms){
		if(jQuery.trim(fms[fnum]) == trimtxt){
			jQuery("#ze_text").addClass("zegreen").removeClass("zellow");
			equal = true;
			break;
		}		
	}
	
	if(!equal){

		if(trimtxt){
			jQuery("#ze_text").addClass("zellow").removeClass("zegreen");
		}else{
			jQuery("#ze_text").removeClass("zellow").removeClass("zegreen");
		}
	}

}

function ze_history_add(){

	if(ZE_HISTORY.length > MAX_HISTORY_LEN){
		ZE_HISTORY = []
	}

	ZE_HISTORY.push([ZE_CURRENT["modo"], ZE_CURRENT["tiempo"], ZE_CURRENT["persona"],
					ZE_VERBO[1], ZE_FORMA]);

	ZE_HISTORY_INDEX = ZE_HISTORY.length;

}




function ze_change_screen(){

	jQuery(".ze_top_img").click(function(){

		if(jQuery(this).hasClass("ze_top_prev")){
			ZE_SCREEN = (ZE_SCREEN > 1)? ZE_SCREEN - 1 : 3;
		}else if (jQuery(this).hasClass("ze_top_next")){
			ZE_SCREEN = (ZE_SCREEN < 3)? ZE_SCREEN + 1 : 1;
		}else if (jQuery(this).hasClass("ze_top_settings")){
			ZE_SCREEN = 2;
		}else if (jQuery(this).hasClass("ze_top_question")){
			ZE_SCREEN = 3;
		}else{
			ZE_SCREEN =1;
		}
		ze_goto_screen();
	});

}

var ZE_SCREEN_SETTINGS_CREATED = false;

function ze_goto_screen(){

		var w = parseInt(jQuery("#ze_wrapper").css("width"));
		jQuery("#ze_screens").css("margin-left", (-1*(ZE_SCREEN-1)*w)+"px");

		if(ZE_SCREEN == 2 && !ZE_SCREEN_SETTINGS_CREATED){
			ze_create_settings();
			ZE_SCREEN_SETTINGS_CREATED = true;
		}

		jQuery(".screen_head.current").removeClass("current");
		jQuery("#screen_head_"+ZE_SCREEN).addClass("current");
}



/*********************** SECOND TAB ****************************/

function ze_create_settings(){
	k=0;
	for(modo in MODOS){ 
		cl = (!k)? " active" : "";
		jQuery("#ze_modos_tabs").append("<div rel='"+k+"' class='ze_tab"+cl+"'>"+modo+"</div>");
		
		var mtable = "<table class='ze_content_modo_table' rel='"+modo+"'><thead><tr>";

		mtable += "<th class='ze_th_all'>ALL</th>";
		var l = 0;
		for(tnum in MODOS[modo]["simple"]){
			tiempo = MODOS[modo]["simple"][tnum];
			mtable += "<th rel='"+l+"'><div>"+ze_th_short(tiempo, modo)+"</div></th>";
			l++;
		}

		if(modo != "Imperativo"){
			for(tnum in MODOS[modo]["compuesto"]){
				tiempo = MODOS[modo]["compuesto"][tnum];
				mtable += "<th rel='"+l+"'><div>"+ze_th_short(tiempo, modo)+"</div></th>";
				l++;
			}

		}

		mtable += "</tr></thead><tbody>";

		for(pnum in PERSONAS){
			if(pnum == 0 && modo == "Imperativo")continue;

			mtable += "<tr>";

			mtable += "<td class='ze_persona_td'><div>"+PERSONAS[pnum]+"</div></td>";
			var l = 0;
			for(tnum in MODOS[modo]["simple"]){
				tiempo = MODOS[modo]["simple"][tnum];
				mtable += "<td rel='"+l+"' pnum='"+pnum+"'><div class='ze_td_pers'>"+PERSONAS[pnum]+
				"</div><div class='ze_td_t_short'>"+
				ze_tiempo_short(tiempo, modo)+"</div></td>";
				l++;
			}

			if(modo != "Imperativo"){
				for(tnum in MODOS[modo]["compuesto"]){
					tiempo = MODOS[modo]["compuesto"][tnum];
					mtable += "<td rel='"+l+"' pnum='"+pnum+"'><div class='ze_td_pers'>"+PERSONAS[pnum]
					+"</div><div class='ze_td_t_short'>"+
					ze_tiempo_short(tiempo, modo)+"</div></td>";
					l++;
				}

			}

			mtable += "</tr>";

		}

		mtable += "</tbody></table>";

		jQuery("#ze_modos_content").append("<div id='ze_content_tab"
			+k+"' class='ze_content_tab"+cl+"'>"+mtable+"</div>");
		k++;
	}

	jQuery("#ze_modos_tabs .ze_tab").click(function(){
		if(jQuery(this).hasClass("active")) return;

		jQuery('.ze_content_tab.active, .ze_tab.active').removeClass("active");
		jQuery('#ze_content_tab'+this.getAttribute("rel")).addClass("active");
		jQuery(this).addClass('active');


	});

	jQuery(".ze_content_modo_table td").click(function(){
		var isSel = !(jQuery(this).hasClass("selected"));
		jQuery(this).toggleClass('selected');
		if(jQuery(this).hasClass('ze_persona_td')){
			if(isSel){
				jQuery(this).parent().find('td').addClass("selected");
			}else{
				jQuery(this).parent().find('td').removeClass("selected");
			}
		}
		ze_selection_check(this);
		ze_refill();
	});
	jQuery(".ze_content_modo_table th").click(function(){
		var isSel = !(jQuery(this).hasClass("selected"));
		var isAll = jQuery(this).hasClass("ze_th_all");
		jQuery(this).toggleClass('selected');
		var tnum =  this.getAttribute("rel");

		var r = (isAll)? ', th' : '[rel="'+tnum+'"]';
		
		var tbl = jQuery(this).closest(".ze_content_modo_table");
		if(isSel){
			tbl.find('td'+r).addClass("selected");
		}else{
			tbl.find('td'+r).removeClass("selected");
		}

		if(isAll){
			ZE_SELECTED[tbl.attr('rel')] = (isSel)? "ALL" : "";
			ze_selection_save();
		}else{
			ze_selection_check(this);
		}
		ze_refill();

	});	

	ze_select_settings();
}



function ze_select_settings(){
	if(ze_if_sel_all()){
		jQuery("#ze_modos_content td, #ze_modos_content  th").addClass("selected");
		return;
	}

	if(jQuery.type(ZE_SELECTED) !== "object" ) return;

	for (var modo in ZE_SELECTED){
		mobj = ZE_SELECTED[modo];
		if(mobj == "") continue;

		var tbl = jQuery(".ze_content_modo_table[rel='" + modo + "']");

		if(mobj == "ALL"){
			tbl.find("td, th").addClass("selected");
			continue;
		}

		var ths = tbl.find("th:not(.ze_th_all)");
		

		ths.each(function(index, th){
			if(mobj[index] == "ALL"){
				tbl.find("td[rel='"+index+"']").addClass("selected");
			}else{
				jQuery(mobj[index]).each(function(i, pnum){
					tbl.find("td[rel='"+index+"'][pnum='"+pnum+"']").addClass("selected");
				});
			}
		});

		tbl.find(".ze_persona_td").each(function(index, el){
			if(jQuery(el).closest("tr").find("td.selected").length == ths.length){
				jQuery(el).addClass("selected");
			}
		});

	}
}

function ze_selection_check(self){
	var tbl = jQuery(self).closest(".ze_content_modo_table");
	var modo = tbl.attr('rel');
	var cols = tbl.find('th').length - 1;
	var rows = (modo == "Imperativo")? PERSONAS.length - 1 : PERSONAS.length;
	var tds = tbl.find("td.selected:not(.ze_persona_td)");

	if(tds.length == cols*rows){
		// ALL SELECTED
		ZE_SELECTED[modo] = "ALL";
		tbl.find("td, th").addClass("selected");
		ze_selection_save();
		return;
	}

	tbl.find("td.selected.ze_persona_td, th.selected").removeClass('selected');


	if(tds.length == 0){
		// NONE SELECTED
		ZE_SELECTED[modo] = "";
		ze_selection_save();
		return;
	}

	var crows = {};
	var rcols = {};

	ZE_SELECTED[modo] = {};

	tds.each(function(index, el){
		var col = el.getAttribute("pnum");
		var row = el.getAttribute("rel");

		rcols[row] = (rcols[row])? rcols[row]+1 : 1;
		crows[col] = (crows[col])? crows[col]+1 : 1;

		if(!ZE_SELECTED[modo][row]) ZE_SELECTED[modo][row] = [];
		ZE_SELECTED[modo][row].push(col);

		if(crows[col] == cols){
			tbl.find("td.ze_persona_td:eq("+col+")").addClass('selected');
		}
		if(rcols[row] == rows){
			tbl.find("th[rel='"+row+"']").addClass('selected');
			ZE_SELECTED[modo][row] = "ALL";			
		}

	})

	ze_selection_save();
}


function ze_selection_save(){
	//console.log("ZE_SELECTED = ", jQuery.stringify(ZE_SELECTED));

	// @TODO: JAVA handler goes here 
	// (для приложения с java-бекэндом c возможностью сохранения)
}


function ze_tiempo_short(tiempo, modo){

	if(modo == "Imperativo" || modo == "Condicional") return tiempo;
	var tarr = tiempo.split(" ");
	var zar = [];
	for(tnum in tarr){
		if(!tarr[tnum]) continue;
		zar.push(tarr[tnum].substring(0,1)+".");
	}
	return zar.join(" ");
}

function ze_th_short(tiempo, modo){
	if(modo != "Indicativo") return tiempo;
	tiempo = tiempo.replace("pluscuamperfecto", "pluscuam");
	return tiempo;
}

function ze_refill(){
	ZE_HISTORY = [];
	ZE_HISTORY_INDEX = 0;

	jQuery(["modo", "tiempo", "persona"]).each(function(i, xtype){
		ze_change_list(xtype);
	});
	ze_get_verbo_form();
}


jQuery.extend({
    stringify  : function stringify(obj) {         
        if ("JSON" in window) {
            return JSON.stringify(obj);
        }

        var t = typeof (obj);
        if (t != "object" || obj === null) {
            // simple data type
            if (t == "string") obj = '"' + obj + '"';

            return String(obj);
        } else {
            // recurse array or object
            var n, v, json = [], arr = (obj && obj.constructor == Array);

            for (n in obj) {
                v = obj[n];
                t = typeof(v);
                if (obj.hasOwnProperty(n)) {
                    if (t == "string") {
                        v = '"' + v + '"';
                    } else if (t == "object" && v !== null){
                        v = jQuery.stringify(v);
                    }

                    json.push((arr ? "" : '"' + n + '":') + String(v));
                }
            }

            return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
        }
    }
});