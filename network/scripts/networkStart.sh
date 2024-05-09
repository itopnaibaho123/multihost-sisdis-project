#!/bin/bash

# Import utils
. scripts/utils.sh


function runCaContainer() {
  infoln "Starting docker container for Certificate Authority"
  println ""

  CA_COMPOSE_FILES="-f compose/docker-compose-ca.yaml"
  docker stack deploy -c ${CA_COMPOSE_FILES} carbonservice -d 2>&1

  println ""
}

function runHost1CaContainer() {
  infoln "Starting docker container for Certificate Authority"
  println ""

  CA_COMPOSE_FILES="-f compose/docker-compose-host1-ca.yaml"
  docker stack deploy -c ${CA_COMPOSE_FILES} carbonservice -d 2>&1

  println ""
}

function runHost2CaContainer() {
  infoln "Starting docker container for Certificate Authority"
  println ""

  CA_COMPOSE_FILES="-f compose/docker-compose-host2-ca.yaml"
  docker stack deploy -c ${CA_COMPOSE_FILES} carbonservice -d 2>&1

  println ""
}

function runOrgContainer() {
  infoln "Starting docker container for All Organizations"
  println ""

  COMPOSE_FILES="-f compose/docker-compose-orderer.yaml -f compose/docker-compose-kemdikbud.yaml -f compose/docker-compose-he1.yaml"
  docker stack deploy -c ${COMPOSE_FILES} carbonservice -d 2>&1

  println ""
}

function runHost1OrgContainer() {
  infoln "Starting docker container for All Organizations"
  println ""

  COMPOSE_FILES="-f compose/docker-compose-host1-orderer.yaml -f compose/docker-compose-host1-kementrian.yaml"
  docker stack deploy -c ${COMPOSE_FILES} carbonservice -d 2>&1

  println ""
}

function runHost2OrgContainer() {
  infoln "Starting docker container for All Organizations"
  println ""

  COMPOSE_FILES="-f compose/docker-compose-host2-supplychain.yaml"
  docker stack deploy -c ${COMPOSE_FILES} carbonservice -d 2>&1

  println ""
}

function runHost3OrgContainer() {
  infoln "Starting docker container for All Organizations"
  println ""

  COMPOSE_FILES="-f compose/docker-compose-host3-supplychain.yaml"
  docker stack deploy -c ${COMPOSE_FILES} carbonservice -d 2>&1

  println ""
}



function generateAnchorPeerKemdikbud() {
  # Generating anchor peer update for KemdikbudMSP

  infoln "Generating anchor peer update for KemdikbudMSP"
  set -x
  configtxgen -profile AcademicChannel -outputAnchorPeersUpdate ./channel-artifacts/KemdikbudMSPanchors.tx -channelID $CHANNEL_NAME -asOrg KemdikbudMSP
  res=$?
  set +x
  if [ $res -ne 0 ]; then
    errorln "Failed to generate anchor peer update for KemdikbudMSP..."
    println ""
    exit 1
  fi

  println ""
}

function generateAnchorPeerHE1() {
  # Generating anchor peer update for HE1MSP

  infoln "Generating anchor peer update for HE1MSP"
  set -x
  configtxgen -profile AcademicChannel -outputAnchorPeersUpdate ./channel-artifacts/HE1MSPanchors.tx -channelID $CHANNEL_NAME -asOrg HE1MSP
  res=$?
  set +x
  if [ $res -ne 0 ]; then
      errorln "Failed to generate anchor peer update for HE1MSP..."
      println ""
      exit 1
  fi

  println ""
}





function startCAHost1() {
  infoln "Start CA"

  println "###########################################################################"
  runHost1CaContainer

  while :
    do
      if [ ! -f "organizations/fabric-ca/kementrian/tls-cert.pem" ]; then
        sleep 1
      else
        break
      fi
    done
    ../organizations/fabric-ca/registerEnroll.sh
  println "###########################################################################"
  infoln "Creating Kementrian Certificates"
  createKementrian
  println ""

  infoln "Creating Orderer Certificates"
  createOrderer
  println ""

  println ""
}

function startNetworkHost1() {
  CHANNEL_NAME=$1

  infoln "Start the network"

  println "###########################################################################"
  runHost1OrgContainer
  println ""

  println ""
}

function startCAHost2() {
  infoln "Start CA"

  println "###########################################################################"
  runHost2CaContainer

  while :
    do
      if [ ! -f "organizations/fabric-ca/supplychain/tls-cert.pem" ]; then
        sleep 1
      else
        break
      fi
    done
  ../organizations/fabric-ca/registerEnroll.sh
  println "###########################################################################"
  infoln "Creating SupplyCHain Certificates"
  createSupplyChain
  println ""

}

function startNetworkHost2() {
  CHANNEL_NAME=$1

  println "###########################################################################"
  runHost2OrgContainer
  println ""

  println ""
}

function startNetworkHost3() {
  CHANNEL_NAME=$1

  infoln "Start the network"

  println "###########################################################################"
  runHost3OrgContainer
  println ""

  println ""
}
