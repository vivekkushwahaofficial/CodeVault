# Changelog

All notable changes to CodeVault are documented in this file.

## [1.4.0] — Coding Activity Heatmap

### Added

- Added a GitHub-compatible coding activity heatmap.
- Added automatic generation of `.codevault/activity.svg`.
- Added 365-day coding activity tracking based on solved dates.
- Added deterministic activity levels based on daily solution counts.
- Added automatic solved-date tracking through the repository pipeline.
- Added automatic activity heatmap regeneration during repository updates.

### Activity Levels

- 0 solutions — No activity
- 1 solution — Light activity
- 2 solutions — Medium-light activity
- 3–4 solutions — Medium activity
- 5+ solutions — Highest activity

### Improved

- Improved repository portfolio generation.
- Improved coding activity statistics.
- Improved solved-date processing.
- Improved repository engine integration.
- Continued automatic README generation.
- Continued automatic platform, difficulty, language, pattern, and topic statistics.
- Continued automatic GitHub synchronization.

### Repository Data

CodeVault now maintains:

.codevault/
├── index.json
└── activity.svg

The activity heatmap is generated from the solution data stored in:

.codevault/index.json

### Production Validation

* Validated production extension build.
* Validated TypeScript and WXT compilation.
* Validated Git whitespace.
* Validated production manifest version.
* Validated GitHub activity heatmap generation.
* Promoted `develop` to `main`.
* Created the `v1.4.0` Git tag.

### Supported Platforms

* LeetCode
* GeeksforGeeks
* HackerRank

---

## [1.3.2] — Complete Difficulty Statistics

### Added

* Added Basic difficulty statistics.
* Added Basic difficulty support to the generated portfolio README.
* Added Basic difficulty progress tracking.
* Improved difficulty statistics across supported platforms.
* Added platform information to recently solved problems.

### Improved

* Improved automatic portfolio README generation.
* Improved difficulty progress statistics.
* Improved platform-aware portfolio statistics.
* Improved recently solved solution information.
* Continued automatic repository documentation updates.

### Difficulty Levels

CodeVault now tracks:

* Basic
* Easy
* Medium
* Hard

### Supported Platforms

* LeetCode
* GeeksforGeeks
* HackerRank

---

## [1.2.0] — HackerRank Integration

### Added

* Added HackerRank support.
* Added automatic HackerRank accepted-submission detection.
* Added HackerRank source-code extraction.
* Added HackerRank problem title and slug extraction.
* Added HackerRank programming-language detection.
* Added HackerRank difficulty detection.
* Added HackerRank problem-statement extraction.
* Added HackerRank solved-date tracking.
* Added automatic HackerRank GitHub synchronization.
* Added a HackerRank Main World XHR submission bridge.
* Added submission-processing and final `Accepted` status detection.
* Added duplicate-submission protection for HackerRank.

### Improved

* Continued GeeksforGeeks automatic solution synchronization.
* Continued LeetCode automatic solution synchronization.
* Improved multi-language solution organization.
* Maintained separate solution paths for different programming languages.

### Supported Platforms

* LeetCode
* GeeksforGeeks
* HackerRank

---

## [1.1.0] — GeeksforGeeks Support

### Added

* Added GeeksforGeeks support.
* Added GFG accepted-submission detection.
* Added complete GFG solution extraction.
* Added GFG metadata extraction.
* Added GFG problem-statement extraction.

### Supported Platforms

* LeetCode
* GeeksforGeeks

### Improved

* Preserved the existing LeetCode workflow.
* Tested the LeetCode end-to-end workflow.
* Tested the GFG end-to-end workflow.
* Tested GitHub synchronization.

---

## [1.0.0] — Initial Release

### Added

* Initial public release of CodeVault.
* Added automatic LeetCode accepted-submission detection.
* Added solution extraction for Java, C++, and Python.
* Added problem metadata extraction.
* Added problem-statement extraction.
* Added automatic README generation.
* Added GitHub OAuth authentication.
* Added automatic GitHub synchronization.
* Added duplicate-submission detection.

### Supported Platforms

* LeetCode

### Supported Languages

* Java
* C++
* Python

---

[1.4.0]: https://github.com/vivekkushwahaofficial/CodeVault/releases/tag/v1.4.0
[1.3.2]: https://github.com/vivekkushwahaofficial/CodeVault/releases/tag/v1.3.2
[1.2.0]: https://github.com/vivekkushwahaofficial/CodeVault/releases/tag/v1.2.0
[1.1.0]: https://github.com/vivekkushwahaofficial/CodeVault/releases/tag/v1.1.0
[1.0.0]: https://github.com/vivekkushwahaofficial/CodeVault/releases/tag/v1.0.0


### One important point

Your changelog is now correctly ordered:

v1.4.0  ← latest
v1.3.2
v1.2.0
v1.1.0
v1.0.0
````

