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
    "major": "Computer Science",
    "aleks": 95,
    "credits": 3,
    "minor": "HON - Min",
    "schedule": [  // List of enrolled courses
        {
            "id": "CS149",
            "honors": false,
            "full_id": "CS149",
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
}
```
