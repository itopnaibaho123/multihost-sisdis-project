#!/bin/bash

function one_line_pem {
    echo "`awk 'NF {sub(/\\n/, ""); printf "%s\\\\\\\n",$0;}' $1`"
}

function json_ccp {
    local PP=$(one_line_pem $5)
    local CP=$(one_line_pem $6)
    sed -e "s/\${ORG}/$1/" \
        -e "s/\${ORGCAP}/$2/" \
        -e "s/\${P0PORT}/$3/" \
        -e "s/\${CAPORT}/$4/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        organizations/ccp-template-badanpertanahannasional.json
}

function yaml_ccp {
    local PP=$(one_line_pem $5)
    local CP=$(one_line_pem $6)
    sed -e "s/\${ORG}/$1/" \
        -e "s/\${ORGCAP}/$2/" \
        -e "s/\${P0PORT}/$3/" \
        -e "s/\${CAPORT}/$4/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        organizations/ccp-template-badanpertanahannasional.yaml | sed -e $'s/\\\\n/\\\n          /g'
}



ORG=badanpertanahannasional
ORGCAP=Badanpertanahannasional
P0PORT=7051
CAPORT=7054
PEERPEM=organizations/peerOrganizations/badanpertanahannasional.example.com/tlsca/tlsca.badanpertanahannasional.example.com-cert.pem
CAPEM=organizations/peerOrganizations/badanpertanahannasional.example.com/ca/ca.badanpertanahannasional.example.com-cert.pem
echo "$(json_ccp $ORG $ORGCAP $P0PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/badanpertanahannasional.example.com/connection-badanpertanahannasional.json
echo "$(yaml_ccp $ORG $ORGCAP $P0PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/badanpertanahannasional.example.com/connection-badanpertanahannasional.yaml
