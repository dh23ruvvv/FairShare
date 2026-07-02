# FairShare

FairShare is a pure C++ object-oriented command-line application that acts as a shared expense tracker and debt simplifier (similar to Splitwise). 

This project was built to demonstrate core software engineering principles, memory management, and algorithmic problem solving in modern C++ (C++17).

## Key Engineering Features

- **Object-Oriented Design**: Utilizes abstraction, encapsulation, and composition to model the domain. 
- **Strategy Pattern (Polymorphism)**: The expense splitting logic is decoupled into an abstract `Split` base class, allowing seamless runtime evaluation of `EqualSplit`, `ExactSplit`, and `PercentSplit` strategies without rigid `if-else` blocks.
- **Greedy Debt Simplification**: Implements a highly optimized $O(N \log N)$ algorithm using Max-Heaps (`std::priority_queue`) to consolidate a complex web of pairwise debts into the absolute minimum number of transactions required to settle all balances.
- **Data Structures**: Heavy, practical use of STL containers including `std::unordered_map`, `std::map`, `std::vector`, and smart pointers (`std::shared_ptr`) for memory safety.
- **Lightweight Persistence**: Custom file serialization module that saves and restores system state without the overhead of a heavy database engine.

## Building the Project

This project uses CMake. To build it from the terminal:

```bash
mkdir build
cd build
cmake ..
cmake --build .
```

## Running the Application

Execute the built binary from the terminal. 

```bash
# On Windows
.\build\FairShare.exe

# On Linux/Mac
./build/FairShare
```

## Available Commands

When the application starts, it will provide a `>` prompt. You can interact with it using the following commands:

* `ADD_USER <id> <name>` - Registers a new user.
* `EXPENSE <payer_id> <amount> <num_participants> <p1_id> <p2_id> ... <split_type> [split args...]` - Records a new shared expense.
  * *Split Types supported: `EQUAL`, `EXACT <amounts...>`, `PERCENT <percentages...>`*
* `SHOW` - Displays the current outstanding balances (who owes whom).
* `SIMPLIFY` - Runs the greedy algorithm to optimize and minimize all debts.
* `HISTORY` - Displays a log of all recorded expenses.
* `EXIT` - Saves the ledger to the disk and terminates the application.

## Example Usage

```text
> ADD_USER 1 Alice
> ADD_USER 2 Bob
> ADD_USER 3 Charlie
> EXPENSE 1 300 3 1 2 3 EQUAL
> SHOW
Bob owes Alice: 100.00
Charlie owes Alice: 100.00
> SIMPLIFY
> SHOW
Bob owes Alice: 100.00
Charlie owes Alice: 100.00
> EXIT
```
