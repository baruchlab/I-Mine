<?php
function mineral_prices() {
	$result = array(
		'tantalum_name' => '',
		'tantalum_price' => '',
		'tantalum_units' => '',
		'tin_name' => '',
		'tin_price' => '',
		'tin_units' => '',
		'tungsten_name' => '',
		'tungsten_price' => '',
		'tungsten_units' => '',
		'gold_name' => '',
		'gold_price' => '',
		'gold_units' => ''
	);
	$lines = file('http://www.mineralprices.com/');
	$content = "";
	foreach ($lines as $num_linea => $line) {
		$content .= $line;
	}
	//Tantalum
	$start = strpos($content, 'gvMinor_ctl17_lblMMname">');
	$string = substr($content, $start);
	$end = strpos($string, '_gvMinor_ctl18_lblMid');
	$string = substr($string, 25, $end);

	$end = strpos($string, '</span>');
	$result['tantalum_name'] = substr($string, 0, $end);
	//echo '"'.$result['tantalum_name'].'"<br>';

	$start = strpos($string, 'ctl17_lblMLPeice">');
	$string = substr($string, $start);
	$end = strpos($string, '</span>');
	$tmp = substr($string, 0, $end);
	$result['tantalum_price'] = substr($tmp, 18);
	//echo '"'.$result['tantalum_price'].'"<br>';

	$start = strpos($string, 'gvMinor_ctl17_lnlunit">');
	$string = substr($string, $start);
	$end = strpos($string, '</span>');
	$tmp = substr($string, 0, $end);
	$result['tantalum_units'] = substr($tmp, 23);
	//echo '"'.$result['$tantalum_units'].'"<br>';
					
	//Tin
	$start = strpos($content, 'gvMinor_ctl18_lblMMname">');
	$string = substr($content, $start);
	$end = strpos($string, '_gvMinor_ctl19_lblMid');
	$string = substr($string, 25, $end);

	$end = strpos($string, '</span>');
	$result['tin_name'] = substr($string, 0, $end);
	//echo '"'.$result['tin_name'].'"<br>';

	$start = strpos($string, 'ctl18_lblMLPeice">');
	$string = substr($string, $start);
	$end = strpos($string, '</span>');
	$tmp = substr($string, 0, $end);
	$result['tin_price'] = substr($tmp, 18);
	//echo '"'.$result['tin_price'].'"<br>';

	$start = strpos($string, 'gvMinor_ctl18_lnlunit">');
	$string = substr($string, $start);
	$end = strpos($string, '</span>');
	$tmp = substr($string, 0, $end);
	$result['tin_units'] = substr($tmp, 23);
	//echo '"'.$result['tin_units'].'"<br>';

	//Tungsten
	$start = strpos($content, 'gvMinor_ctl19_lblMMname">');
	$string = substr($content, $start);
	$end = strpos($string, '_gvMinor_ctl20_lblMid');
	$string = substr($string, 25, $end);

	$end = strpos($string, '</span>');
	$result['tungsten_name'] = substr($string, 0, $end);
	//echo '"'.$result['tungsten_name'].'"<br>';

	$start = strpos($string, 'ctl19_lblMLPeice">');
	$string = substr($string, $start);
	$end = strpos($string, '</span>');
	$tmp = substr($string, 0, $end);
	$result['tungsten_price'] = substr($tmp, 18);
	//echo '"'.$result['tungsten_price'].'"<br>';

	$start = strpos($string, 'gvMinor_ctl19_lnlunit">');
	$string = substr($string, $start);
	$end = strpos($string, '</span>');
	$tmp = substr($string, 0, $end);
	$result['tungsten_units'] = substr($tmp, 23);
	//echo '"'.$result['tungsten_units'].'"<br>';
					
					
	//Gold
	$start = strpos($content, 'GvMetal_ctl02_lblMetalName">');
	$string = substr($content, $start);
	$end = strpos($string, 'GvMetal_ctl02_gvDetails_ctl04_lblid"');
	$string = substr($string, 28, $end);
	
	$end = strpos($string, '</span>');
	$result['gold_name'] = substr($string, 0, $end);
	//echo '"'.$result['gold_name'].'"<br>';

	$start = strpos($string, 'ctl03_lblLPeice" class="tdBlack"');
	$string = substr($string, $start);
	$end = strpos($string, '</span>');
	$tmp = substr($string, 0, $end);
	$result['gold_price'] = substr($tmp, 33);
	//echo '"'.$result['gold_price'].'"<br>';

	$start = strpos($string, '_ctl03_lnlunit"');
	$string = substr($string, $start);
	$end = strpos($string, '</span>');
	$tmp = substr($string, 0, $end);
	$result['gold_units'] = substr($tmp, 16);
	//echo '"'.$result['gold_units'].'"<br>';
	
	return $result;
}

// trying
//$prices = mineral_prices();
//print_r($prices);
?>