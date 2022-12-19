export const getNumberOfSlotsOnActiveDay = (user, dayOfWeek) => {
  switch (dayOfWeek) {
    case "Sunday":
      return user.maxJobsSunday;
    case "Monday":
      return user.maxJobsMonday;
    case "Tuesday":
      return user.maxJobsTuesday;
    case "Wednesday":
      return user.maxJobsWednesday;
    case "Thursday":
      return user.maxJobsThursday;
    case "Friday":
      return user.maxJobsFriday;
    case "Saturday":
      return user.maxJobsSaturday;
    case "Sunday":
      return user.maxJobsSunday;
  }
};
