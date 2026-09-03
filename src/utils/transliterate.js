export const transliterateToHindi = (text) => {
  if (!text) return '';
  const rules = [
    [/sh/g, 'श'], [/ch/g, 'च'], [/th/g, 'थ'], [/ph/g, 'फ'], [/gh/g, 'घ'], [/dh/g, 'ध'], [/bh/g, 'भ'],
    [/a/g, 'ा'], [/e/g, 'े'], [/i/g, 'ि'], [/o/g, 'ो'], [/u/g, 'ु'],
    [/b/g, 'ब'], [/c/g, 'क'], [/d/g, 'द'], [/f/g, 'फ'], [/g/g, 'ग'], [/h/g, 'ह'], [/j/g, 'ज'],
    [/k/g, 'क'], [/l/g, 'ल'], [/m/g, 'म'], [/n/g, 'न'], [/p/g, 'प'], [/q/g, 'क'], [/r/g, 'र'],
    [/s/g, 'स'], [/t/g, 'त'], [/v/g, 'व'], [/w/g, 'व'], [/x/g, 'क्स'], [/y/g, 'य'], [/z/g, 'ज़']
  ];
  let hindiText = text.toLowerCase();
  rules.forEach(([eng, hin]) => { hindiText = hindiText.replace(eng, hin); });
  
  const startVowels = { 'ा': 'आ', 'े': 'ए', 'ि': 'इ', 'ो': 'ओ', 'ु': 'उ' };
  if (startVowels[hindiText.charAt(0)]) hindiText = startVowels[hindiText.charAt(0)] + hindiText.slice(1);
  return hindiText;
};