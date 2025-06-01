const templateSelect = document.getElementById('template');
const form = document.getElementById('prompt-form');
const output = document.getElementById('output');
const generateBtn = document.getElementById('generate-btn');
const copyBtn = document.getElementById('copy-btn');
const addDialogBtn = document.getElementById('add-dialog-btn');
const dialogContainer = document.getElementById('dialog-container');

let dialogCount = 0;

// Define all templates
const templates = {
  default: {
    prompt: `The scene takes place in {timeOfDay} at {location}, depicting a {sceneType}. The camera uses {cameraTechnique}, with a {visualAesthetic} look.\nThe main character is {characterDescription}, engaged in {mainActivity}.\nThe environment features {environmentDetails}.\nThe color palette includes {colorPalette}, and the atmosphere feels {emotionalTone}.\nAudio includes {audioElements}.`,
    fields: [
      'timeOfDay', 'location', 'sceneType', 'cameraTechnique',
      'visualAesthetic', 'characterDescription', 'mainActivity',
      'environmentDetails', 'colorPalette', 'emotionalTone', 'audioElements'
    ],
    placeholders: {
      timeOfDay: 'Morning, Midnight',
      location: 'Abandoned warehouse, Futuristic city',
      sceneType: 'Action chase, Romantic dinner',
      cameraTechnique: 'Slow zoom, Drone tracking',
      visualAesthetic: 'Gritty realism, Dreamlike softness',
      characterDescription: 'A lone traveler in a trench coat',
      mainActivity: 'Chasing a drone, Cooking dinner',
      environmentDetails: 'Rain falling, Neon reflections',
      colorPalette: 'Warm golden hues, Cyberpunk neon',
      emotionalTone: 'Intense and thrilling, Calm and meditative',
      audioElements: 'Gunfire echoes, Gentle classical piano'
    }
  },
  sciFi: {
    prompt: `At night in {futuristicCityName}, towering skyscrapers surround streets filled with {visualElements}. The camera uses {cameraView} to show the city’s rhythm.\nThe protagonist is {characterDescription}, navigating through {cityscapeSetting}. The color scheme is {colorScheme}, with a mood that’s {emotionalTone}.\nBackground music includes {musicStyle}, layered with {backgroundSoundEffects}.`,
    fields: [
      'futuristicCityName', 'visualElements', 'cameraView',
      'characterDescription', 'cityscapeSetting', 'colorScheme',
      'emotionalTone', 'musicStyle', 'backgroundSoundEffects'
    ],
    placeholders: {
      futuristicCityName: 'Neo Tokyo, Hyperion Prime, Cyberdome City',
      visualElements: 'Neon signs, Hovering traffic, Robotic crowds',
      cameraView: 'Aerial bird’s-eye view, Tracking POV shot',
      characterDescription: 'Female bounty hunter in a silver cloak, Android street vendor',
      cityscapeSetting: 'Floating walkways, Lower slums, Holographic billboards',
      colorScheme: 'Cool blues mixed with magenta neon, Dark purples and chrome highlights',
      emotionalTone: 'Mysterious, Cold and intense, Isolated',
      musicStyle: 'Synthwave, Electronic basslines, Dystopian ambiance',
      backgroundSoundEffects: 'Machine sounds, Voice prompts, Distant sirens'
    }
  }
};

function renderFormFields(templateKey) {
  form.innerHTML = '';
  const data = templates[templateKey];
  if (!data) return;

  data.fields.forEach(field => {
    const label = document.createElement('label');
    label.textContent = field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

    const input = document.createElement('input');
    input.type = 'text';
    input.name = field;
    input.placeholder = data.placeholders[field] || '';

    form.appendChild(label);
    form.appendChild(input);
  });
}

function addDialogLine() {
  const wrapper = document.createElement('div');
  wrapper.className = 'dialog-line';

  const charInput = document.createElement('input');
  charInput.type = 'text';
  charInput.name = `dialogCharacter${dialogCount}`;
  charInput.placeholder = 'Character name (e.g. Hero)';

  const dialogInput = document.createElement('input');
  dialogInput.type = 'text';
  dialogInput.name = `dialogText${dialogCount}`;
  dialogInput.placeholder = 'Enter dialog here...';

  wrapper.appendChild(charInput);
  wrapper.appendChild(dialogInput);

  dialogContainer.appendChild(wrapper);
  dialogCount++;
}

// Event Listeners
templateSelect.addEventListener('change', () => {
  const selected = templateSelect.value;
  renderFormFields(selected);
});

addDialogBtn.addEventListener('click', () => {
  addDialogLine();
});

generateBtn.addEventListener('click', () => {
  const selected = templateSelect.value;
  if (!selected || !templates[selected]) return;

  const formData = new FormData(form);
  let prompt = templates[selected].prompt;

  // Replace only filled placeholders
  for (let [key, value] of formData.entries()) {
    if (value.trim() !== "") {
      prompt = prompt.replace(new RegExp(`{${key}}`, 'g'), value.trim());
    }
  }

  // Remove any remaining placeholder tags
  prompt = prompt.replace(/{[^{}]+}/g, "").trim();

  // Clean up extra blank lines
  prompt = prompt.replace(/\n\s*\n/g, "\n\n");

  // Build dialog lines
  const dialogLines = [];
  for (let i = 0; i < dialogCount; i++) {
    const character = formData.get(`dialogCharacter${i}`);
    const text = formData.get(`dialogText${i}`);

    if (character && text && character.trim() !== "" && text.trim() !== "") {
      dialogLines.push(`${character}: "${text}"`);
    }
  }

  // Add dialog section if there are valid lines
  if (dialogLines.length > 0) {
    prompt += `\n\nDialog:\n` + dialogLines.join('\n');
  }

  output.value = prompt;
});

copyBtn.addEventListener('click', () => {
  output.select();
  document.execCommand('copy');
  alert('Prompt copied to clipboard!');
});
