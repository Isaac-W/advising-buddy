import toast from "../util/toast.mjs";
import Stateful from "../util/stateful.mjs";
import { genEdClassLookup } from "../data/geneds.mjs";

// Constants
const CREDIT_THRESHOLDS = {
    DANGER: 12,
    WARNING: 14,
    HIGH: 17
};

const TABLE_COLUMN_INDICES = {
    CHECKBOX: 0,
    NAME: 1,
    ID: 2,
    PROGRAM: 3,
    CREDITS: 4,
    CS: 5,
    MATH: 6,
    CT: 7,
    COMM: 8,
    WRITING: 9,
    GENEDS: 10,
    ELECTIVES: 11
};

// Data normalization helpers
function normalizeStudentData(student) {
    if (!student.terms || student.terms.length === 0) {
        return {
            ...student,
            terms: [{
                id: "current",
                credits: student.credits || 0,
                schedule: student.schedule || []
            }]
        };
    }
    return student;
}

function getAllTerms(students) {
    const termSet = new Set();
    students.forEach(student => {
        const normalized = normalizeStudentData(student);
        normalized.terms.forEach(term => termSet.add(term.id));
    });
    return Array.from(termSet).sort();
}

function getTermData(student, termId) {
    const normalized = normalizeStudentData(student);
    const term = normalized.terms.find(t => t.id === termId);
    return term || { id: termId, credits: 0, schedule: [] };
}

// Course categorization helpers
function getUniqueCourses(courses) {
    const seenCourses = new Set();
    const uniqueCourses = [];
    for (let course of courses) {
        if (!seenCourses.has(course.id)) {
            seenCourses.add(course.id);
            uniqueCourses.push(course);
        }
    }
    return uniqueCourses;
}

function categorizeCourses(courses) {
    const categories = {
        cs: courses.filter(c => c.id.startsWith("CS")),
        math: courses.filter(c => c.id.startsWith("MATH")),
        ct: courses.filter(c => genEdClassLookup[c.id] === "C1CT"),
        comm: courses.filter(c => genEdClassLookup[c.id] === "C1HC"),
        writing: courses.filter(c => genEdClassLookup[c.id] === "C1W"),
        genEd: courses.filter(c => genEdClassLookup[c.id] !== undefined &&
            !["C1CT", "C1HC", "C1W"].includes(genEdClassLookup[c.id]))
    };

    // Calculate remaining courses (electives)
    const categorized = new Set([
        ...categories.cs,
        ...categories.math,
        ...categories.ct,
        ...categories.comm,
        ...categories.writing,
        ...categories.genEd
    ]);
    categories.electives = courses.filter(c => !categorized.has(c));

    return categories;
}

// Cell creation functions
function createCheckboxCell(student) {
    const cell = document.createElement("td");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("student-checkbox");
    checkbox.setAttribute("aria-label", `Select ${student.fullName}`);
    checkbox.dataset.studentId = student.id;
    checkbox.dataset.studentEmail = student.email;
    checkbox.dataset.studentName = student.fullName;
    cell.appendChild(checkbox);
    return cell;
}

function createHoldIndicator(holds) {
    const holdIndicator = document.createElement("span");
    holdIndicator.textContent = "⛔";
    holdIndicator.classList.add("me-1");
    holdIndicator.style.cursor = "pointer";
    holdIndicator.setAttribute("data-bs-toggle", "popover");
    holdIndicator.setAttribute("data-bs-trigger", "hover");
    holdIndicator.setAttribute("tabindex", "0");
    holdIndicator.setAttribute("role", "button");

    const holdDetails = holds.map(
        hold => `<strong>${hold.name}</strong> (${hold.department}): ${hold.reason}`
    ).join("<br>");
    holdIndicator.setAttribute("data-bs-content", holdDetails);

    new bootstrap.Popover(holdIndicator, {
        html: true,
        placement: "top"
    });

    return holdIndicator;
}

function createNameCell(student) {
    const cell = document.createElement("td");
    const holds = student.holds || [];
    
    if (holds.length > 0) {
        cell.appendChild(createHoldIndicator(holds));
    }

    const nameLink = document.createElement("a");
    nameLink.href = `schedule.html?id=${student.id}`;
    nameLink.textContent = student.fullName;
    cell.appendChild(nameLink);
    
    return cell;
}

function createTextCell(text) {
    const cell = document.createElement("td");
    cell.textContent = text;
    return cell;
}

function createProgramCell(student) {
    const cell = document.createElement("td");
    cell.textContent = student.major;
    
    if (student.minor) {
        cell.appendChild(document.createElement("br"));
        const minorLabel = document.createElement("strong");
        minorLabel.textContent = "Minor: ";
        cell.appendChild(minorLabel);
        const minorText = document.createElement("span");
        minorText.textContent = student.minor;
        cell.appendChild(minorText);
    }
    
    return cell;
}

function createCreditsCell(totalCredits, row) {
    const cell = document.createElement("td");
    cell.textContent = totalCredits;

    if (totalCredits === 0) {
        row.classList.add("table-danger");
    } else if (totalCredits < CREDIT_THRESHOLDS.DANGER) {
        cell.classList.add("table-danger");
    } else if (totalCredits < CREDIT_THRESHOLDS.WARNING) {
        cell.classList.add("table-warning");
    } else if (totalCredits >= CREDIT_THRESHOLDS.HIGH) {
        cell.classList.add("table-primary");
    }

    return cell;
}

function createCourseListCell(courses) {
    const cell = document.createElement("td");
    cell.textContent = courses.length > 0 ? courses.map(c => c.full_id).join(", ") : "";
    return cell;
}

function applyCourseHighlighting(csCell, mathCell, csCourses, mathCourses) {
    if (csCell.textContent.includes("CS")) {
        csCell.classList.add("table-success");
    }

    if (mathCell.textContent.includes("MATH155") || mathCell.textContent.includes("MATH199")) {
        mathCell.classList.add("table-info");
    }

    if (csCourses.length === 0 && mathCourses.length === 0) {
        csCell.classList.add("table-danger");
        mathCell.classList.add("table-danger");
    }
}

// Main table population
function createStudentRow(student, termId) {
    const termData = getTermData(student, termId);
    const row = document.createElement("tr");

    // Get unique courses and calculate credits
    let courses = termData.schedule.filter(c => c.full_id);
    courses = getUniqueCourses(courses);
    const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);

    // Categorize courses
    const categorized = categorizeCourses(courses);

    // Build row cells
    row.appendChild(createCheckboxCell(student));
    row.appendChild(createNameCell(student));
    row.appendChild(createTextCell(student.id));
    row.appendChild(createProgramCell(student));
    row.appendChild(createCreditsCell(totalCredits, row));

    // Major courses
    const csCell = createCourseListCell(categorized.cs);
    const mathCell = createCourseListCell(categorized.math);
    row.appendChild(csCell);
    row.appendChild(mathCell);
    applyCourseHighlighting(csCell, mathCell, categorized.cs, categorized.math);

    // Madison Foundations
    row.appendChild(createCourseListCell(categorized.ct));
    row.appendChild(createCourseListCell(categorized.comm));
    row.appendChild(createCourseListCell(categorized.writing));

    // Other courses
    row.appendChild(createCourseListCell(categorized.genEd));
    row.appendChild(createCourseListCell(categorized.electives));

    return row;
}

// Selection helper functions
function getStudentCredits(checkbox) {
    const row = checkbox.closest("tr");
    return parseInt(row.children[TABLE_COLUMN_INDICES.CREDITS].textContent, 10);
}

function hasHoldIndicator(checkbox) {
    const row = checkbox.closest("tr");
    const nameCell = row.children[TABLE_COLUMN_INDICES.NAME];
    return nameCell.querySelector("span[data-bs-toggle='popover']") !== null;
}

function selectStudentsByCriteria(criteriaFn) {
    const checkboxes = document.querySelectorAll(".student-checkbox");
    checkboxes.forEach(cb => {
        cb.checked = criteriaFn(cb);
    });
}

// Main application class
export class AdviseesApp {
    constructor() {
        this.students = [];
        this.selectedTerm = "current";
        this.elements = {};
        this.state = null;
    }

    init() {
        this.loadStudents();
        this.cacheElements();
        this.setupTermSelector();
        this.setupEventListeners();
        this.initializeState();
        this.populateTable(this.selectedTerm);
    }

    loadStudents() {
        this.students = JSON.parse(localStorage.getItem("studentData") || "[]");
        if (this.students.length === 0) {
            toast("No student data found. Please upload student data.", "error");
            window.location.href = "index.html";
        }
    }

    cacheElements() {
        this.elements = {
            termSelect: document.getElementById("termSelect"),
            selectAllCheckbox: document.getElementById("select-all-checkbox"),
            emailSelectedBtn: document.getElementById("email-selected-btn"),
            copyEmailsBtn: document.getElementById("copy-emails-btn"),
            selectedCountSpan: document.getElementById("selected-count"),
            tableBody: document.querySelector("#studentsTable tbody"),
            studentsTable: document.getElementById("studentsTable"),
            selectAllBtn: document.getElementById("select-all-btn"),
            selectNoneBtn: document.getElementById("select-none-btn"),
            selectUnder12Btn: document.getElementById("select-under-12-btn"),
            select1213Btn: document.getElementById("select-12-13-btn"),
            selectOver17Btn: document.getElementById("select-over-17-btn"),
            selectHoldsBtn: document.getElementById("select-holds-btn")
        };
    }

    setupTermSelector() {
        const availableTerms = getAllTerms(this.students);
        this.elements.termSelect.innerHTML = "";
        
        availableTerms.forEach(termId => {
            const option = document.createElement("option");
            option.value = termId;
            option.textContent = termId === "current" ? "Current" : termId;
            this.elements.termSelect.appendChild(option);
        });

        this.selectedTerm = availableTerms[0] || "current";
        this.elements.termSelect.value = this.selectedTerm;
    }

    setupEventListeners() {
        // Term change
        this.elements.termSelect.addEventListener("change", (e) => {
            this.selectedTerm = e.target.value;
            this.populateTable(this.selectedTerm);
            this.updateSelectedCount();
        });

        // Checkbox changes
        this.elements.tableBody.addEventListener("change", (e) => {
            if (e.target.classList.contains("student-checkbox")) {
                this.updateSelectedCount();
            }
        });

        // Select all checkbox
        this.elements.selectAllCheckbox.addEventListener("change", () => {
            const checkboxes = document.querySelectorAll(".student-checkbox");
            checkboxes.forEach(cb => cb.checked = this.elements.selectAllCheckbox.checked);
            this.updateSelectedCount();
        });

        // Selection buttons
        this.elements.selectAllBtn.addEventListener("click", () => {
            const checkboxes = document.querySelectorAll(".student-checkbox");
            const allChecked = document.querySelectorAll(".student-checkbox:checked").length === checkboxes.length;
            checkboxes.forEach(cb => cb.checked = !allChecked);
            this.updateSelectedCount();
        });

        this.elements.selectNoneBtn.addEventListener("click", () => {
            selectStudentsByCriteria(() => false);
            this.updateSelectedCount();
        });

        this.elements.selectUnder12Btn.addEventListener("click", () => {
            selectStudentsByCriteria(cb => getStudentCredits(cb) < 12);
            this.updateSelectedCount();
        });

        this.elements.select1213Btn.addEventListener("click", () => {
            selectStudentsByCriteria(cb => {
                const credits = getStudentCredits(cb);
                return credits >= 12 && credits <= 13;
            });
            this.updateSelectedCount();
        });

        this.elements.selectOver17Btn.addEventListener("click", () => {
            selectStudentsByCriteria(cb => getStudentCredits(cb) >= 17);
            this.updateSelectedCount();
        });

        this.elements.selectHoldsBtn.addEventListener("click", () => {
            selectStudentsByCriteria(hasHoldIndicator);
            this.updateSelectedCount();
        });

        // Copy emails button
        this.elements.copyEmailsBtn.addEventListener("click", () => {
            const selectedCheckboxes = document.querySelectorAll(".student-checkbox:checked");
            const emails = Array.from(selectedCheckboxes).map(cb => cb.dataset.studentEmail);

            if (emails.length === 0) {
                toast("No students selected.", "error");
                return;
            }

            const emailString = emails.join(", ");
            navigator.clipboard.writeText(emailString)
                .then(() => {
                    toast(`Copied ${emails.length} email address${emails.length > 1 ? "es" : ""} to clipboard.`, "success");
                })
                .catch((err) => {
                    console.error(err);
                    toast("Failed to copy emails to clipboard.", "error");
                });
        });
    }

    initializeState() {
        this.state = new Stateful("details");
        this.state.initialize();
    }

    populateTable(termId) {
        this.elements.tableBody.innerHTML = "";

        for (let student of this.students) {
            const row = createStudentRow(student, termId);
            this.elements.tableBody.appendChild(row);
        }

        this.elements.studentsTable.classList.remove("d-none");
        this.updateSelectedCount();
    }

    updateSelectedCount() {
        const checkboxes = document.querySelectorAll(".student-checkbox");
        const selectedCheckboxes = document.querySelectorAll(".student-checkbox:checked");
        const checkedCount = selectedCheckboxes.length;
        
        this.elements.selectedCountSpan.textContent = checkedCount;
        this.elements.copyEmailsBtn.disabled = checkedCount === 0;

        // Update select all checkbox state
        this.elements.selectAllCheckbox.checked = checkedCount === checkboxes.length && checkboxes.length > 0;
        this.elements.selectAllCheckbox.indeterminate = checkedCount > 0 && checkedCount < checkboxes.length;

        // Update mailto link
        if (checkedCount === 0) {
            this.elements.emailSelectedBtn.classList.add("disabled");
            this.elements.emailSelectedBtn.href = "#";
        } else {
            this.elements.emailSelectedBtn.classList.remove("disabled");
            const emails = Array.from(selectedCheckboxes).map(cb => cb.dataset.studentEmail);
            const subject = "From your Academic Advisor";
            const body = `Hi everyone,\n\n\n\nBest,\n`;
            const mailtoLink = `mailto:?bcc=${emails.join(",")}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            this.elements.emailSelectedBtn.href = mailtoLink;
        }
    }
}
