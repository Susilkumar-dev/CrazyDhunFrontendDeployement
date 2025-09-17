
import { useState, useEffect, useCallback } from 'react';

export const usePersist = (key, initialValue) => {
  const [state, setState] = useState(initialValue);
  
  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Check if data has expired (24 hours)
        if (parsed.expiry && Date.now() > parsed.expiry) {
          localStorage.removeItem(key);
          setState(initialValue);
        } else {
          setState(parsed.value || parsed);
        }
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      setState(initialValue);
    }
  }, [key, initialValue]);

  const setValue = useCallback((value) => {
    try {
      // Store with 24-hour expiration
      const item = {
        value,
        expiry: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      };
      localStorage.setItem(key, JSON.stringify(item));
      setState(value);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [key]);

  return [state, setValue];
};