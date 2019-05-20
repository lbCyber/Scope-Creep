let currentChapter = "";
let currentBranch = "";
let currentPart = "";
let doubleTap = false;
let activeChoice = "";
let mobileState = 0;

const storyMain = {
  position: {
    chapter: "start",
    branch: "start",
    part: "start",
    text: "",
    image: "",
    choice0: "",
    choice0desc: "",
    choice1: "",
    choice1desc: ""
  },
  name: "",
  nameclean: "",
  firstname: "",
  choices: [],
  state: 0
}

$(function () {
  storyMain.grabStory();
  $('.option0').on('click', function () {
    mobileCheck('0')
    if (mobileState != 1) {
      if ((storyMain.position.choice0 == 'Login') && ($('.name-field').val() !== '')) {
        nameInput();
      } else if ($('.name-field').val() == '') {
        return;
      }
      chapterCheck('choice0');
      $.extend(storyMain.position, readChanges('choice0'));
      injectChanges();
      mobileState = 0;
      $('.show-description').removeClass('show-description')
    } else {
      $('.option1-desc').removeClass('show-description');
      $('.option0-desc').addClass('show-description');
    }
  });
  $('.option1').on('click', function () {
    mobileCheck('1')
    if (mobileState != 1) {
      chapterCheck('choice1');
      $.extend(storyMain.position, readChanges('choice1'));
      injectChanges();
      mobileState = 0;
      $('.show-description').removeClass('show-description')
    } else {
      $('.option0-desc').removeClass('show-description');
      $('.option1-desc').addClass('show-description');
    }
  });

  $('form').on('submit', function (event) {
    event.preventDefault();
    nameInput();
    chapterCheck('choice0');
    $.extend(storyMain.position, readChanges('choice0'));
    injectChanges();
  });
});

const chapterCheck = function (option) {
  if (readChanges(option)['chapter']) {
    let crumb = readChanges(option)['chapter'];
    if (crumb === 'chap1') {
      $('.story-title').text('Chapter 1');
      $('.crumb-1').removeClass('hide-option');
    } else if (crumb === 'chap2') {
      $('.crumb-1').removeClass('incomplete-bread-crumb');
      $('.crumb-2').removeClass('hide-option');
      $('.story-title').text('Chapter 2');
    } else if (crumb === 'chap3') {
      $('.crumb-2').removeClass('incomplete-bread-crumb');
      $('.crumb-3').removeClass('hide-option');
      $('.story-title').text('Chapter 3');
    } else if (crumb === 'chap4') {
      $('.crumb-3').removeClass('incomplete-bread-crumb');
      $('.crumb-4').removeClass('hide-option');
      $('.story-title').text('Chapter 4');
    } else if (crumb === 'chap5') {
      $('.crumb-4').removeClass('incomplete-bread-crumb');
      $('.crumb-5').removeClass('hide-option');
      $('.story-title').text('Chapter 5');
    }
  }
}

storyMain.grabStory = function () {
  $.ajax({
    url: './js/story.json',
    method: `GET`,
    dataType: `json`
  }).then(function (storyData) {
    storyMain["storyData"] = storyData;
  });
}

const mobileCheck = function (choice) {
  let clientWidth = window.innerWidth;
  if (clientWidth < 769) {
    if (!doubleTap) {
      doubleTap = true;
      activeChoice = choice;
      mobileState = 1;
    } else if (doubleTap && (activeChoice == choice)) {
      doubleTap = false;
      mobileState = 2;
      activeChoice = "";
    } else {
      doubleTap = false;
      activeChoice = "";
      mobileState = 1
    }
  } else {
    mobileState = 0;
    activeChoice = "";
  }
}

const nameInput = function () {
  let nameEntered = smartAssDetector($('.name-field').val());
  if (nameEntered !== '') {
    storyMain.name = capitalizeInput(nameEntered);
    storyMain.nameclean = nameEntered.replace(/[\[\]'.,\/#!$%\^&\*;:0-9{}=\-_`~()\s]/g, '').toLowerCase();
    storyMain.firstname = capitalizeInput(nameEntered.replace(/\s.*/, ''));
  }
}

const base = function () {
  return storyMain.storyData[currentChapter][currentBranch][currentPart];
};

const currentBase = function () {
  return storyMain.position;
};

const capitalizeInput = function (input) {
  capitalizer = function (c) {
    return c.toUpperCase();
  }
  return input.replace(/^\w/, capitalizer(input.charAt(0)));
}

const refreshPosition = function () {
  currentChapter = storyMain.position.chapter;
  currentBranch = storyMain.position.branch;
  currentPart = storyMain.position.part;
}

const readChanges = function (choice) {
  refreshPosition();
  changes = base()[choice][2];
  if (base()[choice][3] !== undefined) {
    storyMain["choices"].push(base()[choice][3])
  }
  return changes;
}

const readNewPosition = function () {
  refreshPosition();
  readArray = {};
  readArray["choice0"] = base().choice0[0];
  readArray["choice0desc"] = base().choice0[1];
  if (base().choice1 !== undefined) {
    readArray["choice1"] = base().choice1[0];
    readArray["choice1desc"] = base().choice1[1];
  } else {
    readArray["choice1"] = false;
    readArray["choice1desc"] = false;
  }
  readArray["image"] = base()["image"];
  readArray["text"] = base()["text"].replace(/%name%/g, storyMain.name).replace(/%nameclean%/g, storyMain.nameclean).replace(/%firstname%/g, storyMain.firstname);
  return readArray;
}

const initChanges = function () {
  $.extend(storyMain.position, readNewPosition());
}

const smartAssDetector = function (dumbname) {
  if ((dumbname == 'fuck') || (dumbname == 'ass') || (dumbname == 'shit') || (dumbname == 'dumb') || (dumbname == 'penis') || (dumbname == 'bepis') || (dumbname == 'douchebag') || (dumbname == 'butt')) {
    storyMain['choices'].push('smartass');
    return 'Jon Arbuckle';
  } else {
    return dumbname;
  }
}

const injectChanges = function (choice) {
  initChanges();
  $('.story-body').addClass('text-transition');
  setTimeout(function () {
    $('.story-body').animate({ scrollTop: 0 }, 10);
    $('.story-body-text').html(storyMain.position.text);
    $('.story-body').removeClass('text-transition')
    $('.option0').text(storyMain.position.choice0);
    $('.option0-desc').html(storyMain.position.choice0desc);
    if (storyMain.position.choice1) {
      if ($('.option1').hasClass('hide-option')) {
        $('.option1').removeClass('hide-option');
      }
      $('.option1').text(storyMain.position.choice1);
      $('.option1-desc').html(storyMain.position.choice1desc);
    } else {
      if (!($('.option1').hasClass('hide-option'))) {
        $('.option1').addClass('hide-option');
      }
    }
    if (storyMain.position.image) {
      $('.story-body').style.image = `url: "./assets/${storyMain.position.image}"`;
    }
  }, 750);
}
