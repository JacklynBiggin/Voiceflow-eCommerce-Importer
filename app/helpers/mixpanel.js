// Generate a random session ID when the file is loaded
const sessionUserId = Math.random().toString(36).substring(2) + Date.now().toString(36);

const track = async (eventName, properties = {}) => {
    try {
        const enrichedProperties = {
            ...properties,
            distinct_id: sessionUserId
        };
        
        const response = await fetch('/api/track', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                event: eventName,
                properties: enrichedProperties
            })
        });
        
        const result = await response.text();
        return result === '1';
    } catch (error) {
        return false;
    }
};

// Specific tracking functions with updated names
export const trackPlatformSelection = (platform) => {
    return track('Ecomm Importer: Platform Selected', { platform });
};

export const trackImportSuccess = (platform) => {
    return track('Ecomm Importer: Import Successful', { platform });
};

// Export general track function for custom events
export { track };
