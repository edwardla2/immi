export interface GoalOption {
  id: string;
  label: string;
  emoji: string;
}

export const PRIMARY_GOALS: GoalOption[] = [
  { id: 'upcoming_deadline', label: 'I have an upcoming deadline', emoji: '🗓️' },
  { id: 'file_form', label: 'I need to file or prepare a form', emoji: '📝' },
  { id: 'understand_options', label: 'I need to understand my options', emoji: '❓' },
  { id: 'something_wrong', label: 'Something went wrong or I got a notice', emoji: '⚠️' },
  { id: 'plan_green_card', label: 'I want to plan my path to a green card', emoji: '💼' },
  { id: 'learn', label: 'I just want to learn how this all works', emoji: '🔍' },
];

export const MAX_GOALS = 3;

export const getGoalLabel = (id: string): string =>
  PRIMARY_GOALS.find((g) => g.id === id)?.label ?? id;
