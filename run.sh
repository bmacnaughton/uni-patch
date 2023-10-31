#!/bin/sh
set -ex

node --require ./hook.cjs --import ./register-hook.mjs ./entrypoint.mjs
