// Google Calendar API Integration
const CLIENT_ID = '962088146382-7sakavrun6ir2sb8dd48tkqkjbigp569.apps.googleusercontent.com';
const API_KEY = 'AIzaSyCxVzFshjwdhPmghgCpJrrEkbrmNwyfL4Q';
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/calendar.events';

let tokenClient;
let gapiInited = false;
let gisInited = false;
let initPromise = null;

// Initialize Google API client (Singleton)
export const initializeGoogleCalendar = () => {
    if (initPromise) return initPromise;

    initPromise = new Promise((resolve, reject) => {
        try {
            // Check if scripts already exists
            const existingGapi = document.querySelector('script[src="https://apis.google.com/js/api.js"]');
            const existingGis = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');

            const loadGapi = () => {
                if (gapiInited) return Promise.resolve();
                return new Promise((res) => {
                    const script = existingGapi || document.createElement('script');
                    if (!existingGapi) {
                        script.src = 'https://apis.google.com/js/api.js';
                        document.body.appendChild(script);
                    }

                    const initGapi = () => {
                        window.gapi.load('client', async () => {
                            try {
                                await window.gapi.client.init({
                                    apiKey: API_KEY,
                                    discoveryDocs: [DISCOVERY_DOC],
                                });
                                gapiInited = true;
                                console.log('✅ Google API client initialized');
                                res();
                            } catch (e) {
                                console.error('Error init gapi client:', e);
                                res(); // Resolve anyway to not block entire app
                            }
                        });
                    };

                    if (window.gapi) initGapi();
                    else script.onload = initGapi;
                });
            };

            const loadGis = () => {
                if (gisInited) return Promise.resolve();
                return new Promise((res) => {
                    const script = existingGis || document.createElement('script');
                    if (!existingGis) {
                        script.src = 'https://accounts.google.com/gsi/client';
                        document.body.appendChild(script);
                    }

                    const initGis = () => {
                        try {
                            tokenClient = window.google.accounts.oauth2.initTokenClient({
                                client_id: CLIENT_ID,
                                scope: SCOPES,
                                callback: '', // defined later
                            });
                            gisInited = true;
                            console.log('✅ Google Identity Services initialized');
                            res();
                        } catch (e) {
                            console.error('Error init GIS:', e);
                            res();
                        }
                    };

                    if (window.google?.accounts?.oauth2) initGis();
                    else script.onload = initGis;
                });
            };

            Promise.all([loadGapi(), loadGis()]).then(() => {
                console.log('✅ Google Calendar system ready');
                resolve(true);
            });
        } catch (error) {
            console.error('❌ Calendar initialization failed:', error);
            reject(error);
        }
    });

    return initPromise;
};

// Request calendar access from user (with popup if needed)
export const requestCalendarAccess = async (emailHint = null) => {
    await initializeGoogleCalendar();

    return new Promise((resolve, reject) => {
        if (!tokenClient) {
            reject(new Error("Google Identity Services not initialized. Please check your internet connection."));
            return;
        }

        tokenClient.callback = async (resp) => {
            if (resp.error !== undefined) {
                console.error('❌ Authorization failed:', resp);
                reject(resp);
                return;
            }
            console.log('✅ Calendar access granted');
            resolve(true);
        };

        // Complete consent flow
        console.log('🔐 Requesting full calendar access...', emailHint ? `(Hint: ${emailHint})` : '');
        tokenClient.requestAccessToken({
            prompt: emailHint ? '' : 'consent', // Use silent prompt if hint is provided
            hint: emailHint
        });
    });
};

// Silent refresh of token (note: may still be blocked by browser)
export const refreshCalendarToken = async (emailHint = null) => {
    await initializeGoogleCalendar();

    return new Promise((resolve, reject) => {
        if (!tokenClient) {
            const error = "Google Calendar system not fully initialized. Please try again in a moment or check if your browser is blocking Google scripts.";
            console.error('❌', error);
            reject(new Error(error));
            return;
        }

        tokenClient.callback = (resp) => {
            if (resp.error !== undefined) {
                // Silently fail - this is expected with popup blockers
                console.log('ℹ️ Silent refresh not possible (popup blocked or no stored credentials)');
                resolve(false);
                return;
            }
            console.log('✅ Token refreshed silently');
            resolve(true);
        };

        try {
            console.log('🔐 Attempting silent token refresh...', emailHint ? `(Hint: ${emailHint})` : '');
            tokenClient.requestAccessToken({
                prompt: '',
                hint: emailHint
            });
        } catch (error) {
            // Catch any sync errors from popup blockers
            console.log('ℹ️ Silent refresh failed (expected in development)');
            resolve(false);
        }
    });
};

// Check if user is authorized
export const isCalendarAuthorized = () => {
    const authorized = window.gapi?.client?.getToken() !== null && window.gapi?.client?.getToken() !== undefined;
    console.log('Calendar authorization status:', authorized);
    return authorized;
};

// Sign out from Google Calendar
export const signOutCalendar = async () => {
    await initializeGoogleCalendar();
    const token = window.gapi.client.getToken();
    if (token !== null) {
        window.google.accounts.oauth2.revoke(token.access_token);
        window.gapi.client.setToken('');
        console.log('✅ Signed out from Google Calendar');
    }
};

// Create exam event in Google Calendar
export const createExamEvent = async (exam) => {
    await initializeGoogleCalendar();
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
        const startDate = new Date(exam.examDate);
        const startDateString = startDate.toISOString().split('T')[0];

        // Google Calendar all-day events MUST end on the day AFTER the start date
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1);
        const endDateString = endDate.toISOString().split('T')[0];

        const event = {
            summary: `📚 ${exam.subjectName} Exam`,
            description: `Exam for ${exam.subjectName}\n\nAdded from Benchmate AI Study Platform`,
            start: {
                date: startDateString, // All-day event start
            },
            end: {
                date: endDateString, // All-day event end (next day)
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
            start: startDateString,
            end: endDateString,
            type: 'All-day event (corrected duration)'
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
    await initializeGoogleCalendar();
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
    await initializeGoogleCalendar();
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

