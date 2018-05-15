import { getConnectedFormUrl } from './getConnectedFormUrl';
import { getStartDate } from './dates';

function getAllEmails() {
  const allReminderData = SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName('Reminder')
    .getDataRange();

  return allReminderData
    .offset(3, 0, allReminderData.getNumRows() - 3, 1)
    .getValues()
    .map(value => value[0])
    .filter(value => value.length > 0)
    .reduce((acc, value) => [...acc, ...value.split(', ')], []); // allow multiple emails in one cell
}

function getConnectedForm() {
  return FormApp.openByUrl(getConnectedFormUrl());
}

function getThisF2fResponses() {
  return getConnectedForm().getResponses(getStartDate());
}

function stripOutDomainExtension(email) {
  return email
    .split('.')
    .slice(0, -1)
    .join('.');
}

function getEmailsThatResponded() {
  return getThisF2fResponses().map(response => response.getRespondentEmail());
}

export function getEmailsThatDidNotRespond() {
  return getAllEmails().filter(email => {
    const respondedWithoutDomain = getEmailsThatResponded().map(emailAddress =>
      stripOutDomainExtension(emailAddress)
    );
    return respondedWithoutDomain.indexOf(stripOutDomainExtension(email)) < 0;
  });
}
