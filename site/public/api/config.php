<?php
/**
 * CuttingEdge enquiry endpoint configuration. This is the ONE file to edit after upload.
 * It is denied to web visitors by api/.htaccess; PHP includes it directly.
 */
return [
    // Who receives every enquiry. Default = the address shown on the website today. See CONTENT-NEEDED.md.
    'recipients' => ['klucas.lucas@gmail.com'],

    // Sender shown on the notification mail. On Hostinger use a mailbox/domain that exists on the hosting,
    // otherwise mail() may be rejected or land in spam. Reply-To is always the visitor's own address.
    'from'      => 'no-reply@cuttingedge.world',
    'from_name' => 'CuttingEdge website',
    'subject_prefix' => '[CuttingEdge enquiry]',
    // Pass "-f<from>" to sendmail (sets the envelope sender; needed on some hosts, refused on others).
    'envelope_from' => false,

    // Every valid enquiry is appended here as one JSON line, whether or not the mail goes through.
    // This directory is protected by its own .htaccess. For extra safety point it OUTSIDE public_html,
    // e.g. '/home/<user>/ce-data' (create it first; PHP needs write access).
    'data_dir' => __DIR__ . '/_data',

    // Abuse protection
    'rate_limit'  => ['max' => 8, 'window' => 3600], // POSTs per IP per window (seconds)
    'min_seconds' => 3,                               // forms submitted faster than this are rejected (time-trap)
    'max_body'    => 65536,                           // bytes
    'secret'      => '',                              // leave empty: a random one is created in data_dir/secret.key
    'trust_proxy_header' => false,                    // true only behind a proxy that sets X-Forwarded-For

    // Hosts allowed to post to this endpoint (CSRF/Origin check). Empty = same host as the request.
    'allowed_hosts' => [],

    // Where a plain (non-JavaScript) submission is sent after success, per language.
    'thanks_urls' => ['en' => '/contact/thank-you/', 'nl' => '/nl/contact/bedankt/'],

    // Shown on the error page when something goes wrong.
    'fallback_whatsapp' => 'https://wa.me/31647639702',
    'fallback_email'    => 'klucas.lucas@gmail.com',
];
