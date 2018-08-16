# \<scary-cube\>

Rubik's Cube implemented as Polymer Element.

Needs to be sized (best by fitting it into a parent element) to correctly display and scale.

Orientation of cube can be changed with mouse and touch gestures.

Moves need to be performed using the `addMove` or `addMoves` methods, using SiGN notation.

Colors of the cube can be changed using the following custom CSS properties, matching the sides of the cube

```
scary-cube {
  --cube-color-u: white;
  --cube-color-d: yellow;
  --cube-color-f: green;
  --cube-color-b: #3333FF;
  --cube-color-l: orange;
  --cube-color-r: red;
}
```

Additionaly the speed of the move animations can be adjusted with the `--cube-speed` parameter

```
scary-cube {
  --cube-speed: 0.4s;
}
```
