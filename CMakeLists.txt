cmake_minimum_required(VERSION 3.12.0)

# set the project name and version
project(stb-image VERSION 1.0)

# specify the C++ standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED True)

set(CMAKE_CXX_VISIBILITY_PRESET hidden)
if(CMAKE_BUILD_TYPE MATCHES Release)
    message(STATUS "Release Build")
    set(CMAKE_CXX_FLAGS_RELEASE "-O2")
    if(WASM)
        set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -msse -msse2 -msse3 -msimd128 -pthread")
    else()
        set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -msse -msse2 -msse3 -pthread")
    endif()
endif()

if(WASM)
    message(STATUS "WEB ASSEMBLY TARGET IS ON")
    add_library(${PROJECT_NAME} STATIC main.cpp)
else()
    message(STATUS "Building for desktop")
    add_executable(${PROJECT_NAME} main.cpp)
endif()

target_include_directories(${CMAKE_PROJECT_NAME} PUBLIC
                           "includes"
                           )