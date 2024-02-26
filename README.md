# Toy Robot

## Instructions and Assumption

This is a program that simulates a Toy Robot moving on a table top. The table top is a grid of 5 units x 5 units. There are no obstructions on the table surface. The Toy Robot is free to roam around the surface of the table, but must be prevented from falling to destruction. A failed or invalid command should not stop the simulation.

- `PLACE X,Y,F` will place the Toy Robot on the table at position X,Y and facing direction F.
  - Direction can be one of the cardinal points: `NORTH`, `EAST`, `SOUTH` or `WEST`.
- `MOVE` will move the Toy Robot one unit forward in the direction it is currently facing.
- `LEFT` will rotate the Toy Robot 90 degrees left (anti-clockwise/counter-clockwise).
- `RIGHT` will rotate the Toy Robot 90 degrees right (clockwise).
- `REPORT` will announce the X,Y,F of Toy Robot.
- Assume the succeed command would strcitly follow the above perserved commands (lower case letter would result fail)
- Every command should provide visual output that the command has either succeeded or failed.
- Assume origin (0,0) to be the SOUTH WEST most corner.
- Assume inputs are String type and from standard input.
- Ignore any move that would cause the robot to fall and fail (remain the same state).

## Constraints

The first valid command must be the PLACE (Assume: discard all commands in the sequence until a valid PLACE command has been executed). After that, any sequence of commands may be issued in any order, including another PLACE command.

## Example Input and Output

### Example A

Input:

```
PLACE 0,0,NORTH
MOVE
REPORT
```

Output:

```
0,1,NORTH
```

### Example B

Input:

```
PLACE 0,0,NORTH
LEFT
REPORT
```

Output:

```
0,0,WEST
```

### Example C

Input:

```
PLACE 1,2,EAST
MOVE
MOVE
LEFT
MOVE
REPORT
```

Output:

```
3,3,NORTH
```

## Setup

#### Make sure you have the latest git, Node.js and Npm installed on your machine
```
$ git --version
$ npm --version
$ node --version
```
#### Clone the repo from Github
`git clone https://github.com/LEO0331/ToyRobot.git` 
#### Install dependencies with `npm install` in the ToyRobot folder
`npm install`
#### Start the simulator
`npm run start`
#### Paste your input followed by Enter
```
PLACE 0,0,NORTH -> type Enter
MOVE -> type Enter
REPORT -> type Enter then the result will show
```
#### Exit the simulator
`Ctrl + C` or `Cmd + C` to terminate the simulator

