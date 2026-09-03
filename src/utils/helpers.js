export const getCategoryTranslation = (cat, t) => {
  switch(cat) {
    case 'Work': return t.work;
    case 'Personal': return t.personal;
    case 'Shopping': return t.shopping;
    case 'Health': return t.health;
    case 'Other': return t.other;
    default: return cat;
  }
};

export const getPriorityTranslation = (prio, t) => {
  switch(prio) {
    case 'High': return t.high;
    case 'Medium': return t.medium;
    case 'Low': return t.low;
    default: return prio;
  }
};

export const getPriorityColor = (priority) => {
  switch(priority) {
    case 'High': return '#4CAF50';
    case 'Medium': return '#FFC107';
    case 'Low': return '#FF5252';
    default: return '#666';
  }
};