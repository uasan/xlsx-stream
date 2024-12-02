const OFFSET_DAYS = 25569;
const MILLISECONDS_IN_ONE_DAY = 86400000;

export const getDate = date =>
  date.getTime() / MILLISECONDS_IN_ONE_DAY + OFFSET_DAYS;
