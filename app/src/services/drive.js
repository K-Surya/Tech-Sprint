
const CLIENT_ID = '962088146382-7sakavrun6ir2sb8dd48tkqkjbigp569.apps.googleusercontent.com';
const SCOPES = 'https://www.googleapis.com/auth/drive.file';

let tokenClient;
let gisInited = false;
let initPromise = null;

// Initialize Google Identity Services (GIS)
export const initializeGoogleDrive = () => {
  if (initPromise) return initPromise;

  initPromise = new Promise((resolve, reject) => {
    const loadGis = () => {
      if (gisInited) return Promise.resolve();
      return new Promise((res) => {
        const existingGis = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
        const script = existingGis || document.createElement('script');
        if (!existingGis) {
          script.src = 'https://accounts.google.com/gsi/client';
          script.async = true;
          script.defer = true;
          document.body.appendChild(script);
        }

        const initGis = () => {
          try {
            if (window.google && window.google.accounts && window.google.accounts.oauth2) {
              tokenClient = window.google.accounts.oauth2.initTokenClient({
                client_id: CLIENT_ID,
                scope: SCOPES,
                callback: '', // defined dynamically
              });
              gisInited = true;
              console.log('✅ Google Drive Auth Service initialized');
              res();
            } else {
              // Retry if window.google not ready yet
              setTimeout(initGis, 100);
            }
          } catch (e) {
            console.error('Error init GIS for Drive:', e);
            res();
          }
        };

        if (window.google?.accounts?.oauth2) initGis();
        else script.onload = initGis;
      });
    };

    loadGis().then(() => resolve(true)).catch(reject);
  });

  return initPromise;
};

// Request Drive Access Token
export const getDriveAccessToken = async () => {
  await initializeGoogleDrive();

  // 1. Check local cache
  const cachedToken = localStorage.getItem('googleDriveAccessToken');
  const cachedExpiry = localStorage.getItem('googleDriveTokenExpiry');

  if (cachedToken && cachedExpiry) {
    const now = Date.now();
    // Use cached token if valid (with 5 min buffer)
    if (now < parseInt(cachedExpiry) - 300000) {
      console.log('✅ Using cached Drive token');
      return cachedToken;
    } else {
      console.log('ℹ️ Cached Drive token expired');
      localStorage.removeItem('googleDriveAccessToken');
      localStorage.removeItem('googleDriveTokenExpiry');
    }
  }

  return new Promise((resolve, reject) => {
    if (!tokenClient) {
      reject(new Error("Google Drive Service not initialized."));
      return;
    }

    tokenClient.callback = (resp) => {
      if (resp.error) {
        console.error('❌ Drive Authorization failed:', resp);
        reject(resp);
      }
      if (resp.access_token) {
        console.log('✅ Drive access granted');

        // Cache the token
        // expires_in is seconds (default 3600 = 1 hr)
        const expiresInStr = resp.expires_in || "3599";
        const expiresInMs = parseInt(expiresInStr) * 1000;
        const expiryTime = Date.now() + expiresInMs;

        localStorage.setItem('googleDriveAccessToken', resp.access_token);
        localStorage.setItem('googleDriveTokenExpiry', expiryTime.toString());

        resolve(resp.access_token);
      } else {
        reject(new Error("No access token received"));
      }
    };

    console.log('🔐 Requesting Drive access...');
    // prompt: '' (empty string) allows silent auth if possible, or simple popup without consent screen if already granted
    tokenClient.requestAccessToken({ prompt: '' });
  });
};
