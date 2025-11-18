# Advising Buddy

Created to facilitate first-year advising at James Madison University.

## Live Site

<https://isaac-w.github.io/advising-buddy/>

## Student Data Format

This is an example of the data parsed from the PDF file:

```json
{
    "id": 123456789,
    "eid": "lastsm",
    "preferredName": "Student",
    "firstName": "Student Middle",
    "lastName": "Last",
    "fullName": "Student Middle Last",
    "email": "lastsm@dukes.jmu.edu",
    "major": "Computer Science", // TODO: May have multiple majors
    "aleks": 95,
    "credits": 3, // Credits in the current term (deprecated)
    "minor": "HON - Min", // TODO: May have multiple minors
    "terms": [
        {
            "id": "1258", // Fall 2025
            "credits": 3,
            "schedule": [
                // Same format as "schedule" below, but only for this term
            ]
        }
    ],
    "schedule": [  // List of enrolled courses (deprecated)
        {
            "id": "CS149",
            "honors": false,
            "full_id": "CS149", // Includes H for honors
            "name": "INTRODUCTION TO PROGRAMMING",
            "credits": 3,
            "section": "2",
            "days": "MWF",
            "start": "10:20",
            "end": "11:10",
            "location": "King Hall 248"
        }
    ],
    "transfer": [ // List of awarded transfer credit
        {
            "id": "SPAN101",
            "reason": "test"
        },
        {
            "id": "WRTC103",
            "reason": "transfer"
        }
    ],
    "tests": [
        {
            "type": "AP",
            "name": "Spanish Language",
            "score": "5"
        }
    ],
    "holds": [ // Optional: comes only from CRM
        {
            "name": "No initial registration",
            "department": "STUDENT HEALTH SERV",
            "reason": "Incomplete Health Records"
        }
    ]
}
```
