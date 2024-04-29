#!/bin/sh
RED="\033[1;31m"
GREEN="\033[1;32m"
YELLOW="\033[1;33m"
NOCOLOR="\033[0m"

CATALOGUE_NAME=elwazi

echo ${YELLOW}check catalogue service${NOCOLOR}
api_url=http://localhost:8000
service_port=8080
kubectl port-forward service/data-catalogue-${CATALOGUE_NAME} 8000:${service_port} &
port_forward_pid=$!
sleep 2
curl -o /dev/null -w "%{http_code}\n" "${api_url}/api/redcap_data.json"
echo ${YELLOW}checking pods logs${NOCOLOR}
kubectl logs "$(kubectl get pods -o "jsonpath={.items[0].metadata.name}")" | tail -1
kill "$port_forward_pid"
sleep 2

echo ${YELLOW}check ingress service${NOCOLOR}
api_url=http://localhost:8000/catalogue/${CATALOGUE_NAME}
service_port=80
kubectl port-forward service/ingress-nginx-controller 8000:${service_port} --namespace ingress-nginx &
port_forward_pid=$!
sleep 2
curl -o /dev/null -w "%{http_code}\n" "${api_url}/api/redcap_data.json"
echo ${YELLOW}checking ingress logs${NOCOLOR}
kubectl logs --namespace ingress-nginx "$(kubectl get pods -o "jsonpath={.items[0].metadata.name}" --selector "app.kubernetes.io/component=controller" --namespace ingress-nginx)" | tail -1
kill "$port_forward_pid"
sleep 2

echo ${YELLOW}check EBI load balancer${NOCOLOR}
api_url=http://wwwdev.ebi.ac.uk/catalogue/${CATALOGUE_NAME}
curl -o /dev/null -w "%{http_code}\n" "${api_url}/api/redcap_data.json"
echo app http logs
kubectl logs "$(kubectl get pods -o "jsonpath={.items[0].metadata.name}")" | tail -1
echo ingress http logs
kubectl logs --namespace ingress-nginx "$(kubectl get pods -o "jsonpath={.items[0].metadata.name}" --selector "app.kubernetes.io/component=controller" --namespace ingress-nginx)" | tail -1
