cmake_minimum_required(VERSION 3.14)
project(FairShare)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED True)

include_directories(include)

# Core sources (everything except main.cpp)
set(CORE_SOURCES 
    src/User.cpp 
    src/Split.cpp 
    src/Expense.cpp 
    src/Ledger.cpp 
    src/FairShareManager.cpp 
    src/FileManager.cpp
)

# 1. Main Application
add_executable(FairShare ${CORE_SOURCES} src/main.cpp)

# 2. Google Test Setup
include(FetchContent)
FetchContent_Declare(
  googletest
  URL https://github.com/google/googletest/archive/03597a01ee50ed33e9dfd640b249b4be3799d395.zip
)
# For Windows MSVC/MinGW compatibility
set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(googletest)

enable_testing()

# 3. Test Executable
add_executable(FairShareTests tests/tests.cpp ${CORE_SOURCES})
target_link_libraries(FairShareTests gtest_main)

include(GoogleTest)
gtest_discover_tests(FairShareTests)
