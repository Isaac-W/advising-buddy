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

// EVENTS

// const eventPattern = /(?<id>\w+)-0*(?<section>\d+)-(?<name>.+)\n(?<credits>\d+)\n(?<days>\w*)\n?(?<start>[0-9.]*)-(?<end>[0-9.]*)(?: |\n)(?<location>.+)/gm // Original, with only newlines
const eventPattern = /(?<id>\w+)-0*(?<section>\w+)-(?<name>.+?)(?:\n| )(?<credits>\d+)(?:\n| )(?<days>\w*)(?:\n| )?(?<start>[0-9.]*)-(?<end>[0-9.]*)(?:\n| )(?<location>.+)/gm; // Updated, with optional spaces
const namePattern = /Student: (?<last>[^0-9,]+),(?<first>[^0-9]+)/m;
const startDate = Date.parse("2024-01-01");

const daysToArray = {
    "M": [1],
    "TU": [2],
    "W": [3],
    "TH": [4],
    "F": [5],
    "MWF": [1, 3, 5],
    "MW": [1, 3],
    "WF": [3, 5],
    "MF": [1, 5],
    "TT": [2, 4],
    "": [1] // Online
}

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
    "": "dimgray" // Online
}

function toTitleCase(str) {
    return str.replace(
        /\w\w*/g,
        text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
    );
}

// Parse events from input text using RegEx
function parseEvents(text) {
    let events = [];
    let classes = [];

    let matches = text.matchAll(eventPattern);
    for (const match of matches) {
        const parsed = match.groups;
        const classData = getClassData(parsed);
        const newEvents = buildEvents(parsed);
        events = events.concat(newEvents);
        classes.push(classData);
    }

    addWalkabilityToList(events);
    return [events, classes];
}

function getClassData(parsed) {
    let classData = {
        id: parsed.id.endsWith("H") ? parsed.id.slice(0, -1) : parsed.id,
        honors: parsed.id.endsWith("H"),
        full_id: parsed.id,
        name: parsed.name,
        credits: parseInt(parsed.credits),
        section: parsed.section, // Section may not always be a number (e.g. "OP01")
        days: parsed.days,
        start: parsed.start.replace(".", ":"),
        end: parsed.end.replace(".", ":"),
        location: parsed.location,
        region: getRegion(parsed.location),
    }
    return classData;
}

// Build events from parsed RegEx data
function buildEvents(parsed) {
    let event = {}; // Base event object
    event.title = `${parsed.id} (Sec ${parsed.section})`;
    event.extendedProps = {
        id: parsed.id,
        location: parsed.location,
        region: getRegion(parsed.location),
        name: parsed.name,
        credits: parsed.credits,
        section: parsed.section,
        days: parsed.days,
    }

    // Check if event has no start time (all day/online)
    if (parsed.start === "") {
        event.allDay = true;
        event.extendedProps.displayTime = "";
    } else {
        event.startTime = parsed.start.replace(".", ":");
        event.endTime = parsed.end.replace(".", ":");
        event.extendedProps.displayTime = `${event.startTime} - ${event.endTime}`;
    }

    // Get days of week from parsed data
    let days = daysToArray[parsed.days];
    if (days === undefined) { // Manually parse days if unusual
        const dayPattern = /(?<M>M)?(?<TU>T(?!H)U?)?(?<W>W)?(?<TH>TH?)?(?<F>F)?/; // Match individual days

        let dayMatch = parsed.days.match(dayPattern);
        let individualDays = Object.keys(dayMatch.groups).filter(key => dayMatch.groups[key] !== undefined);
        days = individualDays.map(day => daysToArray[day]).flat();

        event.color = "darkgreen"; // Custom color for custom days
    } else {
        event.color = daysToColor[parsed.days]; // Set color based on days of week
    }

    // Override color for online classes
    if (event.extendedProps.location === "Online") {
        event.color = "dimgray";
    }

    // Instead of using recurrence, we'll just add the event multiple times (allows for location checks)
    let events = [];
    for (const day of days) {
        let newEvent = { ...event };
        newEvent.extendedProps = { ...event.extendedProps }; // Also deep copy extendedProps (for walkability checks)
        newEvent.daysOfWeek = [day];
        events.push(newEvent);
    }

    return events;
}

// Get events by day of week (ignoring online/allDay classes), sorted by start time
function getEventsByDay(events, day) {
    return events.filter(event => event.daysOfWeek.includes(day) && !event.allDay).sort((a, b) => {
        return a.startTime.localeCompare(b.startTime);
    });
}

function addWalkabilityToList(events) {
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
        // console.log(`Time diff: ${timeDiff} minutes`);
        if (timeDiff > 30) {
            event.extendedProps.walkability = "✅";
        } else {
            console.log(`Checking walkability between ${prevLocation} and ${location}: ${canIGetThere(prevLocation, location)}`)
            event.extendedProps.walkability = canIGetThere(prevLocation, location);
        }

        prevLocation = location;
        prevTime = event.endTime;
    }
}
