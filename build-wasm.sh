#!/bin/bash
set -x
set -e

build_type=${1:-Release}
wasm_optimization_level="-g2"
app_name="app"
if [ "$build_type" = "Debug" ]; then
    echo "<<<<<< ${build_type} <<<<<<"
    wasm_optimization_level="-gseparate-dwarf=${app_name}.debug.wasm"
fi

pushd .
rm -rf build
mkdir -p build
cd build
emcmake cmake -DCMAKE_BUILD_TYPE=${build_type} -DWASM=1 ..
emmake make
em++ ${wasm_optimization_level} libstb-image.a -o ${app_name}.js --bind -lnodefs.js -s ALLOW_MEMORY_GROWTH=1 -s MAXIMUM_MEMORY=4GB -s FORCE_FILESYSTEM=1 -s EXPORTED_RUNTIME_METHODS=["UTF8ToString"]
cp ${app_name}.* ../docs
popd 