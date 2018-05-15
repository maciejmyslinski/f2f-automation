const MS_PER_DAY = 1000 * 60 * 60 * 24;

function getF2fDate() {
  return SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName('Reminder')
    .getRange('B3')
    .getValue();
}

function getAllEmails() {
  const allReminderData = SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName('Reminder')
    .getDataRange();

  return allReminderData
    .offset(3, 0, allReminderData.getNumRows() - 3, 1)
    .getValues()
    .map(value => value[0])
    .filter(value => value.length > 0);
}

function getConnectedFormUrl() {
  return SpreadsheetApp.getActiveSpreadsheet().getFormUrl();
}

function getConnectedForm() {
  return FormApp.openByUrl(getConnectedFormUrl());
}

function substractDays(date, numberOfDays) {
  return new Date(date.setDate(date.getDate() - numberOfDays));
}

function getStartDate() {
  return substractDays(getF2fDate(), 7);
}

function getDeadline() {
  return (
    (getF2fDate().getDay() === 1 && substractDays(getF2fDate(), 3)) ||
    substractDays(getF2fDate(), 1)
  );
}

function getThisF2fResponses() {
  return getConnectedForm().getResponses(getStartDate());
}

function getEmailsThatResponded() {
  return getThisF2fResponses().map(response => response.getRespondentEmail());
}

function stripOutDomainExtension(email) {
  return email
    .split('.')
    .slice(0, -1)
    .join('.');
}

function getEmailsThatDidNotRespond() {
  return getAllEmails().filter(email => {
    const respondedWithoutDomain = getEmailsThatResponded().map(emailAddress =>
      stripOutDomainExtension(emailAddress)
    );
    return respondedWithoutDomain.indexOf(stripOutDomainExtension(email)) < 0;
  });
}

function getRemainingDays() {
  return Math.ceil((getF2fDate() - new Date()) / MS_PER_DAY);
}

function isLastCall() {
  return (
    getRemainingDays() === 1 ||
    (new Date().getDay() === 5 && getRemainingDays() === 3)
  );
}

function amICollectingFeedbackToday() {
  const todaysWeekday = new Date().getDay();
  const f2fIsInUpcomingDays =
    getF2fDate() > Date.now() && getStartDate() < Date.now();
  const todayIsNotWeekend = todaysWeekday !== 6 && todaysWeekday !== 0;

  return (
    f2fIsInUpcomingDays &&
    todayIsNotWeekend &&
    (isLastCall() ||
      todaysWeekday === 1 ||
      todaysWeekday === 2 ||
      todaysWeekday === 3 ||
      todaysWeekday === 4 ||
      todaysWeekday === 5)
  );
}

function getEmailTemplate() {
  return HtmlService.createTemplateFromFile('email-template');
}

function getFirstName() {
  return SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName('Reminder')
    .getRange('B1')
    .getValue();
}

function getLastName() {
  return SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName('Reminder')
    .getRange('B2')
    .getValue();
}

function getEmailBody() {
  const emailTemplate = getEmailTemplate();
  emailTemplate.formUrl = getConnectedFormUrl();
  emailTemplate.remainingDays = getRemainingDays();
  emailTemplate.isLastCall = isLastCall();
  emailTemplate.firstName = getFirstName();
  return emailTemplate.evaluate().getContent();
}

function getEmailTitle() {
  if (isLastCall()) {
    return `[LAST CHANCE]: ${getFirstName()} ${getLastName()} - Feedback Request, today EOD`;
  }
  return `${getFirstName()} ${getLastName()} - Feedback Request, ${(
    getDeadline().getDate() + 100
  )
    .toString()
    .substring(1, 3)}.${(getDeadline().getMonth() + 101)
    .toString()
    .substring(1, 3)} EOD`;
}

function test() {
  Logger.log(getEmailTitle());
}

function sendFeedbackReminderToMe() {
  GmailApp.sendEmail(
    Session.getActiveUser().getEmail(),
    getEmailTitle(),
    getConnectedFormUrl(),
    {
      htmlBody: getEmailBody(),
    }
  );
}

function sendFeedbackReminder() {
  if (!amICollectingFeedbackToday()) return;
  GmailApp.sendEmail(
    getEmailsThatDidNotRespond()[0],
    getEmailTitle(),
    getConnectedFormUrl(),
    {
      htmlBody: getEmailBody(),
      bcc: getEmailsThatDidNotRespond()
        .slice(1)
        .join(','),
    }
  );
}
