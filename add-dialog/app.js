const templateSelect = document.getElementById('template');
const form = document.getElementById('prompt-form');
const output = document.getElementById('output');
const generateBtn = document.getElementById('generate-btn');
const addDialogBtn = document.getElementById('add-dialog-btn');
const dialogContainer = document.getElementById('dialog-container');

let dialogCount = 0;

// Define templates
const templates = {
  default: {
    prompt: `The scene takes place in {timeOfDay} at {location}, depicting a {sceneType}. The camera uses {cameraTechnique}, with a {visualAesthetic} look.\nThe main character is {characterDescription}, engaged in {mainActivity}.\nThe environment features {environmentDetails}.\nThe color palette includes {colorPalette}, and the atmosphere feels {emotionalTone}.`,
    fields: [
      'timeOfDay', 'location', 'sceneType',
      'cameraTechnique', 'visualAesthetic',
      'characterDescription', 'mainActivity',
      'environmentDetails', 'colorPalette', 'emotionalTone'
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
      emotionalTone: 'Intense and thrilling, Calm and meditative'
    }
  },
  fantasy: {
    prompt: `In a {forestType} at {timeOfDay}, {characterDescription} walks through an ancient, mysterious forest. The camera moves with a {cameraMovement}, capturing dappled light filtering through the trees and {magicalElements} floating in the air.\nShe encounters a {mysticalCreature}, and they share a gentle moment of connection. The color palette centers around {dominantColors}, and the mood is {emotionalTone}.`,
    fields: [
      'forestType', 'timeOfDay', 'characterDescription',
      'cameraMovement', 'magicalElements', 'mysticalCreature',
      'dominantColors', 'emotionalTone'
    ],
    placeholders: {
      forestType: 'Enchanted birch grove, Ancient redwood forest',
      timeOfDay: 'Golden hour, Twilight',
      characterDescription: 'Elven ranger in leafy armor',
      cameraMovement: 'Smooth glide, Slow orbit',
      magicalElements: 'Floating fireflies, Glowing spores',
      mysticalCreature: 'Moss-covered deer spirit',
      dominantColors: 'Emerald green and silver',
      emotionalTone: 'Magical calm, Reverent awe'
    }
  },
  sciFi: {
    prompt: `At night in {futuristicCityName}, towering skyscrapers surround streets filled with {visualElements}. The camera uses {cameraView} to show the city’s rhythm.\nThe protagonist is {characterDescription}, navigating through {cityscapeSetting}. The color scheme is {colorScheme}, with a mood that’s {emotionalTone}.`,
    fields: [
      'futuristicCityName', 'visualElements', 'cameraView',
      'characterDescription', 'cityscapeSetting', 'colorScheme', 'emotionalTone'
    ],
    placeholders: {
      futuristicCityName: 'Neo Tokyo, Hyperion Prime',
      visualElements: 'Neon signs, Hovering traffic',
      cameraView: 'Aerial bird’s-eye view',
      characterDescription: 'Female bounty hunter in a silver cloak',
      cityscapeSetting: 'Floating walkways, Lower slums',
      colorScheme: 'Cool blues mixed with magenta neon',
      emotionalTone: 'Mysterious, Cold and intense'
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
    input.placeholder = data.placeholders[field] || 'Enter value...';

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

  // Remove unfilled placeholders
  prompt = prompt.replace(/{[^{}]+}/g, '').trim();

  // Clean up extra blank lines
  prompt = prompt.replace(/\n\s*\n/g, '\n\n');

  // Collect dialog lines
  const dialogLines = [];
  for (let i = 0; i < dialogCount; i++) {
    const character = formData.get(`dialogCharacter${i}`);
    const text = formData.get(`dialogText${i}`);

    if (character && text && character.trim() && text.trim()) {
      dialogLines.push(`${character}: "${text}"`);
    }
  }

  // Add dialog section if there are valid lines
  if (dialogLines.length > 0) {
    prompt += `\n\nDialog:\n` + dialogLines.join('\n');
  }

  output.value = prompt;
});

addDialogBtn.addEventListener('click', addDialogLine);

document.getElementById('copy-btn').addEventListener('click', () => {
  output.select();
  document.execCommand('copy');
  alert('Prompt copied to clipboard!');
});
