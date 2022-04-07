#!/bin/bash

pushd .
rm -rf build
mkdir -p build
cd build
emcmake cmake -DCMAKE_BUILD_TYPE=Release ..
emmake make
em++ libstb-image.a -o app.html --bind -lidbfs.js -s ALLOW_MEMORY_GROWTH=1 -s MAXIMUM_MEMORY=4GB -s FORCE_FILESYSTEM=1
cp -r app.* ../web
popd 