const preps = '(in|by|before|during|on|until|after|of|within|all)' //6
const thisNext = '(last|next|this|previous|current|upcoming|coming)' //2
const sections = '(start|end|middle|starting|ending|midpoint|beginning)' //2
const seasons = '(spring|summer|winter|fall|autumn)'

// { match: '', tag: '', reason:'' },
let matches = [
  // in the evening
  { match: 'in the (night|evening|morning|afternoon|day|daytime)', tag: 'Time', reason: 'in-the-night' },
  // 8 pm
  { match: '(#Value|#Time) (am|pm)', tag: 'Time', reason: 'value-ampm' },
  // 2012-06
  { match: '/^[0-9]{4}-[0-9]{2}$/', tag: 'Date', reason: '2012-06' },
  // misc weekday words
  { match: '(tue|thu)', tag: 'WeekDay', reason: 'misc-weekday' },
  //June 5-7th
  { match: `#Month #Date+`, tag: 'Date', reason: 'correction-numberRange' },
  //5th of March
  { match: '#Value of #Month', tag: 'Date', reason: 'value-of-month' },
  //5 March
  { match: '#Cardinal #Month', tag: 'Date', reason: 'cardinal-month' },
  //march 5 to 7
  { match: '#Month #Value (and|or|to)? #Value+', tag: 'Date', reason: 'value-to-value' },
  //march the 12th
  { match: '#Month the #Value', tag: 'Date', reason: 'month-the-value' },
  // march to april
  { match: '[(march|may)] to? #Date', tag: 'Date', group: 0, tag: 'Month', reason: 'march-to' },
  // 'march'
  { match: '^(march|may)$', tag: 'Month', reason: 'single-march' },
  //March or June
  { match: '#Month or #Month', tag: 'Date', reason: 'month-or-month' },
  //june 7
  { match: '(#WeekDay|#Month) #Value', ifNo: '#Money', tag: 'Date', reason: 'date-value' },
  //7 june
  { match: '#Value (#WeekDay|#Month)', ifNo: '#Money', tag: 'Date', reason: 'value-date' },
  //may twenty five
  { match: '#TextValue #TextValue', if: '#Date', tag: '#Date', reason: 'textvalue-date' },
  //two thursdays back
  { match: '#Value (#WeekDay|#Duration) back', tag: '#Date', reason: '3-back' },
  //for 4 months
  { match: 'for #Value #Duration', tag: 'Date', reason: 'for-x-duration' },
  //two days before
  { match: '#Value #Duration #Conjunction', tag: 'Date', reason: 'val-duration-conjunction' },
  //for four days
  { match: `${preps}? #Value #Duration`, tag: 'Date', reason: 'value-duration' },
  //two years old
  { match: '#Value #Duration old', unTag: 'Date', reason: 'val-years-old' },
  // 
  { match: `${preps}? ${thisNext} ${seasons}`, tag: 'Date', reason: 'thisNext-season' },
  // 
  { match: `the? ${sections} of ${seasons}`, tag: 'Date', reason: 'section-season' },
  // 
  { match: `${seasons} ${preps}? #Cardinal`, tag: 'Date', reason: 'season-year' },
  //june the 5th
  { match: '#Date the? #Ordinal', tag: 'Date', reason: 'correction' },
  //last month
  { match: `${thisNext} #Date`, tag: 'Date', reason: 'thisNext-date' },
  //by 5 March
  { match: 'due? (by|before|after|until) #Date', tag: 'Date', reason: 'by' },
  //next feb
  { match: '(last|next|this|previous|current|upcoming|coming|the) #Date', tag: 'Date', reason: 'next-feb' },
  //start of june
  { match: `the? ${sections} of #Date`, tag: 'Date', reason: 'section-of' },
  //fifth week in 1998
  { match: '#Ordinal #Duration in #Date', tag: 'Date', reason: 'duration-in' },
  //early in june
  { match: '(early|late) (at|in)? the? #Date', tag: 'Time', reason: 'early-evening' },
  //tomorrow before 3
  { match: '#Date [(by|before|after|at|@|about) #Cardinal]', group: 0, tag: 'Time', reason: 'date-before-Cardinal' },
  //feb to june
  { match: '#Date (#Preposition|to) #Date', ifNo: '#Duration', tag: 'Date', reason: 'date-prep-date' },
  //by 6pm
  { match: '(by|before|after|at|@|about) #Time', tag: 'Time', reason: 'preposition-time' },
  // in 20mins
  { match: '(in|after) /^[0-9]+(min|sec|wk)s?/', tag: 'Date', reason: 'shift-units' },
  //tuesday night
  { match: '#Date [(now|night|sometime)]', group: 0, tag: 'Time', reason: 'date-now' },
  // 4 days from now
  { match: '(from|starting|until|by) now', tag: 'Date', reason: 'for-now' },
  // every night
  { match: '(each|every) night', tag: 'Date', reason: 'for-now' },
  //saturday am
  { match: '#Date [(am|pm)]', group: 0, tag: 'Time', reason: 'date-am' },


  //june 5 to 7th
  { match: '#Month #Value to #Value of? #Year?', tag: 'Date', reason: 'date-val' },
  //5 to 7th june
  { match: '#Value to #Value of? #Month #Year?', tag: 'Date', reason: 'date-val' },
  //third week of may
  { match: '#Value #Duration of #Date', tag: 'Date', reason: 'date-val' },
  //two days after
  { match: '#Value+ #Duration (after|before|into|later|afterwards|ago)?', tag: 'Date', reason: 'date-val' },
  //two days
  { match: '#Value #Date', tag: 'Date', reason: 'date-val' },
  //june 5th
  { match: '#Date #Value', tag: 'Date', reason: 'date-val' },
  //tuesday at 5
  { match: '#Date #Preposition #Value', tag: 'Date', reason: 'date-val' },
  //tomorrow before 3
  { match: '#Date (after|before|during|on|in) #Value', tag: 'Date', reason: 'date-val' },
  //a year and a half
  { match: '#Value (year|month|week|day) and a half', tag: 'Date', reason: 'date-val' },
  //5 and a half years
  { match: '#Value and a half (years|months|weeks|days)', tag: 'Date', reason: 'date-val' },
  //on the fifth
  { match: 'on the #Ordinal', tag: 'Date', reason: 'date-val' },
  // 'jan 5 or 8'
  { match: '#Month #Value+ (and|or) #Value', tag: 'Date', reason: 'date-or-date' },
  // 5 or 8 of jan
  { match: '#Value+ (and|or) #Value of #Month ', tag: 'Date', reason: 'date-and-date' },

  { match: '(spring|summer|winter|fall|autumn|springtime|wintertime|summertime)', tag: 'Season', reason: 'date-tag' },
  { match: '(q1|q2|q3|q4)', tag: 'FinancialQuarter', reason: 'date-tag' },
  { match: '(this|next|last|current) quarter', tag: 'FinancialQuarter', reason: 'date-tag' },
  { match: '(this|next|last|current) season', tag: 'Season', reason: 'date-tag' },
  //friday to sunday
  { match: '#Date #Preposition #Date', tag: 'Date', reason: 'date-tag' },
  //once a day..
  { match: '(once|twice) (a|an|each) #Date', tag: 'Date', reason: 'date-tag' },
  //tuesday
  { match: '#Date+', tag: 'Date', reason: 'date-tag' },
  //a year after..
  { match: 'a #Duration', tag: 'Date', reason: 'date-tag' },
  //between x and y
  { match: '(between|from) #Date', tag: 'Date', reason: 'date-tag' },
  { match: '(to|until|upto) #Date', tag: 'Date', reason: 'date-tag' },
  { match: '#Date and #Date', tag: 'Date', reason: 'date-tag' },
  //day after next
  { match: 'the? #Date after next one?', tag: 'Date', reason: 'date-tag' },
  //approximately...
  { match: '(about|approx|approximately|around) #Date', tag: 'Date', reason: 'date-tag' },

  { match: '(by|until|on|in|at|during|over|every|each|due) the? #Date', notIf: '#PhrasalVerb', tag: 'Date', reason: '' },
  { match: '(by|until|after|before|during|on|in|following|since) (next|this|last)? (#Date|#Date)', notIf: '#PhrasalVerb', tag: 'Date', reason: '' },

  // //next september
  { match: 'this? (last|next|past|this|previous|current|upcoming|coming|the) #Date', tag: 'Date', reason: '' },
  //starting this june
  { match: '(starting|beginning|ending) #Date', tag: 'Date', reason: '' },
  //start of june
  { match: 'the? (start|end|middle|beginning) of (last|next|this|the) (#Date|#Date)', tag: 'Date', reason: '' },
  //this coming june
  { match: '(the|this) #Date', tag: 'Date', reason: '' },
  //january up to june
  { match: '#Date up to #Date', tag: 'Date', reason: '' },

  // 2 oclock
  { match: '#Cardinal oclock', tag: 'Time', reason: 'time-tag' },
  // 13h30
  { match: '/^[0-9]{2}h[0-9]{2}$/', tag: 'Time', reason: 'time-tag' },
  // 03/02
  { match: '/^[0-9]{2}/[0-9]{2}/', tag: 'Date', unTag: 'Value', reason: 'time-tag' },
  // 3 in the morning
  { match: '#Value (in|at) the? (morning|evening|night|nighttime)', tag: 'Time', reason: 'time-tag' },
  // ten to seven
  { match: '(5|10|15|20|five|ten|fifteen|quarter|twenty|half) (to|after|past) #Cardinal', tag: 'Time', reason: 'time-tag' }, //add check for 1 to 1 etc.
  // at 10 past
  { match: '(at|by|before) (5|10|15|20|five|ten|fifteen|twenty|quarter|half) (after|past|to)', tag: 'Time', reason: 'at-20-past' },
  // iso  (2020-03-02T00:00:00.000Z)
  { match: '/^[0-9]{4}[:-][0-9]{2}[:-][0-9]{2}T[0-9]/', tag: 'Time', reason: 'time-tag' },
  // tuesday at 4
  { match: '#Date [at #Cardinal]', group: 0, notIf: '#Year', tag: 'Time', reason: 'time-tag' },
  // half an hour
  { match: 'half an (hour|minute|second)', tag: 'Date', reason: 'time-tag' },
  // in eastern time
  { match: '(in|for|by|near|at) #Timezone', tag: 'Timezone', reason: 'time-tag' },
  // 3pm to 4pm
  { match: '#Time to #Time', tag: 'Date', reason: 'time-tag' },
  // 4pm sharp
  { match: '#Time [(sharp|on the dot)]', group: 0, tag: 'Time', reason: 'time-tag' },

  // around four thirty
  { match: '(at|around|near|#Date) [#Cardinal (thirty|fifteen) (am|pm)?]', group: 0, tag: 'Time', reason: 'time-tag' },
  //anytime around 3
  { match: '(anytime|sometime) (before|after|near) [#Cardinal]', group: 0, tag: 'Time', reason: 'antime-after-3' }

]
