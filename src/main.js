const responseOptions = [
  { value: 'definitelyAgree', label: 'Definitely agree', traitSide: 'agree' },
  { value: 'slightlyAgree', label: 'Slightly agree', traitSide: 'agree' },
  { value: 'slightlyDisagree', label: 'Slightly disagree', traitSide: 'disagree' },
  { value: 'definitelyDisagree', label: 'Definitely disagree', traitSide: 'disagree' },
];

const agreeScoredItems = new Set([2, 4, 5, 6, 7, 9, 12, 13, 16, 18, 19, 20, 21, 22, 23, 26, 33, 35, 39, 41, 42, 43, 45, 46]);

const interpretationBands = [
  { min: 0, max: 10, label: 'Low range', guidance: 'Your responses indicate relatively few AQ-keyed autistic traits.' },
  { min: 11, max: 21, label: 'Average range', guidance: 'Your responses sit in the broad range often seen in general-population samples.' },
  { min: 22, max: 25, label: 'Above-average traits', guidance: 'Your responses indicate more autistic traits than average, but below commonly used referral thresholds.' },
  { min: 26, max: 31, label: 'Elevated traits', guidance: 'Your responses meet a threshold used by some services to suggest considering a fuller assessment if these traits affect daily life.' },
  { min: 32, max: 50, label: 'High range', guidance: 'Your responses meet the original AQ-50 screening cut-off often used to indicate that a professional autism assessment may be worth considering.' },
];

const questionText = [
  'I prefer to do things with others, rather than on my own.',
  'I prefer to do things the same way over and over again.',
  'If I try to imagine something, I find it very easy to create a picture in my mind.',
  'I frequently get so strongly absorbed in one thing that I lose sight of other things.',
  'I often notice small sounds when others do not.',
  'I usually notice car number plates or similar strings of information.',
  'Other people frequently tell me that what I’ve said is impolite, even though I think it is polite.',
  'When I’m reading a story, I can easily imagine what the characters might look like.',
  'I am fascinated by dates.',
  'In a social group, I can easily keep track of several different people’s conversations.',
  'I find social situations easy.',
  'I tend to notice details that others do not.',
  'I would rather go to a library than to a party.',
  'I find making up stories easy.',
  'I find myself drawn more strongly to people than to things.',
  'I tend to have very strong interests, which I get upset about if I can’t pursue.',
  'I enjoy social chitchat.',
  'When I talk, it isn’t always easy for others to get a word in edgewise.',
  'I am fascinated by numbers.',
  'When I’m reading a story, I find it difficult to work out the characters’ intentions.',
  'I don’t particularly enjoy reading fiction.',
  'I find it hard to make new friends.',
  'I notice patterns in things all the time.',
  'I would rather go to the theatre than to a museum.',
  'It does not upset me if my daily routine is disturbed.',
  'I frequently find that I don’t know how to keep a conversation going.',
  'I find it easy to “read between the lines” when someone is talking to me.',
  'I usually concentrate more on the whole picture, rather than on the small details.',
  'I am not very good at remembering phone numbers.',
  'I don’t usually notice small changes in a situation or a person’s appearance.',
  'I don’t know how to tell if someone listening to me is getting bored.',
  'I find it easy to do more than one thing at once.',
  'When I talk on the phone, I’m not sure when it’s my turn to speak.',
  'I enjoy doing things spontaneously.',
  'I am often the last to understand the point of a joke.',
  'I find it easy to work out what someone is thinking or feeling just by looking at their face.',
  'If there is an interruption, I can switch back to what I was doing very quickly.',
  'I am good at social chitchat.',
  'People often tell me that I keep going on and on about the same thing.',
  'When I was young, I used to enjoy playing games involving pretending with other children.',
  'I like to collect information about categories of things (e.g. types of cars, birds, trains, plants).',
  'I find it difficult to imagine what it would be like to be someone else.',
  'I like to carefully plan any activities I participate in.',
  'I enjoy social occasions.',
  'I find it difficult to work out people’s intentions.',
  'New situations make me anxious.',
  'I enjoy meeting new people.',
  'I am a good diplomat.',
  'I am not very good at remembering people’s date of birth.',
  'I find it very easy to play games with children that involve pretending.',
];

const questions = questionText.map((text, index) => ({
  id: index + 1,
  text,
  scoredSide: agreeScoredItems.has(index + 1) ? 'agree' : 'disagree',
}));

const answers = new Map();
const questionnaire = document.querySelector('#questionnaire');
const progressText = document.querySelector('#progressText');
const progressBar = document.querySelector('#progressBar');
const scoreText = document.querySelector('#scoreText');
const result = document.querySelector('#result');
const resultTitle = document.querySelector('#resultTitle');
const resultBody = document.querySelector('#resultBody');
const interpretationLabel = document.querySelector('#interpretationLabel');
const interpretationText = document.querySelector('#interpretationText');
const interpretationScale = document.querySelector('#interpretationScale');

function scoreAnswers() {
  return questions.reduce((total, question) => {
    const selectedValue = answers.get(question.id);
    const selectedOption = responseOptions.find((option) => option.value === selectedValue);
    return total + (selectedOption?.traitSide === question.scoredSide ? 1 : 0);
  }, 0);
}

function getInterpretation(score) {
  return interpretationBands.find((band) => score >= band.min && score <= band.max);
}

function updateSummary() {
  const answeredCount = answers.size;
  const score = scoreAnswers();
  const remaining = questions.length - answeredCount;

  progressText.textContent = `${answeredCount}/50`;
  progressBar.style.width = `${(answeredCount / questions.length) * 100}%`;
  scoreText.textContent = score;

  result.classList.toggle('show', remaining === 0);
  resultTitle.textContent = remaining === 0
    ? `Completed: AQ score ${score}/50`
    : 'Answer every statement to complete your score';
  const interpretation = getInterpretation(score);

  resultBody.textContent = remaining === 0
    ? 'AQ scoring awards one point per item when the selected agree/disagree direction matches the keyed autistic-trait response.'
    : `${remaining} item${remaining === 1 ? '' : 's'} remaining.`;
  interpretationLabel.textContent = remaining === 0 ? interpretation.label : 'Interpretation available after completion';
  interpretationText.textContent = remaining === 0
    ? `${interpretation.guidance} This is a screening interpretation only, not a diagnosis.`
    : 'Complete all 50 items to see a plain-language score band and suggested next step.';
  interpretationScale.value = score;
}


function renderQuestion(question) {
  const fieldset = document.createElement('fieldset');
  fieldset.className = 'question';

  const legend = document.createElement('legend');
  legend.innerHTML = `<span>${question.id}</span>${question.text}`;
  fieldset.append(legend);

  const answerGroup = document.createElement('div');
  answerGroup.className = 'answers';

  responseOptions.forEach((option) => {
    const label = document.createElement('label');
    label.htmlFor = `question-${question.id}-${option.value}`;

    const input = document.createElement('input');
    input.type = 'radio';
    input.id = label.htmlFor;
    input.name = `question-${question.id}`;
    input.value = option.value;
    input.addEventListener('change', () => {
      answers.set(question.id, option.value);
      answerGroup.querySelectorAll('label').forEach((item) => item.classList.remove('selected'));
      label.classList.add('selected');
      updateSummary();
    });

    label.append(input, document.createTextNode(option.label));
    answerGroup.append(label);
  });

  fieldset.append(answerGroup);
  return fieldset;
}

questions.forEach((question) => questionnaire.append(renderQuestion(question)));

document.querySelector('#resetButton').addEventListener('click', () => {
  answers.clear();
  questionnaire.reset();
  document.querySelectorAll('.answers label').forEach((label) => label.classList.remove('selected'));
  updateSummary();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

updateSummary();
