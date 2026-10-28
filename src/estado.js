/* Estado compartido del juego: lo que cambia mientras se juega. */
export const S = {
  P: null,
  L: null,
  li: 0,
  prog: [],
  sel: null,
  engine: null,
  sprites: [],
  stars: [],
  won: false,
  freeCount: 0,
  curSp: 0,
  winTimer: 0,
  VARS: {},
  BACKDROP: null,
  particles: [],
  exploreIdx: 0,
  dragging: false,
  quiz: [],
  R: {},
  insideCount: 0,
  done: new Set(),
  muted: false,
  lastMsg: '',
  showRef: true
};

export const createdVars = {};

export const programs = {};
