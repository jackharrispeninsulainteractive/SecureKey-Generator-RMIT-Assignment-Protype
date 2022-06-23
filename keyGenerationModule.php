<?php
/**
 * Copyright Jack Harris
 * Peninsula Interactive - A1_Q1
 * Last Updated - 22/06/2022
 */

//create our blank response array
$response = [];

//set our valid actions
$valid_actions = [
    "generate_pad",
    "generate_security_key",
    "reverse_security_key",
    "open-file",
];

//initialize our variables to null.
$employee_id = null;
$file_number =  null;
$action = null;
$oracle_member_codes = [];

//load the users numbers from the oracle_members.json file
$oracle_members = json_decode(file_get_contents("oracle_members.json"), true)["users"];
foreach ($oracle_members as $index =>$member){
    $oracle_member_codes[$index] = $member["code"];
}

$one = $oracle_member_codes[0];
$two = $oracle_member_codes[1];
$three = $oracle_member_codes[2];

//set our action
if(isset($_POST["action"])){
    $action = $_POST["action"];
}

//check if this is a valid action
if(!in_array($action, $valid_actions)){
    $response["error"]["action"] = "invalid action call provided";
    returnResponse($response);
}

//validate the PHP script is being called from the correct HTTP POST method, if not return errors
if($_SERVER["REQUEST_METHOD"] !== "POST"){
    $response["error"]["request method"] = "request method must be POST, all other methods are rejected";
    returnResponse($response);
}

//check if we have received an employee id via POST, if so set the value
if(isset($_POST["employee_id"])){
    $employee_id = trim($_POST["employee_id"]);
}
//validate the employee id is not null
if(!is_numeric($employee_id)){
    $response["error"]["employee_id"] = "employee_id must be a numeric number, no letters or null input is accepted";
    returnResponse($response);
}

//check if our file number is set
if(isset($_POST["file_number"])){
    $file_number = $_POST["file_number"];
}
//validate our file number is a valid input
if(!is_numeric($file_number)){
    $response["error"]["file_number"] = "file_number must be a numeric number, no letters or null input is accepted";
    returnResponse($response);
}

if($action === "generate_pad"){

    $random = rand(100000,999999);

    $one_time_pad = (int)$one ^ (int)$two ^ (int)$three ^ $random;

    $request_id = substr((string)Time(), -6);

    $fopen = fopen("one_time_pad_generations.csv","a");
    fputcsv($fopen,["request id:".$request_id,"employee id:".$employee_id,"file number:".$file_number,"one time pad:".$one_time_pad]);
    fclose($fopen);

    $response["pad"] = $one_time_pad;
    $response["random_number"] = $random;
    returnResponse($response);
}

if($action === "generate_security_key"){

    //validate the one time pad is set
    if(!isset($_POST["one_time_pad"])){
        $response["error"]["one_time_pad"] = "one time pad value must be provided";
        returnResponse($response);
    }

    $one_time_pad = trim($_POST["one_time_pad"]);

    //validate the one time pad is not null
    if(!is_numeric($one_time_pad)){
        $response["error"]["one_time_pad"] = "one time pad must be a 6 digit number";
        returnResponse($response);
    }

    $secret_key = (int)$employee_id ^ (int)$file_number ^ (int)$one_time_pad;

    $fopen = fopen("security_key_generations","a");
    fputcsv($fopen,["employee id:".$employee_id,"one time pad:".$one_time_pad,"security key:".$secret_key]);
    fclose($fopen);

    $response["security_key"] = $secret_key;
    returnResponse($response);

}

if($action === "reverse_security_key"){

    if(!isset($_POST["security_key"])){
        $response["error"]["security_key"] = "valid security key must be provided";
        returnResponse($response);
    }

    $secret_key = trim($_POST["security_key"]);

    //validate security key is numeric
    if(!is_numeric($secret_key)){
        $response["error"]["security_key"] = "valid security key must be provided";
        returnResponse($response);
    }

    $one_time_pad = (int)$employee_id ^ (int)$file_number ^ (int)$secret_key;

    $fopen = fopen("security_key_reverses","a");
    fputcsv($fopen,["employee id:".$employee_id,"security key:".$secret_key,"one time pad:".$one_time_pad]);
    fclose($fopen);

    $response["one_time_pad"] = $one_time_pad;
    returnResponse($response);
}



function returnResponse($response){

    header('Content-Type: application/json;');

    if(isset($response["error"])){
        $response["outcome"] = false;
    }else{
        $response["outcome"] = true;
    }

    echo json_encode($response);
    die;
}