const apTestLookup = {
    "2-D ART AND DESIGN": [
        { score: 4, courses: ["ART292"] },
    ],
    "3-D ART AND DESIGN": [
        { score: 4, courses: ["ART292"] },
    ],
    "AFRICAN AMERICAN STUDIES": [
        { score: 4, courses: ["GNED142"] },
        { score: 3, courses: ["AAAD000"] },
    ],
    "ART HISTORY": [
        { score: 4, courses: ["ARTH206"] },
    ],
    "BIOLOGY": [
        { score: 4, courses: ["BIO140", "BIO140L", "BIO150", "BIO150L"] },
        { score: 3, courses: ["BIO140", "BIO140L"] },
    ],
    "CALCULUS AB": [
        { score: 4, courses: ["MATH235"] },
    ],
    "CALCULUS AB SUBSCORE": [
        { score: 4, courses: ["MATH235"] },
    ],
    "CALCULUS BC": [
        { score: 4, courses: ["MATH235", "MATH236"] },
    ],
    "CHEMISTRY": [
        { score: 4, courses: ["CHEM131", "CHEM131L", "CHEM132", "CHEM132L"] },
        { score: 3, courses: ["CHEM120", "CHEM000"] },
    ],
    "CHINESE LANGUAGE AND CULTURE": [
        { score: 3, courses: ["CHIN231"] },
    ],
    "COMPARATIVE GOVERNMENT": [
        { score: 4, courses: ["POSC240"] },
    ],
    "COMPUTER SCIENCE A": [
        { score: 5, courses: ["CS149"] },
        { score: 3, courses: ["CS000"] },
    ],
    "COMPUTER SCIENCE PRINCIPLES": [
        { score: 3, courses: ["CS000"] },
    ],
    "DRAWING": [
        { score: 4, courses: ["ART292"] },
    ],
    "MICROECONOMICS": [
        { score: 4, courses: ["ECON201"] },
    ],
    "MACROECONOMICS": [
        { score: 4, courses: ["ECON200"] },
    ],
    "ENGLISH LANGUAGE AND COMPOSITION": [
        { score: 4, courses: ["WRTC103"] },
    ],
    "ENGLISH LITERATURE AND COMPOSITION": [
        { score: 5, courses: ["GNED123"] },
    ],
    "ENVIRONMENTAL SCIENCE": [
        { score: 4, courses: ["GEOL115", "ISCI104", "ISAT000"] },
        { score: 3, courses: ["ENVT101"] },
    ],
    "FRENCH LANGUAGE": [
        { score: 3, courses: ["FR231"] },
    ],
    "FRENCH LITERATURE": [
        { score: 3, courses: ["FR231"] },
    ],
    "HUMAN GEOGRAPHY": [
        { score: 3, courses: ["GEOG200"] },
    ],
    "GERMAN LANGUAGE": [
        { score: 3, courses: ["GER231"] },
    ],
    "UNITED STATES GOVERNMENT": [
        { score: 4, courses: ["POSC225"] },
    ],
    "EUROPEAN HISTORY": [
        { score: 3, courses: ["HIST000"] },
    ],
    "UNITED STATES HISTORY": [
        { score: 4, courses: ["HIST225"] },
    ],
    "WORLD HISTORY": [
        { score: 4, courses: ["HIST102"] },
    ],
    "ITALIAN LANGUAGE AND CULTURE": [
        { score: 3, courses: ["ITAL231"] },
    ],
    "LATIN VERGIL": [
        { score: 3, courses: ["LAT231"] },
    ],
    "MUSIC THEORY": [
        { score: 5, courses: ["MUS143"] },
    ],
    "PHYSICS B": [
        { score: 4, courses: ["PHYS140", "PHYS140L", "PHYS150", "PHYS150L"] },
        { score: 3, courses: ["PHYS140", "PHYS140L"] },
    ],
    "PHYSICS C: MECHANICS": [
        { score: 4, courses: ["PHYS240", "PHYS240L"] },
        { score: 3, courses: ["PHYS140", "PHYS140L"] },
    ],
    "PHYSICS C: ELECTRICITY AND MAGNETISM": [
        { score: 4, courses: ["PHYS250", "PHYS250L"] },
        { score: 3, courses: ["PHYS150", "PHYS150L"] },
    ],
    "PHYSICS 1": [
        { score: 3, courses: ["PHYS140", "PHYS140L"] },
    ],
    "PHYSICS 2": [
        { score: 3, courses: ["PHYS150", "PHYS150L"] },
    ],
    "PSYCHOLOGY": [
        { score: 4, courses: ["PSYC101"] },
    ],
    "SPANISH LANGUAGE": [
        { score: 3, courses: ["SPAN231"] },
    ],
    "SPANISH LITERATURE": [
        { score: 3, courses: ["SPAN231"] },
    ],
    "STATISTICS": [
        { score: 4, courses: ["MATH220", "ISAT251"] },
    ],
}

export function getExpectedCourses(test) {
    let equivalences = apTestLookup[test.name.toUpperCase()];
    if (equivalences) {
        for (const tier of equivalences) {
            if (test.score >= tier.score) {
                return tier.courses;
            }
        }
    } else {
        console.log(`No equivalences found for ${test.type} ${test.name}`);
    }
    return [];
}