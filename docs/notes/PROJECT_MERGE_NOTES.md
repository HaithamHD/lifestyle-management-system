# Project Merge Notes

## Sources merged

1. `Projects.rar`
   - Laravel 12 project.
   - Existing migrations, models, repositories, observers, policies, tests, vendor packages, and API work.

2. `HAitham project.rar`
   - Original React homepage design source.
   - Static UI design pages and screenshots.
   - Backend documentation, code screenshots, Trello screenshots, and sequence diagram.

## Integration decisions

- Laravel remains the single application server.
- The production-ready frontend is served by one Blade shell and static CSS/JavaScript assets.
- The frontend communicates with Laravel REST endpoints using `fetch` and Sanctum bearer tokens.
- No Node process is required to run the integrated version.
- The original React and static design source remains in `frontend-source/` for reference and future development.

## Problems fixed

- Added working frontend-to-API authentication.
- Added complete user and admin navigation.
- Connected Tasks, Habits, Journal, Mood, Notifications, Profile, and Dashboard.
- Replaced the broken legacy Admin Blade dashboard with the integrated frontend Admin page.
- Removed missing admin partial and undefined admin route dependencies.
- Preserved `AuthorizesRequests` in the base Controller.
- Added admin middleware alias.
- Added/kept repository bindings, Task policy, Task observer, and notification strategy.
- Avoided local-date mismatch for habit tick by letting the API use its configured current date.
- Added a ready SQLite database and demo accounts.
- Added Windows start/reset scripts and MySQL fallback configuration.
