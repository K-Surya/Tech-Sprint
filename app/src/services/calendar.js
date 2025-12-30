// Google Calendar API Integration
const CLIENT_ID = '962088146382-7sakavrun6ir2sb8dd48tkqkjbigp569.apps.googleusercontent.com';
const API_KEY = 'AIzaSyCxVzFshjwdhPmghgCpJrrEkbrmNwyfL4Q';
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/calendar.events';

let tokenClient;
let gapiInited = false;
let gisInited = false;

// Initialize Google API client
export const initializeGoogleCalendar = () => {
    return new Promise((resolve) => {
        // Load gapi script
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/api.js';
        script.onload = () => {
            window.gapi.load('client', async () => {
                await window.gapi.client.init({
                    apiKey: API_KEY,
                    discoveryDocs: [DISCOVERY_DOC],
                });
                gapiInited = true;
                console.log('✅ Google API client initialized');
                maybeEnableButtons(resolve);
            });
        };
        document.body.appendChild(script);

        // Load Google Identity Services
        const gisScript = document.createElement('script');
        gisScript.src = 'https://accounts.google.com/gsi/client';
        gisScript.onload = () => {
            tokenClient = window.google.accounts.oauth2.initTokenClient({
                client_id: CLIENT_ID,
                scope: SCOPES,
                callback: '', // defined later
            });
            gisInited = true;
            console.log('✅ Google Identity Services initialized');
            maybeEnableButtons(resolve);
        };
        document.body.appendChild(gisScript);
    });
};

function maybeEnableButtons(resolve) {
    if (gapiInited && gisInited) {
        console.log('✅ Google Calendar fully initialized');
        resolve(true);
    }
}

// Request calendar access from user
export const requestCalendarAccess = () => {
    return new Promise((resolve, reject) => {
        tokenClient.callback = async (resp) => {
            if (resp.error !== undefined) {
                console.error('❌ Authorization failed:', resp);
                reject(resp);
                return;
            }
            console.log('✅ Calendar access granted');
            resolve(true);
        };

        if (window.gapi.client.getToken() === null) {
            // Prompt the user to select a Google Account and ask for consent
            console.log('🔐 Requesting calendar access...');
            tokenClient.requestAccessToken({ prompt: 'consent' });
        } else {
            // Skip display of account chooser and consent dialog for an existing session.
            console.log('🔐 Using existing token...');
            tokenClient.requestAccessToken({ prompt: '' });
        }
    });
};

// Check if user is authorized
export const isCalendarAuthorized = () => {
    const authorized = window.gapi?.client?.getToken() !== null;
    console.log('Calendar authorization status:', authorized);
    return authorized;
};

// Sign out from Google Calendar
export const signOutCalendar = () => {
    const token = window.gapi.client.getToken();
    if (token !== null) {
        window.google.accounts.oauth2.revoke(token.access_token);
        window.gapi.client.setToken('');
        console.log('✅ Signed out from Google Calendar');
    }
};

// Create exam event in Google Calendar
export const createExamEvent = async (exam) => {
    try {
        console.log('📅 Creating calendar event for exam:', exam);

        // Check if gapi is loaded
        if (!window.gapi || !window.gapi.client || !window.gapi.client.calendar) {
            const error = 'Google Calendar API not loaded. Please refresh the page.';
            console.error('❌', error);
            throw new Error(error);
        }

        // Check if user is authorized
        const token = window.gapi.client.getToken();
        if (!token) {
            const error = 'Not authorized. Please connect to Google Calendar first.';
            console.error('❌', error);
            throw new Error(error);
        }

        console.log('✅ Authorization token present');

        // Format date as YYYY-MM-DD for all-day event
        const examDate = new Date(exam.examDate);
        const dateString = examDate.toISOString().split('T')[0];

        const event = {
            summary: `📚 ${exam.subjectName} Exam`,
            description: `Exam for ${exam.subjectName}\n\nAdded from Benchmate AI Study Platform`,
            start: {
                date: dateString, // All-day event (no time)
            },
            end: {
                date: dateString, // All-day event (no time)
            },
            reminders: {
                useDefault: false,
                overrides: [
                    { method: 'popup', minutes: 900 }, // 15 hours before (9 AM day before if exam is at midnight)
                    { method: 'email', minutes: 900 }, // Email reminder at 9 AM day before
                ],
            },
            colorId: '9', // Blue color for exams
        };

        console.log('📋 Event data prepared:', {
            summary: event.summary,
            date: dateString,
            type: 'All-day event'
        });

        console.log('🚀 Sending request to Google Calendar API...');
        const request = await window.gapi.client.calendar.events.insert({
            calendarId: 'primary',
            resource: event,
        });

        console.log('✅ Calendar event created successfully!');
        console.log('📌 Event ID:', request.result.id);
        console.log('🔗 Event link:', request.result.htmlLink);
        console.log('📅 View in calendar:', `https://calendar.google.com/calendar/r/eventedit/${request.result.id}`);

        // Show success message to user
        alert(`✅ Exam added to Google Calendar!\n\n${exam.subjectName} Exam\n${new Date(exam.examDate).toLocaleDateString()}\n\nCheck your Google Calendar to see it.`);

        return request.result.id; // Return the event ID
    } catch (error) {
        console.error('❌ Error creating calendar event:', error);
        console.error('Error details:', {
            message: error.message,
            status: error.status,
            result: error.result,
            body: error.body
        });
        throw error;
    }
};

// Delete exam event from Google Calendar
export const deleteExamEvent = async (eventId) => {
    try {
        console.log('🗑️ Deleting calendar event:', eventId);
        await window.gapi.client.calendar.events.delete({
            calendarId: 'primary',
            eventId: eventId,
        });
        console.log('✅ Calendar event deleted successfully');
        return true;
    } catch (error) {
        console.error('❌ Error deleting calendar event:', error);
        // Don't throw error if event doesn't exist
        if (error.status === 404 || error.status === 410) {
            console.log('ℹ️ Event already deleted or not found');
            return true; // Event already deleted
        }
        throw error;
    }
};

// Clean up past exam events
export const cleanupPastEvents = async (exams) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const pastExams = exams.filter(exam => {
        const examDate = new Date(exam.examDate);
        examDate.setHours(0, 0, 0, 0);
        return examDate < today && exam.calendarEventId;
    });

    console.log(`🧹 Cleaning up ${pastExams.length} past exam(s)`);

    const deletePromises = pastExams.map(exam =>
        deleteExamEvent(exam.calendarEventId).catch(err => {
            console.warn(`Failed to delete event ${exam.calendarEventId}:`, err);
        })
    );

    await Promise.all(deletePromises);
    console.log('✅ Cleanup complete');
    return pastExams.map(exam => exam.id); // Return IDs of exams to remove from DB
};

// Verify if a calendar event still exists
export const verifyCalendarEvent = async (eventId) => {
    try {
        const response = await window.gapi.client.calendar.events.get({
            calendarId: 'primary',
            eventId: eventId,
        });
        return response.result !== null;
    } catch (error) {
        // If event doesn't exist (404) or was deleted (410), return false
        if (error.status === 404 || error.status === 410) {
            console.log('ℹ️ Calendar event not found:', eventId);
            return false;
        }
        console.error('Error verifying calendar event:', error);
        return false; // Assume not synced if we can't verify
    }
};

// Verify all exam calendar syncs and update database
export const verifyAllExamSyncs = async (exams, userId, updateCallback) => {
    if (!window.gapi?.client?.getToken()) {
        console.log('ℹ️ Not authorized, skipping sync verification');
        return;
    }

    console.log('🔍 Verifying calendar sync for', exams.length, 'exams');

    for (const exam of exams) {
        if (exam.calendarEventId) {
            const exists = await verifyCalendarEvent(exam.calendarEventId);
            if (!exists) {
                console.log('⚠️ Event deleted externally for exam:', exam.subjectName);
                // Notify callback to remove calendar event ID from database
                if (updateCallback) {
                    await updateCallback(exam.id);
                }
            }
        }
    }

    console.log('✅ Sync verification complete');
};

