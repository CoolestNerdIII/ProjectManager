# Project Manager

The purpose of this project is to develop an open source tool to better manage projects in an Agile way.
This is my first true node application, with hopefully many more to come :)

## Todo List

 - [ ] Facebook oauth2
 - [ ] Twitter oauth2
 - [ ] Github Integration
 - [ ] Bitbucket Integration
 - [ ] Project Level Chat (Similar to Slack, Hipchat)

## Github/Bitbucket Integration
 - [ ] Store user credentials for logging in
 - [ ] Link a project to a git repository
 - [ ] Link Github/Bitbucket issues to issues Project Manager

## Project Structure
- Generic Todo List (based on Google Keep)
    - Create a new list
    - Add/Remove items to/from list
    - Mark items as completed
- Projects View
    - View Projects/Create New Project
    - View items in the backlog
    - Create/Complete sprints
    - Add items from backlog to sprint
    - Kanban based view
        - Customize panes
    - Project Level Chat (Slack/HipChat)
        - Implement Socket.io
        - Chat in different rooms based on topic
        - Create/Edit Rooms