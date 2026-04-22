import { DetectionResult, ClothingItem } from '../types';

// Mock SOP rules - customize these based on your requirements
const SOP_RULES = {
  baju: {
    allowedColors: ['putih', 'biru', 'hitam'],
    description: 'Baju harus berwarna putih, biru, atau hitam'
  },
  celana: {
    allowedColors: ['hitam', 'biru gelap', 'abu-abu'],
    description: 'Celana harus berwarna hitam, biru gelap, atau abu-abu'
  },
  sepatu: {
    allowedColors: ['hitam', 'coklat'],
    description: 'Sepatu harus berwarna hitam atau coklat'
  }
};

const POSSIBLE_COLORS = {
  baju: ['putih', 'biru', 'hitam', 'merah', 'kuning', 'hijau', 'pink'],
  celana: ['hitam', 'biru gelap', 'abu-abu', 'coklat', 'biru muda', 'krem'],
  sepatu: ['hitam', 'coklat', 'putih', 'merah', 'biru']
};

function getRandomColor(type: keyof typeof POSSIBLE_COLORS): string {
  const colors = POSSIBLE_COLORS[type];
  return colors[Math.floor(Math.random() * colors.length)];
}

function isColorCompliant(type: keyof typeof SOP_RULES, color: string): boolean {
  return SOP_RULES[type].allowedColors.includes(color);
}

function getRandomConfidence(): number {
  // Generate confidence between 0.75 and 0.98
  return 0.75 + Math.random() * 0.23;
}

export function analyzeClothing(): DetectionResult {
  const items: ClothingItem[] = [];

  // Detect Baju (Shirt)
  const bajuColor = getRandomColor('baju');
  const bajuCompliant = isColorCompliant('baju', bajuColor);
  items.push({
    type: 'baju',
    color: bajuColor,
    compliant: bajuCompliant,
    confidence: getRandomConfidence(),
    reason: bajuCompliant ? undefined : SOP_RULES.baju.description
  });

  // Detect Celana (Pants)
  const celanaColor = getRandomColor('celana');
  const celanaCompliant = isColorCompliant('celana', celanaColor);
  items.push({
    type: 'celana',
    color: celanaColor,
    compliant: celanaCompliant,
    confidence: getRandomConfidence(),
    reason: celanaCompliant ? undefined : SOP_RULES.celana.description
  });

  // Detect Sepatu (Shoes)
  const sepatuColor = getRandomColor('sepatu');
  const sepatuCompliant = isColorCompliant('sepatu', sepatuColor);
  items.push({
    type: 'sepatu',
    color: sepatuColor,
    compliant: sepatuCompliant,
    confidence: getRandomConfidence(),
    reason: sepatuCompliant ? undefined : SOP_RULES.sepatu.description
  });

  const isCompliant = items.every(item => item.compliant);

  return {
    items,
    isCompliant,
    timestamp: Date.now()
  };
}
