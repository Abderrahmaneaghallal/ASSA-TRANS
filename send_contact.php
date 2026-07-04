<?php
/**
 * AssaTrans - Contact Form Handler via Hostinger SMTP
 */

// Allow only POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['error' => 'Méthode non autorisée. Seuls les envois POST sont acceptés.']);
    exit;
}

header('Content-Type: application/json; charset=utf-8');

// Retrieve and sanitize inputs
$firstname    = isset($_POST['firstname']) ? trim(strip_tags($_POST['firstname'])) : '';
$lastname     = isset($_POST['lastname']) ? trim(strip_tags($_POST['lastname'])) : '';
$email        = isset($_POST['email']) ? trim(filter_var($_POST['email'], FILTER_SANITIZE_EMAIL)) : '';
$phone        = isset($_POST['phone']) ? trim(strip_tags($_POST['phone'])) : '';
$service_type = isset($_POST['service_type']) ? trim(strip_tags($_POST['service_type'])) : '';
$travel_date  = isset($_POST['travel_date']) ? trim(strip_tags($_POST['travel_date'])) : '';
$passengers   = isset($_POST['passengers']) ? trim(strip_tags($_POST['passengers'])) : '3';
$message      = isset($_POST['message']) ? trim(strip_tags($_POST['message'])) : '';

// Validation
if (empty($firstname) || empty($lastname) || empty($email) || empty($phone) || empty($service_type) || empty($travel_date)) {
    http_response_code(400);
    echo json_encode(['error' => 'Tous les champs obligatoires (*) doivent être remplis.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'L\'adresse email saisie n\'est pas valide.']);
    exit;
}

// SMTP Configuration
$smtp_host = 'ssl://smtp.hostinger.com';
$smtp_port = 465;
$smtp_user = 'reservation@assatrans.com';
$smtp_pass = 'Assa@2026#';
$to_email  = 'reservation@assatrans.com';

// Format Subject and Body
$subject_text = "Nouvelle demande de contact - " . $firstname . " " . $lastname;
$subject = "=?UTF-8?B?" . base64_encode($subject_text) . "?=";

$body = "Vous avez reçu une nouvelle demande de contact depuis le site assatrans.com :\n\n";
$body .= "Prénom : " . $firstname . "\n";
$body .= "Nom : " . $lastname . "\n";
$body .= "Email : " . $email . "\n";
$body .= "Téléphone / WhatsApp : " . $phone . "\n";
$body .= "Type de prestation : " . ucfirst($service_type) . "\n";
$body .= "Date souhaitée : " . $travel_date . "\n";
$body .= "Nombre de personnes : " . $passengers . "\n\n";
$body .= "Message / Précisions :\n" . (empty($message) ? "(Aucun message)" : $message) . "\n";

// Ensure CRLF endings for the body
$body = str_replace("\r", "", $body);
$body = str_replace("\n", "\r\n", $body);

// Headers
$headers = [
    "From: AssaTrans Website <" . $smtp_user . ">",
    "Reply-To: " . $firstname . " " . $lastname . " <" . $email . ">",
    "To: <" . $to_email . ">",
    "Subject: " . $subject,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=UTF-8",
    "Date: " . date('r'),
    "Message-ID: <" . time() . "-" . md5($email) . "@assatrans.com>"
];

$email_data = implode("\r\n", $headers) . "\r\n\r\n" . $body;

// Dot stuffing
$email_data = str_replace("\r\n.", "\r\n..", $email_data);

// SMTP Socket Client Function
function send_smtp_email($host, $port, $username, $password, $from, $to, $data) {
    $socket = @fsockopen($host, $port, $errno, $errstr, 10);
    if (!$socket) {
        return "Connexion au serveur de messagerie impossible : $errstr ($errno)";
    }

    // Helper to read multiline SMTP response
    $read_response = function($socket, $expected_code) {
        $response = '';
        while ($str = fgets($socket, 515)) {
            $response .= $str;
            if (substr($str, 3, 1) === ' ') {
                break;
            }
        }
        $code = substr($response, 0, 3);
        if ($code !== (string)$expected_code) {
            return [false, "SMTP Error (Expected $expected_code): " . trim($response)];
        }
        return [true, $response];
    };

    // 1. Connection check
    $res = $read_response($socket, 220);
    if (!$res[0]) { fclose($socket); return $res[1]; }

    // 2. EHLO
    fwrite($socket, "EHLO assatrans.com\r\n");
    $res = $read_response($socket, 250);
    if (!$res[0]) { fclose($socket); return $res[1]; }

    // 3. AUTH LOGIN
    fwrite($socket, "AUTH LOGIN\r\n");
    $res = $read_response($socket, 334);
    if (!$res[0]) { fclose($socket); return $res[1]; }

    // 4. Username
    fwrite($socket, base64_encode($username) . "\r\n");
    $res = $read_response($socket, 334);
    if (!$res[0]) { fclose($socket); return $res[1]; }

    // 5. Password
    fwrite($socket, base64_encode($password) . "\r\n");
    $res = $read_response($socket, 235);
    if (!$res[0]) { fclose($socket); return $res[1]; }

    // 6. MAIL FROM
    fwrite($socket, "MAIL FROM:<" . $from . ">\r\n");
    $res = $read_response($socket, 250);
    if (!$res[0]) { fclose($socket); return $res[1]; }

    // 7. RCPT TO
    fwrite($socket, "RCPT TO:<" . $to . ">\r\n");
    $res = $read_response($socket, 250);
    if (!$res[0]) { fclose($socket); return $res[1]; }

    // 8. DATA
    fwrite($socket, "DATA\r\n");
    $res = $read_response($socket, 354);
    if (!$res[0]) { fclose($socket); return $res[1]; }

    // 9. Send Email Data & Terminating Dot
    fwrite($socket, $data . "\r\n.\r\n");
    $res = $read_response($socket, 250);
    if (!$res[0]) { fclose($socket); return $res[1]; }

    // 10. QUIT
    fwrite($socket, "QUIT\r\n");
    fclose($socket);
    return true;
}

$smtp_result = send_smtp_email($smtp_host, $smtp_port, $smtp_user, $smtp_pass, $smtp_user, $to_email, $email_data);

if ($smtp_result === true) {
    echo json_encode(['success' => true]);
} else {
    // Fallback to PHP's built-in mail() function
    $fallback_headers = "From: " . $smtp_user . "\r\n" .
                       "Reply-To: " . $email . "\r\n" .
                       "Content-Type: text/plain; charset=UTF-8";
    
    if (@mail($to_email, $subject_text, $body, $fallback_headers)) {
        echo json_encode(['success' => true, 'fallback' => true]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Erreur d\'envoi de l\'email. Détails SMTP : ' . $smtp_result]);
    }
}
