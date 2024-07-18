import { getExpectedCourses } from "./aptest.mjs";
import { getSatisfiedGenEdsByArea } from "./geneds.mjs";

export function populateChecklist(checklistEl, student) {
    let checkItems = processChecklist(student);

    checklistEl.innerHTML = "";
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

        checklistEl.appendChild(li);
    }
}

function processChecklist(student) {
    let classes = getClassSet(student);
    let transfer = getTransferSet(student);
    
    console.log("Transfer:", student.transfer);
    console.log("Tests:", student.tests);

    let items = [];
    items.pushOptional = function(item) {
        if (item.status !== "☑️") {
            this.push(item);
        }
    }

    items.push(checkCredits(student));
    items.push(checkAleks(student));
    items.pushOptional(checkMinor(student));
    items.push(checkCS(student, classes, transfer));
    items.push(checkMath(student, classes, transfer));
    items.push(checkFoundations(classes, transfer));
    items.pushOptional(checkDuplicates(classes, transfer));

    return items;
}

function getClassSet(student) {
    let classSet = new Set();
    student.schedule.forEach(course => classSet.add(course.id));
    return classSet;
}

function getTransferSet(student) {
    let combined = new Set();
    student.transfer.forEach(course => combined.add(course.id));
    
    for (const test of student.tests) {
        const courses = getExpectedCourses(test);
        courses.forEach(course => combined.add(course));
    }

    return combined;
}

const mathPlacement = {
    55: ["MATH155"],
    65: ["MATH231", "MATH199"],
    80: ["MATH231"],
    100: ["MATH235"],
}

function getMathPlacement(aleks) {
    for (const score in mathPlacement) {
        if (aleks <= score) {
            return mathPlacement[score];
        }
    }
    return [];

}

function findMissingCourses(requirements, classes) {
    let satisfied = [];
    let missing = [];
    for (const course of requirements) {
        if (classes.has(course)) {
            satisfied.push(course);
        } else {
            missing.push(course);
        }
    }
    return [satisfied, missing];
}

function checkAleks(student) {
    let status = "☑️";
    let message = "";

    if (student.aleks > 60 && student.aleks < 66) {
        status = "👉";
        message = "Consider retaking ALEKS to get into CS 149";
    }

    return { "item": "ALEKS", "value": student.aleks, "status": status, "message": message };
}

function checkCredits(student) {
    let status = "☑️";
    let message = "";

    if (student.credits < 12) {
        status = "🚫";
        message = "Need 12 credits to be full-time";
    } else if (student.credits < 14) {
        status = "⚠️";
        message = "Need ~15 credits to graduate on time";
    } else if (student.credits > 17) {
        status = "🚫";
        message = "Over credit limit";
    } else if (student.credits > 16) {
        status = "⚠️";
        message = "High credit load";
    }

    return { "item": "Credits", "value": student.credits, "status": status, "message": message };
}

function checkMinor(student) {
    let minor = student.minor;
    let status = "☑️";
    let message = "";

    if (minor === "") {
        minor = "none";
    } else {
        status = "👉";
        message = "Check minor requirements";
    }

    return { "item": "Minor", "value": minor, "status": status, "message": message };
}

function checkCS(student, classes, transfer) {
    let status = "☑️";
    let current = "none";
    let message = "";

    if (student.aleks < 66) {
        status = "👉";
        current = "Need to take MATH course instead of CS149";
    } else { // Check for CS 149
        if (transfer.has("CS149")) { // Check transfer credit for CS 149
            let needed = findMissingCourses(["CS159", "CS227"], classes)[1];
            let taking = findMissingCourses(["CS149", "CS159", "CS227"], classes)[0];

            current = taking.length ? taking.join(", ") : "none"; // Determine courses currently taking

            if (needed.length > 0) {
                status = "⚠️";
                message = `Need to take ${needed.join(" + ")}; has credit for CS149`;
            } else {
                message = "Has credit for CS149";
            }
        } else if (classes.has("CS149")) {
            status = "☑️";
            current = "CS149";
        } else {
            status = "🚫";
            message = "Need to take CS149";
        }
    }

    return { "item": "CS Course", "value": current, "status": status, "message": message };
}

function checkMath(student, classes, transfer) {
    let status = "☑️";
    let course = "none";
    let message = "";

    let taking = findMissingCourses(["MATH155", "MATH231", "MATH199", "MATH235"], classes)[0];
    course = taking.length ? taking.join(", ") : "none";
    
    let math = getMathPlacement(student.aleks);

    let needed = findMissingCourses(math, classes)[1];
    let [transferred, remaining] = findMissingCourses(needed, transfer); // Check if has transfer credit for missing course(s)
    needed = remaining;

    if (needed.length > 0) {
        if (student.aleks < 66) {
            status = "🚫";
            message = `Need to take ${needed.join(" + ")}`;
        } else {
            status = "⚠️";
            message = `Need to take ${needed.join(" + ")} to stay on track`;
        }
    } else {
        if (transferred.length > 0) {
            message = `Transfer credit for ${transferred.join(", ")}`;
        }
    }

    // Check for duplicate courses based on transfer credit
    let duplicate = math.filter(m => transfer.has(m) && taking.includes(m));
    if (duplicate.length > 0) {
        status = "⚠️";
        message += (message ? "; " : "") + `Warning: duplicate transfer credit`;
    }

    return { "item": "MATH Course", "value": course, "status": status, "message": message };
}

function checkFoundations(classes, transfer) {
    let status = "☑️";
    let courses = [];
    let message = "";

    let taking = getSatisfiedGenEdsByArea(classes, "C1");
    let satisfiedByTransfer = getSatisfiedGenEdsByArea(transfer, "C1");

    // Combine taking and transferred courses
    let satisfied = { ...taking, ...satisfiedByTransfer };
    let count = Object.keys(satisfied).length;

    if (count === 0) {
        status = "🚫";
        message = `Need to take Madison Foundations`;
    } else if (count === 1) {
        // Make sure progress is made towards C1CT or C1HC if only one course taken
        if ("C1W" in satisfied) {
            status = "🚫";
            message = `Need C1CT or C1HC to finish on-time`;
        }
    } else {
        if (Object.keys(satisfiedByTransfer).length > 0) {
            message = `Transfer credit for ${Object.keys(satisfiedByTransfer).join(", ")}`;
        }
    }
    
    // Make list of courses currently taking (for display)
    courses = Object.entries(taking).map(([area, course]) => `${area}: ${course}`);
    if (courses.length === 0) {
        courses = ["none"];
    }

    return { "item": "Madison Foundations", "value": courses.join(", "), "status": status, "message": message };
}

function checkDuplicates(classes, transfer) {
    let status = "☑️";
    let value = "none";
    let message = "";

    let duplicates = [];
    for (const course of classes) {
        if (transfer.has(course)) {
            duplicates.push(course);
        }
    }

    if (duplicates.length > 0) {
        status = "⚠️";
        value = duplicates.join(", ");
        message = "Check transfer report";
    }

    return { "item": "Duplicate Credit", "value": value, "status": status, "message": message };
}
