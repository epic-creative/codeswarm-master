#!/bin/bash

DEBUG=0
BASEDIR=$(cd $(dirname $0); pwd)
buildname="codeswarm-main"
buildver="0.0.1"

source ./bin/deploy.sh

parse_options parse_options $@

echo "workers"
echo $1
