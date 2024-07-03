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
        document.getElementById('schedule').hidden = true;

        // Clear input
        let input = document.getElementById('input');
        input.value = "";
        input.focus();
    });

    // Submit button handler
    document.getElementById('submit-btn').addEventListener('click', (ev) => {
        ev.preventDefault();
        document.getElementById('schedule').hidden = false;

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

        // Check off items in checklist
        processChecklist(input);

        // Parse events
        const allEvents = parseEvents(input);
        addWalkabilityToList(allEvents);

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

        window.scrollTo(0, document.getElementById('schedule').offsetTop);
    });

    // Copy button handler
    document.getElementById('copy-btn').addEventListener('click', () => {
        // Hide copy button and top section
        let btn = document.getElementById('buttons');
        btn.hidden = true;

        let schedule = document.getElementById('schedule');
        let calendar = document.getElementById('calendar');
        html2canvas(schedule, {
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

            btn.hidden = false;
        });
    });

    // Download button handler
    document.getElementById('download-btn').addEventListener('click', () => {
        // Hide download button and top section
        let btn = document.getElementById('buttons');
        btn.hidden = true;

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

            btn.hidden = false;
        });
    });

    // Load previous input
    let prevInput = sessionStorage.getItem('input');
    if (prevInput) {
        document.getElementById('input').value = prevInput;
    }
});
