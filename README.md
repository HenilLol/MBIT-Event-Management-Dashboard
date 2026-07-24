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

(8) Smart Event Sorting

Users can sort events based on different criteria:

- Nearest upcoming events
- Most interested events
- Recently added events
- Events the user has marked as interested

Sorting works together with the existing search and category filters.

(9) Dynamic Event Status

Event statuses are calculated dynamically based on the event date and time.

Events can display statuses such as:

- Upcoming
- Happening Today
- Starting Soon
- Completed

(10) Enhanced My Interests Dashboard

The My Interests section provides a personalized overview of saved events, including:

- Total number of saved events
- Next upcoming saved event
- Saved event categories
- Upcoming events marked as interested

The dashboard updates dynamically whenever the user saves or removes an event.

(11)Event Conflict Detection

The application detects overlapping saved events.

If a user is interested in multiple events that occur at overlapping times, the application displays a warning so the user can identify potential scheduling conflicts.

(12) Share Events

Users can share event details directly from the event details modal.

The application uses the Web Share API when supported. On unsupported browsers, event details can be copied to the clipboard as a fallback.

Shared event information includes:

- Event title
- Category
- Date and time
- Venue
- Organizer

(13) Export Events to Calendar

Users can export an event as a `.ics` calendar file.

The generated calendar file contains the event's:

- Title
- Description
- Date
- Time
- Venue
- Organizer

This allows events to be imported into compatible calendar applications.

(14) Personalized Recommendations

The application provides event recommendations based on the user's saved interests.

For example, if a user saves multiple events from a particular category, other upcoming events from that category are prioritized in the recommendations.

Users without an interest history receive upcoming event recommendations as a fallback.

(15) Recently Viewed Events

The application tracks the user's five most recently viewed events.

Recently viewed events:

- Are stored locally
- Are displayed with the most recent event first
- Do not contain duplicates
- Persist after page refresh
- Can be opened through the normal event details modal

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
