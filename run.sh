cd network

./network.sh up -ca -s couchdb

sleep 5

./network.sh createChannel

sleep 5

CC_NAME="basic"

./network.sh deployCC -ccn $CC_NAME -ccp ../chaincode/atcontract -ccl go