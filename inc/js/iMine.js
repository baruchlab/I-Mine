//********************************
// iMine main javascript functons
//********************************

/*capture accelerometer data and saving it in javascript array */
var watchAccel = function() {
	var suc = function(a){
		accelData[0] = roundFloat(a.x,4);
		accelData[1] = roundFloat(a.y,4);
		accelData[2] = roundFloat(a.z,4);
  		
		if(!tracking) {
			if (a.y<=(-1.5)) {
				$("#miner_img img").attr('src','inc/img/miner_40_02.png');
				tracking=true;
			}
		} else if (a.y>=0) {
			tracking=false;
			$("#miner_img img").attr('src','inc/img/miner_40_01.png');
			navigator.notification.beep(1);
			minero.dig();
		}
			
	};
	var fail = function(){};
	var opt = {};
	opt.frequency = 100;
	watch = navigator.accelerometer.watchAcceleration(suc,fail,opt);
}
  			
function hide(list) {
	for(i=0; i<list.length; i++) {
		$(list[i]).hide();
	}
}
function show(list) {
	for(i=0; i<list.length; i++) {
		$(list[i]).show();
	}
}

function select_form_init() {
	var html = form_select_html();
	$(".wrapper").empty();
	$(".wrapper").append(html);
	$(".button").click(function () {
		var parent = $(this.parentNode).attr("id");
		var target = $(this).attr("value");
		$("#question").toggle();
		if (target=="new_user") {
			new_user_form_init();
		} else if (target=="old_user") {
			old_user_form_init();
		}
	});
}

function new_user_form_init() {
	var html = form_new_user_html();
	$(".wrapper").empty();
	$(".wrapper").append(html);
	loadFlags();
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {  
			$('#new_user_lat').attr('value',position.coords.latitude);
			$('#new_user_lng').attr('value',position.coords.longitude);
		});  
	} else {  
		alert(write.no_geolocation);  
	}
	$(".click").dblclick(function () {
		var id = $(this).attr("id");
		$(".valor" + id.slice(3)).hide();
		$(".campo" + id.slice(3)).show("slow");
	});
	$(".button").click(function () {
		$("#question").toggle();
		select_form_init();
	});
	$("#new_user").submit(function() {
		submit_new_user(this);
		return false;
	});
}

function old_user_form_init() {
	var html = form_old_user_html();
	$(".wrapper").empty();
	$(".wrapper").append(html);
	$(".button").click(function () {
		$("#question").toggle();
		select_form_init();
	});
	$("#old_user").submit(function() {
		submit_old_user(this);
		return false;
	});
}

function gameInit(user) {
	$("#imining").removeClass("form").addClass("game");
	hide(new Array('#question', '.wrapper', 'h1'));
	$('.wrapper').empty();
	getUser(user);
}

function changeFlag() {
	var selected = document.forms.new_user.flag[document.forms.new_user.flag.selectedIndex].value;
	$('#img_flag').html('<img src="'+root+flags[selected]+'"/>');
	oculta_campo("flag", "slow");
}

function oculta_campo (campo, speed) {
	$(".campo_" + campo).hide();
	$(".valor_" + campo).show(speed);
}

function loadFlags() {
	var url = 'inc/js/flags.js';
	jQuery.getJSON(url, function(data) {
		var options = '';
		var select = '';
		options += option_html(0, '--');
		$.each(data.imining_locations, function(i,location){
			if(location.name!='country name') {
				options += option_html(location.id, location.name);
				flags[location.id] = location.flag;
			}
			if (i==(data.total_flags-1)) {
				select = select_html('campo_flag','flag','new_user_flag', options);
				$('#img_flag').before(select);
				$("#new_user_flag").change( function(){
					changeFlag();
				});
			}
		});
	});
}

function submit_new_user(form) {
	var values = $(form).serialize();
	var url = root + "exec/user.php";
	if($('#new_user_name').attr('value')=="") {
		alert(write.need_name);
	} else if(document.forms.new_user.flag[document.forms.new_user.flag.selectedIndex].value==0) {
		alert(write.need_flag);
	} else {
		jQuery.post( url, values, function(data){
			if (typeof data.error == "undefined") {
				// el formulario se ha enviado correctamente
				alert(data.msg);
				gameInit(data.id);
			} else {
				// se ha producdo un error al enviar el formulario
				alert(data.msg);
				//alert("error: " + data.msg + " " + data.name + " " + data.flag + " " + data.lat + " " + data.lng + " " + data.submit);
			}
		}, "json" );
	}
}

function submit_old_user(form) {
	var values = $(form).serialize();
	var url = root + "exec/user.php";
	jQuery.post( url, values, function(data){
		if (typeof data.error == "undefined") {
			// el formulario se ha enviado correctamente
			alert(data.msg);
			if(data.alive==1) {
				gameInit(data.id);
			}
		} else {
			// se ha producdo un error al enviar el formulario
			alert(data.msg);
		}
	}, "json" );
}

function getUser(id) {
	var url = root + "exec/miners.js.php";
	jQuery.post( url, { user: id }, function(data){
		if (typeof data.error == "undefined") {
			// el formulario se ha enviado correctamente
			setCookie('userid',data.id,7);
			setCookie('username',data.name,7);
			minero.initialize(data);
			if (data.alive==1) {
				play();
			} else {
				// el usuario esta muerto
				minero.html();
				$("#imining").removeClass("game").addClass("gameover");
				minero.dead_html();
				$("#miner").show();
				setTimeout("gameover()",3000);
			}
		} else {
			// se ha producdo un error al enviar el formulario
			alert("error: " + data.msg);
		}
	}, "json" );
}

function play() {
	minero.html();
	watchAccel();
	timer();
	$("#wwage_wrapper").hide();
	$('#wwage_bar').bind('mousemove',function(e){
		bind_wage(e.pageX);
	});
	$('#wwage_bar').mouseleave(function(){
		$('#wwage_wrapper').fadeOut("fast");
	});
	$('#miner_settings button').click(function(){
		$('#wwage_wrapper').fadeIn("fast");
	});
	$("#miner").show("slow");
}

function bind_wage(x) {
	var window_width = window.innerWidth;
	var imining_width = px2int($('#imining').css('width'));
	var wwagebar_pos = px2int($('#wwage_bar').css('left'));
	var wwagebar_width = px2int($('#wwage_bar').css('width'));
	var offset = roundFloat((window_width-imining_width)/2,0) + wwagebar_pos - 8;
	var value = roundFloat((x - offset)/wwagebar_width,2);
	var txt = roundFloat((value*3 + 1) * minero.k_wage) + "$ cents";
	minero.change_wage(value*3 + 1);
	$("#wwagetxt").text(txt); 
	$("#wwage_bar div").css("width", value*wwagebar_width);
}

function timer() {
	minero.calculate_gametime();
	minero.update_html();
	t = setTimeout("timer()",1000);
}

function gameover() {
	clearTimeout(t);
	navigator.accelerometer.clearWatch(watch);
	navigator.notification.vibrate(2000);
	$('#miner_gameover').fadeOut(3000, function(){
		$('#miner_img_dead').append('<h1 class="bad">Sorry you are dead!<'+'/h1>');
		$('#miner_img_dead').append('<button class="restart" type="button">Try again</button>');
		$(".restart").click(function () {
			$('#miner').empty();
			delCookie('userid');
			delCookie('username');
			$("#imining").removeClass("gameover").addClass("form");
			$('#miner').empty();
			select_form_init();
			show(new Array('#question', '.wrapper', 'h1'));
		});
	})
}

(function($) {
  var cache = [];
  // Arguments are image paths relative to the current page.
  $.preLoadImages = function() {
    var args_len = arguments.length;
    for (var i = args_len; i--;) {
      var cacheImage = document.createElement('img');
      cacheImage.src = arguments[i];
      cache.push(cacheImage);
    }
  }
})(jQuery)