import { getCourseCredits } from "./courses.mjs";

export async function parseCrm(file) {
    const rawData = await file.text();
    const crmData = JSON.parse(rawData);
    const crmAdvisees = crmData.advisees || [];
    const students = crmAdvisees.map(formatStudentData);
    students.sort((a, b) => a.fullName.localeCompare(b.fullName));

    return students;
}

function parseEid(email) {
    return email.split('@')[0];
}

function findMajor(studentPrograms) {
    const majors = studentPrograms.filter(program => program.description && program.description.includes("Major"));
    if (majors.length === 0) {
        return "Unknown"; // Default if no major found
    }

    if (majors.length > 1) {
        console.warn("Multiple majors found for student, using the first one:", majors);
        // TODO: Handle multiple majors more gracefully
    }

    return majors[0].name;
}

function findMinor(studentPrograms) {
    const minors = studentPrograms.filter(program => program.description && program.description.includes("Minor"));
    if (minors.length === 0) {
        return ""; // Default if no minor found
    }

    if (minors.length > 1) {
        console.warn("Multiple minors found for student, using the first one:", minors);
    }

    return minors[0].name;
}

function findAleksScore(tests) {
    const foundTests = tests.filter(test =>
        test.type === "Math Placement Test" && test.subject.startsWith("ALEKS")
    );

    if (foundTests.length === 0) {
        return 0;
    }

    return Math.max(...foundTests.map(test => test.score));
}

function formatSchedule(schedule) {
    const parseDays = (course) => {
        let days = "";
        if (course.Monday) days += "M";
        if (course.Tuesday) days += "TU";
        if (course.Wednesday) days += "W";
        if (course.Thursday) days += "TH";
        if (course.Friday) days += "F";
        if (course === "TUTH") days = "TT";
        return days;
    }

    const parseTime = (time) => {
        if (!time) return ""; // Online classes may not have a time

        const match = time.match(/(\d{1,2}):(\d{2}) ([AP]M)/);
        if (!match) return time; // Return original if no match

        let hours = parseInt(match[1]);
        const minutes = match[2];
        const period = match[3];

        if (period === "PM" && hours < 12) {
            hours += 12; // Convert PM to 24-hour format
        }

        if (period === "AM" && hours === 12) {
            hours = 0; // Convert 12 AM to 0 hours
        }

        return `${hours.toString().padStart(2, '0')}:${minutes}`;
    };

    return schedule.map(course => {
        if (!course.Subject) {
            console.warn("Skipping course with no Subject:", course);
            return null; // Skip courses without a Subject
        }

        const courseId = course.Subject.replace("-", "");
        return {
            id: courseId.endsWith("H") ? courseId.slice(0, -1) : courseId,
            honors: courseId.endsWith("H"),
            full_id: courseId.replace("-", ""),
            name: course.DescName,
            credits: getCourseCredits(courseId),
            section: "", // TODO: get from CRM
            days: parseDays(course),
            start: parseTime(course.Start),
            end: parseTime(course.End),
            location: course.Location
        };
    }).filter(course => course !== null); // Filter out skipped courses
}

function formatAPTests(tests) {
    return tests
        .filter(test => test.type === "Advance Placement")
        .map(test => {
            return {
                type: "AP",
                name: test.subject,
                score: test.score,
            };
        });
}

function getTotalCredits(formattedSchedule) {
    // Get unique course IDs from the schedule
    const seenCourses = new Set();
    let totalCredits = 0;

    formattedSchedule.forEach(course => {
        if (!seenCourses.has(course.id)) {
            seenCourses.add(course.id);
            totalCredits += course.credits || 0;
        }
    });

    return totalCredits;
}

function formatStudentData(student) {
    const formatted = {
        id: student.studentId,
        eid: parseEid(student.email),
        preferredName: student.firstName,
        firstName: student.firstName,
        lastName: student.lastName,
        fullName: student.fullName,
        email: student.email,
        major: findMajor(student.studentPrograms),
        minor: findMinor(student.studentPrograms),
        aleks: findAleksScore(student.testScores),
        transfer: [], // TODO: Determine transfer credits
        tests: formatAPTests(student.testScores),
    };

    // Parse schedule
    formatted.schedule = formatSchedule(student.classSchedule);
    formatted.credits = getTotalCredits(formatted.schedule);

    return formatted;
}