<?php

$data = (object) array_merge($_GET, $_POST);

$values = explode(',', 'target,mname,ip,txt');
$records = dns_get_record(json_decode($data->query));
foreach($records as &$record){
  foreach($values as $value){
      if(!array_key_exists($value, $record)) continue;
      $record['value'] = $record[$value];
      unset($record[$value]);
  }
}

echo json_encode($records);
