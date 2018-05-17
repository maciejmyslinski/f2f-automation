const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function getF2fDate() {
  return SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName('Reminder')
    .getRange('B3')
    .getValue();
}

export function substractDays(date, numberOfDays) {
  return new Date(date.setDate(date.getDate() - numberOfDays));
}

export function getDeadline() {
  return (
    (getF2fDate().getDay() === 1 && substractDays(getF2fDate(), 3)) ||
    substractDays(getF2fDate(), 1)
  );
}

function dateDiffInDays(a, b) {
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / MS_PER_DAY);
}

export function daysUntilDeadline() {
  return dateDiffInDays(new Date(), getDeadline());
}

export function getRemainingDays() {
  return Math.ceil((getF2fDate() - new Date()) / MS_PER_DAY);
}

export function isLastCall() {
  return (
    getRemainingDays() === 1 ||
    (new Date().getDay() === 5 && getRemainingDays() === 3)
  );
}

export function getStartDate() {
  return substractDays(getF2fDate(), 7);
}
