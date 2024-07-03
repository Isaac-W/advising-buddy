// CHECKLIST

const genEdClasses = {
    "C1CT": [
        "BUS160",
        "EDUC102",
        "HIST150",
        "ISAT160",
        "PHIL120",
        "PHIL150",
        "SMAD150",
        "UNST300",
    ],
    "C1HC": [
        "SCOM121",
        "SCOM122",
        "SCOM123",
    ],
    "C1W": [
        "WRTC103",
    ],
    "C2HQC": [
        "AMST200",
        "ANTH205",
        "HIST101",
        "HIST102",
        "HUM250",
        "HUM251",
        "HUM252",
        "LAXC252",
        "PHIL101",
        "REL101",
        "REL102",
    ],
    "C2VPA": [
        "ART200",
        "ARTH205",
        "ARTH206",
        "DANC215",
        "MUS200",
        "MUS203",
        "MUS206",
        "THEA210",
    ],
    "C2L": [
        "ENG221",
        "ENG222",
        "ENG235",
        "ENG236",
        "ENG239",
        "ENG247",
        "ENG248",
        "ENG260",
        "HUM200",
    ],
    "C3QR": [
        "ISAT151",
        "ISAT251",
        "MATH103",
        "MATH105",
        "MATH110",
        "MATH205",
        "MATH220",
        "MATH229",
        "MATH231",
        "MATH235",
    ],
    "C3PP": [
        "ASTR120",
        "ASTR121",
        "CHEM120",
        "CHEM131",
        "ENVT101",
        "ISAT100",
        "ISAT112",
        "ISCI101",
        "ISCI172",
        "PHYS121",
        "PHYS140",
        "PHYS215",
        "PHYS240",
    ],
    "C3NS": [
        "ANTH196",
        "BIO103",
        "BIO140",
        "BIO270",
        "GEOL102",
        "GEOL110",
        "GEOL115",
        "GEOL210",
        "GEOL211",
        "ISAT113",
        "ISCI171",
    ],
    "C3L": [
        "ANTH196L",
        "BIO140L",
        "BIO270L",
        "CHEM131L",
        "GEOL110L",
        "GEOL115L",
        "ISAT113L",
        "ISCI104",
        "ISCI173",
        "PHYS140L",
        "PHYS240L",
    ],
    "C4AE": [
        "HIST225",
        "JUST225",
        "POSC225",
    ],
    "C4GE": [
        "AAAD200",
        "ANTH195",
        "ECON200",
        "GEOG200",
        "POSC200",
        "SOCI110",
    ],
    "C5WD": [
        "HTH100",
        "KIN100",
    ],
    "C5SD": [
        "PSYC101",
        "PSYC160",
        "SOCI140",
        "WGSS200",
    ],
}

const classLookup = {};
for (const area in genEdClasses) {
    for (const classId of genEdClasses[area]) {
        classLookup[classId] = area;
    }
}

const genEdAreas = {
    "Madison Foundations": ["C1CT", "C1HC", "C1W"],
    "Sociocultural and Wellness Area": ["C5WD", "C5SD"],
    "Arts and Humanities": ["C2HQC", "C2VPA", "C2L"],
    "American and Global Perspectives": ["C4AE", "C4GE"],
    "The Natural World": ["C3QR", "C3PP", "C3NS", "C3L"],
}

const areaLookup = {};
for (const area in genEdAreas) {
    for (const req of genEdAreas[area]) {
        areaLookup[req] = area;
    }
}

const requirementNames = {
    "C1CT": "Critical Thinking",
    "C1HC": "Human Communication",
    "C1W": "Writing",
    "C2HQC": "Human Questions and Contexts",
    "C2VPA": "Visual and Performing Arts",
    "C2L": "Literature",
    "C3QR": "Quantitative Reasoning",
    "C3PP": "Physical Principles",
    "C3NS": "Natural Systems",
    "C3L": "Lab Experience",
    "C4AE": "The American Experience",
    "C4GE": "The Global Experience",
    "C5WD": "Wellness Domain",
    "C5SD": "Sociocultural Domain",
}

const labReq = {
    "CHEM131": "CHEM131L",
    "PHYS140": "PHYS140L",
    "PHYS240": "PHYS240L",
    "BIO140": "BIO140L",
    "BIO270": "BIO270L",
    "GEOL110": "GEOL110L",
    "GEOL115": "GEOL115L",
    "ISAT113": "ISAT113L",
    "ANTH196": "ANTH196L",
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

function processChecklist(text, classes) {
    /*
    Classes has format:
    [{
        id: "CS149",
        name: "Introduction to Programming",
        credits: 3,
        section: "4",
        days: "MWF",
        start: "11:00",
        end: "11:50",
        location: "King Hall 248",
        region: "Skyline",
    }, ...]
    */

    let classIds = classes.map(c => c.id);

    let items = [];

    let aleks = getALEKS(text);
    let math = getMathPlacement(aleks);
    let transfer = getTransfer(text);
    
    items.push(checkCredits(text));
    items.push(checkAleks(aleks));
    items.push(checkMinor(text));
    items.push(checkCS(aleks, transfer, classIds));
    items.push(checkMath(aleks, math, transfer, classIds));
    items.push(checkFoundations(transfer, classIds));

    return items;
}

function getALEKS(text) {
    const pattern = /ALEKS Math Assessment Score (\d+)/;
    const match = text.match(pattern);
    return parseInt(match[1]);
}

function checkAleks(aleks) {
    let status = "☑️";
    let message = "";

    if (aleks > 60 && aleks < 66) {
        status = "👉";
        message = "Consider retaking ALEKS to get into CS 149";
    }

    return { "item": "ALEKS", "value": aleks, "status": status, "message": message };
}

function getTransfer(text) {
    const pattern = /(\w+)-\d+ units via (?:(?:transfer)|(?:test)) credit/gm;
    const matches = text.matchAll(pattern);
    let transfer = [];
    for (const match of matches) {
        transfer.push(match[1]);
    }
    return transfer;
}

function getCredits(text) {
    const pattern = /Total of (\d+) credit hours/;
    const match = text.match(pattern);
    return parseInt(match[1]);
}

function checkCredits(text) {
    const credits = getCredits(text);

    let status = "☑️";
    let message = "";

    if (credits < 12) {
        status = "🚫";
        message = "Need 12 credits to be full-time";
    } else if (credits < 14) {
        status = "⚠️";
        message = "Need ~15 credits to graduate on time";
    } else if (credits > 18) {
        status = "🚫";
        message = "Over credit limit";
    } else if (credits > 17) {
        status = "⚠️";
        message = "High credit load";
    }

    return { "item": "Credits", "value": credits, "status": status, "message": message };
}

function getMinor(text) {
    const pattern = /Minor: ?(.*)\n?Email/;
    const match = text.match(pattern);
    return match[1];
}

function checkMinor(text) {
    let minor = getMinor(text);
    
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

function findMissingCourses(required, classIds) {
    let missing = [];
    for (const course of required) {
        if (!classIds.some(c => c === course)) {
            missing.push(course);
        }
    }
    return missing;
}

function checkCS(aleks, transfer, classIds) {
    let status = "☑️";
    let course = "CS149";
    let message = "";

    if (aleks < 66) { // Unable to take CS 149
        status = "👉";
        course = "Need to take MATH course instead of CS149";
    } else { // Check for CS 149
        // Check transfer credit for CS 149
        if (transfer.includes("CS149")) {
            course = "CS159 + CS227";
            message = "Transfer credit for CS149";

            let needed = findMissingCourses(["CS159", "CS227"], classIds);
            if (needed.length > 0) {
                status = "🚫";
                course = needed.join(" + ");
                message = `Need to take; has credit for CS149`;
            }
        } else if (!classIds.some(c => c === "CS149")) {
            status = "🚫";
            message = "Need to take";
        }
    }

    return { "item": "CS Course", "value": course, "status": status, "message": message };
}

function checkMath(aleks, math, transfer, classIds) {
    let status = "☑️";
    let course = math.join(" + ");
    let message = ``;
    
    let needed = findMissingCourses(math, classIds);
    if (needed.length > 0) {
        // Check if has transfer credit for missing course(s)
        let missingAfterTransfer = needed.filter(m => !transfer.includes(m));
        
        if (missingAfterTransfer.length > 0) {
            course = missingAfterTransfer.join(" + ");

            if (aleks < 66) {
                status = "🚫";
                message = `Need to take`;
            } else {
                status = "⚠️";
                message = `Recommend taking to stay on track`;
            }
        } else {
            status = "☑️";
            message = `Has transfer credit`;
        }
    } else {
        // Double-check for duplicate courses based on transfer credit
        let duplicate = math.filter(m => transfer.includes(m));
        if (duplicate.length > 0) {
            status = "🚫";
            course = duplicate.join(" + ");
            message = `Duplicate transfer credit`;
        }
    }

    return { "item": `MATH Course`, "value": course, "status": status, "message": message };
}

function getGenEdCourses(requirements, classIds) {
    let result = {};
    for (const id of classIds) {
        console.log(id)
        if (id in classLookup) {
            let x = classLookup[id];
            if (requirements.includes(classLookup[id])) {
                result[classLookup[id]] = id;
            }
        }
    }
    return result;
}

function checkFoundations(transfer, classIds) {
    let status = "☑️";
    let courses = [];
    let message = "";

    let foundations = genEdAreas["Madison Foundations"];
    let taking = getGenEdCourses(foundations, classIds);
    let transferred = getGenEdCourses(foundations, transfer);
    
    courses = Object.entries(taking).map(([area, course]) => `${area}: ${course}`);
    if (courses.length === 0) {
        courses = ["none"];
    }

    let satisfied = {...taking, ...transferred};
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
        if (Object.keys(transferred).length > 0) {
            message = `Transfer credit for ${Object.keys(transferred).join(", ")}`;
        }
    }

    return { "item": "Madison Foundations", "value": courses.join(", "), "status": status, "message": message };
}
