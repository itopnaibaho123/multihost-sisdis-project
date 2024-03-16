cd network

./network.sh down

docker volume ls --format '{{.Name}}' | grep '^compose_' | awk '{print $1}' | xargs docker volume rm
docker network rm supply_chain_carbon