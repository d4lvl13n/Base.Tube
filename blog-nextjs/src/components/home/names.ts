// The hero's field of fan names: invented, from many places, shown as "Léa M.". Drawn on a canvas
// (see NameField.tsx), never as DOM text. A fixed seed keeps the same field on every visit.

const FIRST = [
  'Léa', 'Kofi', 'Hana', 'Mateo', 'Aisha', 'Yuki', 'Olu', 'Inès', 'Rafael', 'Priya', 'Sven', 'Amara', 'Diego', 'Mei',
  'Tomasz', 'Zainab', 'Luca', 'Noor', 'Kwame', 'Elif', 'Sofia', 'Arjun', 'Chloé', 'Emeka', 'Ingrid', 'Hiro', 'Fatima',
  'Joaquín', 'Anya', 'Tariq', 'Maren', 'Kenji', 'Lucía', 'Oskar', 'Nia', 'Ravi', 'Camille', 'Jonas', 'Seo-yeon', 'Farid',
  'Isla', 'Malik', 'Greta', 'Thiago', 'Ayumi', 'Bilal', 'Clara', 'Dmitri', 'Esme', 'Femi', 'Giulia', 'Hugo', 'Ivy',
  'Jamal', 'Kira', 'Lars', 'Maya', 'Nico', 'Olga', 'Pablo', 'Qi', 'Rosa', 'Sami', 'Tove', 'Uma', 'Viktor', 'Wren',
  'Ximena', 'Yara', 'Zoé', 'Adaeze', 'Björn', 'Céline', 'Dara', 'Emil', 'Freya', 'Gaël', 'Hamid', 'Ilse', 'Jin',
  'Kalani', 'Leila', 'Moana', 'Nadia', 'Omar', 'Paz', 'Quinn', 'Rin', 'Selin', 'Tomás', 'Uri', 'Vera', 'Wei', 'Xavi',
  'Yusuf', 'Zara', 'Abebe', 'Beatriz', 'Chidi', 'Dana', 'Eun-ji', 'Fiona', 'Goran', 'Helga', 'Idris', 'Jasmin', 'Kai',
  'Luz', 'Mina', 'Nils', 'Ola', 'Pia', 'Rashid', 'Sade', 'Timo', 'Valentina', 'Wanjiru', 'Yosef', 'Ana', 'Ben', 'Tom',
];
const INITIALS = 'ABCDEFGHIJKLMNOPRSTUVWYZ';

/** What a buyer bought: plain words, no prices. */
export const PURCHASES = [
  'Full course', 'Director’s cut', 'Archive pass', 'Film', 'Workshop', 'Documentary', 'Masterclass', 'Tour film',
  'Extended cut', 'Studio session',
];

/** A small seeded random generator (mulberry32): the same field every time. */
export function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function fanName(random: () => number): string {
  return `${FIRST[Math.floor(random() * FIRST.length)]} ${INITIALS[Math.floor(random() * INITIALS.length)]}.`;
}
