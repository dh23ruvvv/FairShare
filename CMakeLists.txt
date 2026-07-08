cmake_minimum_required(VERSION 3.14)
project(FairShare)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED True)

include_directories(include)

file(GLOB SOURCES "src/*.cpp")

include(FetchContent)

# JSON Library
FetchContent_Declare(
  json
  URL https://github.com/nlohmann/json/releases/download/v3.11.3/json.tar.xz
)
FetchContent_MakeAvailable(json)

# HTTP Library
FetchContent_Declare(
  httplib
  URL https://github.com/yhirose/cpp-httplib/archive/refs/tags/v0.15.3.tar.gz
)
FetchContent_MakeAvailable(httplib)

add_executable(FairShare ${SOURCES})

# Link libraries
target_link_libraries(FairShare PRIVATE nlohmann_json::nlohmann_json httplib::httplib)

# Windows specific networking libraries
if(WIN32)
    target_link_libraries(FairShare PRIVATE ws2_32 crypt32)
endif()
