let questionPage = document.querySelector('.question-page');
let startButton = document.querySelector('.start-button');
let modalDialog = document.querySelector('.modal-dialog-background');
let dialogTitle = document.querySelector('#modal-dialog-title');
let dialogMessage = document.querySelector('#modal-dialog-message');
let restartButton = document.querySelector('.restart-button');
let closeDialog = document.querySelector('.close-dialog-button');
let statsPage = document.querySelector('.stats-page');
let submitButton = document.createElement('button');
submitButton.classList.add('submit-button');
submitButton.setAttribute('type', 'submit');
submitButton.textContent = 'Done';

const stats = {
  gamesPlayed: 0,
  correctAnswers: 0,
  incorrectAnswers: 0,
  getPercentage: function() {
    let percentage = (this.correctAnswers / this.getTotalAnswers()) * 100;
    return percentage || 0;
  },
  getTotalAnswers: function() {
    return this.correctAnswers + this.incorrectAnswers;
  }
};

startButton.addEventListener('click', function(event) {
  startButton.remove();
  getData();
});

function getData() {
  fetch('https://opentdb.com/api.php?amount=10')
    .then(response => response.json())
    .then(jsonResponse => jsonResponse.results)
    .then(data => {
      renderQuestions(data);
    });
}

function renderQuestions(data) {
showPage('#questions');
let questionCount = 0;
  for (let question of data) {
    questionCount++;
    let h3 = document.createElement('h3');
    h3.innerHTML = 'Q' + questionCount + '. ' + question.question;
    h3.setAttribute('tabindex', 0);
    submitForm.appendChild(h3);
    showOptions(question);
  }
  let submitContainer = document.createElement('div');
  submitContainer.classList.add('submit-button-container');

  submitContainer.appendChild(submitButton);
  submitForm.appendChild(submitContainer);
}

function showOptions(question) {
  let optionCount = 0;
  let optionsList = document.createElement('ul');

  let rightAnswer = question.correct_answer;
  let answers = question.incorrect_answers.slice();
  answers.push(rightAnswer);
  answers = shuffleArray(answers);

  for (let index in answers) {
    optionCount++;
    let li = document.createElement('li');
    let optionLabel = document.createElement('label');
    optionLabel.innerHTML = answers[index];
    optionLabel.setAttribute('for', question.question + optionCount);

    let option = document.createElement('input');
    option.setAttribute('id', question.question + optionCount);
    option.setAttribute('value', answers[index]);
    option.setAttribute('type', 'radio');
    option.setAttribute('name', question.question);
    option.setAttribute('data-is-correct', answers[index] === question.correct_answer);
    option.required = true;

    li.prepend(optionLabel);
    li.prepend(option);
    optionsList.appendChild(li);
    submitForm.appendChild(optionsList);
  }
}

let correctAnswers = 0;
let submitForm = document.querySelector('.submit-form');
submitForm.addEventListener('submit', function(event) {
  event.preventDefault();
  stats.gamesPlayed++;

  let radioButtons = document.querySelectorAll('input[type="radio"]:checked');
  for (let radioButton of radioButtons) {
    if (radioButton.getAttribute('data-is-correct') == 'false') {
      stats.incorrectAnswers++;
    }
    else {
      correctAnswers++;
      stats.correctAnswers++;
    }
  }

  modalDialog.style.display = 'block';
  dialogMessage.textContent = correctAnswers ? 'Congratulations!' : 'Try again!';
  dialogMessage.setAttribute('tabindex', 0);
  dialogMessage.setAttribute('aria-label', correctAnswers ? 'Congratulations!' : 'Try again!');
  dialogTitle.textContent = 'You answered ' + correctAnswers + '/10 questions correct!';
  dialogTitle.setAttribute('tabindex', 0);
  dialogTitle.setAttribute('aria-label', 'You answered ' + correctAnswers + 'out of 10 questions correct!')
});

restartButton.addEventListener('click', function(event) {
  correctAnswers = 0;
  modalDialog.style.display = 'none';
});

closeDialog.addEventListener('click', function(event) {
  correctAnswers = 0;
  submitForm.innerHTML = '';
  modalDialog.style.display = 'none';
  let startButtonContainer = document.querySelector('.start-button-container');
  startButtonContainer.appendChild(startButton);
});


let navbar = document.querySelector('.navbar');
let firstToggler = document.querySelector('.top-bar__left__icon');
firstToggler.addEventListener('click', function(event) {
  expandNavbar();
});


let secondToggler = document.querySelector('.navbar__left__icon');
secondToggler.addEventListener('click', function(event) {
  submitForm.style.backgroundColor = 'transparent';
  closeNavbar();
});

let pageTitle = document.querySelector('.top-bar__left__title');
let aTags = document.querySelectorAll('.navbar-list > li > a');
for (let aLink of aTags) {
  aLink.addEventListener('click', function(event) {
    const linkHash = event.target.getAttribute('href');
    pageTitle.textContent = event.target.textContent;
    hideAllPages();
    showPage(linkHash);
    renderStats();
    closeNavbar();
  });
}

function expandNavbar() {
  navbar.classList.add('expanded');
  navbar.setAttribute('aria-hidden', false);
}

function closeNavbar() {
  navbar.classList.remove('expanded');
  navbar.setAttribute('aria-hidden', true);
}

function renderStats() {
  let pTagGames = document.getElementById('games-played');
  pTagGames.textContent = stats.gamesPlayed;
  pTagGames.setAttribute('aria-label', 'Games played is ' + stats.gamesPlayed);
  let pTagCorrect = document.getElementById('correct-answers');
  pTagCorrect.textContent = stats.correctAnswers;
  pTagCorrect.setAttribute('aria-label', 'Number of correct answers is ' + stats.correctAnswers);
  let pTagIncorrect = document.getElementById('incorrect-answers');
  pTagIncorrect.textContent = stats.incorrectAnswers;
  pTagIncorrect.setAttribute('aria-label', 'Number of incorrect answers is ' + stats.incorrectAnswers);
  let pTagPercentage = document.getElementById('correct-percentage');
  pTagPercentage.textContent = stats.getPercentage() + '%';
  pTagPercentage.setAttribute('aria-label', 'Percentage of correct answers is ' + stats.getPercentage());
}

function shuffleArray(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}

function hideAllPages() {
  let dataHashLinks = document.querySelectorAll('section[data-link-hash*="#"]');
  for (let dataLink of dataHashLinks) {
    dataLink.classList.add('hidden');
    dataLink.setAttribute('aria-hidden', true);
  }
}

function showPage(hash) {
  let dataHashLink = document.querySelector(`section[data-link-hash*="${hash}"]`);
  dataHashLink.classList.remove('hidden');
  dataHashLink.setAttribute('aria-hidden', false);
}
