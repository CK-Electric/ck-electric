<?php
if (!defined('ABSPATH')) { exit; }
/** Shared human-readable labels for admin and new CRM notes; storage remains unchanged. */
function ck_estimates_readable_answers($data) {
    $labels = array('first'=>'First name','last'=>'Last name','email'=>'Email','phone'=>'Phone','street'=>'Street address','unit'=>'Unit / suite','city'=>'City','state'=>'State','zip'=>'ZIP code','charger'=>'Installation type','supply'=>'Customer providing charger','location'=>'Installation location','distance'=>'Within 10 feet of electrical panel','count'=>'Number of panels','known'=>'Panel amperage known','comments'=>'Additional comments');
    $choices = array('hardwired'=>'Hardwired charger','nema'=>'NEMA 14-50 receptacle','yes'=>'Yes','no'=>'No','unsure'=>'Not sure','indoors'=>'Indoors','outdoors'=>'Outdoors','both'=>'Indoors and outdoors');
    $rows = array();
    foreach ($labels as $key=>$label) {
        if (isset($data[$key]) && $data[$key] !== '') { $rows[$label] = in_array($key,array('charger','supply','location','distance','known'),true) ? ($choices[$data[$key]] ?? $data[$key]) : $data[$key]; }
    }
    for ($i=0; $i<6; $i++) {
        if (isset($data['amps'.$i])) { $rows['Panel '.($i+1).' amperage'] = (($data['amps'.$i] === 'other') ? ($data['other'.$i] ?? 'Not specified') : $data['amps'.$i]) . ' A'; }
    }
    for ($i=0; $i<3; $i++) {
        if (!isset($data['date'.$i])) { continue; }
        $date = DateTimeImmutable::createFromFormat('!Y-m-d', $data['date'.$i], new DateTimeZone('America/Los_Angeles'));
        $format_time = function ($value) { $time = DateTimeImmutable::createFromFormat('!H:i', $value, new DateTimeZone('America/Los_Angeles')); return $time ? $time->format('g:i A') : 'Not specified'; };
        $rows['Visit preference '.($i+1)] = ($date ? $date->format('l, F j, Y') : $data['date'.$i]) . ' — ' . $format_time($data['from'.$i] ?? '') . '–' . $format_time($data['to'.$i] ?? '') . ' Pacific time';
    }
    if (isset($data['date0'])) { $rows['Scheduling note'] = 'Requested availability only. No appointment has been booked.'; }
    return $rows;
}
