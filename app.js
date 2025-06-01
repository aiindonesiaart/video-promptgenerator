const templateSelect = document.getElementById('template');
const form = document.getElementById('prompt-form');
const output = document.getElementById('output');
const generateBtn = document.getElementById('generate-btn');
const copyBtn = document.getElementById('copy-btn');

// Define templates with required fields
const templates = {
  default: {
    prompt: `The scene takes place in {timeOfDay} at {location}, depicting a {sceneType}. The camera uses {cameraTechnique}, with a {visualAesthetic} look.\nThe main character is {characterDescription}, engaged in {mainActivity}.\nThe environment features {environmentDetails}.\nThe color palette includes {colorPalette}, and the atmosphere feels {emotionalTone}.\nAudio includes {audioElements}.`,
    fields: [
      'timeOfDay', 'location', 'sceneType', 'cameraTechnique',
      'visualAesthetic', 'characterDescription', 'mainActivity',
      'environmentDetails', 'colorPalette', 'emotionalTone', 'audioElements'
    ]
  },
  fantasy: {
    prompt: `In a {forestType} at {timeOfDay}, {characterDescription} walks through an ancient, mysterious forest...\n(Add full template as needed)`,
    fields: ['forestType', 'timeOfDay', 'characterDescription', 'cameraMovement', 'magicalElements', 'mysticalCreature', 'dominantColors', 'emotionalTone', 'forestSounds', 'musicStyle']
  },
  // Add more templates similarly...
};

function renderFormFields(templateKey) {
  form.innerHTML = '';
  const fields = templates[templateKey]?.fields || [];

  fields.forEach(field => {
    const label = document.createElement('label');
    label.textContent = field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

    const input = document.createElement('input');
    input.type = 'text';
    input.name = field;

    form.appendChild(label);
    form.appendChild(input);
  });
}

templateSelect.addEventListener('change', () => {
  const selected = templateSelect.value;
  renderFormFields(selected);
});

generateBtn.addEventListener('click', () => {
  const selected = templateSelect.value;
  if (!selected || !templates[selected]) return;

  const formData = new FormData(form);
  let prompt = templates[selected].prompt;

  for (let [key, value] of formData.entries()) {
    prompt = prompt.replace(new RegExp(`{${key}}`, 'g'), value);
  }

  output.value = prompt;
});

copyBtn.addEventListener('click', () => {
  output.select();
  document.execCommand('copy');
  alert('Prompt copied to clipboard!');
});
