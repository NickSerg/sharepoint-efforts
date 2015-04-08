(function () {
    var overrideCtx = {};
    overrideCtx.Templates = {};
    overrideCtx.Templates.Fields = {
        'Effort': {
            'EditForm': newEffort,
        }
    };
    SPClientTemplates.TemplateManager.RegisterTemplateOverrides(overrideCtx);
})();

function newEffort(ctx) {
    var formCtx = SPClientTemplates.Utility.GetFormContextForCurrentField(ctx);
    formCtx.registerGetValueCallback(formCtx.fieldName, function () {
    	var res = '{';
		var  tabs = $("#tabs");
		tabs.find("ul li a[href^='#tabs']").each(function(index, element) {
			index += 1;
			if(index != 1) {
				res += ',';
			}
			
			res += '"' + element.text + '":{';
			var isFirstEffort = true;
			tabs.find("table[id='effort-" + element.text + "'] tr").each(function(){
		    	var date = $(this).find(".effortDatepicker");
		    	var effort = $(this).find(".effortValue");
				if(date[0].value != "" && effort[0].value != "")
				{
					if(!isFirstEffort) {	
		    			res += ',';
		    		}
		    		
		    		var effortValue = effort[0].value;
		    		if(!$.isNumeric(effort[0].value)) {
		    			effortValue = '"' + effortValue + '"';
		    		}

		    		res += '"' + date[0].value + '":' + effortValue ;
		    		isFirstEffort = false;
		    	}	
			});
			res += '}';
		});
		
		return res + '}';
    });
    var validators = new SPClientForms.ClientValidation.ValidatorSet();
    if (formCtx.fieldSchema.Required) {
        validators.RegisterValidator(new SPClientForms.ClientValidation.RequiredValidator());
    }
    
    if (validators._registeredValidators.length > 0) {
        formCtx.registerClientValidator(formCtx.fieldName, validators);
    } 
    
    var tabsHtmlBegin = "<div id='tabs'><ul>";
    var tabsHtmlEnd = "";
    var effortJson;
    if (ctx.CurrentItem.Effort && ctx.CurrentItem.Effort != '') {
        try{
        	effortJson = JSON.parse(ctx.CurrentItem.Effort);
        }
        catch(e) {
        }
    }

    ctx.CurrentItem.AssignedTo.forEach(function(value, index, arr) {
        index += 1;
        tabsHtmlBegin += "<li><a href='#tabs-"+index+"'>" + value.DisplayText +"</a></li>";
        var currentEffort;
        if(typeof(effortJson) != 'undefined' && effortJson.hasOwnProperty(value.DisplayText)) {
        	currentEffort = effortJson[value.DisplayText];
        }
        
        tabsHtmlEnd += "<div id='tabs-" + index + "'>" + "<p>" + getEffortTable(value.DisplayText, currentEffort) + "</p> </div>";
    });
    
    return tabsHtmlBegin + "</ul>" + tabsHtmlEnd + "</div>";
}

function getEffortTable(assignedTo, effort) {
	var tableHtmlBegin = "<table class='form-table' id='effort-" + assignedTo + "'>";
	tableHtmlBegin += "<tr valign='top'><td><input type='text' class='effortDatepicker' value='' /></td><td><input type='text' class='effortValue' value='' placeholder='Кол-во ч.'/></td><td><a href='javascript:void(0);' class='addEffortItem'>Добавить</a></td></tr>"
	
	if(typeof(effort) != 'undefined') {
		for(var item in effort) {
			tableHtmlBegin += "<tr valign='top'><td><input type='text' class='effortDatepicker' value=" + item + " /></td><td><input type='text' class='effortValue' value=" + effort[item] + " placeholder='Кол-во ч.' /></td><td><a href='javascript:void(0);' class='removeEffortItem'>Удалить</a></td></tr>";
		}
	}
	return tableHtmlBegin + "</table>";
}

function createTabs() {
    $(function () {
        $("#tabs").tabs();
        $(".removeEffortItem").click(function(){
	        $(this).parent().parent().remove();
	    });
	    $(".addEffortItem").click(function() {
	    	var tr = $(this).parent().parent();
	    	var curDate = tr.find(".effortDatepicker");
	    	var curEffort = tr.find(".effortValue");
	    	if(curDate[0].value != "" && curEffort[0].value != "") {	    					
		    	tr.after("<tr valign='top'><td><input type='text' class='effortDatepicker' value=" + curDate[0].value + " /></td><td><input type='text' class='effortValue' value=" + curEffort[0].value + " placeholder='Кол-во ч.' /></td><td><a href='javascript:void(0);' class='removeEffortItem'>Удалить</a></td></tr>");
		    	curDate.val('');
		    	curEffort.val('');		    
		    	tr.next().find(".effortDatepicker").datepicker({maxDate: "+0d"});
		    	tr.next().find(".removeEffortItem").click(function(){
		    		$(this).parent().parent().remove();
		    	});
		    }
	    });	    
    });
}

function createDatepicker() {
	$(function() {
		 $.datepicker.regional["ru"] = {
                    closeText: "Закрыть",
                    prevText: "&#x3c;Пред",
                    nextText: "След&#x3e;",
                    currentText: "Сегодня",
                    monthNames: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
                    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
                    monthNamesShort: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн",
                    "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
                    dayNames: ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"],
                    dayNamesShort: ["вск", "пнд", "втр", "срд", "чтв", "птн", "сбт"],
                    dayNamesMin: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
                    weekHeader: "Не",
                    dateFormat: "dd.mm.yy",
                    firstDay: 1,
                    isRTL: false,
                    showMonthAfterYear: false,
                    yearSuffix: ""
                };
        $.datepicker.setDefaults($.datepicker.regional["ru"]);
		$(".effortDatepicker").datepicker({maxDate: "+0d"});
	});
}

function loadScript(url, callback) {
    var script = document.createElement("script")
    script.type = "text/javascript";
    if (script.readyState) { //IE
        script.onreadystatechange = function () {
            if (script.readyState == "loaded" || script.readyState == "complete") {
                script.onreadystatechange = null;
                callback();
            }
        };
    } else { //Others
        script.onload = function () {
            callback();
        };
    }
    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}


function loadCss(url) {
    var css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = url;
    document.getElementsByTagName("head")[0].appendChild(css);
}

loadCss('https://code.jquery.com/ui/1.11.4/themes/overcast/jquery-ui.css');
loadScript("https://code.jquery.com/jquery-2.1.3.min.js", function () {
    loadScript('https://code.jquery.com/ui/1.11.4/jquery-ui.min.js', function () {
        createTabs(); 
        createDatepicker();
    });
});
