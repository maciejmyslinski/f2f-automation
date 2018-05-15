import { isLastCall, getRemainingDays } from './dates';
import { getConnectedFormUrl } from './getConnectedFormUrl';

function getFirstName() {
  return SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName('Reminder')
    .getRange('B1')
    .getValue();
}

function getEmailTemplate() {
  return HtmlService.createTemplateFromFile('email-template');
}

function getLastName() {
  return SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName('Reminder')
    .getRange('B2')
    .getValue();
}

export function getEmailBody() {
  const emailTemplate = getEmailTemplate();
  emailTemplate.formUrl = getConnectedFormUrl();
  emailTemplate.remainingDays = getRemainingDays();
  emailTemplate.isLastCall = isLastCall();
  emailTemplate.firstName = getFirstName();
  return emailTemplate.evaluate().getContent();
}

export function getEmailTitle() {
  if (isLastCall()) {
    return `[LAST CHANCE]: ${getFirstName()} ${getLastName()} – Feedback Request, today EOD`;
  }
  return `${getFirstName()} ${getLastName()} – Feedback Request, closes in ${getRemainingDays()} days`;
}
