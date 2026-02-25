## Packages
date-fns | Formatting dates for activities and events
clsx | Conditional class names utility
tailwind-merge | Merging tailwind classes efficiently

## Notes
- ENTIRE application runs entirely in the browser using `localStorage`.
- NO backend API calls are made. TanStack Query is used to manage the async state of reading/writing to local storage for a realistic architecture.
- Initial mock data (Users, Activities, Registrations) is seeded automatically if the local storage is empty.
- Authentication is simulated by selecting a user profile from the mocked list.
