const toFormResponseUrl = (rawUrl) => {
  if (!rawUrl) return '';

  let parsed;
  try {
    parsed = new URL(rawUrl);
  } catch (err) {
    throw new Error('Invalid Google Form URL.');
  }

  if (parsed.hostname === 'forms.gle') {
    throw new Error('Use the full docs.google.com form URL, not forms.gle short links.');
  }

  const path = parsed.pathname;

  if (path.includes('/formResponse')) {
    return `${parsed.origin}${path}`;
  }

  if (path.includes('/viewform')) {
    return `${parsed.origin}${path.replace('/viewform', '/formResponse')}`;
  }

  // Handles uncommon variants like /forms/d/e/<id>/ without viewform suffix.
  const match = path.match(/\/forms\/d\/e\/([^/]+)/);
  if (match?.[1]) {
    return `${parsed.origin}/forms/d/e/${match[1]}/formResponse`;
  }

  throw new Error('Could not derive formResponse URL from the provided Google Form URL.');
};

const postGoogleForm = async (action, fields) => {
  const body = new URLSearchParams();

  Object.entries(fields).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    body.append(key, String(value));
  });

  const submitUrl = toFormResponseUrl(action);

  await fetch(submitUrl, {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    body: body.toString(),
  });
};

export const submitWaitlist = async ({ email, source }) => {
  const action = import.meta.env.VITE_WAITLIST_FORM_ACTION;
  const emailEntry = import.meta.env.VITE_WAITLIST_EMAIL_ENTRY;
  const sourceEntry = import.meta.env.VITE_WAITLIST_SOURCE_ENTRY;

  if (!action || !emailEntry) {
    throw new Error('Waitlist Google Form is not configured.');
  }

  const fields = {
    [emailEntry]: email,
  };

  if (sourceEntry) fields[sourceEntry] = source;
 console.log(fields)
  await postGoogleForm(action, fields);
};

export const submitPartnership = async ({ name, org, email, types, other, source }) => {
  const action = import.meta.env.VITE_PARTNER_FORM_ACTION;
  const nameEntry = import.meta.env.VITE_PARTNER_NAME_ENTRY;
  const orgEntry = import.meta.env.VITE_PARTNER_ORG_ENTRY;
  const emailEntry = import.meta.env.VITE_PARTNER_EMAIL_ENTRY;
  const typesEntry = import.meta.env.VITE_PARTNER_TYPES_ENTRY;
  const otherEntry = import.meta.env.VITE_PARTNER_OTHER_ENTRY;
  const sourceEntry = import.meta.env.VITE_PARTNER_SOURCE_ENTRY;

  if (!action || !nameEntry || !emailEntry) {
    throw new Error('Partnership Google Form is not configured.');
  }

  const fields = {
    [nameEntry]: name,
    [emailEntry]: email,
  };

  if (orgEntry) fields[orgEntry] = org;
  if (typesEntry) fields[typesEntry] = Array.isArray(types) ? types.join(', ') : types;
  if (otherEntry) fields[otherEntry] = other;
  if (sourceEntry) fields[sourceEntry] = source;

  await postGoogleForm(action, fields);
};
