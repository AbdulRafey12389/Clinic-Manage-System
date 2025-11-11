export const validateDoctorForm = (form, isEdit = false) => {
  const errors = [];

  const {
    name,
    email,
    password,
    specialization,
    experience,
    degrees,
    bio,
    workingDays,
    day,
    from,
    to,
    slotDurationMinutes,
    fees,
  } = form;

  const validDays = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ];

  const timePattern = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i;

  if (!name.trim()) errors.push('Name is required');

  if (!email.trim()) errors.push('Email is required');
  else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(email))
    errors.push('Invalid email format');

  if (!isEdit) {
    if (!password.trim()) errors.push('Password is required');
    else if (password.length < 6)
      errors.push('Password must be at least 6 characters long');
  }

  if (!specialization.trim()) errors.push('Specialization is required');
  if (!experience.trim()) errors.push('Experience is required');
  if (!degrees.trim()) errors.push('Degrees are required');
  if (!bio.trim()) errors.push('Bio is required');

  if (!workingDays.trim()) errors.push('Working days are required');
  else {
    const daysArray = workingDays
      .split(',')
      .map((d) => d.trim().toLowerCase())
      .filter(Boolean);

    if (!daysArray.length)
      errors.push('Please enter at least one valid working day');
    else if (!daysArray.every((d) => validDays.includes(d)))
      errors.push('Working days must only contain valid weekdays (Mon–Sun)');
  }

  if (!day.trim()) errors.push('Schedule day is required');
  else if (!validDays.includes(day.trim().toLowerCase()))
    errors.push('Schedule day must be a valid weekday (Mon–Sun)');

  if (!from.trim()) errors.push('From time is required');
  else if (!timePattern.test(from))
    errors.push('From time must be in valid format (e.g. 09:00 AM)');

  if (!to.trim()) errors.push('To time is required');
  else if (!timePattern.test(to))
    errors.push('To time must be in valid format (e.g. 05:00 PM)');

  if (!slotDurationMinutes || slotDurationMinutes <= 0)
    errors.push('Slot duration must be greater than 0 minutes');

  if (!fees || fees <= 0)
    errors.push('Consultation fee must be greater than 0');

  return errors;
};
