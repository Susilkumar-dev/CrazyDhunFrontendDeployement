
export const cleanExpiredStorage = () => {
  const now = Date.now();
  const keysToCheck = ['recentlyPlayed', 'likedSongs'];
  
  keysToCheck.forEach(key => {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        const parsed = JSON.parse(item);
        if (parsed.expiry && now > parsed.expiry) {
          localStorage.removeItem(key);
          console.log(`Removed expired data: ${key}`);
        }
      }
    } catch (error) {
      console.error(`Error cleaning up ${key}:`, error);
    }
  });
};

// Run cleanup on app startup
cleanExpiredStorage();

// Optional: Run cleanup periodically (every hour)
setInterval(cleanExpiredStorage, 60 * 60 * 1000);