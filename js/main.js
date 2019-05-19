let currentChapter = "";
let currentBranch = "";
let currentPart = "";

const base = function () {
  return storyMain.storyData[currentChapter][currentBranch][currentPart];
};

const storyMain = {
  position: {
    chapter: "start",
    branch: "start",
    part: "start",
    text: "",
    background: "",
    choice0: "",
    choice0desc: "",
    choice1: "",
    choice1desc: ""
  },
  name: "",
  choices: {},
  state: 0
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

$(function () {
  storyMain.grabStory();
  $('.option0').on('click', function () {
    $.extend(storyMain.position, readChanges("choice0"));
    injectChanges();
  });

  $('.option1').on('click', function () {
    $.extend(storyMain.position, readChanges("choice1"));
    injectChanges();
  });
});

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
  readArray["background"] = base()["background"];
  readArray["text"] = base()["text"];
  return readArray;
}

const initChanges = function () {
  $.extend(storyMain.position, readNewPosition());
}

const injectChanges = function (choice) {
  initChanges();
  $('.story-body-text').html(storyMain.position.text);
  $('.option0').text(storyMain.position.choice0);
  if (storyMain.position.choice1) {
    if ($('.option1').hasClass('hideOption')) {
      $('.option1').removeClass('hideOption');
    }
    $('.option1').text(storyMain.position.choice1);
  } else {
    if (!($('.option1').hasClass('hideOption'))) {
      $('.option1').addClass('hideOption');
    }
  }
  if (storyMain.position.background) {
    $('.story-body').style.background = `url: "./assets/${storyMain.position.background}"`;
  }
  $('.story-body').animate({ scrollTop: 0 }, "fast");
}
// {chap#}.{branch#}.{part#}.text, background, choice[0:choicetext,1:description,2:{actions}}
