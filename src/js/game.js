const Game = (function() {
  'use strict';

  const colors = [
    'AliceBlue',
    'AntiqueWhite',
    'Aqua',
    'Aquamarine',
    'Azure',
    'Beige',
    'Bisque',
    'Black',
    'BlanchedAlmond',
    'Blue',
    'BlueViolet',
    'Brown',
    'BurlyWood',
    'CadetBlue',
    'Chartreuse',
    'Chocolate',
    'Coral',
    'CornflowerBlue',
    'Cornsilk',
    'Crimson',
    'Cyan',
    'DarkBlue',
    'DarkCyan',
    'DarkGoldenRod',
    'DarkGrey',
    'DarkGreen',
    'DarkKhaki',
    'DarkMagenta',
    'DarkOliveGreen',
    'DarkOrange',
    'DarkOrchid',
    'DarkRed',
    'DarkSalmon',
    'DarkSeaGreen',
    'DarkSlateBlue',
    'DarkSlateGrey',
    'DarkTurquoise',
    'DarkViolet',
    'DeepPink',
    'DeepSkyBlue',
    'DimGrey',
    'DodgerBlue',
    'FireBrick',
    'FloralWhite',
    'ForestGreen',
    'Fuchsia',
    'Gainsboro',
    'GhostWhite',
    'Gold',
    'GoldenRod',
    'Grey',
    'Green',
    'GreenYellow',
    'HoneyDew',
    'HotPink',
    'IndianRed',
    'Indigo',
    'Ivory',
    'Khaki',
    'Lavender',
    'LavenderBlush',
    'LawnGreen',
    'LemonChiffon',
    'LightBlue',
    'LightCoral',
    'LightCyan',
    'LightGoldenRodYellow',
    'LightGrey',
    'LightGreen',
    'LightPink',
    'LightSalmon',
    'LightSeaGreen',
    'LightSkyBlue',
    'LightSlateGrey',
    'LightSteelBlue',
    'LightYellow',
    'Lime',
    'LimeGreen',
    'Linen',
    'Magenta',
    'Maroon',
    'MediumAquaMarine',
    'MediumBlue',
    'MediumOrchid',
    'MediumPurple',
    'MediumSeaGreen',
    'MediumSlateBlue',
    'MediumSpringGreen',
    'MediumTurquoise',
    'MediumVioletRed',
    'MidnightBlue',
    'MintCream',
    'MistyRose',
    'Moccasin',
    'NavajoWhite',
    'Navy',
    'OldLace',
    'Olive',
    'OliveDrab',
    'Orange',
    'OrangeRed',
    'Orchid',
    'PaleGoldenRod',
    'PaleGreen',
    'PaleTurquoise',
    'PaleVioletRed',
    'PapayaWhip',
    'PeachPuff',
    'Peru',
    'Pink',
    'Plum',
    'PowderBlue',
    'Purple',
    'RebeccaPurple',
    'Red',
    'RosyBrown',
    'RoyalBlue',
    'SaddleBrown',
    'Salmon',
    'SandyBrown',
    'SeaGreen',
    'SeaShell',
    'Sienna',
    'Silver',
    'SkyBlue',
    'SlateBlue',
    'SlateGrey',
    'Snow',
    'SpringGreen',
    'SteelBlue',
    'Tan',
    'Teal',
    'Thistle',
    'Tomato',
    'Turquoise',
    'Violet',
    'Wheat',
    'White',
    'WhiteSmoke',
    'Yellow',
    'YellowGreen'];


  const levels = {
    2: 3,
    4: 4,
    6: 6,
    10: 9,
    15: 12,
    20: 16,
    25: 20,
    30: 25,
    40: 30,
    50: 35,
    60: 40
  };
  let pool = [];
  let numberOfColors = 2;
  let currentColor = '';
  let lives = 5;
  let level = 1;
  let topLevel = 1;
  let levelTime = 15000;
  let score = 0;
  let topScore = 0;
  let startedAt = 0;
  let timerId = 0;

  function init() {
    pool = randomColors(numberOfColors);
    currentColor = pool[random(0, pool.length -1)];

    render(true);
  }

  const dom = {
    splash: document.getElementById('splash'),
    start: document.getElementById('start'),
    game: document.getElementById('game'),
    timer: document.getElementById('timer'),
    colors: document.getElementById('colors'),
    name: document.getElementById('name'),
    level: document.getElementById('level'),
    lives: document.getElementById('lives'),
    clicked: document.getElementById('clicked'),
    score: document.getElementById('score'),
    maxScore: document.getElementById('max-score'),
    maxLevel: document.getElementById('max-level')
  };

  function render(fillColors) {
    dom.lives.textContent = lives;
    dom.level.textContent = level;
    dom.name.textContent = currentColor;

    if (fillColors) {

      dom.colors.innerHTML = '';

      for (let i = 0; i < pool.length; i++) {
        const li = document.createElement('li');
        li.id = (pool[i]);
        li.style.background = (pool[i]);
        dom.colors.appendChild(li);
      }
    }
  }

  function resetGame() {

    pool = [];
    numberOfColors = 2;
    currentColor = '';
    lives = 5;
    level = 1;
    levelTime = 15000;
    score = 0;
    startedAt = 0;

    init();
  }

  dom.colors.addEventListener('click', checkAnswer);
  dom.start.addEventListener('click', startGame);

  function checkAnswer(event) {
    if (event.target.id === currentColor) {
      resetTimer();
      updateScore();
      delay(300)
      .then(() => startLevel(true));
    }
    else {
      event.target.classList.add('wrong');
      lostLife(false);
    }
  }

  function updateScore() {
    let savedTime = Math.round((levelTime - (new Date() - startedAt)) / 1000);
    savedTime = savedTime > 0 ? savedTime : 0;
    score += level * Math.floor(level / 10) + savedTime;
  }

  function lostLife(isTimedOut) {

    lives -= 1;

    if (lives === 0) {
      resetTimer();
      gameOver();
    }
    else {
      if (isTimedOut) {
        resetTimer();
        delay(20)
        .then(startLevel());
      }
      else {
        console.log('Carry on, you still have lives: ', lives)
        render();
      }
    }
  }

  function updateNumberOfColors() {
    numberOfColors = levels.hasOwnProperty(level) ? levels[level] : numberOfColors;
  }

  function startLevel(next) {

    if (next) { level += 1; }

    updateNumberOfColors();

    startedAt = new Date();

    pool = randomColors(numberOfColors);
    currentColor = pool[random(0, pool.length -1)];
    render(true);

    delay(20)
    .then(() => startTimer())
    .then(() => {
      resetTimer();
      lostLife(true);
      console.log('timeOut')
    })
    .catch(err => console.log('oops'));
  }

  function delay(time) {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, time);
    });
  }

  function startTimer() {
    dom.timer.classList.add('active');
    return new Promise((resolve, reject) => {
      timerId = setTimeout(resolve, levelTime);
    });
  }

  function resetTimer() {
    clearTimeout(timerId);
    dom.timer.classList.remove('active');
  }

  function startGame() {
    resetGame();
    dom.splash.classList.remove('active');
    dom.game.classList.add('active');
    startLevel();
  }

  function gameOver() {
    topScore = score > topScore ? score : topScore;
    topLevel = level > topLevel ? level : topLevel;
    dom.score.textContent = score;
    dom.maxScore.textContent = topScore;
    dom.maxLevel.textContent = topLevel;
    dom.game.classList.remove('active');
    dom.splash.classList.add('active');
  }

  function randomColors(size) {
    return shuffle(colors).slice(0, size);
  }

  function shuffle(array) {
    let i = array.length;
    let temp;
    let random;

    while (i !== 0) {
      random = Math.floor(Math.random() * i);
      i -= 1;

      temp = array[i];
      array[i] = array[random];
      array[random] = temp;
    }
    return array;
  }

  function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  return {
    init: init
  }
})();

Game.init();
