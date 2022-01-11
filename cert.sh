#!/bin/bash
openssl req -x509 -new -newkey rsa:2048 -nodes -subj '/C=CN/ST=Shanghai/L=Shanghai/O=DLD/CN=CN Identity Provider' -keyout idp-private-key.pem -out idp-public-cert.pem -days 7300
