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

function processChecklist(text) {
    
}
