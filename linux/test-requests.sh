#!/usr/bin/env bash
curl -k -v https://localhost:7443/test-url/
curl -k -v -X POST -d '{"json":"payload"}' https://localhost:7443/