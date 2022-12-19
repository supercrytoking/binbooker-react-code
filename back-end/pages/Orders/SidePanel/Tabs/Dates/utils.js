//returning [0,6] means they are closed sunday,saturday
export function getClosedDaysOfWeek(user) {
  const closedDays = [];

  if (user.maxJobsSunday === 0) {
    closedDays.push(0);
  }
  if (user.maxJobsMonday === 0) {
    closedDays.push(1);
  }

  if (user.maxJobsTuesday === 0) {
    closedDays.push(2);
  }

  if (user.maxJobsWednesday === 0) {
    closedDays.push(3);
  }

  if (user.maxJobsThursday === 0) {
    closedDays.push(4);
  }

  if (user.maxJobsFriday === 0) {
    closedDays.push(5);
  }

  if (user.maxJobsSaturday === 0) {
    closedDays.push(6);
  }
  return closedDays;
}
