CHANNEL_NAME="carbonchannel"

export PATH=${PWD}/bin:$PATH

cd network

export FABRIC_CFG_PATH=$PWD/config/ 

echo $FABRIC_CFG_PATH

ORG_NAME_1="kementrian"
ORG_NAME_2="supplychain"

export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="KementrianMSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/$ORG_NAME_1.example.com/peers/peer0.$ORG_NAME_1.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/$ORG_NAME_1.example.com/users/Admin@$ORG_NAME_1.example.com/msp
export CORE_PEER_ADDRESS=localhost:7051

peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C ${CHANNEL_NAME} -n basic --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/$ORG_NAME_1.example.com/peers/peer0.$ORG_NAME_1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/$ORG_NAME_2.example.com/peers/peer0.$ORG_NAME_2.example.com/tls/ca.crt" -c '{"function":"InitLedger","Args":[]}'

peer chaincode query -C ${CHANNEL_NAME} -n basic -c '{"Args":["GetAllAssets"]}' | jq '.'