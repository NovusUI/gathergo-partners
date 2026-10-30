export function eventActions(event, mode, now = Date.now()) {
  const ended = new Date(event.endDate).getTime() <= now;
  const actions = [];
  if (event.registrationType === 'foodbank') {
    actions.push({ id: 'meals', label: 'Claim a meal', disabled: false });
  } else if (event.registrationType === 'ticket') {
    const unavailable = event.eventTickets.length === 0;
    actions.push({
      id: 'tickets',
      label: ended ? 'Event ended' : unavailable ? 'Tickets unavailable' : event.eventTickets.some((ticket) => ticket.price > 0) ? 'Buy tickets' : 'Get tickets',
      disabled: ended || unavailable,
    });
  } else if (event.registrationType === 'registration') {
    actions.push({ id: 'registration', label: ended ? 'Event ended' : 'Register for event', disabled: ended });
  } else if (event.registrationType === 'volunteer') {
    const recruiting = new Date(event.startDate).getTime() > now;
    actions.push({ id: 'volunteer', label: recruiting ? 'Volunteer' : 'Recruitment closed', disabled: !recruiting });
  }
  if (event.donationsEnabled) actions.push({ id: 'donation', label: ended ? 'Donations closed' : 'Make a donation', disabled: ended });
  if (mode === 'live') actions.push({ id: 'live', label: 'Open event Live', disabled: false });
  return actions;
}
