cd network

./network.sh up -ca -s couchdb

sleep 5

./network.sh createChannel

sleep 5

CC_NAME="basic"
CC_FOLDER="atcontract"

./network.sh deployCC -ccn $CC_NAME -ccp ../chaincode/$CC_FOLDER -ccl go
./network.sh deployCC -ccn cecontract -ccp ../chaincode/cecontract -ccl go
./network.sh deployCC -ccn cspcontract -ccp ../chaincode/cspcontract -ccl go
./network.sh deployCC -ccn ctcontract -ccp ../chaincode/ctcontract -ccl go
./network.sh deployCC -ccn divcontract -ccp ../chaincode/divcontract -ccl go
./network.sh deployCC -ccn pecontract -ccp ../chaincode/pecontract -ccl go
./network.sh deployCC -ccn shcontract -ccp ../chaincode/shcontract -ccl go
./network.sh deployCC -ccn vecontract -ccp ../chaincode/vecontract -ccl go
./network.sh deployCC -ccn usercontract -ccp ../chaincode/usercontract -ccl go