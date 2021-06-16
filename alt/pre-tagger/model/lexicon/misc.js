//words that can't be compressed, for whatever reason
let misc = {
  // numbers
  '20th century fox': 'Organization',
  // '3m': 'Organization',
  '7 eleven': 'Organization',
  'motel 6': 'Organization',
  g8: 'Organization',
  vh1: 'Organization',
  q1: 'Date',
  q2: 'Date',
  q3: 'Date',
  q4: 'Date',
  her: ['Possessive', 'Pronoun'],
  his: ['Possessive', 'Pronoun'],
  their: ['Possessive', 'Pronoun'],
  themselves: ['Possessive', 'Pronoun'],
  your: ['Possessive', 'Pronoun'],
  our: ['Possessive', 'Pronoun'],
  my: ['Possessive', 'Pronoun'],
  its: ['Possessive', 'Pronoun'],
  // ampersands
  'at&t': 'Organization',
  'black & decker': 'Organization',
  'h & m': 'Organization',
  'johnson & johnson': 'Organization',
  'procter & gamble': 'Organization',
  "ben & jerry's": 'Organization',
}

module.exports = misc
