#!/bin/sh

pushd assembly-script
npm ci
popd

pushd ffi
npm ci
popd


