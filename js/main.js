const storyMain = {
  position: {
    chapter: 1,
    branch: 0,
    part: 1,
    text: 0
  },
  name: "",
  choices: {},
  state: 0
}

storyMain.grabStory = function () {
  console.log('blep')
  $.ajax({
    url:'./js/story.json',
    method: `GET`,
    dataType: `json`
  }).then(function(storyData) {
    console.log(storyData);
    console.log('something happening')
  });
}

// {chap#}.{branch#}.{part#}.{text[0-1], background, choice[0:choicetext,1:description,2:[0:action1,1:action2]}
