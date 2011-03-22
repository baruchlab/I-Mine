//**************
// iMiner Object
//**************

function iMiner() {
	
	// miner world wide id!
	this.id = 0;
	
	/* Profile information */
	this.name = "";
	this.lat = 0;
	this.lng = 0;
	this.flag = 0;
	this.date_birth = "";
	this.date_death = "";
	this.date_dig = "";
	this.life = "";
	this.flag_img = "";
	this.flag_name = "";
	
	this.profileProp = new Array(	//for repetitive tasks like retriving data
		"name",
		"lat",
		"lng",
		"flag",
		"date_birth",
		"date_death",
		"date_dig",
		"life",
		"flag_img",
		"flag_name"
	);
	
	/* Mining information */
	this.alive = false;				// is miner still alive?
	this.lapse = 0;					// time since last update
	this.digs = 0;					// number of clicks during game				
	this.value_digs = 0;			// clicks adjusted for attrition and wage
	this.eff = 0.5;					// efficiency using value_digs					
	this.raw_eff = 0;				// digs per gametime					
	this.recent_eff = 0;			// during the last 8 digs (how many digs per gametime)	
	this.savings = 0;				// total saving, calculated every 20 game seconds
	this.salary = 0;				// money sended to acumulate savings
	this.wwage = 1;					// raw_wage / 5 (between 1 and 4)
	this.attr1 = 1;					// attrition derived from activity (efficiency) ___starting value=1			
	this.attr2 = 1;					// attrition derived from gametime ___starting value=1
	
	this.miningProp = new Array(	//for repetitive tasks like retriving data
		"alive",
		"lapse",
		"digs",
		"value_digs",
		"eff",
		"raw_eff",
		"recent_eff",
		"savings",
		"salary",
		"wwage",
		"attr1",
		"attr2"
	);
	
	/* Local variables for calculations */
	this.k_wage = 5;					// each 1 wwage represents 5 cents
	this.k_digs = 8;					// k digs before sending digging data (8 digs)
	this.k_gametime = 20;				// k gamentime for average calculations (20 seconds)
	
	this.gametime = 0;					// seconds counted during game play (local game time nothing to do with global gametime!)
	this.recent_digs = 0;				// number of digs since last digging data was sent
	//this.recent_gametime = 0;			// local gameplay seconds since last digging data was sent 
	this.recent_avg_gametime = 0;		// local gameplay seconds since last 20 local gameplay seconds
	
	//this.raw_wage = 5;				// salary (from 5 to 20 cents) chosen by player, value starts at 5			
	//this.sqwage = 1;					// square root of wwage (between 1 and 2)
	this.tmp_avg_wage = 0;				// for average calculations
	this.avg_wage = 0;					// recent wage (every 20 seconds) – take an average of wwage during last 20 seconds of local gametime ___in my pd I use sqwage, not wwage					
	
	this.miner_min_x = 0;				// miner img possition k calculation variables
	this.miner_max_x = -40;
	this.miner_min_y = 30;
	this.miner_max_y = 18;
	this.miner_min_width = 100;
	this.miner_max_width = 223;
	this.miner_min_height = 141;
	this.miner_max_height = 300;
	
	this.calculationProp = new Array(	//for repetitive tasks like retriving data
		"k_wage",
		"k_digs",
		"k_gametime",
		"gametime",
		"recent_digs",
		//"recent_gametime",
		"recent_avg_gametime",
		//"raw_wage",
		//"sqwage",
		"tmp_avg_wage",
		"avg_wage"
	);
	
	/* game global variables returned from server */
	this.price = 0;					// the total price of an iphone
	this.self_price = 0;			// the theoretical price of an iphone if you only worked
	this.cod = 0;					// chance of death : checked every 20 seconds of gametime % chance of dying (random number generated)									
	this.cot = 0;					// chance of theft :  checked every 20 seconds of gametime % chance of soldier robbing the player  (random number generated)
	this.self_cod = 0;				// chance of death : checked every 20 seconds of gametime % chance of dying (random number generated)									
	this.self_cot = 0;				// chance of theft :  checked every 20 seconds of gametime % chance of soldier robbing the player  (random number generated)									
	
	this.globalProp = new Array(	//for repetitive tasks like retriving data
		"price",
		"self_price",
		"cod",
		"cot",
		"self_cod",
		"self_cot"
	);

}
iMiner.prototype.initialize = function(data) {
	
	/* Profile information */
	if (typeof(data.id)!="undefined") {
		this.id = data.id;
	}
	if (typeof(data.name)!="undefined") {
		this.name = data.name;
	}
	if (typeof(data.lat)!="undefined") {
		this.lat = parseFloat(data.lat);
	}
	if (typeof(data.lng)!="undefined") {
		this.lng = parseFloat(data.lng);
	}
	if (typeof(data.flag)!="undefined") {
		this.flag = data.flag;
	}
	if (typeof(data.date_birth)!="undefined") {
		this.date_birth = data.date_birth;
	}
	if (typeof(data.date_death)!="undefined") {
		this.date_death = data.date_death;
	}
	if (typeof(data.date_dig)!="undefined") {
		this.date_dig = data.date_dig;
	}
	if (typeof(data.life)!="undefined") {
		this.life = data.life;
	}
	if (typeof(data.flag_img)!="undefined") {
		this.flag_img = data.flag_img;
	}
	if (typeof(data.flag_name)!="undefined") {
		this.flag_name = data.flag_name;
	}
	
	/* Mining information */
	if (typeof(data.alive)!="undefined") {
		if (data.alive==1) {
			this.alive = true;
		}
	}
	if (typeof(data.digs)!="undefined") {
		this.digs = parseInt(data.digs);
	}
	if (typeof(data.value_digs)!="undefined") {
		this.value_digs = parseFloat(data.value_digs);
	}
	if (typeof(data.eff)!="undefined") {
		this.eff = parseFloat(data.eff);
	}
	if (typeof(data.raw_eff)!="undefined") {
		this.raw_eff = parseFloat(data.raw_eff);
	}
	if (typeof(data.recent_eff)!="undefined") {
		this.recent_eff = parseFloat(data.recent_eff);
	}
	if (typeof(data.attr1)!="undefined") {
		this.attr1 = parseFloat(data.attr1);
	}
	if (typeof(data.attr2)!="undefined") {
		this.attr2 = parseFloat(data.attr2);
	}
	if (typeof(data.savings)!="undefined") {
		this.savings = parseFloat(data.savings);
	}
	if (typeof(data.wwage)!="undefined") {
		this.wwage = parseFloat(data.wwage);
		var width = (this.wwage - 1)*100;
		$("#wwagetxt").text(roundFloat(this.wwage*this.k_wage) + "$ cents"); 
		$("#wwage_bar div").css("width",width);
	}
	
	if (typeof(data.lapse)!="undefined") {
		this.lapse = data.lapse;
	}
}

//gametime related calculations
iMiner.prototype.calculate_gametime = function() {
	this.gametime++;
	this.recent_avg_gametime++;
	this.tmp_avg_wage += (this.wwage / this.k_gametime); 	// calculate tmp average wage ___again, in my pd, this should be sqwage
	if(this.recent_avg_gametime > this.k_gametime) {		// each 20 seconds
		$("#soldier_img img").attr('src','inc/img/soldier2.png');
		this.avg_wage = this.tmp_avg_wage;					// store average wage
		this.salary = (this.avg_wage * this.k_wage);		// get some money 
		this.tmp_avg_wage = 0;								// inicialize tmp average wage
		this.recent_avg_gametime = 1;						// inicialize recent average gametime to count 20 again
		this.sendMoney();
	}
}

//code and cot related calculations ___there is no calculation here
iMiner.prototype.calculate_cod = function() {
	
}


iMiner.prototype.change_wage = function(value) {
	this.wwage = value;
	//this.raw_wage = value * this.k_wage;
	//this.sqwage = Math.sqrt(value);
}

iMiner.prototype.dig = function(value) {
	this.digs++;
	this.recent_digs++;
	if(this.recent_digs > this.k_digs) {
		//this.recent_eff = this.recent_digs / (this.gametime - this.recent_gametime);
		//this.recent_gametime = this.gametime;
		this.recent_digs = 1;
		if ((this.attr1!=0)&&(this.attr2!=0)) {   //___ attrs will start at 1
			this.value_digs = (this.avg_wage / this.attr1) * this.attr2;  //___I think here it should be ...this.wwage... not  ...this.avg_wage...
		}
		this.sendDiging();
	}
}

iMiner.prototype.encode = function(key) {
	var data = 'id='+this.id;
	data += '&'+key+'=true';
	for (var i=0; i<this.miningProp.length; i++) {
		data += '&'+this.miningProp[i]+'='+eval('this.'+this.miningProp[i]);
	}
	for (var i=0; i<this.globalProp.length; i++) {
		data += '&'+this.globalProp[i]+'='+eval('this.'+this.globalProp[i]);
	}
    return data;
}

iMiner.prototype.sendDiging = function () {
	var url = root + "exec/diging.php";
	jQuery.post( url, this.encode('digging'), function(data){
		if (typeof(data.error)!="undefined")  {
			alert(data.msg);
		}
		if (typeof(data.eff)!="undefined") {
			minero.eff = parseFloat(data.eff);
		}
		if (typeof(data.raw_eff)!="undefined") {
			minero.raw_eff = parseFloat(data.raw_eff);
		}
		if (typeof(data.recent_eff)!="undefined") {
			minero.recent_eff = parseFloat(data.recent_eff);
		}
		if (typeof(data.attr1)!="undefined") {
			minero.attr1 = parseFloat(data.attr1);
		}
		if (typeof(data.attr2)!="undefined") {
			minero.attr2 = parseFloat(data.attr2);
		}
		if (typeof(data.price)!="undefined") {
			minero.price = parseFloat(data.price);
		}
		if (typeof(data.self_price)!="undefined") {
			minero.self_price = parseFloat(data.self_price);
		}
		if (typeof(data.cod)!="undefined") {
			minero.cod = parseFloat(data.cod);
		}
		if (typeof(data.cot)!="undefined") {
			minero.cot = parseFloat(data.cot);
		}
		if (typeof(data.self_cod)!="undefined") {
			minero.self_cod = parseFloat(data.self_cod);
		}
		if (typeof(data.self_cot)!="undefined") {
			minero.self_cot = parseFloat(data.self_cot);
		}
		if (typeof(data.alive)!="undefined") {
			if(data.alive==0) {
				// el usuario acaba de morir
				$("#imining").removeClass("game").addClass("gameover");
				minero.dead_html();
				clearTimeout(t);
				minero.alive = false;
				setTimeout("gameover()",3000);
			}
			minero.alive = data.alive;
		}
	}, "json");
}
iMiner.prototype.sendMoney = function () {
	var url = root + "exec/pay.php";
	jQuery.post( url, this.encode('pay'), function(data){
		if (typeof(data.error)!="undefined")  {
			alert(data.msg);
		}
		if (typeof(data.savings)!="undefined") {
			minero.savings = parseFloat(data.savings);
		}
		if (typeof(data.stolen)!="undefined") {
			if(data.stolen!=0) {
				alert('You have been robbed! '+data.stolen+'$!')  //____ I changed the word here
			}
		}
		setTimeout("$('#soldier_img img').attr('src','inc/img/soldier1.png');",2000);
	}, "json");
}

iMiner.prototype.info = function() {
	var html = '';
	for (var i=0; i<this.miningProp.length; i++) {
		html += tag_html('li',this.miningProp[i],this.miningProp[i]+": ",roundFloat(eval('this.'+this.miningProp[i]),4),"");
	}
	for (var i=0; i<this.calculationProp.length; i++) {
		html += tag_html('li',this.calculationProp[i],this.calculationProp[i]+": ",roundFloat(eval('this.'+this.calculationProp[i]),4),"");
	}
	for (var i=0; i<this.globalProp.length; i++) {
		html += tag_html('li',this.globalProp[i],this.globalProp[i]+": ",roundFloat(eval('this.'+this.globalProp[i]),4),"");
	}
    return html;
}

iMiner.prototype.html = function () {
	var html = "";
	// i-miner name <h1></h1>
	html += this.name;
	if (this.flag_img!="") {
		html += ' <img src="'+ root + this.flag_img+'"/>';
	}
	// i-miner img <div id="miner_img"></div>
	$('#miner').append('<div id="miner_img"></div>');
	html = '<img src="inc/img/miner_40_01.png" alt="'+write.miner_miner_digging+'" />';
	$('#miner_img').append(html);
	// i-miner soldier img <div id="soldier_img"></div>
	$('#miner').append('<div id="soldier_img"></div>');		
	html = '<img src="inc/img/soldier1.png" alt="'+write.miner_miner_digging+'" />';
	$('#soldier_img').append(html);
	
	// i-miner info <div id="miner_data"></div>
	$('#miner').append('<div id="miner_data"></div>');
	$('#miner_data').append('<div id="miner_digs" class="info"></div>');
	$('#miner_digs').append(data_html('Tantalun mined',roundFloat(this.digs,2)+'gr'));
	$('#miner_data').append('<div id="miner_wwage" class="info"></div>');
	$('#miner_wwage').append(data_html('Wage','$'+roundFloat(this.wwage,2)+'/hr'));
	$('#miner_data').append('<div id="miner_savings" class="info"></div>');
	$('#miner_savings').append(data_html('Savings','$'+roundFloat(this.savings,2)));
	$('#miner_data').append('<div id="miner_name" class="info"></div>');
	$('#miner_name').append(data_html('Nane',this.name));
		
	// i-miner info <div id="miner_mineral"></div>
	$('#miner').append('<div id="miner_mineral"></div>');
	$('#miner_mineral').append('<img src="inc/img/mineral.png" alt="Tantalum pile" />');

	// i-miner imine logo <div id="imine_logo"></div>
	$('#miner').append('<div id="imine_logo"></div>');
	$('#imine_logo').append('<img src="inc/img/imine_logo.png" alt="i-mine" />');
	
	
	// i-miner settings <div id="settings"></div>
	$('#miner').append('<div id="miner_settings"></div>');
	$('#miner_settings').append('<button class="button" type="button" value="new_settings">Settings</button>');
		
	// i-miner wwage_bar <div id="wwage_wrapper"></div>
	$('#miner').append('<div id="wwage_wrapper"></div>');
	html = '<h2>Wage</h2><div id="wwage_bar"><div></div><span id="wwagetxt">5$ cents</span></div>';
	$('#wwage_wrapper').append(html);
}
iMiner.prototype.update_html = function () {
	$('#miner_digs').empty();
	$('#miner_digs').append(data_html('Tantalun mined',roundFloat(this.digs,2)+'gr'));
	$('#miner_wwage').empty();
	$('#miner_wwage').append(data_html('Wage','$'+roundFloat(this.wwage,2)+'/hr'));
	$('#miner_savings').empty();
	$('#miner_savings').append(data_html('Savings','$'+roundFloat(this.savings,2)));
	var x = this.miner_min_x  + this.cod*this.miner_max_x/100;
	var y = this.miner_min_y + this.cod*this.miner_max_y/100;
	var width = this.miner_min_width  + this.cod*this.miner_max_width/100;
	var height = this.miner_min_height + this.cod*this.miner_max_height/100;
	$('#soldier_img').css('left',x+'px');
	$('#soldier_img').css('top',y+'px');
	$('#soldier_img img').css('width',width+'px');
	$('#soldier_img img').css('height',height+'px');
}
iMiner.prototype.dead_html = function () {
	$('#miner_img').remove();
	$('#wwage_wrapper').remove();
	$('#soldier_img').remove();
	$('#miner_settings').remove();
	$('#miner_wwage').remove();
	$('#miner_savings').remove();
	$('#miner_name').remove();
	html = '<div id="miner_img_dead"></div>';
	$('#miner').append(html);
	html = '<img src="inc/img/miner_40_dead.png" alt="creapy dead miner" />';
	$('#miner_img_dead').append(html);
	html = '<div id="miner_gameover"></div>';
	$('#miner').append(html);
	html = '<img src="inc/img/gameover.png" alt="Game Over" />';
	$('#miner_gameover').append(html);
	$('#miner_mineral').addClass('transparent');
	$('#imine_logo').addClass('transparent');
}