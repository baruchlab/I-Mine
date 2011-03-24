<?php
	// incluimos el documento que contiene todas las funciones
	include ("../imine_inc/config.php");
	include ("../imine_inc/db.php");
	include ("../imine_inc/imine_rss_functions.php");
	if (isset($_GET['lang'])) {
		include ("../imine_inc/lang_".$_GET['lang'].".php");
		$lang = $_GET['lang'];
	} else {
		include ("../imine_inc/lang_en.php");
		$lang = 'en';
	}
	header("Content-type: application/rss+xml; charset=utf-8");
	$title =  'The latest mineral prices';
	$date = date("o-m-d G:i:s");
	if (isset($_GET['new'])) {
		$data = mineral_prices();
		$insert_id = db_insert_query($db_tables['prices'], array("title" => $title, "tin" => strip_tags($data['tin_price']), "tantalum" => strip_tags($data['tantalum_price']), "tungsten" => strip_tags($data['tungsten_price']), "gold" => strip_tags($data['gold_price']), "tin_units" => strip_tags($data['tin_units']), "tantalum_units" => strip_tags($data['tantalum_units']), "tungsten_units" => strip_tags($data['tungsten_units']), "gold_units" => strip_tags($data['gold_units']), "date" => $date,));
		$link .= $root."imine_exec/prices.js.php?id=".$insert_id;
		$result = db_update_query($db_tables['prices'], array('link'=> $link), $insert_id);
	}
	echo '<?xml version="1.0"?>
<rss version="2.0">
   <channel>
      <title>'.$write['rss_prices'].'</title>
      <language>'.$lang.'</language>
      <link>http://www.vhplab.net/horaciogd/imining/imine_exec/mineral-prices.php</link>
      <description>'.$write['regularly_updated'].'</description>
      ';
	$prices = db_select_all_query($db_tables['prices']);
	for( $i = 0; $i < count($prices['imining_prices']); $i++) {
        	echo '
      <item>';
        	echo '
         <title>'.$write['latest_prices'].'</title>';
        	echo '
         <link>'.$prices['imining_prices'][$i]['link'].'</link>';
        	echo '
         <description>
        		'.htmlentities('<div class="tin"><h4>').$write['tin'].htmlentities(':</h4><span>').$prices['imining_prices'][$i]['tin'].htmlentities('<em>').$prices['imining_prices'][$i]['tin_units'].htmlentities('</em></span><div>').'
        		'.htmlentities('<div class="tantalum"><h4>').$write['tantalum'].htmlentities(':</h4><span>').$prices['imining_prices'][$i]['tantalum'].htmlentities('<em>').$prices['imining_prices'][$i]['tantalum_units'].htmlentities('</em></span><div>').'
        		'.htmlentities('<div class="tungsten"><h4>').$write['tungsten'].htmlentities(':</h4><span>').$prices['imining_prices'][$i]['tungsten'].htmlentities('<em>').$prices['imining_prices'][$i]['tungsten_units'].htmlentities('</em></span><div>').'
        		'.htmlentities('<div class="gold"><h4>').$write['gold'].htmlentities(':</h4><span>').$prices['imining_prices'][$i]['gold'].htmlentities('<em>').$prices['imining_prices'][$i]['gold_units'].htmlentities('</em></span><div>').'
         </description>';
        	$pubDate = date("D, d M Y H:i:s O",strtotime($prices['imining_prices'][$i]['date']));
        	echo '
         <pubDate>'.$pubDate.'</pubDate>';
        	echo '
         <guid isPermaLink="true">'.$prices['imining_prices'][$i]['link'].'</guid>';
        	echo '
      </item>';
    }
	echo  '
   </channel>
</rss>';
	//print_r($prices);
?>