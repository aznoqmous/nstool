<?php

$data = (object) array_merge($_GET, $_POST);

$data = (object) json_decode($data->query);

$res = mail($data->destination, "NSTOOL UPDATE", $data->content);

echo json_encode($res);