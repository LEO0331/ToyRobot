# Toy Robot

Toy Robot simulator with two modes:

- CLI simulator (`npm start`)
- Browser game for GitHub Pages (`npm run web:start`)

Both modes use the same simulator core and command rules.

## Instructions

Toy Robot moves on a tabletop grid with no obstacles.

- Grid coordinates are `0..5` for both X and Y (6x6 board).
- Origin `(0,0)` is the south-west corner.
- Invalid/failed commands do not stop the simulation.

Commands:

- `PLACE X,Y,F` places the robot at `X,Y` facing `F`.
- `MOVE` moves one unit forward.
- `LEFT` rotates 90 degrees anti-clockwise.
- `RIGHT` rotates 90 degrees clockwise.
- `REPORT` outputs `X,Y,F`.

Facing direction `F` must be one of:

- `NORTH`
- `EAST`
- `SOUTH`
- `WEST`

## Assumptions

- Commands are case-sensitive and must be uppercase.
- Leading/trailing spaces are allowed (for example ` REPORT`).
- `PLACE` parameters cannot contain empty values (for example `PLACE ,,NORTH` fails).
- Any move that would cause a fall fails and keeps the same state.
- Commands are ignored until the first valid `PLACE`.

## Constraints

The first valid command must be `PLACE`.
After that, any sequence of commands is allowed, including another `PLACE`.

## Example Input/Output

### Example A

Input:

```text
PLACE 0,0,NORTH
MOVE
REPORT
```

Output:

```text
0,1,NORTH
```

### Example B

Input:

```text
PLACE 0,0,NORTH
LEFT
REPORT
```

Output:

```text
0,0,WEST
```

### Example C

Input:

```text
PLACE 1,2,EAST
MOVE
MOVE
LEFT
MOVE
REPORT
```

Output:

```text
3,3,NORTH
```

## Setup

Install dependencies:

```bash
npm install
```

Run tests:

```bash
npm test
```

## CLI Mode

Start CLI simulator:

```bash
npm start
```

Example input:

```text
PLACE 0,0,NORTH
MOVE
REPORT
```

Exit with `Ctrl + C` (Windows/Linux) or `Cmd + C` (macOS).

## Web Game Mode

Build and serve the static game locally:

```bash
npm run web:start
```

Then open:

- [http://localhost:8080](http://localhost:8080)

Features:

- Visual 6x6 board with robot direction icon
- Single command input
- Multiline script mode (Step / Run All)
- Command log with success/fail messages

## GitHub Pages

Deployment is automated by GitHub Actions via `.github/workflows/deploy-pages.yml`.

- Push to `main` triggers tests + static build + deployment.
- Expected public URL:
  - [https://leo0331.github.io/ToyRobot/](https://leo0331.github.io/ToyRobot/)

If your repo name or owner changes, update the URL accordingly.
