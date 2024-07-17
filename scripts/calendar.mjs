import { Calendar } from "https://cdn.skypack.dev/@fullcalendar/core@6.1.15";
import timeGridPlugin from "https://cdn.skypack.dev/@fullcalendar/timegrid@6.1.15";

const startDate = Date.parse("2024-01-01");

export function createCalendar(calendarEl) {
    const calendar = new Calendar(calendarEl, {
        plugins: [timeGridPlugin],
        initialView: 'timeGridWeek',
        editable: false,
        initialDate: startDate,
        hiddenDays: [0, 6],
        headerToolbar: {
            start: "",
            center: "",
            end: ""
        },
        height: "auto",
        slotMinTime: "08:00:00",
        slotMaxTime: "20:00:00",
        slotEventOverlap: false,
        dayHeaderFormat: { weekday: "long" },
        eventContent: renderEvent,
    });

    // Add custom extension properties/methods

    calendar.element = calendarEl;

    calendar.clearAllEvents = function () {
        const sources = this.getEventSources();
        for (const source of sources) {
            source.remove();
        }
    }

    calendar.displaySchedule = function (student) {
        this.clearAllEvents();

        const events = [];
        for (const course of student.schedule) {
            const newEvents = createEventsForCourse(course);
            events.push(...newEvents);
        }
        addWalkabilityToEvents(events);

        calendar.addEventSource(events);
    }

    calendar.render();
    return calendar;
}

// Converts a course into an array of FullCalendar events
function createEventsForCourse(course) {
    const event = {
        title: `${course.id} (Sec ${course.section})`,
    };

    // Check if event has no start time (all day/online)
    if (course.start === "" || course.start === course.end) {
        event.allDay = true;
    } else {
        event.startTime = course.start;
        event.endTime = course.end;
    }

    // Determine color based on location and days
    let color = "darkgreen"; // Default color
    if (course.location === "Online") {
        color = "dimgray"; // Online classes
    } else if (course.days in daysToColor) {
        color = daysToColor[course.days]; // Override color
    }
    event.color = color;

    // Instead of using recurrence, we'll just add the event multiple times (allows for location checks)
    const events = [];
    const days = daysToArray(course.days);
    const region = getRegion(course.location);

    for (const day of days) {
        let newEvent = {
            ...event,
            daysOfWeek: [day],
            extendedProps: {
                course,
                region,
                walkability: "❔",
            },
        };
        events.push(newEvent);
    }

    return events;
}

function toTitleCase(str) {
    return str.replace(
        /\w\w*/g,
        text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
    );
}

function lTrim(str, chars) {
    let start = 0;
    while (chars.includes(str[start])) {
        start++;
    }
    return str.slice(start);
}

// Custom event rendering callback
function renderEvent(arg) {
    const event = arg.event;
    
    const course = event.extendedProps.course;
    const region = event.extendedProps.region;
    const walkability = event.extendedProps.walkability;

    // Create container
    let container = document.createElement('div');
    container.classList.add('class-container');

    // Title and time
    let title = document.createElement('div');
    title.classList.add('class-title');
    const timeString = event.allDay ? "Async" : `${lTrim(course.start, "0")} - ${lTrim(course.end, "0")}`;
    title.textContent = `${event.title} @ ${timeString}`;
    container.appendChild(title);

    // Description
    let description = document.createElement('div');
    description.classList.add('class-desc');
    description.textContent = toTitleCase(course.name);
    container.appendChild(description);

    // Location and walkability
    let row = document.createElement('div');
    row.classList.add('class-row');

    if (course.location === "Online") { // Don't show walkability for online classes
        row.textContent = "Online";
        row.classList.add('class-loc');
    } else {
        let walkEl = document.createElement('span');
        walkEl.classList.add('class-walk');
        walkEl.textContent = walkability;
        row.appendChild(walkEl);

        let locationEl = document.createElement('span');
        locationEl.classList.add('class-loc');
        locationEl.textContent = toTitleCase(region) + (course.location ? `: ${course.location}` : "");
        row.appendChild(locationEl);
    }
    container.appendChild(row);

    return { domNodes: [container] };
}

// WALKABILITY

const campusRegion = {
    "bluestone": ["Alumnae", "Burruss", "Carrier", "Harrison", "Darcus", "Johnston", "Keezell", "Gabbin", "Miller", "Moody", "Roop", "Sheldon", "Wilson"],
    "w.bluestone": ["Anthony", "Cleveland", "Duke", "Forbes", "Music", "Grace"],
    "memorial": ["Memorial", "Studio", "International"],
    "n.campus": ["Health", "Madison", "Student"],
    "hillside": ["Grafton", "Union"],
    "lakeside": ["Godwin", "Plecker", "Showker", "Hartman", "Lakeview", "Bridgeforth"],
    "skyline": ["Engineering", "King", "Physics", "Bioscience", "Festival", "Rose"],
    "ridge": ["Convocation", "Recreation", "Jennings"],
    "online": ["Online"]
}

const timeEstimates = {
    "bluestone": {
        "bluestone": "✅",
        "w.bluestone": "✅",
        "memorial": "✅",
        "n.campus": "✅",
        "hillside": "✅",
        "lakeside": "✅",
        "skyline": "⚠️",
        "ridge": "⚠️",
        "online": "✅",
    },
    "w.bluestone": {
        "bluestone": "✅",
        "w.bluestone": "✅",
        "memorial": "✅",
        "n.campus": "✅",
        "hillside": "✅",
        "lakeside": "⚠️",
        "skyline": "⚠️",
        "ridge": "🚫",
        "online": "✅",
    },
    "memorial": {
        "bluestone": "✅",
        "w.bluestone": "✅",
        "memorial": "✅",
        "n.campus": "✅",
        "hillside": "✅",
        "lakeside": "🚫",
        "skyline": "🚫",
        "ridge": "🚫",
        "online": "✅",
    },
    "n.campus": {
        "bluestone": "✅",
        "w.bluestone": "✅",
        "memorial": "✅",
        "n.campus": "✅",
        "hillside": "✅",
        "lakeside": "⚠️",
        "skyline": "⚠️",
        "ridge": "⚠️",
        "online": "✅",
    },
    "hillside": {
        "bluestone": "✅",
        "w.bluestone": "✅",
        "memorial": "✅",
        "n.campus": "✅",
        "hillside": "✅",
        "lakeside": "✅",
        "skyline": "⚠️",
        "ridge": "⚠️",
        "online": "✅",
    },
    "lakeside": {
        "bluestone": "✅",
        "w.bluestone": "⚠️",
        "memorial": "🚫",
        "n.campus": "⚠️",
        "hillside": "✅",
        "lakeside": "✅",
        "skyline": "⚠️",
        "ridge": "⚠️",
        "online": "✅",
    },
    "skyline": {
        "bluestone": "⚠️",
        "w.bluestone": "⚠️",
        "memorial": "🚫",
        "n.campus": "⚠️",
        "hillside": "⚠️",
        "lakeside": "⚠️",
        "skyline": "✅",
        "ridge": "✅",
        "online": "✅",
    },
    "ridge": {
        "bluestone": "⚠️",
        "w.bluestone": "🚫",
        "memorial": "🚫",
        "n.campus": "⚠️",
        "hillside": "⚠️",
        "lakeside": "⚠️",
        "skyline": "✅",
        "ridge": "✅",
        "online": "✅",
    },
    "online": {
        "bluestone": "✅",
        "w.bluestone": "✅",
        "memorial": "✅",
        "n.campus": "✅",
        "hillside": "✅",
        "lakeside": "✅",
        "skyline": "✅",
        "ridge": "✅",
        "online": "✅",
    },
}

// Get region based on location
function getRegion(location) {
    for (const region in campusRegion) {
        for (const keyword of campusRegion[region]) {
            if (location.toLowerCase().includes(keyword.toLowerCase())) {
                return region;
            }
        }
    }
    return "unknown";
}

// Check if walking is possible between two locations
function canIGetThere(source, destination) {
    if (source === "unknown" || destination === "unknown") {
        return "❔";
    }
    return timeEstimates[source][destination];
}

function addWalkabilityToEvents(events) {
    for (let i = 0; i < 5; i++) {
        let dayEvents = getEventsByDay(events, i + 1);
        console.log(`Day ${i + 1}`);
        console.log(dayEvents);
        addWalkabilityForDay(dayEvents);
    }
}

function addWalkabilityForDay(day) {
    let prevLocation = "";
    let prevTime = "00:00";

    for (let event of day) {
        let location = event.extendedProps.region;

        // Check if start time is no more than 30 minutes after previous end time
        let startTime = event.startTime;
        if (startTime === "") {
            startTime = "00:00";
            console.log("Invalid start time!");
        }

        let timeDiff = (new Date(`2024-01-01T${startTime}:00`) - new Date(`2024-01-01T${prevTime}:00`)) / 60000;
        if (timeDiff > 30) {
            if (location === "unknown") {
                event.extendedProps.walkability = "❔";
            } else {
                event.extendedProps.walkability = "✅";
            }
        } else {
            console.log(`Checking walkability between ${prevLocation} and ${location}: ${canIGetThere(prevLocation, location)}`)
            event.extendedProps.walkability = canIGetThere(prevLocation, location);
        }

        prevLocation = location;
        prevTime = event.endTime;
    }
}

// EVENTS

const daysToColor = {
    "M": "firebrick",
    "TU": "firebrick",
    "W": "firebrick",
    "TH": "firebrick",
    "F": "firebrick",
    "MWF": "indigo",
    "TT": "purple",
    "MW": "darkgoldenrod",
    "WF": "darkgoldenrod",
    "MF": "darkgoldenrod",
}

function daysToArray(daysString) {
    if (daysString === "") {
        return [1]; // Online (display as Monday)
    }

    const pattern = /(M)?(T(?!H)U?)?(W)?(TH?)?(F)?/; // Match individual days
    const match = daysString.match(pattern);
    let days = [];
    for (let i = 1; i < match.length; i++) {
        if (match[i]) {
            days.push(i);
        }
    }
    return days;
}

// Get events by day of week (ignoring online/allDay classes), sorted by start time
function getEventsByDay(events, day) {
    return events.filter(event => event.daysOfWeek.includes(day) && !event.allDay).sort((a, b) => {
        return a.startTime.localeCompare(b.startTime);
    });
}

