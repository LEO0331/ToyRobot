# Toy Robot

[![Deploy GitHub Pages](https://github.com/LEO0331/ToyRobot/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/LEO0331/ToyRobot/actions/workflows/deploy-pages.yml)
[![Coverage Statements](https://img.shields.io/badge/coverage%20(statements)-100%25-brightgreen)](https://github.com/LEO0331/ToyRobot)
[![Coverage Branches](https://img.shields.io/badge/coverage%20(branches)-89.43%25-yellowgreen)](https://github.com/LEO0331/ToyRobot)

Toy Robot simulator with two modes:

- CLI simulator (`npm start`)
- Browser game for GitHub Pages (`npm run web:start`)

The browser experience is an interactive game powered by the same command engine and rules as the CLI.

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
- Demo preset buttons for Example A/B/C
- Single command input
- Multiline script mode (Step / Run All)
- Script progress preview with active-line highlight during stepping
- Latest command status banner (`SUCCESS` / `FAILED`)
- Command log with success/fail messages

## Demo Walkthrough

For a clean live demo:

1. Open the app and show the `Board (0..5)` grid.
2. Click `Example C` in `Demo Presets`.
3. Click `Step` repeatedly and point out the highlighted active script line.
4. Show `Current State`, `Latest Status`, and `Command Log` updating together.
5. Click `Run All` for `Example A` to quickly show expected `REPORT` output.

## GitHub Pages

Deployment is automated by GitHub Actions via `.github/workflows/deploy-pages.yml`.

- Push to `main` triggers tests + static build + deployment.
- Expected public URL:
  - [https://leo0331.github.io/ToyRobot/](https://leo0331.github.io/ToyRobot/)

If your repo name or owner changes, update the URL accordingly.

## E2E Smoke Test (Playwright)

Install Playwright browsers once:

```bash
npx playwright install
```

Run smoke test:

```bash
npm run test:e2e
```
