import {LitElement, html} from '@polymer/lit-element';
import {GestureEventListeners} from '@polymer/polymer/lib/mixins/gesture-event-listeners.js';
import * as Gestures from '@polymer/polymer/lib/utils/gestures.js';
import {afterNextRender} from '@polymer/polymer/lib/utils/render-status.js';
import ResizeObserver from 'resize-observer-polyfill';

const sides = ['u', 'd', 'r', 'l', 'f', 'b'];
const vPos = ['top', 'middle', 'bottom'];
const hPos = ['left', 'center', 'right'];
const colors = ['white', 'yellow', 'red', 'orange', 'green', 'blue'];

const allMoves = {
  U: [
    {source: {side: 'u', vPos: 'top', hPos: 'left'}, destination: {vPos: 'top', hPos: 'right'}},
    {source: {side: 'u', vPos: 'top', hPos: 'center'}, destination: {vPos: 'middle', hPos: 'right'}},
    {source: {side: 'u', vPos: 'top', hPos: 'right'}, destination: {vPos: 'bottom', hPos: 'right'}},
    {source: {side: 'u', vPos: 'middle', hPos: 'right'}, destination: {vPos: 'bottom', hPos: 'center'}},
    {source: {side: 'u', vPos: 'bottom', hPos: 'right'}, destination: {vPos: 'bottom', hPos: 'left'}},
    {source: {side: 'u', vPos: 'bottom', hPos: 'center'}, destination: {vPos: 'middle', hPos: 'left'}},
    {source: {side: 'u', vPos: 'bottom', hPos: 'left'}, destination: {vPos: 'top', hPos: 'left'}},
    {source: {side: 'u', vPos: 'middle', hPos: 'left'}, destination: {vPos: 'top', hPos: 'center'}},
    {source: {side: 'u', vPos: 'middle', hPos: 'center'}, destination: {}},
    {source: {side: 'f', vPos: 'top'}, destination: {side: 'l'}},
    {source: {side: 'l', vPos: 'top'}, destination: {side: 'b'}},
    {source: {side: 'b', vPos: 'top'}, destination: {side: 'r'}},
    {source: {side: 'r', vPos: 'top'}, destination: {side: 'f'}}
  ],
  u: {steps: ['U', 'E', 'E', 'E']},
  D: [
    {source: {side: 'd', vPos: 'top', hPos: 'left'}, destination: {vPos: 'top', hPos: 'right'}},
    {source: {side: 'd', vPos: 'top', hPos: 'center'}, destination: {vPos: 'middle', hPos: 'right'}},
    {source: {side: 'd', vPos: 'top', hPos: 'right'}, destination: {vPos: 'bottom', hPos: 'right'}},
    {source: {side: 'd', vPos: 'middle', hPos: 'right'}, destination: {vPos: 'bottom', hPos: 'center'}},
    {source: {side: 'd', vPos: 'bottom', hPos: 'right'}, destination: {vPos: 'bottom', hPos: 'left'}},
    {source: {side: 'd', vPos: 'bottom', hPos: 'center'}, destination: {vPos: 'middle', hPos: 'left'}},
    {source: {side: 'd', vPos: 'bottom', hPos: 'left'}, destination: {vPos: 'top', hPos: 'left'}},
    {source: {side: 'd', vPos: 'middle', hPos: 'left'}, destination: {vPos: 'top', hPos: 'center'}},
    {source: {side: 'd', vPos: 'middle', hPos: 'center'}, destination: {}},
    {source: {side: 'f', vPos: 'bottom'}, destination: {side: 'r'}},
    {source: {side: 'l', vPos: 'bottom'}, destination: {side: 'f'}},
    {source: {side: 'b', vPos: 'bottom'}, destination: {side: 'l'}},
    {source: {side: 'r', vPos: 'bottom'}, destination: {side: 'b'}}
  ],
  d: {steps: ['D', 'E']},
  R: [
    {source: {side: 'r', vPos: 'top', hPos: 'left'}, destination: {vPos: 'top', hPos: 'right'}},
    {source: {side: 'r', vPos: 'top', hPos: 'center'}, destination: {vPos: 'middle', hPos: 'right'}},
    {source: {side: 'r', vPos: 'top', hPos: 'right'}, destination: {vPos: 'bottom', hPos: 'right'}},
    {source: {side: 'r', vPos: 'middle', hPos: 'right'}, destination: {vPos: 'bottom', hPos: 'center'}},
    {source: {side: 'r', vPos: 'bottom', hPos: 'right'}, destination: {vPos: 'bottom', hPos: 'left'}},
    {source: {side: 'r', vPos: 'bottom', hPos: 'center'}, destination: {vPos: 'middle', hPos: 'left'}},
    {source: {side: 'r', vPos: 'bottom', hPos: 'left'}, destination: {vPos: 'top', hPos: 'left'}},
    {source: {side: 'r', vPos: 'middle', hPos: 'left'}, destination: {vPos: 'top', hPos: 'center'}},
    {source: {side: 'r', vPos: 'middle', hPos: 'center'}, destination: {}},
    {source: {side: 'f', hPos: 'right'}, destination: {side: 'u'}},
    {source: {side: 'd', hPos: 'right'}, destination: {side: 'f'}},
    {source: {side: 'u', vPos: 'top', hPos: 'right'}, destination: {side: 'b', vPos: 'bottom', hPos: 'left'}},
    {source: {side: 'u', vPos: 'middle', hPos: 'right'}, destination: {side: 'b', vPos: 'middle', hPos: 'left'}},
    {source: {side: 'u', vPos: 'bottom', hPos: 'right'}, destination: {side: 'b', vPos: 'top', hPos: 'left'}},
    {source: {side: 'b', vPos: 'top', hPos: 'left'}, destination: {side: 'd', vPos: 'bottom', hPos: 'right'}},
    {source: {side: 'b', vPos: 'middle', hPos: 'left'}, destination: {side: 'd', vPos: 'middle', hPos: 'right'}},
    {source: {side: 'b', vPos: 'bottom', hPos: 'left'}, destination: {side: 'd', vPos: 'top', hPos: 'right'}}
  ],
  r: {steps: ['R', 'M', 'M', 'M']},
  L: [
    {source: {side: 'l', vPos: 'top', hPos: 'left'}, destination: {vPos: 'top', hPos: 'right'}},
    {source: {side: 'l', vPos: 'top', hPos: 'center'}, destination: {vPos: 'middle', hPos: 'right'}},
    {source: {side: 'l', vPos: 'top', hPos: 'right'}, destination: {vPos: 'bottom', hPos: 'right'}},
    {source: {side: 'l', vPos: 'middle', hPos: 'right'}, destination: {vPos: 'bottom', hPos: 'center'}},
    {source: {side: 'l', vPos: 'bottom', hPos: 'right'}, destination: {vPos: 'bottom', hPos: 'left'}},
    {source: {side: 'l', vPos: 'bottom', hPos: 'center'}, destination: {vPos: 'middle', hPos: 'left'}},
    {source: {side: 'l', vPos: 'bottom', hPos: 'left'}, destination: {vPos: 'top', hPos: 'left'}},
    {source: {side: 'l', vPos: 'middle', hPos: 'left'}, destination: {vPos: 'top', hPos: 'center'}},
    {source: {side: 'l', vPos: 'middle', hPos: 'center'}, destination: {}},
    {source: {side: 'f', hPos: 'left'}, destination: {side: 'd'}},
    {source: {side: 'u', hPos: 'left'}, destination: {side: 'f'}},
    {source: {side: 'd', vPos: 'top', hPos: 'left'}, destination: {side: 'b', vPos: 'bottom', hPos: 'right'}},
    {source: {side: 'd', vPos: 'middle', hPos: 'left'}, destination: {side: 'b', vPos: 'middle', hPos: 'right'}},
    {source: {side: 'd', vPos: 'bottom', hPos: 'left'}, destination: {side: 'b', vPos: 'top', hPos: 'right'}},
    {source: {side: 'b', vPos: 'top', hPos: 'right'}, destination: {side: 'u', vPos: 'bottom', hPos: 'left'}},
    {source: {side: 'b', vPos: 'middle', hPos: 'right'}, destination: {side: 'u', vPos: 'middle', hPos: 'left'}},
    {source: {side: 'b', vPos: 'bottom', hPos: 'right'}, destination: {side: 'u', vPos: 'top', hPos: 'left'}}
  ],
  l: {steps: ['L', 'M']},
  F: [
    {source: {side: 'f', vPos: 'top', hPos: 'left'}, destination: {vPos: 'top', hPos: 'right'}},
    {source: {side: 'f', vPos: 'top', hPos: 'center'}, destination: {vPos: 'middle', hPos: 'right'}},
    {source: {side: 'f', vPos: 'top', hPos: 'right'}, destination: {vPos: 'bottom', hPos: 'right'}},
    {source: {side: 'f', vPos: 'middle', hPos: 'right'}, destination: {vPos: 'bottom', hPos: 'center'}},
    {source: {side: 'f', vPos: 'bottom', hPos: 'right'}, destination: {vPos: 'bottom', hPos: 'left'}},
    {source: {side: 'f', vPos: 'bottom', hPos: 'center'}, destination: {vPos: 'middle', hPos: 'left'}},
    {source: {side: 'f', vPos: 'bottom', hPos: 'left'}, destination: {vPos: 'top', hPos: 'left'}},
    {source: {side: 'f', vPos: 'middle', hPos: 'left'}, destination: {vPos: 'top', hPos: 'center'}},
    {source: {side: 'f', vPos: 'middle', hPos: 'center'}, destination: {}},
    {source: {side: 'l', vPos: 'top', hPos: 'right'}, destination: {side: 'u', vPos: 'bottom', hPos: 'right'}},
    {source: {side: 'l', vPos: 'middle', hPos: 'right'}, destination: {side: 'u', vPos: 'bottom', hPos: 'center'}},
    {source: {side: 'l', vPos: 'bottom', hPos: 'right'}, destination: {side: 'u', vPos: 'bottom', hPos: 'left'}},
    {source: {side: 'u', vPos: 'bottom', hPos: 'left'}, destination: {side: 'r', vPos: 'top', hPos: 'left'}},
    {source: {side: 'u', vPos: 'bottom', hPos: 'center'}, destination: {side: 'r', vPos: 'middle', hPos: 'left'}},
    {source: {side: 'u', vPos: 'bottom', hPos: 'right'}, destination: {side: 'r', vPos: 'bottom', hPos: 'left'}},
    {source: {side: 'r', vPos: 'top', hPos: 'left'}, destination: {side: 'd', vPos: 'top', hPos: 'right'}},
    {source: {side: 'r', vPos: 'middle', hPos: 'left'}, destination: {side: 'd', vPos: 'top', hPos: 'center'}},
    {source: {side: 'r', vPos: 'bottom', hPos: 'left'}, destination: {side: 'd', vPos: 'top', hPos: 'left'}},
    {source: {side: 'd', vPos: 'top', hPos: 'left'}, destination: {side: 'l', vPos: 'top', hPos: 'right'}},
    {source: {side: 'd', vPos: 'top', hPos: 'center'}, destination: {side: 'l', vPos: 'middle', hPos: 'right'}},
    {source: {side: 'd', vPos: 'top', hPos: 'right'}, destination: {side: 'l', vPos: 'bottom', hPos: 'right'}}
  ],
  f: {steps: ['F', 'S']},
  B: [
    {source: {side: 'b', vPos: 'top', hPos: 'left'}, destination: {vPos: 'top', hPos: 'right'}},
    {source: {side: 'b', vPos: 'top', hPos: 'center'}, destination: {vPos: 'middle', hPos: 'right'}},
    {source: {side: 'b', vPos: 'top', hPos: 'right'}, destination: {vPos: 'bottom', hPos: 'right'}},
    {source: {side: 'b', vPos: 'middle', hPos: 'right'}, destination: {vPos: 'bottom', hPos: 'center'}},
    {source: {side: 'b', vPos: 'bottom', hPos: 'right'}, destination: {vPos: 'bottom', hPos: 'left'}},
    {source: {side: 'b', vPos: 'bottom', hPos: 'center'}, destination: {vPos: 'middle', hPos: 'left'}},
    {source: {side: 'b', vPos: 'bottom', hPos: 'left'}, destination: {vPos: 'top', hPos: 'left'}},
    {source: {side: 'b', vPos: 'middle', hPos: 'left'}, destination: {vPos: 'top', hPos: 'center'}},
    {source: {side: 'b', vPos: 'middle', hPos: 'center'}, destination: {}},
    {source: {side: 'r', vPos: 'top', hPos: 'right'}, destination: {side: 'u', vPos: 'top', hPos: 'left'}},
    {source: {side: 'r', vPos: 'middle', hPos: 'right'}, destination: {side: 'u', vPos: 'top', hPos: 'center'}},
    {source: {side: 'r', vPos: 'bottom', hPos: 'right'}, destination: {side: 'u', vPos: 'top', hPos: 'right'}},
    {source: {side: 'u', vPos: 'top', hPos: 'left'}, destination: {side: 'l', vPos: 'bottom', hPos: 'left'}},
    {source: {side: 'u', vPos: 'top', hPos: 'center'}, destination: {side: 'l', vPos: 'middle', hPos: 'left'}},
    {source: {side: 'u', vPos: 'top', hPos: 'right'}, destination: {side: 'l', vPos: 'top', hPos: 'left'}},
    {source: {side: 'l', vPos: 'top', hPos: 'left'}, destination: {side: 'd', vPos: 'bottom', hPos: 'left'}},
    {source: {side: 'l', vPos: 'middle', hPos: 'left'}, destination: {side: 'd', vPos: 'bottom', hPos: 'center'}},
    {source: {side: 'l', vPos: 'bottom', hPos: 'left'}, destination: {side: 'd', vPos: 'bottom', hPos: 'right'}},
    {source: {side: 'd', vPos: 'bottom', hPos: 'right'}, destination: {side: 'r', vPos: 'top', hPos: 'right'}},
    {source: {side: 'd', vPos: 'bottom', hPos: 'center'}, destination: {side: 'r', vPos: 'middle', hPos: 'right'}},
    {source: {side: 'd', vPos: 'bottom', hPos: 'left'}, destination: {side: 'r', vPos: 'bottom', hPos: 'right'}}
  ],
  b: {steps: ['B', 'S', 'S', 'S']},
  M: [
    {source: {side: 'u', hPos: 'center'}, destination: {side: 'f'}},
    {source: {side: 'f', hPos: 'center'}, destination: {side: 'd'}},
    {source: {side: 'b', vPos: 'top', hPos: 'center'}, destination: {side: 'u', vPos: 'bottom'}},
    {source: {side: 'b', vPos: 'middle', hPos: 'center'}, destination: {side: 'u'}},
    {source: {side: 'b', vPos: 'bottom', hPos: 'center'}, destination: {side: 'u', vPos: 'top'}},
    {source: {side: 'd', vPos: 'top', hPos: 'center'}, destination: {side: 'b', vPos: 'bottom'}},
    {source: {side: 'd', vPos: 'middle', hPos: 'center'}, destination: {side: 'b'}},
    {source: {side: 'd', vPos: 'bottom', hPos: 'center'}, destination: {side: 'b', vPos: 'top'}}
  ],
  E: [
    {source: {side: 'f', vPos: 'middle'}, destination: {side: 'r'}},
    {source: {side: 'l', vPos: 'middle'}, destination: {side: 'f'}},
    {source: {side: 'b', vPos: 'middle'}, destination: {side: 'l'}},
    {source: {side: 'r', vPos: 'middle'}, destination: {side: 'b'}}
  ],
  S: [
    {source: {side: 'l', vPos: 'top', hPos: 'center'}, destination: {side: 'u', vPos: 'middle', hPos: 'right'}},
    {source: {side: 'l', vPos: 'middle', hPos: 'center'}, destination: {side: 'u', vPos: 'middle', hPos: 'center'}},
    {source: {side: 'l', vPos: 'bottom', hPos: 'center'}, destination: {side: 'u', vPos: 'middle', hPos: 'left'}},
    {source: {side: 'u', vPos: 'middle', hPos: 'left'}, destination: {side: 'r', vPos: 'top', hPos: 'center'}},
    {source: {side: 'u', vPos: 'middle', hPos: 'center'}, destination: {side: 'r', vPos: 'middle', hPos: 'center'}},
    {source: {side: 'u', vPos: 'middle', hPos: 'right'}, destination: {side: 'r', vPos: 'bottom', hPos: 'center'}},
    {source: {side: 'r', vPos: 'top', hPos: 'center'}, destination: {side: 'd', vPos: 'middle', hPos: 'right'}},
    {source: {side: 'r', vPos: 'middle', hPos: 'center'}, destination: {side: 'd', vPos: 'middle', hPos: 'center'}},
    {source: {side: 'r', vPos: 'bottom', hPos: 'center'}, destination: {side: 'd', vPos: 'middle', hPos: 'left'}},
    {source: {side: 'd', vPos: 'middle', hPos: 'left'}, destination: {side: 'l', vPos: 'top', hPos: 'center'}},
    {source: {side: 'd', vPos: 'middle', hPos: 'center'}, destination: {side: 'l', vPos: 'middle', hPos: 'center'}},
    {source: {side: 'd', vPos: 'middle', hPos: 'right'}, destination: {side: 'l', vPos: 'bottom', hPos: 'center'}}
  ],
  x: {steps: ['R', 'L', 'L', 'L', 'M', 'M', 'M']},
  y: {steps: ['U', 'D', 'D', 'D', 'E', 'E', 'E']},
  z: {steps: ['F', 'S', 'B', 'B', 'B']}
};

const transitionClasses = {
  'U': 'move-fast move-yc',
  "U'": 'move-fast move-ycc',
  'U2': 'move-slow move-y2',
  'u': 'move-fast move-yc',
  "u'": 'move-fast move-ycc',
  'u2': 'move-slow move-y2',
  'E': 'move-fast move-ycc',
  "E'": 'move-fast move-yc',
  'E2': 'move-slow move-y2',
  'D': 'move-fast move-ycc',
  "D'": 'move-fast move-yc',
  'D2': 'move-slow move-y2',
  'd': 'move-fast move-ycc',
  "d'": 'move-fast move-yc',
  'd2': 'move-slow move-y2',
  'M': 'move-fast move-xcc',
  "M'": 'move-fast move-xc',
  'M2': 'move-slow move-x2',
  'L': 'move-fast move-xcc',
  "L'": 'move-fast move-xc',
  'L2': 'move-slow move-x2',
  'l': 'move-fast move-xcc',
  "l'": 'move-fast move-xc',
  'l2': 'move-slow move-x2',
  'R': 'move-fast move-xc',
  "R'": 'move-fast move-xcc',
  'R2': 'move-slow move-x2',
  'r': 'move-fast move-xc',
  "r'": 'move-fast move-xcc',
  'r2': 'move-slow move-x2',
  'B': 'move-fast move-zcc',
  "B'": 'move-fast move-zc',
  'B2': 'move-slow move-z2',
  'b': 'move-fast move-zcc',
  "b'": 'move-fast move-zc',
  'b2': 'move-slow move-z2',
  'F': 'move-fast move-zc',
  "F'": 'move-fast move-zcc',
  'F2': 'move-slow move-z2',
  'f': 'move-fast move-zc',
  "f'": 'move-fast move-zcc',
  'f2': 'move-slow move-z2',
  'S': 'move-fast move-zc',
  "S'": 'move-fast move-zcc',
  'S2': 'move-slow move-z2',
  'x': 'move-fast move-xc',
  "x'": 'move-fast move-xcc',
  'x2': 'move-slow move-x2',
  'z': 'move-fast move-zc',
  "z'": 'move-fast move-zcc',
  'z2': 'move-slow move-z2',
  'y': 'move-fast move-yc',
  "y'": 'move-fast move-ycc',
  'y2': 'move-slow move-y2',
};

/**
 * `scary-cube`
 *
 * Rubik's Cube implemented as Polymer Element.
 *
 * Needs to be sized (best by fitting it into a parent element) to correctly display and scale.
 *
 * Orientation of cube can be changed with mouse and touch gestures.
 *
 * Moves need to be performed using the `addMove` or `addMoves` methods, using SiGN notation.
 *
 * Colors of the cube can be changed using the following custom CSS properties, matching the sides of the cube
 *
 * ```
 * scary-cube {
 *   --cube-color-u: white;
 *   --cube-color-d: yellow;
 *   --cube-color-f: green;
 *   --cube-color-b: #3333FF;
 *   --cube-color-l: orange;
 *   --cube-color-r: red;
 * }
 * ```
 *
 * Additionaly the speed of the move animations can be adjusted with the `--cube-speed` parameter
 *
 * ```
 * scary-cube {
 *   --cube-speed: 0.4s;
 * }
 * ```
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class ScaryCube extends GestureEventListeners(LitElement) {

  static get properties() {
    return {
      _faces: Array,
      _scaleFactor: Number,
      _rotX: Number,
      _rotY: Number,
      _moveClass: String
    };
  }

  static get solvedCube() {
    const faces = [];

    sides.forEach((side, index) => {
      vPos.forEach((v) => {
        hPos.forEach((h) => {
          faces.push({
            side: side,
            vPos: v,
            hPos: h,
            color: colors[index],
            moving: false
          });
        });
      });
    });
    return faces;
  }

  /**
   * Returns true if the cube is in a solved state, i.e. each side has one color.
   *
   * @return {Boolean}
   */
  get isSolved() {
    const colorCheck = {};
    for (let f = 0; f < this._faces.length; f++) {
      if (!colorCheck[this._faces[f].side]) {
        colorCheck[this._faces[f].side] = this._faces[f].color;
      }
      if (colorCheck[this._faces[f].side] !== this._faces[f].color) {
        return false;
      }
    }
    return true;
  }

  /**
   * Returns or sets the current state of the cube.
   *
   * Throws erros when trying to set an invalid state.
   *
   * @return {Array}
   */
  get faces() {
    return JSON.parse(JSON.stringify(this._faces));
  }

  set faces(input) {
    const faces = [];
    const check = {};
    const colorCheck = [0, 0, 0, 0, 0, 0];
    if (input.length !== 54) {
      throw new Error('Faces needs to be an array of length 54.')
    }

    input.forEach((face) => {
      if (!face.side || !face.vPos || !face.hPos || !face.color) {
        throw new Error('Each face needs to have the fields side, vPos, hPos and color.')
      }
      if (sides.indexOf(face.side) < 0) {
        throw new Error(`Encountered invalid value for side: ${face.side}`);
      }
      if (vPos.indexOf(face.vPos) < 0) {
        throw new Error(`Encountered invalid value for vPos: ${face.vPos}`);
      }
      if (hPos.indexOf(face.hPos) < 0) {
        throw new Error(`Encountered invalid value for hPos: ${face.hPos}`);
      }

      const colorIndex = colors.indexOf(face.color);
      if (colorIndex < 0) {
        throw new Error(`Encountered invalid value for color: ${face.color}`);
      }
      if (colorCheck[colorIndex] >= 9) {
        throw new Error(`Color ${face.color} appears more than 9 times`);
      }
      colorCheck[colorIndex]++;

      if (check[`${face.side} ${face.vPos} ${face.hPos}`]) {
        throw new Error(`Encountered duplicate face: ${face.side} ${face.vPos} ${face.hPos}`);
      }
      check[`${face.side} ${face.vPos} ${face.hPos}`] = true;

      faces.push({
        side: face.side,
        vPos: face.vPos,
        hPos: face.hPos,
        color: face.color,
        moving: false
      });
    });

    if (this.moving) {
      this.moving = false;
      this._queue = [];
    }
    this._moveClass = '';
    this._faces = faces;
  }

  constructor() {
    super();
    this._boundResizeHandler = this._resizeHandler.bind(this);
    this._boundTrackHandler = this._trackHandler.bind(this);
    this._boundTransitionHandler = this._transitionHandler.bind(this);
    this._boundMoveHandler = this._performMove.bind(this);

    this._resizeObserver = new ResizeObserver(this._boundResizeHandler);

    this._faces = ScaryCube.solvedCube;
    this._queue = [];
    this._rotX = -25;
    this._rotY = -35;
    this._scaleFactor = 1;
  }

  connectedCallback() {
    super.connectedCallback();

    Gestures.addListener(this, 'track', this._boundTrackHandler);
    this._resizeObserver.observe(this);
  }

  disconnectedCallback() {
    Gestures.removeListener(this, 'track', this._boundTrackHandler);
    this._resizeObserver.unobserve(this);

    super.disconnectedCallback();
  }

  _render ({_faces, _scaleFactor, _rotX, _rotY, _moveClass}) {
    const style = html`
      <style>
        :host {
          display: block;
        }

        #viewport {
          width: 100%;
          height: 100%;
          overflow: hidden;
          margin: 0;
          padding: 0;
        }

        #cube {
          position: absolute;
          transform-style: preserve-3d;
          width: 300px; height: 300px;
          transform-origin: 150px 150px;
          top: 50%;
          left: 50%;
          margin-top: -150px;
          margin-left: -150px;
        }

        #slice {
          position: absolute;
          transform-style: preserve-3d;
          transform-origin: 150px 150px;
        }

        .face {
          display: block;
          box-sizing: border-box;
          position: absolute;
          width: 101px;
          height: 101px;
          border: 4px solid black;
          border-radius: 5px;
          opacity: 0.9;
          font-weight: bold;
          text-align:center;
          font-size: 30px;
          padding-top:35px;
          -moz-user-select: none;
          -webkit-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }

        .face[hidden] {
          display: none;
        }

        .u.top.left { transform:rotateX(90deg) translate3d(0px,-100px,50px); }
        .u.top.center { transform:rotateX(90deg) translate3d(100px,-100px,50px); }
        .u.top.right { transform:rotateX(90deg) translate3d(200px,-100px,50px); }
        .u.middle.left { transform:rotateX(90deg) translate3d(0px,0px,50px);}
        .u.middle.center { transform:rotateX(90deg) translate3d(100px,0px,50px);}
        .u.middle.right { transform:rotateX(90deg) translate3d(200px,0px,50px);}
        .u.bottom.left { transform:rotateX(90deg) translate3d(0px,100px,50px); }
        .u.bottom.center { transform:rotateX(90deg) translate3d(100px,100px,50px); }
        .u.bottom.right { transform:rotateX(90deg) translate3d(200px,100px,50px); }

        .d.top.left { transform:rotateX(-90deg) translate3d(0px,-100px,250px); }
        .d.top.center { transform:rotateX(-90deg) translate3d(100px,-100px,250px); }
        .d.top.right { transform:rotateX(-90deg) translate3d(200px,-100px,250px); }
        .d.middle.left { transform:rotateX(-90deg) translate3d(0px,0px,250px); }
        .d.middle.center { transform:rotateX(-90deg) translate3d(100px,0px,250px); }
        .d.middle.right { transform:rotateX(-90deg) translate3d(200px,0px,250px); }
        .d.bottom.left { transform:rotateX(-90deg) translate3d(0px,100px,250px); }
        .d.bottom.center { transform:rotateX(-90deg) translate3d(100px,100px,250px); }
        .d.bottom.right { transform:rotateX(-90deg) translate3d(200px,100px,250px); }

        .f.top.left { transform: translate3d(0px,0px,150px); }
        .f.top.center { transform: translate3d(100px,0px,150px); }
        .f.top.right { transform: translate3d(200px,0px,150px); }
        .f.middle.left { transform: translate3d(0px,100px,150px); }
        .f.middle.center { transform: translate3d(100px,100px,150px); }
        .f.middle.right { transform: translate3d(200px,100px,150px); }
        .f.bottom.left { transform: translate3d(0px,200px,150px); }
        .f.bottom.center{ transform: translate3d(100px,200px,150px); }
        .f.bottom.right { transform: translate3d(200px,200px,150px); }

        .b.top.left { transform:rotateY(180deg) translate3d(-200px,0px,150px);}
        .b.top.center { transform:rotateY(180deg) translate3d(-100px,0px,150px);}
        .b.top.right { transform:rotateY(180deg) translate3d(0px,0px,150px);}
        .b.middle.left { transform:rotateY(180deg) translate3d(-200px,100px,150px);}
        .b.middle.center { transform:rotateY(180deg) translate3d(-100px,100px,150px);}
        .b.middle.right { transform:rotateY(180deg) translate3d(0px,100px,150px);}
        .b.bottom.left { transform:rotateY(180deg) translate3d(-200px,200px,150px); }
        .b.bottom.center { transform:rotateY(180deg) translate3d(-100px,200px,150px); }
        .b.bottom.right { transform:rotateY(180deg) translate3d(0px,200px,150px); }

        .l.top.left { transform:rotateY(-90deg) translate3d(-100px,0px,50px); }
        .l.top.center { transform:rotateY(-90deg) translate3d(0px,0px,50px); }
        .l.top.right { transform:rotateY(-90deg) translate3d(100px,0px,50px); }
        .l.middle.left { transform:rotateY(-90deg) translate3d(-100px,100px,50px); }
        .l.middle.center { transform:rotateY(-90deg) translate3d(0px,100px,50px); }
        .l.middle.right { transform:rotateY(-90deg) translate3d(100px,100px,50px); }
        .l.bottom.left { transform:rotateY(-90deg) translate3d(-100px,200px,50px); }
        .l.bottom.center { transform:rotateY(-90deg) translate3d(0px,200px,50px); }
        .l.bottom.right { transform:rotateY(-90deg) translate3d(100px,200px,50px); }

        .r.top.left { transform:rotateY(90deg) translate3d(-100px,0px,250px); }
        .r.top.center { transform:rotateY(90deg) translate3d(0px,0px,250px); }
        .r.top.right { transform:rotateY(90deg) translate3d(100px,0px,250px); }
        .r.middle.left { transform:rotateY(90deg) translate3d(-100px,100px,250px); }
        .r.middle.center { transform:rotateY(90deg) translate3d(0px,100px,250px); }
        .r.middle.right { transform:rotateY(90deg) translate3d(100px,100px,250px); }
        .r.bottom.left { transform:rotateY(90deg) translate3d(-100px,200px,250px); }
        .r.bottom.center { transform:rotateY(90deg) translate3d(0px,200px,250px); }
        .r.bottom.right { transform:rotateY(90deg) translate3d(100px,200px,250px); }

        .red { background-color: var(--cube-color-r, red); }
        .blue { background-color: var(--cube-color-b, #3333FF); }
        .green { background-color: var(--cube-color-f, green); }
        .yellow { background-color: var(--cube-color-d, yellow); }
        .white { background-color: var(--cube-color-u, white); }
        .orange { background-color: var(--cube-color-l, orange); }

        .move-fast {
          transition: all var(--cube-speed, 0.4s) ease;
        }
        .move-slow {
          transition: all calc(2 * var(--cube-speed, 0.4s)) ease;
        }
        .move-ycc {
          transform: rotateY(90deg);
        }
        .move-yc {
          transform: rotateY(-90deg);
        }
        .move-y2 {
          transform: rotateY(180deg);
        }
        .move-zc {
          transform: rotateZ(90deg);
        }
        .move-zcc {
          transform: rotateZ(-90deg);
        }
        .move-z2 {
          transform: rotateZ(180deg);
        }
        .move-xc {
          transform: rotateX(90deg);
        }
        .move-xcc {
          transform: rotateX(-90deg);
        }
        .move-x2 {
          transform: rotateX(180deg);
        }
      </style>`;

    const viewportStyle = this._viewportStyle(_scaleFactor);
    const cubeStyle = this._cubeStyle(_rotX, _rotY, _scaleFactor);

    return html`
      ${style}
      <div id="viewport" style$=${viewportStyle}>
        <div id="cube" style$=${cubeStyle}>
        <div id="slice" class$=${_moveClass} on-transitionend=${this._boundTransitionHandler}>
            ${_faces.map((f) => html`
              <div class$=${this._faceClasslist(f.side, f.vPos, f.hPos, f.color)} hidden?=${!f.moving}></div>`
            )}
          </div>
          ${_faces.map((f) => html`
            <div class$=${this._faceClasslist(f.side, f.vPos, f.hPos, f.color)} hidden?=${f.moving}>
              ${(f.vPos === 'middle' && f.hPos === 'center') ? html`${f.side.toUpperCase()}` : html``}
            </div>`
          )}
        </div>
      </div>`;
  }

  _resizeHandler(entries) {
    let height;
    let width;

    if (entries && entries.length > 0) {
      entries = entries.filter((entry) => (entry.target === this));
    }
    if (entries && entries.length > 0) {
      width = entries[0].contentRect.width;
      height = entries[0].contentRect.height;
    } else {
      const vp = this.shadowRoot.getElementById('viewport');
      width = vp.offsetWidth;
      height = vp.offsetHeight;
    }

    this._scaleFactor = Math.min(width / 500, height / 500);
  }

  _trackHandler(e) {
    switch (e.detail.state) {
      case 'start':
        this._draggingReversed = (this._rotX < -90 || this._rotX > 90);
        break;

      case 'track':
        this._rotX -= e.detail.ddy * 0.5;
        if (this._rotX > 180) { this._rotX -= 360; }
        if (this._rotX < -180) { this._rotX += 360; }

        if (this._draggingReversed) {
          this._rotY -= e.detail.ddx * 0.5;
        } else {
          this._rotY += e.detail.ddx * 0.5;
        }
        if (this._rotY > 180) { this._rotY -= 360; }
        if (this._rotY < -180) { this._rotY += 360; }
        break;
    }
  }

  _viewportStyle(scaleFactor) {
    return 'perspective: ' + Math.round(800 * scaleFactor) + 'px;';
  }

  _cubeStyle(rotX, rotY, scaleFactor) {
    let transform = 'translate3d(0px, 0px, -100px) rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg)';
    transform += ' scale3d(' + scaleFactor + ',' + scaleFactor + ',' + scaleFactor + ')';
    return 'transform: ' + transform + ';';
  }

  _faceClasslist(face, v, h, color) {
    return 'face ' + face + ' ' + v + ' ' + h + ' ' + color;
  }

  /**
   * Adds multiple moves to the queue of moves to be performed.
   *
   * @param {String | Array} moves Array or space separated String of moves in SiGN notation
   * @param {Boolean} silent If true, the cube will not be animated for these moves
   */
  addMoves(moves, silent) {
    if (typeof moves === 'string' || moves instanceof String) {
      moves = moves.split(' ');
    }
    // filter invalid moves
    moves = moves.filter((move) => !!transitionClasses[move]);
    if (moves.length === 0) {
      return;
    }
    if (!this._queue) {
      this._queue = [];
    }
    moves.forEach((move) => {
      this._queue.push({move: move, silent: silent});
    });
    if (!this.moving) {
      this.moving = true;
      afterNextRender(this, this._boundMoveHandler);
    }
  }

  /**
   * Adds a single move to the queue of moves to be performed.
   *
   * @param {String} move Move to perform in SiGN notation
   * @param {Boolean} silent If true, the cube will not be animated for this move
   */
  addMove(move, silent) {
    if (!this._queue) {
      this._queue = [];
    }
    if (!transitionClasses[move]) {
      // invalid move
      return;
    }
    this._queue.push({move: move, silent: silent});
    if (!this.moving) {
      this.moving = true;
      afterNextRender(this, this._boundMoveHandler);
    }
  }

  /**
   * Reset the cube to its solved state
   */
  reset () {
    if (this.moving) {
      this.moving = false;
      this._queue = [];
    }
    this._moveClass = '';
    this._faces = ScaryCube.solvedCube;
  }

  /**
   * Fired when a move has finished
   *
   * @event move-finished
   */

  /**
   * Fired when the cube has been solved
   *
   * @event cube-solved
   */

  _performMove() {
    if (!this._queue || this._queue.length === 0) {
      this.moving = false;
      if (this.isSolved) {
        this.dispatchEvent(new CustomEvent('cube-solved'));
      }
      return;
    }

    const move = this._queue.shift();
    if (!move) {
      // queue is empty, stop for now
      this.moving = false;
      return;
    }

    this.moving = true;
    const slice = move.move[0];
    if (!slice) {
      // invalid move, skip to next one
      afterNextRender(this, this._boundMoveHandler);
      return;
    }
    const dir = move.move[1];
    let count = 1;
    if (dir == '\'') {
      count = 3;
    }
    if (dir == '2') {
      count = 2;
    }
    const moves = allMoves[slice];
    if (!moves) {
      afterNextRender(this, this._boundMoveHandler);
      return;
    }

    let steps = [];
    if (moves.steps) {
      for (let c = 0; c < count; c++) {
        steps = steps.concat(moves.steps);
      }
    } else {
      for (let c = 0; c < count; c++) {
        steps.push(slice);
      }
    }

    const newFaces = JSON.parse(JSON.stringify(this._faces));
    const originalFaces = JSON.parse(JSON.stringify(this._faces));

    steps.forEach((step) => {
      let oldFaces = JSON.parse(JSON.stringify(newFaces));
      allMoves[step].forEach((move) => {
        oldFaces.forEach((face, index) => {
          if (
            (!move.source.side || move.source.side === face.side) &&
            (!move.source.vPos || move.source.vPos === face.vPos) &&
            (!move.source.hPos || move.source.hPos === face.hPos)
          ) {
            newFaces[index].side = move.destination.side || face.side;
            newFaces[index].vPos = move.destination.vPos || face.vPos;
            newFaces[index].hPos = move.destination.hPos || face.hPos;
            originalFaces[index].moving = true;
          }
        });
      });
    });

    if (move.silent || !transitionClasses[move.move]) {
      this._faces = newFaces;
      this.dispatchEvent(new CustomEvent('move-finished'));
      afterNextRender(this, this._boundMoveHandler);
    } else {
      this._newFaces = newFaces,
      this._faces = originalFaces;
      this._moveClass = transitionClasses[move.move];
    }
  }

  _transitionHandler () {
    if (this.moving) {
      this._faces = this._newFaces;
      this._moveClass = '';
      this.dispatchEvent(new CustomEvent('move-finished'));
      afterNextRender(this, this._boundMoveHandler);
    }
  }
}

window.customElements.define('scary-cube', ScaryCube);
