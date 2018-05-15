import { getEmailTitle, getEmailBody } from './utils/email';
import { getConnectedFormUrl } from './utils/getConnectedFormUrl';
import { getEmailsThatDidNotRespond } from './utils/getEmailsThatDidNotRespond';
import { getF2fDate, getStartDate, isLastCall } from './utils/dates';

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
