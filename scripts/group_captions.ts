import fs from 'fs';
import path from 'path';

const captions = JSON.parse(fs.readFileSync('public/captions.json', 'utf8'));

const groupedCaptions = [];
let currentGroup = [];
let currentCharCount = 0;

for (const cap of captions) {
  const text = cap.text.trim();
  currentGroup.push(cap);
  currentCharCount += text.length + 1;

  if (text.endsWith('.') || text.endsWith('?') || text.endsWith('!') || currentCharCount > 40) {
    const combinedText = currentGroup.map(c => c.text.trim()).join(' ');
    const startMs = currentGroup[0].startMs;
    const endMs = currentGroup[currentGroup.length - 1].endMs;
    
    groupedCaptions.push({
      text: combinedText,
      startMs,
      endMs,
    });
    
    currentGroup = [];
    currentCharCount = 0;
  }
}

// Add remaining
if (currentGroup.length > 0) {
  const combinedText = currentGroup.map(c => c.text.trim()).join(' ');
  const startMs = currentGroup[0].startMs;
  const endMs = currentGroup[currentGroup.length - 1].endMs;
  
  groupedCaptions.push({
    text: combinedText,
    startMs,
    endMs,
  });
}

fs.writeFileSync('public/captions_grouped.json', JSON.stringify(groupedCaptions, null, 2));
console.log('Grouped captions written to public/captions_grouped.json');
