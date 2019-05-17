const storyMain = {
  position: {
    chapter: "chap1",
    branch: "branch0",
    part: "part1",
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

const readChanges = function (choice) {
  currentChapter = storyMain.position.chapter;
  currentBranch = storyMain.position.branch;
  currentPart = storyMain.position.part;
  changes = storyMain.storyData[currentChapter][currentBranch][currentPart][choice][2];
  return changes;
}

$(function () {
  storyMain.grabStory();
  $('.option0').on('click', function () {
    console.log(readChanges("choice0"));
  });
  $('.option1').on('click', function () {
    console.log(readChanges("choice1"));
  });
});
// {chap#}.{branch#}.{part#}.{text[0-1], background, choice[0:choicetext,1:description,2:[0:action1,1:action2]}
