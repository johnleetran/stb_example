# STB Image Example
STB Lib can be found at https://github.com/nothings/stb

# Install Emscripten
https://emscripten.org/docs/getting_started/downloads.html

The example was tested with 3.1.8

# Build with cmake
```
mkdir build
cd build
cmake -DCMAKE_BUILD_TYPE=Release ..
make
```

# Run app
```
./app input.jpg output.png
```

# build for Web Assembly (WASM)
```
chmod +x build-wasm.sh
./build-wasm.sh
```

# build for Web Assembly (WASM) Debug
```
./build-wasm.sh Debug
```