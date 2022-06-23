<?php
/**
 * Copyright Jack Harris
 * Peninsula Interactive - A1_Q1
 * Last Updated - 21/06/2022
 */
?>

<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Secure File System Tool (A1 Q1)</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="./style.css">
</head>
<body>

<main>
    <section>
        <h1>Secure File System Tool (A1 Q1)</h1>
        <form action="javascript: Application.instance.generateKey(1)">
            <h2>Generate Pad & Security Key</h2>
            <label>
                File number
                <input type="number" placeholder="eg: 12345" required id="requester_file_number">
            </label>
            <label>
                Employee Id
                <input type="number" disabled id="requester-id" required>
            </label>
            <button>Generate</button>
        </form>

    </section>
    <section>
        <form action="javascript: Application.instance.reverseSecurityKey()">
            <h2>Reverse Security Key</h2>
            <label>
                <p id="reverse-security-key-title">Security Key</p>
                <input type="number" placeholder="eg: 12345" required id="reversed_security_key_input">
            </label>
            <label>
                One Time Pad
                <input type="number" disabled id="reversed_one_time_pad" required>
            </label>
            <button>Reverse</button>
        </form>

    </section>
</main>


<div id="you">
    <h2>You</h2>
</div>

<div id="oracle_members">
    <h2>Oracle Members</h2>
</div>

<div id="requesting_access_permission">
    <div id="inner">
        <h2>Request File Access Permission</h2>
        <p>Please wait whilst Oracle Members approve file access</p>
        <div id="member_approval"></div>
    </div>
</div>


<footer>
    <p>Created by Jack Harris 22/06/2022 for RMIT Security in IT and Computing Assignment 1 Question 1</p>
</footer>


</body>

<script src="Application.js"></script>
</html>
