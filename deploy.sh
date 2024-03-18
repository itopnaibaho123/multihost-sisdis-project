ARG=$1

CC_NAME="basic"

cd network

./network.sh deployCC -ccn $CC_NAME -ccp ../chaincode/$ARG -ccl go