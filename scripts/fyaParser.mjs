import * as pdfjs from "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs";
pdfjs.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs";

export async function parsePdf(file) {
    const pdfData = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument(pdfData).promise;
    const pages = await getPages(pdf);
    const students = pages.map(parseStudentData);
    return students;
}

async function getPages(pdf) {
    const pages = [];
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        pages.push(await getText(page));
    }
    return pages;
}

async function getText(page) {
    const textContent = await page.getTextContent();
    const textBoxes = getTextBoxes(textContent);

    const lines = [];
    let lastItem = null;

    for (let item of textBoxes) {
        if (!lastItem || lastItem.hasEOL || item.top < lastItem.bottom) {
            lines.push(item.text);
        } else {
            lines[lines.length - 1] += item.text;
        }

        lastItem = item;
    }

    return lines.filter(line => line.trim().length > 0); // Remove empty lines
}

function getTextBoxes(textContent) {
    const textBoxes = [];
    
    for (let item of textContent.items) {
        const x = item.transform[4];
        const y = item.transform[5];
        const width = item.width;
        const height = item.height;
        textBoxes.push({
            text: item.str,
            x,
            y,
            width,
            height,
            top: y + height,
            right: x + width,
            bottom: y,
            left: x,
            hasEOL: item.hasEOL,
        });
    }

    return sortTextBoxes(textBoxes);
}

function sortTextBoxes(textBoxes) {
    return textBoxes.sort((a, b) => {
        if (a.top >= b.bottom && a.bottom <= b.top) { // Are they on the same line?
            return a.x - b.x; // Sort left to right
        }
        return b.y - a.y; // Sort top to bottom
    });
}

function parseStudentData(page) {
    const text = page.join("\n");
    const student = {};

    student.id = parseId(text);
    student.eid = parseEid(text);
    [student.firstName, student.lastName] = parseName(text);
    student.preferredName = parsePreferredName(text);
    student.schedule = parseClasses(text);
    student.aleks = parseAleks(text);
    student.credits = parseCredits(text);
    student.minor = parseMinor(text);
    student.transfer = parseTransferCredits(text);
    student.ap = parseApTests(text);
    
    // Build additional student data
    student.email = `${student.eid}@dukes.jmu.edu`;
    student.fullName = `${student.firstName} ${student.lastName}`;
    student.major = "Computer Science"; // Hardcoded
    student.classList = student.schedule.map(c => c.id)
        .filter((value, index, self) => self.indexOf(value) === index); // Only keep unique class IDs

    return student;
}

function parseId(text) {
    const pattern = /(\d+) Advisor/;
    const match = text.match(pattern);
    return parseInt(match[1]);
}

function parseEid(text) {
    const pattern = /Email: (.+)@/;
    const match = text.match(pattern);
    return match[1];
}

function parseName(text) {
    const pattern = /Student: ([^0-9,]+),([^0-9]+)/;
    const match = text.match(pattern);
    return [
        match[2].trim(),
        match[1].trim(),
    ];
}

function parsePreferredName(text) {
    const pattern = /Preferred name: (.+) Major/;
    const match = text.match(pattern);
    return match[1].trim();
}

function parseClasses(text) {
    const pattern = /(?<id>\w+)-0*(?<section>\w+)-(?<name>.+?) (?<credits>\d+) (?<days>\w*) ?(?<start>[0-9.]*)-(?<end>[0-9.]*) ?(?<location>.*)/gm;
    const matches = [...text.matchAll(pattern)];
    return matches.map(match => buildClassData(match.groups));
}

function buildClassData(parsed) {
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
    }
    return classData;
}

function parseAleks(text) {
    const pattern = /ALEKS Math Assessment Score (\d+)/;
    const match = text.match(pattern);
    return parseInt(match[1]);
}

function parseCredits(text) {
    const pattern = /Total of (\d+) credit hours/;
    const match = text.match(pattern);
    return parseInt(match[1]);
}

function parseMinor(text) {
    const pattern = /Minor: ?(.*)/;
    const match = text.match(pattern);
    return match[1];
}

function parseTransferCredits(text) {
    const pattern = /(\w+)-\d+ units via (?:(?:transfer)|(?:test)) credit/gm;
    const matches = [...text.matchAll(pattern)];
    return matches.map(match => match[1]);
}

function parseApTests(text) {
    const pattern = /(AP .+) (\d+)/gm;
    const matches = [...text.matchAll(pattern)];
    return matches.map(match => {
        return {
            test: match[1],
            score: match[2],
        };
    });
}
