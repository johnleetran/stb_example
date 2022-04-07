cmake_minimum_required(VERSION 3.12.0)

# set the project name and version
project(stb-image VERSION 1.0)

# specify the C++ standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED True)

set(CMAKE_CXX_VISIBILITY_PRESET hidden)
if(CMAKE_BUILD_TYPE MATCHES Release)
    message("optimize code")
    set(CMAKE_CXX_FLAGS_RELEASE "-O2")
endif()

# add_executable(${PROJECT_NAME} main.cpp)
add_library(${PROJECT_NAME} STATIC main.cpp)

target_include_directories(${CMAKE_PROJECT_NAME} PUBLIC
                           "includes"
                           )