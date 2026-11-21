/*
 * 打砖块 · Brick Breaker — a Breakout / Arkanoid style mini-game for OpenChamber.
 *
 * A paddle at the bottom keeps the ball alive; destructible bricks above break in
 * one to three hits, steel bricks never break and only serve as bumpers. Power-ups
 * drop from bricks, levels are hand-built patterns that loop with tougher bricks.
 *
 * All artwork is drawn procedurally on a 2D canvas. No network, no bitmaps.
 */

import { connectHost } from "@openchamber/sdk";
import { applyHostReady } from "@openchamber/sdk/ui";

var host = connectHost();

var TAU = Math.PI * 2;
var STEP = 1 / 240;
var BEST_KEY = "brick-breaker:best";
var SOUND_KEY = "brick-breaker:sound";
var RUN_KEY = "brick-breaker:run";
var MAX_BALLS = 81;
var PARAMS = new URLSearchParams(window.location.search);
var PLAY = PARAMS.has("play") || PARAMS.has("auto");
var AUTO = PARAMS.has("auto") || PARAMS.has("autopilot");
var GOD = PARAMS.has("god");
var DBG = PARAMS.has("dbg");
var SIM = Math.max(1, Math.min(600, Number(PARAMS.get("sim")) || 1));
var STEPS = Math.max(0, Math.min(200000, Number(PARAMS.get("steps")) || 0));
var START_LEVEL = Math.max(1, Math.min(999, Number(PARAMS.get("level")) || 1));
var DROP_ALL = PARAMS.get("drop");

var C = {
  ink: "#0d0f12",
  panel: "#16191e",
  bone: "#d9dee4",
  dim: "rgba(217, 222, 228, 0.5)",
  line: "rgba(217, 222, 228, 0.16)",
  white: "#e6e3db",
  sand: "#d8a64e",
  rust: "#c96b5e",
  orange: "#dd8448",
  steel: "#6b6660",
  ball: "#f2f4f7",
  accent: "#b5ac9d",
  danger: "#a96a6a"
};

var POWERS = {
  split: { label: "SPLIT", short: "S", color: C.white, dur: 0 },
  life: { label: "LIFE", short: "L", color: C.rust, dur: 0 }
};

/* ------------------------------------------------------------------ levels */

var LEVELS = [
  {
    rows: [
      "......111......",
      ".....11111.....",
      "...C1111111C...",
      "...111111111...",
      "..11111111111..",
      ".1111111111111.",
      ".1111111111111.",
      "...............",
      "XX..XXX..XXX..X"
    ]
  },
  {
    rows: [
      ".1111111111111.",
      ".111111C111111.",
      "..11111111111..",
      "...111111111...",
      "...C1111111....",
      ".....11111.....",
      "......111......",
      "...............",
      "XXX...XXX...XXX"
    ]
  },
  {
    rows: [
      "1.1.1.1C1.1.1.1",
      ".1.1.1.1.1.1.1.",
      "1.1.1.1.1.1.1.1",
      ".1.1.1.1.1.1.1.",
      "1.1C1.1.1.1.1.1",
      ".1.1.1.1.1.C.1.",
      "1.1.1.1.1.1.1.1",
      "...............",
      "X..XXX..XXX..XX"
    ]
  },
  {
    rows: [
      ".....11111.....",
      "....1111111....",
      "...2211C1122...",
      "..2C1111111C2..",
      "...221111122...",
      "....1111111....",
      ".....11111.....",
      "...............",
      "3333...3...3333"
    ]
  },
  {
    rows: [
      "111111111111111",
      "111C1111111C111",
      "111111111111111",
      "111111111111111",
      "111111111111111",
      "111111111111111",
      "111111111111111",
      "...............",
      "XXXX..XXX..XXXX"
    ]
  },
  {
    rows: [
      "111111111111111",
      "111..11111..111",
      "222..11C11..222",
      "222..11111..222",
      "2C2..11111..2C2",
      "111..11111..111",
      "111..11111..111",
      "...............",
      "XXX..XXX...X.XX"
    ]
  },
  {
    rows: [
      ".11111...11111.",
      "..11111.11111..",
      "...111C1C111...",
      "....1111111....",
      ".....11111.....",
      "..1.1111111.1..",
      "...111111111...",
      "...............",
      "XX..XX..XX..XXX"
    ]
  },
  {
    rows: [
      "111111111111111",
      "111111111111111",
      "211133333331112",
      "2111111C1111112",
      "211C1111111E112",
      "111111111111111",
      "111111111111111",
      "...............",
      "XXXX..XXX..XXXX"
    ]
  },
  {
    rows: [
      ".1...1...1...1.",
      ".111111C111111.",
      ".1...1...1...1.",
      ".1111C11111111.",
      ".1...1...1...1.",
      ".1111111111111.",
      ".1...1...1...1.",
      "...............",
      "XX...XXX..XX..X"
    ]
  },
  {
    rows: [
      "111111111111111",
      "11111.....11111",
      "11111..C..11111",
      "11111.....11111",
      "22222..C..22222",
      "11111.....11111",
      "11111.....11111",
      "...............",
      "XXXXX.....XXXXX"
    ]
  },
  {
    rows: [
      "....1111111....",
      "...1111C1111...",
      "..22221112222..",
      ".222211C112222.",
      "..22221112222..",
      "...E1111111E...",
      "....1111111....",
      "...............",
      "XXX..XXX...XXXX"
    ]
  },
  {
    rows: [
      "111111111111111",
      "1C1111...1111C1",
      "11111..C..11111",
      "1111.......1111",
      "11222.....22211",
      "11111.....11111",
      "1.111.....111.1",
      "...............",
      "XX..XXX..XX..XX"
    ]
  },
  {
    rows: [
      "....1111111....",
      "..11111111111..",
      ".111111C111111.",
      ".1111111111111.",
      ".11C1111111C11.",
      ".1111111111111.",
      "..11111111111..",
      "...............",
      "XXXX...XX..XXXX"
    ]
  },
  {
    rows: [
      "1111..1111..111",
      "11..C111..1111.",
      "..1111..1111..1",
      "1111..1111C.111",
      "11..1111..1111.",
      "..1111.C1111..1",
      "1111..1111..111",
      "...............",
      "XX..XX...XX..XX"
    ]
  },
  {
    rows: [
      "111111111111111",
      "..111.1C1.111..",
      "..222.111.222..",
      "1111111C1111111",
      "..222.111.222..",
      "..111.1E1.111..",
      "..111.111.111..",
      "...............",
      "XXX..XXXX..XXXX"
    ]
  },
  {
    rows: [
      "....1111111....",
      "..11111111111..",
      ".211C.....E112.",
      ".211...C...112.",
      ".2111.....1112.",
      "..11111111111..",
      "....1111111....",
      "...............",
      "XXXXX..XX..XXXX"
    ]
  },
  {
    rows: [
      "111111111111111",
      "111.........111",
      "11C11.....11C11",
      "1111111.1111111",
      "1111111C1111111",
      "111111111111111",
      "111111111111111",
      "...............",
      "XX..XXX..XX..XX"
    ]
  },
  {
    rows: [
      "1111111C1111111",
      "111111111111111",
      "222....C....222",
      "222.........222",
      "222.111C111.222",
      "111.........111",
      "...............",
      "...............",
      "XXXX..XXX..XXXX"
    ]
  },
  {
    rows: [
      "...............",
      "..11.11.11.....",
      ".11..11C1...11.",
      ".1.111...11.11.",
      "...11C11.1..111",
      ".111..11..1E.1.",
      ".1..111.111.11.",
      "....1...1...1..",
      "333..33..33..33"
    ]
  },
  {
    rows: [
      "111111111111111",
      "1111111C1111111",
      "111111111111111",
      "11C222222222C11",
      "111222333222111",
      "1112E22222E2111",
      "111111111111111",
      "1111111E1111111",
      "...............",
      "XXXX..XXX..XXXX"
    ]
  },
  {
    cols: 27,
    rows: [
      ".1111111111111111111111.111",
      "11111.111111111111111111111",
      "1111111111.11C1111111111111",
      "112111111111111.11111111111",
      "11111111111111111211.111111",
      "11.1111111111111111111111.1",
      "11112C1.1111111111131C11111",
      "111111111111.11111121111111",
      "11111111111111111.111111111",
      "1111112111111111111111.1111",
      "1111.1111111111111111211111",
      "111111311.11111111111111111",
      "11111111211111.111111111111",
      "1111111111111111111.1112111",
      "1.1111111111111111111111.11",
      "111111.11121111111111111111",
      "11111111111.111111111111121",
      "1111111111111111.1111111131",
      "111111111111211111111.11111",
      "111.1111111111111111111111.",
      "11111111.111111111111111111",
      "1111111111111.2111111111111",
      "111111111111311111.11111111",
      ".2111111111111111111111.111",
      "11111.111111111121111111111",
      "1111111111.1111111111111111",
      "111211111111111.11111111111",
      "11111111111111111121.111111",
      "11.1111111111111111111111.1",
      "1111121.1111111111111111111",
      "111111111111.11111112111111",
      "11111111111111111.111111111",
      "11111111E111111111E111.1111",
      "1111.1111111111111111111111",
      "111111111.11111111111111111",
      "1111111111111E.111111111111",
      "1111E11111111111111.11E1111",
      "1.1111111111111111111111.11",
      "111111.11111111111111111111",
      "XXXX...XXXXX...XXXXX...XXXX"
    ]
  },
  {
    cols: 30,
    rows: [
      "111111111111111111111111111111",
      "111111111111111111111111111111",
      "1111.11111111.1C111111.1111111",
      "1121.11111111.11111111.1111111",
      "1111.11111111.11121111.1111111",
      "..............................",
      "1111.11111111.11111311.1111111",
      "1111.C1111111.11111211.1C11111",
      "1111.11111111.11111111.1111111",
      "1111.12111111.11111111.1111111",
      "1111.11111111.11111112.1111111",
      "1111.13111111.11111111.1111111",
      "1111.11121111.11111111.1111111",
      "1111.11111111.11111111.2111111",
      "1111.11111111.11111111.1111111",
      "..............................",
      "1111.11111111.11111111.1121111",
      "1111.11111111.11111111.1131111",
      "1111.11111112.11111111.1111111",
      "1111.11111111.11111111.1111211",
      "1111.11111111.11111111.1111111",
      "1111.11111111.21111111.1111111",
      "1111.11111113.11111111.1111112",
      "1211.11111111.11111111.1111111",
      "1111.11111111.11211111.1111111",
      "..............................",
      "1112.11111111.11111111.1111111",
      "1111.11111111.11112111.1111111",
      "1111.11111111.11111111.1111111",
      "1111.21111111.11111111.1111111",
      "1111.11111111.11111121.1111111",
      "111E.11111111.11111111.1111E11",
      "1111.11211111.11111111.1111111",
      "1111.11111111.11113111.1111111",
      "1111.11E11111.11111111E1111111",
      "..............................",
      "1111.11111111.11111111.1111111",
      "1111.11111111.E1111111.1111111",
      "1111.11111111.111E1111.1111111",
      "1111.11111111.11111111.1111111",
      "1111.11111111.11111111.1111111",
      "XXXXX...XXXXXX...XXXXXX...XXXX"
    ]
  }
];

/* ------------------------------------------------------------------ helpers */

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

function fmt(n) {
  return Math.round(n).toLocaleString("en-US");
}

function hexToRgb(hex) {
  var v = parseInt(hex.slice(1), 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
}

function rgba(hex, a) {
  var c = hexToRgb(hex);
  return "rgba(" + c[0] + ", " + c[1] + ", " + c[2] + ", " + a + ")";
}

function rng(seed) {
  var s = Math.floor(seed) % 2147483647;
  if (s <= 0) s += 2147483646;
  return function () {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

var $ = function (id) {
  return document.getElementById(id);
};

var stage = $("stage");
var canvas = $("play");
var ctx = canvas.getContext("2d", { alpha: false });
var scoreEl = $("score");
var bestEl = $("best");
var comboEl = $("combo");
var levelEl = $("level");
var livesEl = $("lives");
var powersEl = $("powers");
var gate = $("gate");
var gateBest = $("gate-best");
var gateSave = $("gate-save");
var startBtn = $("start");
var continueBtn = $("continue");
var levelsBtn = $("levels");
var pauseLevelsBtn = $("pause-levels");
var levelScreen = $("levelScreen");
var levelGrid = $("level-grid");
var levelBack = $("level-back");
var pauseScreen = $("pauseScreen");
var resumeBtn = $("resume");
var restartLevelBtn = $("restart-level");
var quitBtn = $("quit");
var overScreen = $("overScreen");
var overTitle = $("over-title");
var overKicker = $("over-kicker");
var overScore = $("over-score");
var overBest = $("over-best");
var overLevel = $("over-level");
var againBtn = $("again");
var soundBtn = $("sound");
var pauseBtn = $("pause");
var banner = $("banner");
var bannerTitle = $("banner-title");
var bannerSub = $("banner-sub");
var hint = $("hint");
var loading = $("loading");

/* -------------------------------------------------------------------- state */

var S = {
  mode: "menu",
  w: 420,
  h: 720,
  scale: 1,
  dpr: 1,
  unit: 1,
  L: 10,
  R: 410,
  cols: 15,
  mega: false,
  layout: null,
  ballR: 5.4,
  level: 1,
  score: 0,
  best: 0,
  lives: 3,
  bricks: [],
  grid: new Map(),
  remaining: 0,
  balls: [],
  drops: [],
  orbs: [],
  particles: [],
  pops: [],
  paddle: {
    x: 210,
    y: 660,
    w: 74,
    h: 11,
    baseW: 74,
    targetW: 74,
    targetX: 210,
    vx: 0
  },
  combo: 0,
  comboTimer: 0,
  respawn: 0,
  shake: 0,
  flash: 0,
  clock: 0,
  bannerTimer: 0,
  nextTimer: 0,
  serveStamp: 0,
  newBest: false,
  savedRun: null,
  lastSaveAt: 0,
  sound: true,
  keys: { left: false, right: false }
};

var hudCache = {
  score: "",
  best: "",
  level: "",
  lives: -1,
  combo: "",
  powers: "",
  mode: ""
};

/* -------------------------------------------------------------------- audio */

var Sound = {
  ac: null,
  master: null,
  noiseBuf: null,

  ensure: function () {
    if (!this.ac) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      this.ac = new AC();
      this.master = this.ac.createGain();
      this.master.gain.value = 0.5;
      this.master.connect(this.ac.destination);
    }
    if (this.ac.state === "suspended") {
      void this.ac.resume();
    }
    return this.ac;
  },

  ready: function () {
    if (!S.sound) return null;
    return this.ensure();
  },

  tone: function (freq, dur, type, gain, to, delay) {
    var ac = this.ready();
    if (!ac) return;
    dur = dur || 0.08;
    type = type || "square";
    gain = gain || 0.04;
    var t = ac.currentTime + (delay || 0);
    var o = ac.createOscillator();
    var g = ac.createGain();
    o.type = type;
    o.frequency.setValueAtTime(Math.max(20, freq), t);
    if (to) {
      o.frequency.exponentialRampToValueAtTime(Math.max(20, to), t + dur);
    }
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g);
    g.connect(this.master);
    o.start(t);
    o.stop(t + dur + 0.03);
  },

  noise: function (dur, gain, freq, delay) {
    var ac = this.ready();
    if (!ac) return;
    if (!this.noiseBuf) {
      var len = Math.floor(ac.sampleRate * 0.5);
      this.noiseBuf = ac.createBuffer(1, len, ac.sampleRate);
      var data = this.noiseBuf.getChannelData(0);
      for (var i = 0; i < len; i += 1) data[i] = Math.random() * 2 - 1;
    }
    var t = ac.currentTime + (delay || 0);
    var src = ac.createBufferSource();
    src.buffer = this.noiseBuf;
    var filter = ac.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = freq || 900;
    filter.Q.value = 1.1;
    var g = ac.createGain();
    g.gain.setValueAtTime(gain || 0.08, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(filter);
    filter.connect(g);
    g.connect(this.master);
    src.start(t);
    src.stop(t + dur);
  },

  paddle: function () {
    if (S.balls.length > 30) return;
    this.tone(210, 0.07, "square", 0.042, 330);
  },
  wall: function () {
    if (S.balls.length > 30) return;
    this.tone(350, 0.035, "triangle", 0.024, 260);
  },
  brick: function (row) {
    if (S.balls.length > 30) return;
    this.tone(410 + row * 26, 0.05, "square", 0.032, 530 + row * 28);
  },
  crack: function () {
    if (S.balls.length > 30) return;
    this.noise(0.14, 0.07, 1300);
    this.tone(540, 0.11, "triangle", 0.036, 240);
  },
  steel: function () {
    if (S.balls.length > 30) return;
    this.tone(1180, 0.09, "triangle", 0.026, 900);
    this.tone(1580, 0.07, "sine", 0.018, 1320, 0.01);
  },
  explode: function () {
    this.noise(0.38, 0.13, 520);
    this.tone(92, 0.4, "sine", 0.09, 38);
  },
  power: function () {
    var notes = [523, 659, 784, 1047];
    for (var i = 0; i < notes.length; i += 1) {
      this.tone(notes[i], 0.09, "triangle", 0.038, 0, i * 0.045);
    }
  },
  frenzy: function () {
    var notes = [330, 440, 554, 660, 880];
    for (var i = 0; i < notes.length; i += 1) {
      this.tone(notes[i], 0.12, "triangle", 0.032, 0, i * 0.055);
    }
    this.noise(0.28, 0.05, 1100);
  },
  lose: function () {
    this.tone(240, 0.5, "sawtooth", 0.065, 70);
    this.tone(120, 0.6, "sine", 0.055, 55, 0.05);
  },
  clear: function () {
    var notes = [392, 523, 659, 784, 1047];
    for (var i = 0; i < notes.length; i += 1) {
      this.tone(notes[i], 0.12, "triangle", 0.04, 0, i * 0.07);
    }
  },
  over: function () {
    this.tone(300, 0.9, "sawtooth", 0.07, 60);
    this.noise(0.8, 0.1, 320);
  },
  ui: function () {
    this.tone(520, 0.05, "triangle", 0.028, 660);
  }
};

/* ---------------------------------------------------------------- persistence */

function readLocal(key) {
  try {
    return window.localStorage.getItem(key);
  } catch (error) {
    return null;
  }
}

function writeLocal(key, value) {
  try {
    window.localStorage.setItem(key, String(value));
  } catch (error) {
    // Storage can be unavailable in a sandboxed frame.
  }
}

function saveBest() {
  writeLocal(BEST_KEY, S.best);
  try {
    void host.storage.set(BEST_KEY, S.best).catch(function () {});
  } catch (error) {
    // Standalone page without a host.
  }
}

function loadBest() {
  var raw = Number(readLocal(BEST_KEY));
  if (isFinite(raw) && raw > S.best) S.best = raw;
  gateBest.textContent = fmt(S.best);
  bestEl.textContent = fmt(S.best);
  try {
    void host.storage.get(BEST_KEY).then(function (stored) {
      var value = Number(stored);
      if (isFinite(value) && value > S.best) {
        S.best = value;
        gateBest.textContent = fmt(S.best);
        bestEl.textContent = fmt(S.best);
        updateHud();
      }
    }).catch(function () {});
  } catch (error) {
    // Standalone page without a host.
  }
}

function parseRun(raw) {
  if (!raw) return null;
  var value = raw;
  if (typeof value === "string") {
    try {
      value = JSON.parse(value);
    } catch (error) {
      return null;
    }
  }
  if (!value || typeof value !== "object") return null;

  var level = Math.floor(Number(value.level));
  var score = Number(value.score);
  var lives = Math.floor(Number(value.lives));
  if (!isFinite(level) || level < 1 || level > 9999) return null;
  if (!isFinite(score) || score < 0) return null;
  if (!isFinite(lives) || lives < 1 || lives > 5) return null;

  return {
    level: level,
    score: Math.round(score),
    lives: lives,
    savedAt: Number(value.savedAt) || 0
  };
}

function saveRun(levelOverride) {
  if (S.mode !== "playing" && S.mode !== "paused" && S.mode !== "cleared") return;
  var level = levelOverride ? Math.floor(levelOverride) : S.level;
  level = clamp(level, 1, 9999);
  var run = {
    level: level,
    score: S.score,
    lives: S.lives,
    savedAt: Date.now()
  };
  S.savedRun = run;
  S.lastSaveAt = S.clock;
  writeLocal(RUN_KEY, JSON.stringify(run));
  try {
    void host.storage.set(RUN_KEY, run).catch(function () {});
  } catch (error) {
    // Standalone page without a host.
  }
}

function clearRun() {
  S.savedRun = null;
  try {
    window.localStorage.removeItem(RUN_KEY);
  } catch (error) {
    // Storage can be unavailable.
  }
  try {
    void host.storage.delete(RUN_KEY).catch(function () {});
  } catch (error) {
    // Standalone page without a host.
  }
  updateGateRun();
}

function loadRun() {
  S.savedRun = parseRun(readLocal(RUN_KEY));
  updateGateRun();
  try {
    void host.storage.get(RUN_KEY).then(function (stored) {
      var remote = parseRun(stored);
      if (remote && (!S.savedRun || remote.savedAt >= S.savedRun.savedAt)) {
        S.savedRun = remote;
        updateGateRun();
      }
    }).catch(function () {});
  } catch (error) {
    // Standalone page without a host.
  }
}

function updateGateRun() {
  var run = S.savedRun;
  if (run) {
    continueBtn.hidden = false;
    continueBtn.textContent = "CONTINUE " + pad2(run.level);
    continueBtn.classList.add("primary");
    startBtn.classList.remove("primary");
    startBtn.textContent = "重新开始";
    gateSave.hidden = false;
    gateSave.textContent = "SAVED · LEVEL " + pad2(run.level) + " · " +
      fmt(run.score) + " PTS · " + run.lives + " LIVES";
  } else {
    continueBtn.hidden = true;
    continueBtn.classList.remove("primary");
    startBtn.classList.add("primary");
    startBtn.textContent = "开始游戏";
    gateSave.hidden = true;
  }
}

function resumeRun() {
  var run = S.savedRun;
  if (!run) return;
  S.score = run.score;
  S.lives = clamp(run.lives, 1, 5);
  S.level = run.level;
  S.newBest = false;
  enterLevel(run.level);
  Sound.ensure();
  Sound.ui();
}

function saveSound() {
  writeLocal(SOUND_KEY, S.sound ? "1" : "0");
  try {
    void host.storage.set(SOUND_KEY, S.sound).catch(function () {});
  } catch (error) {
    // Standalone page without a host.
  }
}

function loadSound() {
  var raw = readLocal(SOUND_KEY);
  if (raw === "0") S.sound = false;
  syncSoundButton();
  try {
    void host.storage.get(SOUND_KEY).then(function (stored) {
      if (stored === "0" || stored === 0 || stored === false) {
        S.sound = false;
        syncSoundButton();
      }
    }).catch(function () {});
  } catch (error) {
    // Standalone page without a host.
  }
}

/* ----------------------------------------------------------------- geometry */

function resize() {
  var rect = stage.getBoundingClientRect();
  var width = Math.max(240, rect.width || 360);
  var height = Math.max(320, rect.height || 640);
  S.dpr = Math.min(window.devicePixelRatio || 1, 2.5);

  var scale = width / 420;
  var h = height / scale;
  if (h > 820) {
    scale = height / 820;
    h = 820;
  } else if (h < 620) {
    scale = height / 620;
    h = 620;
  }
  S.scale = scale;
  S.w = width / scale;
  S.h = h;
  S.unit = S.w / 420;
  S.L = Math.max(8, S.w * 0.024);
  S.R = S.w - S.L;

  canvas.width = Math.round(width * S.dpr);
  canvas.height = Math.round(height * S.dpr);
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";

  var p = S.paddle;
  p.baseW = clamp(S.w * 0.188, 72, 145);
  p.h = clamp(S.w * 0.026, 9, 14);
  p.y = S.h - Math.max(44, S.h * 0.056);
  p.targetW = p.baseW;
  p.w = clamp(p.w || p.baseW, p.baseW, p.baseW * 1.55);
  p.x = clamp(p.x || S.w / 2, S.L + p.w / 2, S.R - p.w / 2);
  p.targetX = clamp(p.targetX || p.x, S.L + p.w / 2, S.R - p.w / 2);
  S.ballR = clamp(S.w * 0.0102, 3.6, 5.4);

  layoutBricks();
  for (var i = 0; i < S.balls.length; i += 1) {
    var b = S.balls[i];
    b.r = S.ballR;
    b.x = clamp(b.x, S.L + b.r, S.R - b.r);
    if (b.stuck) {
      b.x = clamp(p.x + (b.offset || 0), S.L + b.r, S.R - b.r);
      b.y = p.y - b.r - 2;
    } else {
      b.y = Math.min(b.y, S.h - 12);
    }
  }
  for (var d = 0; d < S.drops.length; d += 1) {
    S.drops[d].y = Math.min(S.drops[d].y, S.h - 12);
  }
}

function layoutBricks() {
  var margin = Math.max(9, S.w * 0.024);
  var gap = clamp(S.w * 0.0052, 1.8, 4);
  var bw = (S.w - margin * 2 - gap * (S.cols - 1)) / S.cols;
  var bh = clamp(bw * 0.52, 10, 20);

  var maxRow = 0;
  for (var r = 0; r < S.bricks.length; r += 1) {
    maxRow = Math.max(maxRow, S.bricks[r].r);
  }
  var wallTop = S.h * 0.46;
  var top = Math.max(84, wallTop - maxRow * (bh + gap));
  S.layout = { margin: margin, gap: gap, bw: bw, bh: bh, top: top };

  for (var i = 0; i < S.bricks.length; i += 1) {
    var k = S.bricks[i];
    k.w = bw;
    k.h = bh;
    k.x = margin + k.c * (bw + gap);
    k.y = top + k.r * (bh + gap);
  }
}

/* ------------------------------------------------------------------- bricks */

function brickColor(k) {
  if (k.type === "steel") return C.steel;
  if (k.type === "core") return C.bone;
  if (k.type === "explosive") return C.orange;
  if (k.maxHp >= 3) return C.rust;
  if (k.maxHp >= 2) return C.sand;
  return C.white;
}

function buildBricks() {
  S.bricks = [];
  S.grid = new Map();
  S.remaining = 0;

  var def = LEVELS[(S.level - 1) % LEVELS.length];
  S.cols = def.cols || 15;
  S.mega = S.cols > 20;
  var tier = Math.floor((S.level - 1) / LEVELS.length);

  for (var r = 0; r < def.rows.length; r += 1) {
    var row = def.rows[r].padEnd(S.cols, ".").slice(0, S.cols);
    for (var c = 0; c < S.cols; c += 1) {
      var ch = row[c];
      if (ch === "." || ch === " ") continue;

      var type = "normal";
      var hp = 1;
      if (ch === "X") {
        type = "steel";
        hp = Infinity;
      } else if (ch === "C") {
        type = "core";
        hp = 1;
      } else if (ch === "E") {
        type = "explosive";
        hp = 1;
      } else {
        hp = clamp(Number(ch) + tier, 1, 5);
      }

      var k = {
        c: c,
        r: r,
        type: type,
        hp: hp,
        maxHp: hp,
        alive: true,
        flash: 0,
        exploded: false,
        seed: Math.random() * 100000,
        x: 0,
        y: 0,
        w: 0,
        h: 0
      };
      k.color = brickColor(k);
      S.bricks.push(k);
      S.grid.set(c + ":" + r, k);
      if (type !== "steel") S.remaining += 1;
    }
  }
  layoutBricks();
}

/* ------------------------------------------------------------------ gameplay */

function baseSpeed() {
  return Math.min(530, 338 + (S.level - 1) * 11) * clamp(S.w / 420, 1, 1.25);
}

function comboMult() {
  return Math.min(5, 1 + Math.floor(S.combo / 4));
}

function serveBall() {
  var p = S.paddle;
  var spread = [-0.24, 0, 0.24];
  S.balls = [];
  for (var i = 0; i < 3; i += 1) {
    var offset = (i - 1) * S.ballR * 3.2;
    S.balls.push({
      x: clamp(p.x + offset, S.L + S.ballR, S.R - S.ballR),
      y: p.y - S.ballR - 2,
      r: S.ballR,
      dirx: Math.sin(spread[i]),
      diry: -Math.cos(spread[i]),
      speed: baseSpeed(),
      stuck: true,
      aim: spread[i],
      offset: offset,
      trail: [],
      dead: false
    });
  }
  S.serveStamp = S.clock;
  S.respawn = 0;
}

function launchBalls() {
  var launched = false;
  var p = S.paddle;
  for (var i = 0; i < S.balls.length; i += 1) {
    var b = S.balls[i];
    if (!b.stuck) continue;
    var off = (b.aim || 0) + rand(-0.04, 0.04) + clamp(p.vx * 0.00018, -0.2, 0.2);
    b.dirx = Math.sin(off);
    b.diry = -Math.cos(off);
    b.speed = baseSpeed();
    b.stuck = false;
    b.trail = [];
    launched = true;
  }
  if (launched) {
    Sound.paddle();
    S.flash = 0.18;
  }
}

function startRun(level) {
  var target = level ? clamp(Math.floor(level), 1, LEVELS.length) : (START_LEVEL > 1 ? START_LEVEL : 1);
  S.score = 0;
  S.level = target;
  S.lives = 3;
  S.combo = 0;
  S.comboTimer = 0;
  S.newBest = false;
  S.savedRun = null;
  try {
    window.localStorage.removeItem(RUN_KEY);
  } catch (error) {
    // Storage can be unavailable.
  }
  S.particles = [];
  S.pops = [];
  enterLevel(S.level);
}

function enterLevel(n) {
  S.level = Math.max(1, Math.floor(n));
  S.mode = "playing";
  S.combo = 0;
  S.comboTimer = 0;
  S.drops = [];
  S.orbs = [];
  S.particles = [];
  S.pops = [];
  S.respawn = 0;
  S.shake = 0;
  S.flash = 0;
  S.nextTimer = 0;

  buildBricks();

  var p = S.paddle;
  p.x = S.w / 2;
  p.targetX = p.x;
  p.targetW = p.baseW;
  p.w = p.baseW;
  p.vx = 0;

  serveBall();
  hideScreens();
  hint.classList.remove("dim");

  var tier = Math.floor((S.level - 1) / LEVELS.length);
  if (!S.mega) showBanner("LEVEL " + pad2(S.level), tier > 0 ? "HP +" + tier : "", 1.6);

  if (DROP_ALL) debugDrops();
  updateHud();
  saveRun();
}

function restartLevel() {
  if (S.mode === "menu") {
    startRun();
    return;
  }
  enterLevel(S.level);
}

function toMenu() {
  S.mode = "menu";
  S.score = 0;
  S.lives = 3;
  S.combo = 0;
  S.comboTimer = 0;
  S.drops = [];
  S.orbs = [];
  S.particles = [];
  S.pops = [];
  S.level = 1;

  buildBricks();

  var p = S.paddle;
  p.x = S.w / 2;
  p.targetX = p.x;
  p.w = p.baseW;
  p.targetW = p.baseW;
  p.vx = 0;
  serveBall();
  S.balls[0].speed = 0;

  show(gate);
  gateBest.textContent = fmt(S.best);
  hint.classList.add("dim");
  banner.hidden = true;
  updateHud();
  updateGateRun();
}

function pauseGame() {
  if (S.mode !== "playing") return;
  S.mode = "paused";
  saveRun();
  show(pauseScreen);
  hint.classList.add("dim");
  Sound.ui();
}

function resumeGame() {
  if (S.mode !== "paused") return;
  S.mode = "playing";
  hideScreens();
  hint.classList.remove("dim");
  Sound.ui();
}

function togglePause() {
  if (S.mode === "playing") pauseGame();
  else if (S.mode === "paused") resumeGame();
}

function quitToMenu() {
  saveRun();
  saveBest();
  show(gate);
  toMenu();
  Sound.ui();
}

function gameOver() {
  if (S.mode === "over") return;
  S.mode = "over";
  S.orbs = [];
  clearRun();
  saveBest();
  Sound.over();
  hint.classList.add("dim");

  overScore.textContent = fmt(S.score);
  overBest.innerHTML = "BEST <b>" + fmt(S.best) + "</b>";
  overBest.classList.toggle("record", S.newBest);
  overLevel.textContent = "LEVEL " + pad2(S.level);
  overTitle.textContent = S.newBest ? "NEW RECORD" : "GAME OVER";
  overKicker.textContent = "RESULT";
  show(overScreen);
  updateHud();
}

function loseLife() {
  if (GOD) {
    serveBall();
    return;
  }
  S.lives = Math.max(0, S.lives - 1);
  S.combo = 0;
  S.comboTimer = 0;
  S.shake = 18;
  S.flash = 0.5;
  Sound.lose();
  updateHud();

  if (S.lives <= 0) {
    gameOver();
    return;
  }
  saveRun();
  showBanner("MISS", S.lives + " LIVES LEFT", 1.1);
  S.respawn = 0.85;
}

function clearLevel() {
  if (S.mode !== "playing") return;
  S.mode = "cleared";
  var bonus = 400 + S.level * 125 + S.lives * 45;
  S.score += bonus;
  noteScore();
  saveBest();
  Sound.clear();
  S.shake = 12;
  S.flash = 0.35;
  S.balls = [];
  S.orbs = [];
  S.drops = [];
  showBanner("LEVEL CLEAR", "+" + fmt(bonus) + " · NEXT", 2.2);
  S.nextTimer = 2.1;
  updateHud();
  saveRun(S.level + 1);
}

function noteScore() {
  if (S.score > S.best) {
    S.best = S.score;
    S.newBest = true;
  }
}

/* ------------------------------------------------------------------ physics */

function updatePaddle(dt) {
  var p = S.paddle;

  if (AUTO && S.mode === "playing") {
    var target = null;
    for (var i = 0; i < S.balls.length; i += 1) {
      var b = S.balls[i];
      if (b.stuck) continue;
      if (!target || b.y > target.y) target = b;
    }
    if (target) p.targetX = target.x + (target.dirx >= 0 ? 1 : -1) * 12 * S.unit;
    for (var j = 0; j < S.balls.length; j += 1) {
      if (S.balls[j].stuck && S.clock - S.serveStamp > 0.55) {
        launchBalls();
        break;
      }
    }
  }

  if (S.keys.left) p.targetX -= 780 * S.unit * dt;
  if (S.keys.right) p.targetX += 780 * S.unit * dt;

  p.targetX = clamp(p.targetX, S.L + p.w / 2, S.R - p.w / 2);
  p.targetW = p.baseW;
  p.w += (p.targetW - p.w) * Math.min(1, dt * 10);

  var maxSpeed = 3400 * S.unit;
  var dx = clamp(p.targetX - p.x, -maxSpeed * dt, maxSpeed * dt);
  p.vx = dx / dt;
  p.x = clamp(p.x + dx, S.L + p.w / 2, S.R - p.w / 2);
  p.targetX = clamp(p.targetX, S.L + p.w / 2, S.R - p.w / 2);
}

function stepBall(b, dt) {
  b.x += b.dirx * b.speed * dt;
  b.y += b.diry * b.speed * dt;

  b.trail.push({ x: b.x, y: b.y });
  if (b.trail.length > 16) b.trail.shift();

  var r = b.r;

  if (b.x - r < S.L) {
    b.x = S.L + r;
    b.dirx = Math.abs(b.dirx);
    Sound.wall();
  } else if (b.x + r > S.R) {
    b.x = S.R - r;
    b.dirx = -Math.abs(b.dirx);
    Sound.wall();
  }
  if (b.y - r < 0) {
    b.y = r;
    b.diry = Math.abs(b.diry);
    Sound.wall();
  }

  var p = S.paddle;
  if (
    b.diry > 0 &&
    b.y + r >= p.y &&
    b.y - r <= p.y + p.h &&
    b.x >= p.x - p.w / 2 - r &&
    b.x <= p.x + p.w / 2 + r
  ) {
    var off = clamp((b.x - p.x) / (p.w / 2), -1, 1);
    var angle = clamp(
      -Math.PI / 2 + off * 1.02 + clamp(p.vx * 0.00018, -0.16, 0.16),
      -Math.PI * 0.86,
      -Math.PI * 0.14
    );
    b.dirx = Math.cos(angle);
    b.diry = Math.sin(angle);
    b.y = p.y - r - 0.5;
    b.speed = Math.min(b.speed * 1.008 + 1.1, baseSpeed() * 1.55);
    Sound.paddle();
    addSparks(b.x, p.y, C.accent, 4);
  }

  collideBricks(b, 1);

  if (b.y - r > S.h + 24) {
    b.dead = true;
    addRing(b.x, S.h - 12, C.danger, 4, 42);
  }

  if (Math.abs(b.diry) < 0.14) {
    b.diry = (b.diry < 0 ? -1 : 1) * 0.14;
    var len = Math.hypot(b.dirx, b.diry) || 1;
    b.dirx /= len;
    b.diry /= len;
  }
}

function collideBricks(b, amount) {
  if (!S.layout || !S.grid) return;
  var layout = S.layout;
  var cellW = layout.bw + layout.gap;
  var cellH = layout.bh + layout.gap;
  var col = Math.floor((b.x - layout.margin) / cellW);
  var row = Math.floor((b.y - layout.top) / cellH);
  var r = b.r;

  for (var dr = -1; dr <= 1; dr += 1) {
    for (var dc = -1; dc <= 1; dc += 1) {
      var c = col + dc;
      var rr = row + dr;
      if (c < 0 || c >= S.cols || rr < 0) continue;
      var k = S.grid.get(c + ":" + rr);
      if (!k || !k.alive) continue;
      if (
        b.x + r < k.x ||
        b.x - r > k.x + k.w ||
        b.y + r < k.y ||
        b.y - r > k.y + k.h
      ) continue;

      var cx = clamp(b.x, k.x, k.x + k.w);
      var cy = clamp(b.y, k.y, k.y + k.h);
      var dx = b.x - cx;
      var dy = b.y - cy;
      if (dx * dx + dy * dy > r * r) continue;

      var ox = k.w / 2 + r - Math.abs(b.x - (k.x + k.w / 2));
      var oy = k.h / 2 + r - Math.abs(b.y - (k.y + k.h / 2));

      if (ox < oy) {
        b.x += b.x < k.x + k.w / 2 ? -ox : ox;
        b.dirx *= -1;
      } else {
        b.y += b.y < k.y + k.h / 2 ? -oy : oy;
        b.diry *= -1;
      }
      damageBrick(k, amount || 1);
      return;
    }
  }
}

function damageBrick(k, amount) {
  if (!k.alive || S.mode !== "playing") return;
  k.flash = 1;

  if (k.type === "steel") {
    Sound.steel();
    addSparks(k.x + k.w / 2, k.y + k.h / 2, C.steel, 5);
    S.shake = Math.max(S.shake, 1.6);
    return;
  }

  k.hp -= amount;
  if (k.hp > 0) {
    S.score += 10 * comboMult();
    noteScore();
    addSparks(k.x + k.w / 2, k.y + k.h / 2, k.color, 3);
    Sound.brick(k.r);
    return;
  }
  destroyBrick(k);
}

function destroyBrick(k) {
  k.alive = false;
  k.hp = 0;
  S.remaining = Math.max(0, S.remaining - 1);

  S.combo += 1;
  S.comboTimer = 2.6;
  var mult = comboMult();
  var gain = Math.round((45 + 25 * k.maxHp) * mult);
  S.score += gain;
  noteScore();

  addShards(k);
  addPop(k.x + k.w / 2, k.y + k.h / 2, "+" + gain, mult > 1 ? C.sand : C.bone);
  Sound.crack();
  spawnDrop(k);

  if (k.type === "core") triggerFrenzy(k.x + k.w / 2, k.y + k.h / 2);
  if (k.type === "explosive" && !k.exploded) explode(k);
  if (S.remaining === 0) clearLevel();
}

function triggerFrenzy(x, y) {
  if (S.mode !== "playing") return;
  var room = 12 - S.orbs.length;
  if (room <= 0) return;
  var count = Math.min(6, room);
  var base = rand(0, TAU);
  var speed = Math.min(660, baseSpeed() * 1.4);

  for (var i = 0; i < count; i += 1) {
    var a = base + (i / count) * TAU;
    S.orbs.push({
      x: x,
      y: y,
      r: Math.max(3.4, S.ballR * 0.76),
      dirx: Math.cos(a),
      diry: Math.sin(a),
      speed: speed,
      life: 7,
      maxLife: 7
    });
  }

  addSparks(x, y, C.sand, 18);
  addPop(x, y - 12, "CORE", C.sand);
  S.shake = Math.max(S.shake, 5);
  S.flash = Math.max(S.flash, 0.16);
  Sound.frenzy();
  showBanner("CORE", "AUTO CLEAR 7s", 1.1);
  updateHud();
}

function stepOrb(o, dt) {
  o.life -= dt;
  o.x += o.dirx * o.speed * dt;
  o.y += o.diry * o.speed * dt;

  var r = o.r;
  if (o.x - r < S.L) {
    o.x = S.L + r;
    o.dirx = Math.abs(o.dirx);
  } else if (o.x + r > S.R) {
    o.x = S.R - r;
    o.dirx = -Math.abs(o.dirx);
  }
  if (o.y - r < 0) {
    o.y = r;
    o.diry = Math.abs(o.diry);
  } else if (o.y + r > S.h) {
    o.y = S.h - r;
    o.diry = -Math.abs(o.diry);
  }

  if (Math.abs(o.dirx) < 0.24) {
    o.dirx = (o.dirx < 0 ? -1 : 1) * 0.24;
    var len = Math.hypot(o.dirx, o.diry) || 1;
    o.dirx /= len;
    o.diry /= len;
  }

  collideBricks(o, 2);
}

function updateOrbs(dt) {
  for (var i = S.orbs.length - 1; i >= 0; i -= 1) {
    var o = S.orbs[i];
    if (!o) continue;
    stepOrb(o, dt);
    if (S.mode !== "playing") return;
    if (o.life <= 0) S.orbs.splice(i, 1);
  }
}

function explode(k) {
  k.exploded = true;
  var cx = k.x + k.w / 2;
  var cy = k.y + k.h / 2;
  addRing(cx, cy, C.orange, 6, 110 * S.unit);
  addSparks(cx, cy, C.sand, 12);
  S.shake = Math.max(S.shake, 10);
  Sound.explode();

  for (var dr = -1; dr <= 1; dr += 1) {
    for (var dc = -1; dc <= 1; dc += 1) {
      if (dr === 0 && dc === 0) continue;
      var n = S.grid.get((k.c + dc) + ":" + (k.r + dr));
      if (n && n.alive) damageBrick(n, 2);
    }
  }
}

/* ------------------------------------------------------------------- drops */

function spawnDrop(k) {
  if (k.type === "core") return;
  if (S.drops.length >= 6) return;
  var chance = k.type === "explosive" ? 0.4 : k.maxHp >= 3 ? 0.3 : k.maxHp >= 2 ? 0.22 : 0.15;
  if (Math.random() > chance) return;

  var kind = Math.random() < 0.85 ? "split" : "life";

  S.drops.push({
    kind: kind,
    x: k.x + k.w / 2,
    y: k.y + k.h / 2,
    vy: 175 + Math.random() * 55,
    w: 30 * S.unit,
    h: 16 * S.unit,
    phase: Math.random() * TAU,
    dead: false
  });
}

function debugDrops() {
  var kinds = ["split", "split", "life"];
  var p = S.paddle;
  for (var i = 0; i < kinds.length; i += 1) {
    S.drops.push({
      kind: kinds[i],
      x: S.w * (0.25 + i * 0.25),
      y: p.y - 150 - (i % 2) * 45,
      vy: 175,
      w: 30 * S.unit,
      h: 16 * S.unit,
      phase: i,
      dead: false
    });
  }
}

function applyPower(kind) {
  var def = POWERS[kind];
  if (!def) return;
  Sound.power();
  addPop(S.paddle.x, S.paddle.y - 26, def.label, def.color);

  if (kind === "life") {
    S.lives = Math.min(5, S.lives + 1);
    updateLives();
    return;
  }

  if (kind === "split") {
    var anyStuck = false;
    for (var i = 0; i < S.balls.length; i += 1) {
      if (S.balls[i].stuck) anyStuck = true;
    }
    if (anyStuck) launchBalls();
    if (S.balls.length === 0 || S.balls.length >= MAX_BALLS) return;

    var source = S.balls.slice();
    var total = Math.min(MAX_BALLS, source.length * 3);
    var next = [];
    var spread = [-0.36, 0, 0.36];
    for (var b = 0; b < source.length; b += 1) {
      var base = source[b];
      var angle = Math.atan2(base.diry, base.dirx);
      for (var n = 0; n < 3 && next.length < total; n += 1) {
        var a = angle + spread[n];
        next.push({
          x: base.x,
          y: base.y,
          r: S.ballR,
          dirx: Math.cos(a),
          diry: Math.sin(a),
          speed: base.speed,
          stuck: false,
          trail: [],
          dead: false
        });
      }
    }
    S.balls = next;
    addSparks(source[0].x, source[0].y, C.white, 12);
    return;
  }

}

function updateDrops(dt) {
  var p = S.paddle;
  for (var i = 0; i < S.drops.length; i += 1) {
    var d = S.drops[i];
    d.y += d.vy * dt;
    d.phase += dt * 2.2;

    if (d.y + d.h / 2 > S.h + 20) {
      d.dead = true;
      continue;
    }
    if (
      d.y + d.h / 2 >= p.y &&
      d.y - d.h / 2 <= p.y + p.h &&
      d.x + d.w / 2 >= p.x - p.w / 2 &&
      d.x - d.w / 2 <= p.x + p.w / 2
    ) {
      d.dead = true;
      applyPower(d.kind);
    }
  }
  S.drops = S.drops.filter(function (d) {
    return !d.dead;
  });
}

/* ---------------------------------------------------------------- particles */

function addShards(k) {
  if (S.particles.length > 480) return;
  var count = k.type === "explosive" ? 14 : 8;
  var cx = k.x + k.w / 2;
  var cy = k.y + k.h / 2;
  for (var i = 0; i < count; i += 1) {
    S.particles.push({
      type: "shard",
      x: cx + rand(-k.w / 2, k.w / 2),
      y: cy + rand(-k.h / 2, k.h / 2),
      vx: rand(-170, 170) * S.unit,
      vy: rand(-190, 90) * S.unit,
      g: 520 * S.unit,
      rot: rand(0, TAU),
      vr: rand(-7, 7),
      w: rand(2, 6) * S.unit,
      h: rand(1.5, 4.5) * S.unit,
      color: i % 4 === 0 ? C.bone : k.color,
      life: rand(0.45, 0.95),
      maxLife: 0.95
    });
  }
}

function addSparks(x, y, color, n) {
  if (S.particles.length > 480) return;
  for (var i = 0; i < n; i += 1) {
    var a = rand(0, TAU);
    var sp = rand(60, 230) * S.unit;
    S.particles.push({
      type: "spark",
      x: x,
      y: y,
      vx: Math.cos(a) * sp,
      vy: Math.sin(a) * sp,
      g: 90 * S.unit,
      color: color,
      life: rand(0.14, 0.34),
      maxLife: 0.34
    });
  }
}

function addRing(x, y, color, r0, r1) {
  if (S.particles.length > 480) return;
  S.particles.push({
    type: "ring",
    x: x,
    y: y,
    r: r0,
    vr: (r1 - r0) * 2.6,
    color: color,
    life: 0.42,
    maxLife: 0.42
  });
}

function addPop(x, y, text, color) {
  S.pops.push({
    x: x,
    y: y,
    text: text,
    color: color,
    life: 0.9,
    maxLife: 0.9
  });
  if (S.pops.length > 30) S.pops.shift();
}

function updateParticles(dt) {
  for (var i = 0; i < S.particles.length; i += 1) {
    var p = S.particles[i];
    p.life -= dt;
    if (p.type === "ring") {
      p.r += p.vr * dt;
    } else {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += p.g * dt;
      if (p.type === "shard") p.rot += p.vr * dt;
    }
  }
  S.particles = S.particles.filter(function (p) {
    return p.life > 0;
  });

  for (var j = 0; j < S.pops.length; j += 1) {
    S.pops[j].y -= 30 * dt * S.unit;
    S.pops[j].life -= dt;
  }
  S.pops = S.pops.filter(function (p) {
    return p.life > 0;
  });
}

/* -------------------------------------------------------------------- update */

function step(dt) {
  if (S.shake > 0) S.shake = Math.max(0, S.shake - dt * 54);
  if (S.flash > 0) S.flash = Math.max(0, S.flash - dt * 3);

  for (var i = 0; i < S.bricks.length; i += 1) {
    var k = S.bricks[i];
    if (k.flash > 0) k.flash = Math.max(0, k.flash - dt * 4.2);
  }

  if (S.comboTimer > 0) {
    S.comboTimer -= dt;
    if (S.comboTimer <= 0) S.combo = 0;
  }

  updatePaddle(dt);

  if (S.mode !== "playing") return;

  updateOrbs(dt);
  if (S.mode !== "playing") return;

  if (S.balls.length === 0) {
    if (S.respawn > 0) {
      S.respawn -= dt;
      if (S.respawn <= 0) serveBall();
    } else {
      loseLife();
    }
    return;
  }

  for (var b = 0; b < S.balls.length; b += 1) {
    var ball = S.balls[b];
    if (ball.stuck) {
      ball.x = clamp(S.paddle.x + (ball.offset || 0), S.L + ball.r, S.R - ball.r);
      ball.y = S.paddle.y - ball.r - 2;
    } else {
      stepBall(ball, dt);
    }
  }
  S.balls = S.balls.filter(function (ball) {
    return !ball.dead;
  });

  updateDrops(dt);

  if (S.balls.length === 0 && S.mode === "playing") {
    loseLife();
  }
}

function ambient(dt) {
  if (S.mode === "paused") return;
  if (S.shake > 0) S.shake = Math.max(0, S.shake - dt * 54);
  if (S.flash > 0) S.flash = Math.max(0, S.flash - dt * 3);
  updateParticles(dt);

  if (S.mode === "cleared") {
    S.nextTimer -= dt;
    if (S.nextTimer <= 0) enterLevel(S.level + 1);
  }
}

/* -------------------------------------------------------------------- render */

function resetTransform() {
  ctx.setTransform(S.dpr * S.scale, 0, 0, S.dpr * S.scale, 0, 0);
}

function draw() {
  resetTransform();
  drawBackground();

  var sx = 0;
  var sy = 0;
  if (S.shake > 0) {
    sx = rand(-S.shake, S.shake) * 0.55;
    sy = rand(-S.shake, S.shake) * 0.55;
  }
  ctx.save();
  ctx.translate(sx, sy);

  drawWalls();
  drawBricks();
  drawDrops();
  drawPaddle();
  drawBalls();
  drawOrbs();
  drawParticles();
  drawPops();
  drawServeHint();

  ctx.restore();
}

function drawBackground() {
  ctx.fillStyle = C.ink;
  ctx.fillRect(0, 0, S.w, S.h);

  var grid = 40 * S.unit;
  ctx.strokeStyle = "rgba(217, 222, 228, 0.035)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (var x = grid; x < S.w; x += grid) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, S.h);
  }
  for (var y = grid; y < S.h; y += grid) {
    ctx.moveTo(0, y);
    ctx.lineTo(S.w, y);
  }
  ctx.stroke();
}

function drawWalls() {
  ctx.fillStyle = "rgba(217, 222, 228, 0.21)";
  ctx.fillRect(S.L - 1, 0, 1, S.h);
  ctx.fillRect(S.R, 0, 1, S.h);

  ctx.save();
  ctx.strokeStyle = "rgba(169, 106, 106, 0.28)";
  ctx.lineWidth = 1;
  ctx.setLineDash([4 * S.unit, 7 * S.unit]);
  ctx.beginPath();
  ctx.moveTo(S.L, S.h - 9);
  ctx.lineTo(S.R, S.h - 9);
  ctx.stroke();
  ctx.restore();
}

function drawBricks() {
  for (var i = 0; i < S.bricks.length; i += 1) {
    var k = S.bricks[i];
    if (!k.alive) continue;
    drawBrick(k);
  }
}

function drawMegaBrick(k) {
  ctx.fillStyle = k.color;
  ctx.fillRect(k.x, k.y, k.w, k.h);
  if (k.type === "steel") {
    ctx.fillStyle = "rgba(13, 15, 18, 0.28)";
    ctx.fillRect(k.x, k.y + k.h * 0.46, k.w, 1);
  }
  if (k.type === "core") drawCoreMark(k);
  if (k.type === "explosive") drawExplosiveMark(k);
  if (k.flash > 0) {
    ctx.fillStyle = "rgba(242, 244, 247, " + (k.flash * 0.35) + ")";
    ctx.fillRect(k.x, k.y, k.w, k.h);
  }
}

function drawBrick(k) {
  if (S.mega) {
    drawMegaBrick(k);
    return;
  }
  var x = k.x;
  var y = k.y;
  var w = k.w;
  var h = k.h;
  var r = Math.min(2.4 * S.unit, h * 0.2);
  var steel = k.type === "steel";

  ctx.save();
  pathRound(x, y, w, h, r);
  ctx.fillStyle = k.color;
  ctx.fill();

  ctx.strokeStyle = steel ? "rgba(230, 222, 208, 0.4)" : "rgba(13, 15, 18, 0.62)";
  ctx.lineWidth = 1;
  pathRound(x + 0.5, y + 0.5, w - 1, h - 1, r);
  ctx.stroke();

  ctx.fillStyle = steel ? "rgba(217, 222, 228, 0.16)" : "rgba(255, 255, 255, 0.16)";
  ctx.fillRect(x + 2, y + 1.5, Math.max(0, w - 4), 1);

  if (steel) drawSteelDetail(k);
  else if (k.maxHp > k.hp) drawCracks(k);

  if (!steel && k.maxHp > 1) drawHpPips(k);
  if (k.type === "explosive") drawExplosiveMark(k);
  if (k.type === "core") drawCoreMark(k);

  if (k.flash > 0) {
    ctx.fillStyle = "rgba(242, 244, 247, " + (k.flash * 0.42) + ")";
    pathRound(x, y, w, h, r);
    ctx.fill();
  }
  ctx.restore();
}

function drawHpPips(k) {
  var total = Math.min(5, k.maxHp);
  var size = 1.7 * S.unit;
  var gap = 1.9 * S.unit;
  var startX = k.x + k.w / 2 - ((total - 1) * (size + gap)) / 2;
  var y = k.y + k.h - 3.4 * S.unit;
  for (var i = 0; i < total; i += 1) {
    ctx.beginPath();
    ctx.arc(startX + i * (size + gap), y, size / 2, 0, TAU);
    if (i < k.hp) {
      ctx.fillStyle = "rgba(5, 8, 16, 0.62)";
      ctx.fill();
    } else {
      ctx.fillStyle = "rgba(5, 8, 16, 0.2)";
      ctx.fill();
    }
  }
}

function drawCracks(k) {
  var damage = Math.min(4, k.maxHp - k.hp);
  var randf = rng(k.seed + damage * 131);
  ctx.save();
  ctx.strokeStyle = "rgba(5, 8, 16, 0.55)";
  ctx.lineWidth = 0.9 * S.unit;
  ctx.lineCap = "round";
  for (var d = 0; d < damage; d += 1) {
    var px = k.x + k.w * (0.2 + randf() * 0.6);
    var py = k.y + k.h * (0.16 + randf() * 0.3);
    ctx.beginPath();
    ctx.moveTo(px, py);
    for (var s = 0; s < 3; s += 1) {
      px += (randf() - 0.5) * k.w * 0.34;
      py += k.h * (0.16 + randf() * 0.2);
      ctx.lineTo(px, py);
    }
    ctx.stroke();
  }
  ctx.restore();
}

function drawSteelDetail(k) {
  ctx.save();
  pathRound(k.x, k.y, k.w, k.h, Math.min(2.4 * S.unit, k.h * 0.2));
  ctx.clip();
  ctx.strokeStyle = "rgba(5, 8, 16, 0.3)";
  ctx.lineWidth = 2.4 * S.unit;
  var step = Math.max(7 * S.unit, 8);
  for (var d = -k.h; d < k.w + k.h; d += step) {
    ctx.beginPath();
    ctx.moveTo(k.x + d, k.y + k.h);
    ctx.lineTo(k.x + d + k.h, k.y);
    ctx.stroke();
  }
  ctx.restore();

  var rivet = 1.5 * S.unit;
  var pad = 4 * S.unit;
  ctx.fillStyle = "rgba(222, 233, 250, 0.55)";
  var points = [
    [k.x + pad, k.y + pad],
    [k.x + k.w - pad, k.y + pad],
    [k.x + pad, k.y + k.h - pad],
    [k.x + k.w - pad, k.y + k.h - pad]
  ];
  for (var i = 0; i < points.length; i += 1) {
    ctx.beginPath();
    ctx.arc(points[i][0], points[i][1], rivet, 0, TAU);
    ctx.fill();
  }
}

function drawCoreMark(k) {
  var cx = k.x + k.w / 2;
  var cy = k.y + k.h / 2;
  var r1 = Math.max(2.6, Math.min(k.w, k.h) * 0.22);
  var r2 = r1 * 1.9;

  ctx.save();
  ctx.strokeStyle = "rgba(13, 15, 18, 0.66)";
  ctx.lineWidth = 1.2 * S.unit;
  ctx.beginPath();
  ctx.arc(cx, cy, r2, 0, TAU);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, cy, r1, 0, TAU);
  ctx.stroke();
  ctx.fillStyle = "rgba(13, 15, 18, 0.72)";
  ctx.beginPath();
  ctx.arc(cx, cy, r1 * 0.36, 0, TAU);
  ctx.fill();
  ctx.restore();
}

function drawExplosiveMark(k) {
  var cx = k.x + k.w / 2;
  var cy = k.y + k.h / 2 - (k.maxHp > 1 ? 1.2 * S.unit : 0);
  var s = Math.max(2.4, Math.min(3.6 * S.unit, k.h * 0.26));
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(Math.PI / 4);
  ctx.fillStyle = "rgba(13, 15, 18, 0.68)";
  ctx.fillRect(-s / 2, -s / 2, s, s);
  ctx.strokeStyle = "rgba(217, 222, 228, 0.5)";
  ctx.lineWidth = 1;
  ctx.strokeRect(-s / 2, -s / 2, s, s);
  ctx.restore();
}

function drawDrops() {
  for (var i = 0; i < S.drops.length; i += 1) {
    var d = S.drops[i];
    var def = POWERS[d.kind];
    if (!def) continue;
    var w = d.w;
    var h = d.h;
    ctx.save();
    ctx.translate(d.x, d.y);

    pathRound(-w / 2, -h / 2, w, h, h / 2);
    ctx.fillStyle = C.panel;
    ctx.fill();
    ctx.strokeStyle = def.color;
    ctx.lineWidth = 1;
    pathRound(-w / 2, -h / 2, w, h, h / 2);
    ctx.stroke();

    ctx.fillStyle = def.color;
    ctx.font = "700 " + Math.round(8.5 * S.unit) + "px \"ZCOOL QingKe HuangYou\", \"Microsoft YaHei\", sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(def.short, 0, 0.5);
    ctx.restore();
  }
}

function drawPaddle() {
  var p = S.paddle;
  var w = p.w;
  var h = p.h;
  var x = p.x - w / 2;
  var y = p.y;

  ctx.save();
  pathRound(x, y, w, h, h / 2);
  ctx.fillStyle = C.bone;
  ctx.fill();
  ctx.strokeStyle = "rgba(13, 15, 18, 0.7)";
  ctx.lineWidth = 1;
  pathRound(x + 0.5, y + 0.5, w - 1, h - 1, h / 2);
  ctx.stroke();

  ctx.fillStyle = C.accent;
  ctx.fillRect(p.x - 3 * S.unit, y + h * 0.32, 6 * S.unit, h * 0.36);
  ctx.restore();
}

function drawBalls() {
  var many = S.balls.length > 24;
  for (var i = 0; i < S.balls.length; i += 1) {
    var b = S.balls[i];

    if (!many) {
      for (var t = 0; t < b.trail.length; t += 1) {
        var point = b.trail[t];
        var a = (t + 1) / b.trail.length;
        ctx.globalAlpha = a * 0.15;
        ctx.fillStyle = "#ffe9c9";
        ctx.beginPath();
        ctx.arc(point.x, point.y, b.r * (0.22 + a * 0.55), 0, TAU);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      ctx.save();
      ctx.shadowColor = "rgba(255, 236, 199, 0.85)";
      ctx.shadowBlur = 10 * S.unit;
      var glow = ctx.createRadialGradient(
        b.x - b.r * 0.3,
        b.y - b.r * 0.3,
        b.r * 0.1,
        b.x,
        b.y,
        b.r * 1.9
      );
      glow.addColorStop(0, "#ffffff");
      glow.addColorStop(0.5, "#fff5e7");
      glow.addColorStop(1, "rgba(255, 236, 199, 0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r * 1.9, 0, TAU);
      ctx.fill();
      ctx.restore();
    } else {
      ctx.fillStyle = "rgba(255, 245, 231, 0.13)";
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r * 1.75, 0, TAU);
      ctx.fill();
    }

    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, TAU);
    ctx.fillStyle = C.ball;
    ctx.fill();
    ctx.strokeStyle = "rgba(13, 15, 18, 0.3)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

function drawOrbs() {
  for (var i = 0; i < S.orbs.length; i += 1) {
    var o = S.orbs[i];
    var fade = clamp(o.life / 0.9, 0, 1);
    ctx.globalAlpha = fade;
    ctx.strokeStyle = C.sand;
    ctx.lineWidth = 1.5 * S.unit;
    ctx.beginPath();
    ctx.arc(o.x, o.y, o.r, 0, TAU);
    ctx.stroke();
    ctx.fillStyle = C.sand;
    ctx.beginPath();
    ctx.arc(o.x, o.y, Math.max(1, o.r * 0.28), 0, TAU);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawParticles() {
  for (var i = 0; i < S.particles.length; i += 1) {
    var p = S.particles[i];
    var a = clamp(p.life / p.maxLife, 0, 1);
    ctx.globalAlpha = a;

    if (p.type === "ring") {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 1.8 * S.unit;
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0.5, p.r), 0, TAU);
      ctx.stroke();
    } else if (p.type === "spark") {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 1.4 * S.unit;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x - p.vx * 0.02, p.y - p.vy * 0.02);
      ctx.stroke();
    } else {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }
  }
  ctx.globalAlpha = 1;
}

function drawPops() {
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "700 " + Math.round(12 * S.unit) + "px \"Chakra Petch\", \"Microsoft YaHei\", sans-serif";
  for (var i = 0; i < S.pops.length; i += 1) {
    var p = S.pops[i];
    var a = clamp(p.life / p.maxLife, 0, 1);
    ctx.globalAlpha = a;
    ctx.fillStyle = p.color;
    ctx.fillText(p.text, p.x, p.y);
  }
  ctx.restore();
  ctx.globalAlpha = 1;
}

function drawServeHint() {
  if (S.mode !== "playing" || S.balls.length === 0) return;
  var stuck = [];
  for (var i = 0; i < S.balls.length; i += 1) {
    if (S.balls[i].stuck) stuck.push(S.balls[i]);
  }
  if (stuck.length === 0) return;
  var p = S.paddle;

  ctx.save();
  ctx.setLineDash([3 * S.unit, 4.5 * S.unit]);
  ctx.strokeStyle = "rgba(181, 172, 157, 0.55)";
  ctx.lineWidth = 1;
  for (var j = 0; j < stuck.length; j += 1) {
    var ball = stuck[j];
    var aim = ball.aim || 0;
    var dx = Math.sin(aim);
    var dy = -Math.cos(aim);
    var len = 52 * S.unit;
    ctx.beginPath();
    ctx.moveTo(ball.x + dx * (ball.r + 3), ball.y + dy * (ball.r + 3));
    ctx.lineTo(ball.x + dx * len, ball.y + dy * len);
    ctx.stroke();
  }
  ctx.setLineDash([]);

  ctx.fillStyle = rgba(C.bone, 0.5);
  ctx.font = "500 " + Math.round(9 * S.unit) + "px \"Chakra Petch\", \"Microsoft YaHei\", sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("点击 / 空格 发球", S.w / 2, p.y - 34 * S.unit);
  ctx.restore();
}

function pathRound(x, y, w, h, r) {
  var rr = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.lineTo(x + w - rr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
  ctx.lineTo(x + w, y + h - rr);
  ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
  ctx.lineTo(x + rr, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - rr);
  ctx.lineTo(x, y + rr);
  ctx.quadraticCurveTo(x, y, x + rr, y);
  ctx.closePath();
}

/* ----------------------------------------------------------------------- hud */

function updateLives() {
  var max = 5;
  var html = "";
  for (var i = 0; i < max; i += 1) {
    html += '<i class="' + (i < S.lives ? "" : "off") + '"></i>';
  }
  livesEl.innerHTML = html;
}

function updateHud() {
  var score = fmt(S.score);
  if (score !== hudCache.score) {
    scoreEl.textContent = score;
    hudCache.score = score;
  }
  var best = fmt(S.best);
  if (best !== hudCache.best) {
    bestEl.textContent = best;
    gateBest.textContent = best;
    hudCache.best = best;
  }
  var level = "LEVEL " + pad2(S.level);
  if (level !== hudCache.level) {
    levelEl.textContent = level;
    hudCache.level = level;
  }
  if (S.lives !== hudCache.lives) {
    updateLives();
    hudCache.lives = S.lives;
  }
  var mult = comboMult();
  var combo = S.combo >= 2 ? "COMBO " + S.combo + (mult > 1 ? " · ×" + mult : "") : "";
  if (combo !== hudCache.combo) {
    comboEl.hidden = !combo;
    comboEl.textContent = combo;
    hudCache.combo = combo;
  }

  var parts = "";
  if (S.balls.length > 3) {
    parts += '<span class="power"><b style="background:' + C.white + ';color:' + C.white + '"></b>BALLS ×' +
      S.balls.length + "</span>";
  }
  if (S.orbs.length > 0) {
    var orbLeft = 0;
    for (var o = 0; o < S.orbs.length; o += 1) {
      orbLeft = Math.max(orbLeft, S.orbs[o].life);
    }
    parts += '<span class="power"><b style="background:' + C.sand + ';color:' + C.sand + '"></b>CORE ×' +
      S.orbs.length + '<em>' + Math.ceil(orbLeft) + "s</em></span>";
  }
  if (parts !== hudCache.powers) {
    powersEl.innerHTML = parts;
    hudCache.powers = parts;
  }

  if (S.mode !== hudCache.mode) {
    hint.classList.toggle("dim", S.mode !== "playing");
    document.body.dataset.mode = S.mode;
    hudCache.mode = S.mode;
  }
}

/* -------------------------------------------------------------------- screens */

function show(el) {
  gate.hidden = el !== gate;
  pauseScreen.hidden = el !== pauseScreen;
  overScreen.hidden = el !== overScreen;
  levelScreen.hidden = el !== levelScreen;
}

function hideScreens() {
  gate.hidden = true;
  pauseScreen.hidden = true;
  overScreen.hidden = true;
  levelScreen.hidden = true;
}

var levelReturn = "menu";

function buildLevelSelect() {
  var html = "";
  for (var i = 0; i < LEVELS.length; i += 1) {
    var def = LEVELS[i];
    var cores = 0;
    for (var r = 0; r < def.rows.length; r += 1) {
      cores += (def.rows[r].match(/C/g) || []).length;
    }
    var current = S.savedRun && S.savedRun.level === i + 1;
    html += '<button type="button" class="level-card' + (current ? " current" : "") +
      '" data-level="' + (i + 1) + '">' +
      '<span class="num">' + pad2(i + 1) + "</span>" +
      '<span class="meta">' + cores + " CORE" + (current ? " · SAVE" : "") + "</span>" +
      "</button>";
  }
  levelGrid.innerHTML = html;
}

function openLevelSelect(from) {
  levelReturn = from || "menu";
  buildLevelSelect();
  show(levelScreen);
}

function closeLevelSelect() {
  if (levelReturn === "pause") show(pauseScreen);
  else show(gate);
}

function showBanner(title, sub, duration) {
  banner.style.top = S.cols > 20 ? "62%" : "27%";
  bannerTitle.textContent = title;
  bannerSub.textContent = sub || "";
  banner.hidden = true;
  void banner.offsetWidth;
  banner.hidden = false;
  S.bannerTimer = duration || 1.5;
}

function syncSoundButton() {
  soundBtn.classList.toggle("muted", !S.sound);
  soundBtn.setAttribute("aria-pressed", S.sound ? "true" : "false");
}

function toggleSound() {
  S.sound = !S.sound;
  syncSoundButton();
  saveSound();
  if (S.sound) {
    Sound.ensure();
    Sound.ui();
  }
}

/* ---------------------------------------------------------------------- input */

function toWorldX(event) {
  var rect = canvas.getBoundingClientRect();
  return ((event.clientX - rect.left) / Math.max(1, rect.width)) * S.w;
}

function bindEvents() {
  startBtn.addEventListener("click", function () {
    Sound.ensure();
    startRun();
    Sound.ui();
  });
  continueBtn.addEventListener("click", function () {
    resumeRun();
  });
  levelsBtn.addEventListener("click", function () {
    openLevelSelect("menu");
  });
  pauseLevelsBtn.addEventListener("click", function () {
    openLevelSelect("pause");
  });
  levelBack.addEventListener("click", closeLevelSelect);
  levelGrid.addEventListener("click", function (event) {
    var card = event.target.closest(".level-card");
    if (!card) return;
    var level = Number(card.getAttribute("data-level"));
    if (!level) return;
    Sound.ensure();
    startRun(level);
    Sound.ui();
  });
  againBtn.addEventListener("click", function () {
    Sound.ensure();
    startRun();
    Sound.ui();
  });
  resumeBtn.addEventListener("click", resumeGame);
  restartLevelBtn.addEventListener("click", function () {
    hideScreens();
    Sound.ui();
    restartLevel();
  });
  quitBtn.addEventListener("click", quitToMenu);
  pauseBtn.addEventListener("click", togglePause);
  soundBtn.addEventListener("click", toggleSound);

  canvas.addEventListener("pointermove", function (event) {
    if (S.mode !== "playing") return;
    S.paddle.targetX = clamp(toWorldX(event), S.L, S.R);
  });

  canvas.addEventListener("pointerdown", function (event) {
    Sound.ensure();
    if (event.button === 2) {
      togglePause();
      return;
    }
    if (S.mode !== "playing") return;
    S.paddle.targetX = clamp(toWorldX(event), S.L, S.R);
    launchBalls();
  });

  stage.addEventListener("contextmenu", function (event) {
    event.preventDefault();
  });

  window.addEventListener("keydown", function (event) {
    var key = event.key;
    if (!levelScreen.hidden) {
      if (key === "Escape" || key === "p" || key === "P") {
        event.preventDefault();
        closeLevelSelect();
      }
      return;
    }
    if (key === "ArrowLeft" || key === "a" || key === "A") {
      S.keys.left = true;
      event.preventDefault();
    } else if (key === "ArrowRight" || key === "d" || key === "D") {
      S.keys.right = true;
      event.preventDefault();
    } else if (key === " " || key === "Spacebar") {
      event.preventDefault();
      Sound.ensure();
      if (S.mode === "playing") launchBalls();
      else if (S.mode === "paused") resumeGame();
      else if (S.mode === "menu") {
        if (S.savedRun) resumeRun();
        else startRun();
      } else if (S.mode === "over") startRun();
    } else if (key === "p" || key === "P" || key === "Escape") {
      event.preventDefault();
      togglePause();
    } else if (key === "r" || key === "R") {
      event.preventDefault();
      if (S.mode === "over" || S.mode === "menu") startRun();
      else {
        hideScreens();
        restartLevel();
      }
    } else if (key === "m" || key === "M") {
      toggleSound();
    } else if (key === "Enter") {
      if (S.mode === "menu") {
        if (S.savedRun) resumeRun();
        else startRun();
      } else if (S.mode === "over") {
        startRun();
      }
    }
  });

  window.addEventListener("keyup", function (event) {
    var key = event.key;
    if (key === "ArrowLeft" || key === "a" || key === "A") S.keys.left = false;
    if (key === "ArrowRight" || key === "d" || key === "D") S.keys.right = false;
  });

  window.addEventListener("blur", function () {
    S.keys.left = false;
    S.keys.right = false;
  });

  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) return;
    if (S.mode === "playing") pauseGame();
    else saveRun();
  });

  window.addEventListener("resize", resize);
  if (window.ResizeObserver) {
    var ro = new ResizeObserver(function () {
      resize();
    });
    ro.observe(stage);
  }

  window.addEventListener("beforeunload", function () {
    saveRun();
    saveBest();
  });
  window.addEventListener("pagehide", function () {
    saveRun();
    saveBest();
  });
}

/* ----------------------------------------------------------------------- boot */

var lastTime = 0;
var accumulated = 0;

function frame(now) {
  var raw = lastTime ? clamp((now - lastTime) / 1000, 0, 0.05) : 0.016;
  lastTime = now;
  S.clock += raw;

  if (S.mode === "playing") {
    if (SIM > 1) {
      for (var i = 0; i < SIM; i += 1) step(STEP);
      updateParticles(raw);
    } else {
      accumulated += raw;
      var count = 0;
      while (accumulated >= STEP && count < 16) {
        step(STEP);
        accumulated -= STEP;
        count += 1;
      }
      if (count === 16) accumulated = 0;
      updateParticles(raw);
    }
  } else {
    ambient(raw);
  }

  if (S.bannerTimer > 0) {
    S.bannerTimer -= raw;
    if (S.bannerTimer <= 0) banner.hidden = true;
  }

  if (S.mode === "playing" && S.clock - S.lastSaveAt > 4) saveRun();

  updateHud();
  draw();
  requestAnimationFrame(frame);
}

var booted = false;

function boot(context) {
  if (booted) return;
  booted = true;

  if (context) applyHostReady(context, document.documentElement);

  resize();
  bindEvents();
  loadSound();
  toMenu();
  loadBest();
  loadRun();
  loading.classList.add("done");
  requestAnimationFrame(frame);

  if (PLAY || STEPS > 0) {
    window.setTimeout(function () {
      if (S.mode === "menu") startRun();
      else if (S.mode === "playing") launchBalls();
      launchBalls();
      for (var i = 0; i < STEPS; i += 1) step(STEP);
      updateHud();
      draw();
    }, 240);
  }

  if (DBG) {
    window.__brick = {
      S: S,
      step: step,
      draw: draw,
      startRun: startRun,
      enterLevel: enterLevel,
      launchBalls: launchBalls,
      damageBrick: damageBrick,
      applyPower: applyPower,
      updateHud: updateHud,
      saveRun: saveRun,
      clearRun: clearRun,
      resumeRun: resumeRun,
      quitToMenu: quitToMenu
    };
    window.setInterval(function () {
      document.title = "brick-breaker · " + S.mode + " · L" + S.level + " · " + Math.round(S.fps || 0);
    }, 1000);
  }
}

var fpsFrames = 0;
var fpsAt = 0;
(function trackFps() {
  var now = performance.now();
  fpsFrames += 1;
  if (!fpsAt) fpsAt = now;
  if (now - fpsAt >= 1000) {
    S.fps = (fpsFrames * 1000) / (now - fpsAt);
    fpsFrames = 0;
    fpsAt = now;
  }
  requestAnimationFrame(trackFps);
})();

try {
  host.onReady(function (context) {
    applyHostReady(context, document.documentElement);
    void boot(context);
  });
} catch (error) {
  // The page is running outside OpenChamber.
}

window.setTimeout(function () {
  void boot(null);
}, 220);
