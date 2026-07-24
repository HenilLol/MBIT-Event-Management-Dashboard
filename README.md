----|MBIT Campus Events|----

A modern college event management dashboard designed to help students discover, explore, and keep track of campus events in one place.

----|Overview|----

College events are often scattered across different communication channels, making it difficult for students to discover upcoming workshops, hackathons, competitions, cultural programs, and other activities.

MBIT Campus Events provides a centralized interface where students can:

- Discover upcoming college events
- Search for events
- Filter events by category
- View detailed event information
- Mark events as interesting
- Set reminders for saved events
- Explore events through a calendar interface

----|Features|----

(1) Event Discovery

The application displays upcoming campus events with important information such as:

- Event name
- Category
- Date and time
- Venue
- Organizer
- Description
- Number of interested students

(2) Search

Users can search events using:

- Event title
- Category
- Organizer
- Venue

Search results update dynamically as the user types.

(3) Category Filtering

Events can be filtered by category:

- Technical
- Hackathon
- Workshop
- Cultural
- Sports
- Seminar
- Competition

(4) Event Details

Clicking on an event opens a detailed model containing:

- Full event description
- Date and time
- Location
- Organizer
- Event status
- Interest information

(5) My Interests

Users can save events they are interested in.

Saved events are displayed in the My Interests section.

(6) Reminders

Users can enable or disable reminders for events they have saved.

The current version stores reminder preferences locally in the browser.

(7) Calendar

The calendar provides a monthly view of campus events.

Dates containing events are visually marked. Selecting a date displays the events scheduled for that day.

----|Local Persistence|----

The application uses browser LocalStorage to preserve:

- Saved interests
- Reminder preferences

This allows user preferences to survive page refreshes.

----|Tech Stack|----

- HTML5
- CSS3
- Vanilla JavaScript
- Browser LocalStorage

No frontend framework or backend server is currently required.

The production version will be considered to have a dedicated backend with APIs.

----|Architecture|----

The application follows a client-side architecture:

```text
HTML
  ↓
CSS
  ↓
JavaScript Application Logic
  ↓
LocalStorage
