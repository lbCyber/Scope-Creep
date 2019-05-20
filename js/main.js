let currentChapter = "";
let currentBranch = "";
let currentPart = "";

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
  choices: {},
  state: 0
}

$(function () {
  storyMain.grabStory();

  $('.option0').on('click', function (event) {
    if ((storyMain.position.choice0 == 'Login') && ($('.name-field').val() !== '')) {
      nameInput();
    } else if ($('.name-field').val() == '') {
      return;
    }
    chapterCheck('choice0');
    $.extend(storyMain.position, readChanges('choice0'));
    injectChanges();
  });

  $('.option1').on('click', function () {
    chapterCheck('choice1');
    $.extend(storyMain.position, readChanges('choice1'));
    injectChanges();
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

const nameInput = function (event) {
  let nameEntered = $('.name-field').val();
  if (nameEntered !== '') {
    storyMain.name = nameEntered;
  }
}

const base = function () {
  return storyMain.storyData[currentChapter][currentBranch][currentPart];
};

const currentBase = function () {
  return storyMain.position;
};

const refreshPosition = function () {
  currentChapter = storyMain.position.chapter;
  currentBranch = storyMain.position.branch;
  currentPart = storyMain.position.part;
}

const readChanges = function (choice) {
  refreshPosition();
  changes = base()[choice][2];
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
  readArray["text"] = base()["text"].replace(/%name%/g, storyMain.name);
  return readArray;
}

const initChanges = function () {
  $.extend(storyMain.position, readNewPosition());
}

const injectChanges = function (choice) {
  initChanges();
  $('.story-body-text').addClass('text-transition');
  $('.story-body').animate({ scrollTop: 0 }, 100);
  setTimeout(function () {
    $('.story-body-text').html(storyMain.position.text);
    $('.story-body-text').removeClass('text-transition')
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
