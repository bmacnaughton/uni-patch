#!/bin/sh
set -ex

node --require ./hook.cjs --import ./register-hook.mjs ./1.mjs