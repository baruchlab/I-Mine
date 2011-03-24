<?php
// Para leer todaas las entradas de una tabla de la bd y devolverlas en un array
function db_select_all_query($table,$query_key=FALSE, $query_value=FALSE, $query_order=FALSE, $query_limit=FALSE) {
	global $db, $write;
	$link = mysql_connect ($db['host'],$db['user'],$db['pass']);
	if (!$link) {
		$error = array (
			"error" => true,
			"error_type" => 0,
			"msg" => $write['error_conecting_db_msg']
		);
		return $error;
	} else {
		mysql_select_db ($db['data'], $link);
		$dosql = "SELECT * FROM `".$table."`";
		if($query_key && $query_value) {
			if($query_value[0]=='*') {
				$dosql .= " WHERE `".$query_key."` LIKE '".substr($query_value, 1)."'";
			} else {
				$dosql .= " WHERE `".$query_key."`='".$query_value."'";
			}
		}
		if ($query_order) {
			if($query_order[0]=='*') {
				$dosql .= " ORDER BY `".substr($query_order, 1)."`  DESC";
			} else {
				$dosql .= " ORDER BY `".$query_order."`  ASC";
			}
		}
		if ($query_limit) {
			//$array_limit = preg_split (',', $query_limit);
			$dosql .= " LIMIT ".$query_limit;
		}
		$result = mysql_query ($dosql);
		if (!$result) {
			// ha habido un fallo en la consulta
    		$error = array (
				"error" => true,
				"error_type" => 1,
				"msg" => "'".$dosql."' ".$write['invalid_query'].": ".mysql_error()
			);
			mysql_close ($link);
			return $error;
		} else if (mysql_num_rows($result)==0) {
			// No se ha encontrado ninguna entrada
			$error = array (
				"error" => true,
				"error_type" => 2,
				"msg" => $write['no_db_entries_found']
			);
			mysql_close ($link);
			return $error;
		} else {
			$entries = array();
			$entries[$table] = array();
			while ($row = mysql_fetch_array($result)) {
				$data = array();
				$campos = array_keys($row);
				$values = array_values($row);
				for($i=0; $i<count($campos); $i++) {
					if (!is_int($campos[$i])) {
						$data[$campos[$i]] = $values[$i];
					}
				}
				array_push($entries[$table], $data);
			}
			mysql_close ($link);
			return $entries;
		}
	}
}


// Para leer todos los datos de un elemento de la bd y devolverlos en un array
function db_select_one_query($table, $query_key, $query_value) {
	global $db, $write;
	$link = mysql_connect ($db['host'],$db['user'],$db['pass']);
	if (!$link) {
		$error = array (
			"error" => true,
			"error_type" => 0,
			"msg" => $write['error_conecting_db_msg']
		);
		return $error;
	} else {
		mysql_select_db ($db['data'], $link);
		if (is_array($query_key)&&is_array($query_value)) {
			$dosql = "SELECT * FROM `".$table."` WHERE `".$query_key[0]."`='".$query_value[0]."'";
			for ($i=1; $i<count($query_key);$i++) {
				$dosql .=  " AND `".$query_key[$i]."`='".$query_value[$i]."'";
			}
			$dosql .=  " LIMIT 0, 1";
		} else {
			$dosql = "SELECT * FROM `".$table."` WHERE `".$query_key."`='".$query_value."' LIMIT 0, 1";
		}
		$result = mysql_query ($dosql);
		if (!$result) {
			// ha habido un fallo en la consulta
    		$error = array (
				"error" => true,
				"error_type" => 1,
				"msg" => "'".$dosql."' Invalid query: ".mysql_error()
			);
			mysql_close ($link);
			return $error;
		} else if (mysql_num_rows($result)==0) {
			// No se ha encontrado ninguna entrada
			$error = array (
				"error" => true,
				"error_type" => 2,
				"msg" => $write['no_db_entries_found']."`".$query_key."`='".$query_value."'"
			);
			mysql_close ($link);
			return $error;
		} else {
			$row = mysql_fetch_array($result);
			$data = array();
			$entrie = array();
			$campos = array_keys($row);
			$values = array_values($row);
			for($i=0; $i<count($campos); $i++) {
				if (!is_int($campos[$i])) {
					$data[$campos[$i]] = $values[$i];
				}
			}
			mysql_close ($link);
			return $data;
		}
	}
}

// Para insertar una entrada en la bd
function db_insert_query($table, $data) {
	global $db, $write;
	$link = mysql_connect ($db['host'],$db['user'],$db['pass']);
	$dosql = "";
	if (!$link) {
		$error = array (
			"error" => true,
			"msg" => $write['error_updating_db']
		);
		return $error;
	} else {
		mysql_select_db ($db['data'], $link);
		$campos = array_keys($data);
		$values = array_values($data);
		$dosql .= "INSERT INTO `".$table."` (`".$campos[0]."`";
		for($i=1; $i<count($campos); $i++) {
			$dosql .= ", `".$campos[$i]."`";
		}
		$dosql .= ") VALUES ('".$values[0]."'";
		for($i=1; $i<count($values); $i++) {
			$dosql .= ", '".$values[$i]."'";
		}
		$dosql .= ")";
		if (mysql_query($dosql)) {
			
			$return = mysql_insert_id();
			mysql_close ($link);
			return $return;
		} else {
			// ha habido un fallo en la consulta
    		$error = array (
				"error" => true,
				"error_type" => 1,
				"msg" => "'".$dosql."' Invalid query: ".mysql_error()
			);
			mysql_close ($link);
			return $error;
		}
	}
}

// Para actualizar un elemento de la bd
function db_update_query($table, $data, $id) {
	global $db, $write;
	$dosql = "";
	$link = mysql_connect ($db['host'],$db['user'],$db['pass']);
	if (!$link) {
		$error = array (
			"error" => true,
			"msg" => $write['error_updating_db']
		);
		return $error;
	} else {
		mysql_select_db ($db['data'], $link);
		$dosql .= "UPDATE `".$table."` SET ";
		$campos = array_keys($data);
		$values = array_values($data);
		$dosql .= "`".$campos[0]."` = '".$values[0]."'";
		for($i=1; $i<count($data); $i++) {
			$dosql .= ", `".$campos[$i]."` = '".$values[$i]."'";
		}
		if (is_array($id)) {
			$campos = array_keys($id);
			$values = array_values($id);
			$dosql .= " WHERE `".$campos[0]."`='".$values[0]."'";
			for($i=1; $i<count($campos); $i++) {
				$dosql .= " AND `".$campos[$i]."`='".$values[$i]."'";
			}
			$dosql .= " LIMIT 1";
		} else {
			$dosql .= " WHERE `id`=".$id." LIMIT 1";
		}
		if (mysql_query($dosql)) {
			mysql_close ($link);
			return true;
		} else {
			// ha habido un fallo al actualizar los datos
    		$error = array (
				"error" => true,
				"error_type" => 1,
				"msg" => "'".$dosql."' Invalid query: ".mysql_error()
			);
			mysql_close ($link);
			return $error;
		}
	}
}

// Para leer todos los datos de un elemento de la bd y devolverlos en un array
function db_select_avg_query($table, $query_column, $query_key, $query_value) {
	global $db, $write;
	$link = mysql_connect ($db['host'],$db['user'],$db['pass']);
	if (!$link) {
		$error = array (
			"error" => true,
			"error_type" => 0,
			"msg" => $write['error_conecting_db_msg']
		);
		return $error;
	} else {
		mysql_select_db ($db['data'], $link);
		$dosql = "SELECT";
		if (is_array($query_column)) {
			$dosql .= ' AVG(`'.$query_column[0].'`)';
			for ($i=1; $i<count($query_column);$i++) {
				$dosql .= ', AVG(`'.$query_column[$i].'`)';
			}
		} else {
			$dosql .= ' AVG(`'.$query_column.'`)';
		}
		if (is_array($query_key)&&is_array($query_value)) {
			$dosql .= " FROM `".$table."` WHERE `".$query_key[0]."`='".$query_value[0]."'";
			for ($i=1; $i<count($query_key);$i++) {
				$dosql .=  " AND `".$query_key[$i]."`='".$query_value[$i]."'";
			}
		} else {
			$dosql .= " FROM `".$table."` WHERE `".$query_key."`='".$query_value."' LIMIT 0, 1";
		}
		$result = mysql_query ($dosql);
		if (!$result) {
			// ha habido un fallo en la consulta
    		$error = array (
				"error" => true,
				"error_type" => 1,
				"msg" => "'".$dosql."' Invalid query: ".mysql_error()
			);
			mysql_close ($link);
			return $error;
		} else if (mysql_num_rows($result)==0) {	
			// No se ha encontrado ninguna entrada
			$error = array (
				"error" => true,
				"error_type" => 2,
				"msg" => $write['no_db_entries_found']."`".$query_key."`='".$query_value."'"
			);
			mysql_close ($link);
			return $error;
		} else {
			$row = mysql_fetch_array($result);
			$data = array();
			$entrie = array();
			$campos = array_keys($row);
			$values = array_values($row);
			for($i=0; $i<count($campos); $i++) {
				if (!is_int($campos[$i])) {
					$data[$query_column[$i/2]] = $values[$i];
				}
			}
			mysql_close ($link);
			return $data;
		}
	}
}

// Para leer todos los datos de un elemento de la bd y devolverlos en un array
function db_select_count($table, $query_key, $query_value) {
	global $db, $write;
	$link = mysql_connect ($db['host'],$db['user'],$db['pass']);
	if (!$link) {
		$error = array (
			"error" => true,
			"error_type" => 0,
			"msg" => $write['error_conecting_db_msg']
		);
		return $error;
	} else {
		mysql_select_db ($db['data'], $link);
		$dosql = 'SELECT COUNT(*) FROM `'.$table.'`';
		if($query_key && $query_value) {
			if (is_array($query_key)&&is_array($query_value)) {
				$dosql .= " ` WHERE `".$query_key[0]."`='".$query_value[0]."'";
				for ($i=1; $i<count($query_key);$i++) {
					$dosql .=  " AND `".$query_key[$i]."`='".$query_value[$i]."'";
				}
			} else if($query_value[0]=='*') {
				$dosql .= " WHERE `".$query_key."` LIKE '".substr($query_value, 1)."'";
			} else {
				$dosql .= " WHERE `".$query_key."`='".$query_value."'";
			}
		}
		$result = mysql_query ($dosql);
		if (!$result) {
			// ha habido un fallo en la consulta
    		$error = array (
				"error" => true,
				"error_type" => 1,
				"msg" => "'".$dosql."' Invalid query: ".mysql_error()
			);
			mysql_close ($link);
			return $error;
		} else if (mysql_num_rows($result)==0) {
			// No se ha encontrado ninguna entrada
			$error = array (
				"error" => true,
				"error_type" => 2,
				"msg" => $write['no_db_entries_found']."`".$query_key."`='".$query_value."'"
			);
			mysql_close ($link);
			return $error;
		} else {
			$row = mysql_fetch_array($result);
			$data = array();
			$campos = array_keys($row);
			$values = array_values($row);
			$data['count'] = $values[0];
			mysql_close ($link);
			return $data;
		}
	}
}

?>