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

const testCredit = {
    "AP 2-D ART AND DESIGN": [
        { score: 4, courses: ["ART292"] },
    ],
    "AP 3-D ART AND DESIGN": [
        { score: 4, courses: ["ART292"] },
    ],
    "AP AFRICAN AMERICAN STUDIES": [
        { score: 4, courses: ["GNED142"] },
        { score: 3, courses: ["AAAD000"] },
    ],
    "AP ART HISTORY": [
        { score: 4, courses: ["ARTH206"] },
    ],
    "AP BIOLOGY": [
        { score: 4, courses: ["BIO140", "BIO140L", "BIO150", "BIO150L"] },
        { score: 3, courses: ["BIO140", "BIO140L"] },
    ],
    "AP CALCULUS AB": [
        { score: 4, courses: ["MATH235"] },
    ],
    "AP CALCULUS AB SUBSCORE": [
        { score: 4, courses: ["MATH235"] },
    ],
    "AP CALCULUS BC": [
        { score: 4, courses: ["MATH235", "MATH236"] },
    ],
    "AP CHEMISTRY": [
        { score: 4, courses: ["CHEM131", "CHEM131L", "CHEM132", "CHEM132L"] },
        { score: 3, courses: ["CHEM120", "CHEM000"] },
    ],
    "AP CHINESE LANGUAGE AND CULTURE": [
        { score: 3, courses: ["CHIN231"] },
    ],
    "AP COMPARATIVE GOVERNMENT": [
        { score: 4, courses: ["POSC240"] },
    ],
    "AP COMPUTER SCIENCE A": [
        { score: 5, courses: ["CS149"] },
        { score: 3, courses: ["CS000"] },
    ],
    "AP COMPUTER SCIENCE PRINCIPLES": [
        { score: 3, courses: ["CS000"] },
    ],
    "AP DRAWING": [
        { score: 4, courses: ["ART292"] },
    ],
    "AP MICROECONOMICS": [
        { score: 4, courses: ["ECON201"] },
    ],
    "AP MACROECONOMICS": [
        { score: 4, courses: ["ECON200"] },
    ],
    "AP ENGLISH LANGUAGE AND COMPOSITION": [
        { score: 4, courses: ["WRTC103"] },
    ],
    "AP ENGLISH LITERATURE AND COMPOSITION": [
        { score: 5, courses: ["GNED123"] },
    ],
    "AP ENVIRONMENTAL SCIENCE": [
        { score: 4, courses: ["GEOL115", "ISCI104", "ISAT000"] },
        { score: 3, courses: ["ENVT101"] },
    ],
    "AP FRENCH LANGUAGE": [
        { score: 3, courses: ["FR231"] },
    ],
    "AP FRENCH LITERATURE": [
        { score: 3, courses: ["FR231"] },
    ],
    "AP HUMAN GEOGRAPHY": [
        { score: 3, courses: ["GEOG200"] },
    ],
    "AP GERMAN LANGUAGE": [
        { score: 3, courses: ["GER231"] },
    ],
    "AP UNITED STATES GOVERNMENT": [
        { score: 4, courses: ["POSC225"] },
    ],
    "AP EUROPEAN HISTORY": [
        { score: 3, courses: ["HIST000"] },
    ],
    "AP UNITED STATES HISTORY": [
        { score: 4, courses: ["HIST225"] },
    ],
    "AP WORLD HISTORY": [
        { score: 4, courses: ["HIST102"] },
    ],
    "AP ITALIAN LANGUAGE AND CULTURE": [
        { score: 3, courses: ["ITAL231"] },
    ],
    "AP LATIN VERGIL": [
        { score: 3, courses: ["LAT231"] },
    ],
    "AP MUSIC THEORY": [
        { score: 5, courses: ["MUS143"] },
    ],
    "AP PHYSICS B": [
        { score: 4, courses: ["PHYS140", "PHYS140L", "PHYS150", "PHYS150L"] },
        { score: 3, courses: ["PHYS140", "PHYS140L"] },
    ],
    "AP PHYSICS C: MECHANICS": [
        { score: 4, courses: ["PHYS240", "PHYS240L"] },
        { score: 3, courses: ["PHYS140", "PHYS140L"] },
    ],
    "AP PHYSICS C: ELECTRICITY AND MAGNETISM": [
        { score: 4, courses: ["PHYS250", "PHYS250L"] },
        { score: 3, courses: ["PHYS150", "PHYS150L"] },
    ],
    "AP PHYSICS 1": [
        { score: 3, courses: ["PHYS140", "PHYS140L"] },
    ],
    "AP PHYSICS 2": [
        { score: 3, courses: ["PHYS150", "PHYS150L"] },
    ],
    "AP PSYCHOLOGY": [
        { score: 4, courses: ["PSYC101"] },
    ],
    "AP SPANISH LANGUAGE": [
        { score: 3, courses: ["SPAN231"] },
    ],
    "AP SPANISH LITERATURE": [
        { score: 3, courses: ["SPAN231"] },
    ],
    "AP STATISTICS": [
        { score: 4, courses: ["MATH220", "ISAT251"] },
    ],
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
    let ap = getAP(text);

    console.log(`Transfer Credit: ${transfer}`);
    console.log(`AP Credit: ${ap}`)
    transfer = transfer.concat(ap); // Merge transfer and AP credit

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

function getAP(text) {
    const pattern = /(?<test>AP .+) (?<score>\d+)/gm;
    const matches = text.matchAll(pattern);
    let courses = [];
    for (const match of matches) {
        let test = testCredit[match.groups.test.toUpperCase()];
        if (test) {
            for (const tier of test) {
                if (match.groups.score >= tier.score) {
                    courses = courses.concat(tier.courses);
                    break;
                }
            }
        } else {
            console.log(`Could not find ${match.groups.test}`)
        }
    }
    return courses;
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

function getSatisfiedCourses(required, classIds) {
    let satisfied = [];
    let missing = [];
    for (const course of required) {
        if (classIds.some(c => c === course)) {
            satisfied.push(course);
        } else {
            missing.push(course);
        }
    }
    return [satisfied, missing];
}

function checkCS(aleks, transfer, classIds) {
    let status = "☑️";
    let course = "none";
    let message = "";

    if (aleks < 66) {
        status = "👉";
        course = "Need to take MATH course instead of CS149";
    } else { // Check for CS 149
        if (transfer.includes("CS149")) { // Check transfer credit for CS 149
            let needed = getSatisfiedCourses(["CS159", "CS227"], classIds)[1];
            let taking = getSatisfiedCourses(["CS149", "CS159", "CS227"], classIds)[0];

            course = taking.length ? taking.join(", ") : "none";

            if (needed.length > 0) {
                status = "⚠️";
                message = `Need to take ${needed.join(" + ")}; has credit for CS149`;
            } else {
                message = "Has credit for CS149";
            }
        } else if (classIds.includes("CS149")) {
            course = "CS149";
        } else {
            status = "🚫";
            message = "Need to take CS149";
        }
    }

    return { "item": "CS Course", "value": course, "status": status, "message": message };
}

function checkMath(aleks, math, transfer, classIds) {
    let status = "☑️";
    let course = "none";
    let message = "";

    let taking = getSatisfiedCourses(["MATH155", "MATH231", "MATH199", "MATH235"], classIds)[0];
    course = taking.length ? taking.join(", ") : "none";

    let needed = getSatisfiedCourses(math, classIds)[1];
    let [transferred, remaining] = getSatisfiedCourses(needed, transfer); // Check if has transfer credit for missing course(s)
    needed = remaining;

    if (needed.length > 0) {
        if (aleks < 66) {
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
    let duplicate = math.filter(m => transfer.includes(m) && taking.includes(m));
    if (duplicate.length > 0) {
        status = "⚠️";
        message += (message ? "; " : "") + `Warning: duplicate transfer credit`;
    }

    return { "item": "MATH Course", "value": course, "status": status, "message": message };
}

function getGenEdCourses(requirements, classIds) {
    let result = {};
    for (const id of classIds) {
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

    // Determine courses currently taking
    courses = Object.entries(taking).map(([area, course]) => `${area}: ${course}`);
    if (courses.length === 0) {
        courses = ["none"];
    }

    // Combine taking and transferred courses
    let satisfied = { ...taking, ...transferred };
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
