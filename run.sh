#!/bin/bash
set -ex

version=`node -v`

# Remove the leading "v" if it's present
version="${version#v}"

# split the version string into an array
IFS='.' read -ra version_parts <<< "$version"

# Ensure that there are at least three parts (major, minor, patch)
if [ ${#version_parts[@]} -lt 3 ]; then
    echo "Invalid version format: $version"
    exit 1
fi

# Extract major, minor, and patch versions from the array
major="${version_parts[0]}"
minor="${version_parts[1]}"

if [ "$major" -gt 20 ] && [ "$minor" -gt 6 ]; then
    node --import ./esm-loader.mjs ./entrypoint.mjs
elif [ "$major" -ge 20 ]; then
    node --require ./hook.cjs --loader ./esm-loader.mjs ./entrypoint.mjs
elif [ "$major" -ge 16 ]; then
    node --loader ./esm-loader.mjs ./entrypoint.mjs
else
    echo "all bets are off"
fi
