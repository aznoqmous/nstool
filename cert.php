<?php

$data = (object) array_merge($_GET, $_POST);

$hostname = $data->query;

$ssloptions = array(
    "capture_peer_cert" => true,
    "capture_peer_cert_chain" => true,
    "allow_self_signed"=> false,
    "CN_match" => $hostname,
    "verify_peer" => true,
    "SNI_enabled" => true,
    "SNI_server_name" => $hostname,
);


$ctx = @stream_context_create( array("ssl" => $ssloptions) );
$result = @stream_socket_client("ssl://$hostname:443", $errno, $errstr, 30, STREAM_CLIENT_CONNECT, $ctx);
$cont = @stream_context_get_params($result);

if(!$cont) {
  echo json_encode(false);
  exit;
}

$x509 = $cont["options"]["ssl"]["peer_certificate"];
$certparsed = @openssl_x509_parse($x509);



foreach($cont["options"]["ssl"]["peer_certificate_chain"] as $chaincert)
{
    $chainparsed = openssl_x509_parse($chaincert);
    $chain_public_key = openssl_get_publickey($chaincert);
    $r = openssl_x509_verify($x509, $chain_public_key);
    if ($r==1)
    {
        echo json_encode([
          'issuer' => $certparsed['issuer']['O'] . ' - ' . $certparsed['issuer']['CN'],
          'names' => explode(', ', preg_replace("/DNS\:/s", '', $certparsed['extensions']['subjectAltName'])),
          'from' => parse_date($certparsed['validFrom']),
          'to' => parse_date($certparsed['validTo']),
        ]);
    }

}

function parse_date($zuluDate){
  $year = $zuluDate[0] . $zuluDate[1];
  $month = $zuluDate[2] . $zuluDate[3];
  $day = $zuluDate[4] . $zuluDate[5];
  return "$day/$month/$year";
}
