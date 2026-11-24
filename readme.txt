--Readme document for Bianca Cataniag, cataniab@uci.edu, cataniab--

1. How many assignment points do you believe you completed (replace the *'s with your numbers)?

10/10
- 1/1 The ability to log overnight sleep
- 1/1 The ability to log sleepiness during the day
- 1/1 The ability to view these two categories of logged data
- 2/2 Either using a native device resource or backing up logged data
- 2/2 Following good principles of mobile design
- 2/2 Creating a compelling app
- 1/1 A readme and demo video which explains how these features were implemented and their design rationale

2. How long, in hours, did it take you to complete this assignment?
50 hours, including creating designs on Figma for the UI and setting up the work environment. I also spent a long time trying
to set up a simulator, but it never worked. I acknowledge that I should've started sooner on the project, but I got sick and never
bothered to ask for an extension.

3. What online resources did you consult when completing this assignment? (list specific URLs)
- Ionic Framework Documentation (https://ionicframework.com/docs)
- Capacitor Local Notifications Plugin Documentation (https://capacitorjs.com/docs/apis/local-notifications)
- Angular Documentation on Change Detection & Lifecycle Hooks

4. What classmates or other individuals did you consult as part of this assignment? What did you discuss?
N/A


5. Is there anything special we need to know in order to run your code?
I used a native feature (notifications), so make sure you can demo the code on a simulator.

--Aim for no more than two sentences for each of the following questions.--


6. Did you design your app with a particular type of user in mind? If so, whom?
Not necessarily. The UI is very simple, so it's suited for a wide range of ages.

7. Did you design your app specifically for iOS or Android, or both?
iOS.

8. How can a person log overnight sleep in your app? Why did you choose to support logging overnight sleep in this way?
Users can log overnight sleep by navigating to the sleep log view and submitting their sleep and wake times.
I chose this method as it was the most straightforward and got the most significant information.

9. How can a person log sleepiness during the day in your app? Why did you choose to support logging sleepiness in this way?
Users can log daytime sleepiness using an interactive modal component with a quick rating scale.
This allows users to record their current alertness instantly without interrupting their daily workflow.

10. How can a person view the data they logged in your app? Why did you choose to support viewing logged data in this way?
Users can view their history through structured logs and graphs that automatically sync and update using Angular change detection.
This keeps past logs organized and easily readable at a glance.

11. Which feature choose--using a native device resource, backing up logged data, or both?
Native device resource.

12. If you used a native device resource, what feature did you add? How does this feature change the app's experience for a user?
I integrated Capacitor Local Notifications to trigger daily tracking prompts and a test notification upon app launch.
This  encourages user engagement and habit-building by reminding them to log their sleep.


13. If you backed up logged data, where does it back up to?
N/A

14. How does your app implement or follow principles of good mobile design?
The app follows good mobile design by utilizing native-feeling Ionic UI components, touch-friendly button targets, responsive modal overlays,
and an accessible color pallette. It also ensures smooth state synchronization across shared services for a responsive mobile experience.