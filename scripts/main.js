// EVENT HANDLERS

document.addEventListener('DOMContentLoaded', () => {
    // Hotkeys for input
    document.getElementById('input').addEventListener('keydown', (ev) => {
        if (ev.key === "Enter" && ev.ctrlKey || ev.key === "s" && ev.ctrlKey) {
            ev.preventDefault();
            document.getElementById('submit-btn').click();
        } else if (ev.key === "v" && ev.ctrlKey) {
            setTimeout(() => {
                document.getElementById('submit-btn').click();
            }, 0); // Use setTimeout to allow paste to complete
        }
    });

    // Clear button handler
    document.getElementById('clear-btn').addEventListener('click', (ev) => {
        // Hide schedule
        document.getElementById('results').hidden = true;

        // Clear input
        let input = document.getElementById('input');
        input.value = "";
        input.focus();
    });

    // Submit button handler
    document.getElementById('submit-btn').addEventListener('click', (ev) => {
        ev.preventDefault();
        document.getElementById('results').hidden = false;

        const input = document.getElementById('input').value;
        sessionStorage.setItem('input', input);

        // Get student name
        let name = input.match(namePattern);
        if (name) {
            let fullname = `${name.groups.first.trim()} ${name.groups.last.trim()}`;
            document.getElementById('schedule-title').textContent = `${fullname}`;
        } else {
            document.getElementById('schedule-title').textContent = "Schedule";
        }

        // Parse events
        const [allEvents, allClasses] = parseEvents(input);

        // Populate checklist items
        let checkItems = processChecklist(input, allClasses);
        
        let checklist = document.getElementById('checklist-items');
        checklist.innerHTML = "";
        for (const item of checkItems) {
            let li = document.createElement('li');
            
            let status = document.createElement('span');
            status.classList.add('checklist-status');
            status.textContent = item.status;
            li.appendChild(status);

            let itemText = document.createElement('span');
            itemText.classList.add('checklist-item');
            itemText.textContent = `${item.item}:`;
            li.appendChild(itemText);

            let value = document.createElement('span');
            value.classList.add('checklist-value');
            value.textContent = item.value;
            li.appendChild(value);

            if (item.message) {
                let message = document.createElement('span');
                message.classList.add('checklist-message');
                message.textContent = `(${item.message})`;
                li.appendChild(message);
            }

            checklist.appendChild(li);
        }

        // Create calendar
        const calendarEl = document.getElementById('calendar');
        const calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'timeGridWeek',
            editable: false,
            initialDate: startDate,
            hiddenDays: [0, 6],
            headerToolbar: {
                start: "",
                center: "",
                end: ""
            },
            slotMinTime: "08:00:00",
            slotMaxTime: "20:00:00",
            slotEventOverlap: false,
            dayHeaderFormat: { weekday: "long" },
            events: allEvents,
            eventContent: renderEvent,
        });
        calendar.render();

        window.scrollTo(0, document.getElementById('results').offsetTop - 10);
    });

    // Copy button handler
    document.getElementById('copy-btn').addEventListener('click', () => {
        let results = document.getElementById('schedule');
        let calendar = document.getElementById('calendar');
        html2canvas(results, {
            scale: 2,
            windowWidth: calendar.scrollWidth + 20,
        }).then(canvas => {
            // Copy to clipboard
            canvas.toBlob(blob => {
                navigator.clipboard.write([
                    new ClipboardItem({
                        'image/png': blob
                    })
                ]);
            });
        });
    });

    // Download button handler
    document.getElementById('download-btn').addEventListener('click', () => {
        let schedule = document.getElementById('schedule');
        let calendar = document.getElementById('calendar');
        html2canvas(schedule, {
            scale: 2,
            windowWidth: calendar.scrollWidth + 20,
        }).then(canvas => {
            // Save to png
            let imgData = canvas.toDataURL('image/png');

            let link = document.createElement('a');
            link.download = `${document.getElementById('schedule-title').textContent}.png`;
            link.href = imgData;
            link.click();
        });
    });

    // Load previous input
    let prevInput = sessionStorage.getItem('input');
    if (prevInput) {
        document.getElementById('input').value = prevInput;
    }
});

// Custom event rendering callback
function renderEvent(arg) {
    let event = arg.event;

    let container = document.createElement('div');
    container.classList.add('class-container');

    // Title and time
    let title = document.createElement('div');
    title.classList.add('class-title');
    title.textContent = event.title + " @ " + (event.extendedProps.displayTime ? event.extendedProps.displayTime : "Async");
    container.appendChild(title);

    // Description
    let description = document.createElement('div');
    description.classList.add('class-desc');
    description.textContent = toTitleCase(event.extendedProps.name);
    container.appendChild(description);

    // Location and walkability
    let miniContainer = document.createElement('div');
    miniContainer.style.display = "flex";
    miniContainer.style.flexDirection = "row";

    if (event.extendedProps.location === "Online") { // Don't show walkability for online classes
        miniContainer.textContent = "Online";
        miniContainer.classList.add('class-loc');
    } else {
        let walkability = document.createElement('span');
        walkability.classList.add('class-walk');
        walkability.textContent = event.extendedProps.walkability;
        miniContainer.appendChild(walkability);

        let location = document.createElement('span');
        location.classList.add('class-loc');
        location.textContent = `${toTitleCase(event.extendedProps.region)}: ${event.extendedProps.location}`;
        miniContainer.appendChild(location);
    }
    container.appendChild(miniContainer);

    return { domNodes: [container] };
}