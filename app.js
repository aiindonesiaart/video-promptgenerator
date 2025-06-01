const templateSelect = document.getElementById('template');
const form = document.getElementById('prompt-form');
const output = document.getElementById('output');
const generateBtn = document.getElementById('generate-btn');
const copyBtn = document.getElementById('copy-btn');

// Define all templates with their respective fields and prompt structure
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
    prompt: `In a {forestType} at {timeOfDay}, {characterDescription} walks through an ancient, mysterious forest. The camera moves with a {cameraMovement}, capturing dappled light filtering through the trees and {magicalElements} floating in the air.\nShe encounters a {mysticalCreature}, and they share a gentle moment of connection. The color palette centers around {dominantColors}, and the mood is {emotionalTone}.\nAmbient sounds include {forestSounds}, accompanied by {musicStyle}, making the whole scene feel like a storybook painting.`,
    fields: [
      'forestType', 'timeOfDay', 'characterDescription',
      'cameraMovement', 'magicalElements', 'mysticalCreature',
      'dominantColors', 'emotionalTone', 'forestSounds', 'musicStyle'
    ]
  },
  offroad: {
    prompt: `On an off-road trail in {naturalTerrain}, a {vehicleType} speeds through the course. The camera uses {movementStyle}, often getting splattered by {mudWaterDebris}.\nThe scene features {actionMoments}, with roaring engines and wild motion. Sounds include {engineRoarWaterSpraySuspensionImpact}, making every second feel intense and visceral.`,
    fields: [
      'naturalTerrain', 'vehicleType', 'movementStyle',
      'mudWaterDebris', 'actionMoments', 'engineRoarWaterSpraySuspensionImpact'
    ]
  },
  cooking: {
    prompt: `A close-up captures {ingredientName} hitting a sizzling hot pan, with a dramatic burst of {soundEffect} and steam. The camera performs a {cameraMovement}.\nThe color palette is {colorPalette}, highlighting the textures and oil bubbles. Background audio may include {ambientKitchenSoundsOrSoftMusic}, creating a calm and focused mood.`,
    fields: [
      'ingredientName', 'soundEffect', 'cameraMovement',
      'colorPalette', 'ambientKitchenSoundsOrSoftMusic'
    ]
  },
  sciFi: {
    prompt: `At night in {futuristicCityName}, towering skyscrapers surround streets filled with {visualElements}. The camera uses {cameraView} to show the city’s rhythm.\nThe protagonist is {characterDescription}, navigating through {cityscapeSetting}. The color scheme is {colorScheme}, with a mood that’s {emotionalTone}.\nBackground music includes {musicStyle}, layered with {backgroundSoundEffects}.`,
    fields: [
      'futuristicCityName', 'visualElements', 'cameraView',
      'characterDescription', 'cityscapeSetting', 'colorScheme',
      'emotionalTone', 'musicStyle', 'backgroundSoundEffects'
    ]
  },
  monologue: {
    prompt: `The camera focuses on {characterDescription} sitting at {setting}, slowly telling a story about {topic}.\nLight pours in from {lightDirection}, emphasizing facial contours and subtle expressions. The camera uses {cameraTechnique}, and the palette is {colorPalette}.\nThe background is quiet, with occasional {backgroundSounds}, reinforcing a mood of {emotionalTone}.`,
    fields: [
      'characterDescription', 'setting', 'topic',
      'lightDirection', 'cameraTechnique', 'colorPalette',
      'backgroundSounds', 'emotionalTone'
    ]
  },
  comedy: {
    prompt: `In a {bizarreSetting}, a {character} is {funnyAction}.\nThe camera uses {oddAngles} to enhance absurdity. Colors are {colorStyle}, and the editing is {editingStyle}.\nSoundtrack includes {soundtrack}, with exaggerated stings for every motion.`,
    fields: [
      'bizarreSetting', 'character', 'funnyAction',
      'oddAngles', 'colorStyle', 'editingStyle', 'soundtrack'
    ]
  },
  seaside: {
    prompt: `At dusk, the camera films a {boatType} gently drifting over {seaCondition}. A {characterDescription} sits quietly on the boat, gazing into the distance, deep in thought.\nThe shot slowly pulls back or circles, capturing {visualDetails}.\nThe color palette features {colorPalette}, and the mood feels {emotionalTone}.\nSoundscape includes {soundscape}, with background music of {musicStyle}.`,
    fields: [
      'boatType', 'seaCondition', 'characterDescription',
      'visualDetails', 'colorPalette', 'emotionalTone',
      'soundscape', 'musicStyle'
    ]
  },
  historical: {
    prompt: `The scene is set in {historicalEra}, at {location}, where the camera captures {actionScene}.\nThe cinematography uses {cinematographyStyle}, with a color palette of {colorPalette}, highlighting {details}.\nSound effects reflect {soundEffects}, while the soundtrack uses {musicStyle} to enhance immersion.`,
    fields: [
      'historicalEra', 'location', 'actionScene',
      'cinematographyStyle', 'colorPalette', 'details',
      'soundEffects', 'musicStyle'
    ]
  }
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
