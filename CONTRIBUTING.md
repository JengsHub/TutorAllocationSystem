# Contributing to this project - Gitlab repository management

*Note - this can also be found in Quality Assurance Plan present in the Google Drive*

## Implementing a change

When implementing a change, please do the following:
- Assign the issue or kanban task to yourself and move it to the Doing column
- Create a new branch (from master) to develop your changes in

When you have successfully implemented the change in your branch, create a merge/pull request which will then be reviewed by the Release Train Engineers.

## (Reporting/suggesting an issue)
#### Issue labelling conventions

Label issues based on whether they are:
- Bugs
- Feature requests
- Blockers (waiting on another issue’s completion before they can continue)

## Code review process
Due to the fluctuations in academic demands throughout the semester, pull requests will be reviewed as soon as possible (usually on a weekly basis) by RTEs.

The priority in code review is determining whether your solution works and whether it preserves continuity of the repository’s code/practices. Code that works but doesn’t assimilate well into the existing codebase will most likely not pass review* as it introduces a lot of unnecessary friction in development 

**Depending on the requirement, changing up a codebase may be required in some cases*

## Project conventions
#### Code styling conventions
To format code, use [Prettier for VSCode](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode). It saves a lot of time and energy in needing to follow a strict and consistent style guide. Please remember to use it as whitespace differences are picked up by Git and may result in unnecessarily complicated and unreadable commits.

#### Commit message conventions
When making commits, use a simplified version of [Angular's](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#commit-message-header) style of commit messages. Essentially, when making commits, use the following template for your commit message so it’s easier for everyone to understand exactly what you've done:

`<type>: <short summary>`

`<type>` describes the type of change you made. It can be one of the following (as seen in Angular's docs):

- build: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
- docs: Documentation only changes
- style: Feature and updates related to styling (not logic or behaviour)
- feat: A new feature
- fix: A bug fix
- perf: A code change that improves performance
- refactor: A code change that neither fixes a bug nor adds a feature
- test: Adding missing tests or correcting existing tests
- chore: Regular code maintenance


`<short summary>` provides a short description of the change you made. When writing this, make sure that you:
- use the imperative, present tense: "change" not "changed" nor "changes"
- don't capitalize the first letter
- don't include a dot (.) at the end
