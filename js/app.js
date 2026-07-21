// Wires the form up to the scheduler and renders the resulting plan.

const GROUP_LABELS = {
  chest: 'Chest',
  back: 'Back',
  legs: 'Legs',
  shoulders: 'Shoulders',
  arms: 'Arms',
  core: 'Core',
  cardio: 'Cardio',
};

const form = document.getElementById('goal-form');
const resultSection = document.getElementById('result');
const emptyState = document.getElementById('empty-state');

function getConfig() {
  return {
    goal: form.goal.value,
    experience: form.experience.value,
    equipment: form.equipment.value,
    daysPerWeek: parseInt(form.daysPerWeek.value, 10),
  };
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function renderDayCard(day) {
  const card = el('article', 'day-card');

  const header = el('div', 'day-header');
  const heading = el('div', 'day-heading');
  heading.appendChild(el('h3', null, day.title));
  heading.appendChild(el('span', 'weekday', day.weekday));
  header.appendChild(heading);
  header.appendChild(el('span', 'duration', `~${day.estMinutes} min`));
  card.appendChild(header);

  const table = el('table', 'exercise-table');
  const thead = el('thead');
  const headRow = el('tr');
  ['Exercise', 'Sets', 'Reps', 'Rest'].forEach((h) =>
    headRow.appendChild(el('th', null, h))
  );
  thead.appendChild(headRow);
  table.appendChild(thead);

  const tbody = el('tbody');
  day.exercises.forEach((ex) => {
    const row = el('tr');
    const nameCell = el('td', 'ex-name');
    nameCell.appendChild(el('span', null, ex.name));
    nameCell.appendChild(el('span', `tag tag-${ex.group}`, GROUP_LABELS[ex.group] || ex.group));
    row.appendChild(nameCell);
    row.appendChild(el('td', null, ex.sets));
    row.appendChild(el('td', null, ex.reps));
    row.appendChild(el('td', null, ex.rest));
    tbody.appendChild(row);
  });
  table.appendChild(tbody);
  card.appendChild(table);

  if (day.cardio) {
    const cardio = el('div', 'cardio-note');
    cardio.appendChild(el('strong', null, `Finisher — ${day.cardio.name}: `));
    cardio.appendChild(document.createTextNode(day.cardio.note));
    card.appendChild(cardio);
  }

  return card;
}

function renderPlan(plan) {
  resultSection.innerHTML = '';

  // Summary banner
  const summary = el('div', 'plan-summary');
  summary.appendChild(el('h2', null, plan.goalLabel));
  summary.appendChild(el('p', 'blurb', plan.goalBlurb));

  const meta = el('div', 'plan-meta');
  const metaItems = [
    ['Split', plan.splitName],
    ['Frequency', `${plan.daysPerWeek} days / week`],
    ['Level', capitalize(plan.experience)],
    ['Equipment', equipmentLabel(plan.equipment)],
  ];
  metaItems.forEach(([label, value]) => {
    const item = el('div', 'meta-item');
    item.appendChild(el('span', 'meta-label', label));
    item.appendChild(el('span', 'meta-value', value));
    meta.appendChild(item);
  });
  summary.appendChild(meta);
  resultSection.appendChild(summary);

  // Day grid
  const grid = el('div', 'day-grid');
  plan.days.forEach((day) => grid.appendChild(renderDayCard(day)));
  resultSection.appendChild(grid);

  // Rest days
  if (plan.restDays.length) {
    const rest = el('div', 'rest-days');
    rest.appendChild(el('strong', null, 'Rest & recovery: '));
    rest.appendChild(document.createTextNode(plan.restDays.join(', ')));
    resultSection.appendChild(rest);
  }

  emptyState.hidden = true;
  resultSection.hidden = false;
  resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function equipmentLabel(eq) {
  return { bodyweight: 'Bodyweight only', dumbbell: 'Dumbbells', gym: 'Full gym' }[eq] || eq;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const plan = generatePlan(getConfig());
  renderPlan(plan);
});
