export  const safeSetItem = (key: string, value: string): boolean => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    if (error instanceof DOMException && error.code === 22) {
      // Storage quota exceeded
      console.warn('Storage quota exceeded. Clearing old data...');
      clearOldData();
      try {
        localStorage.setItem(key, value);
        return true;
      } catch (retryError) {
        console.error('Still unable to save after clearing:', retryError);
        return false;
      }
    }
    console.error('Storage error:', error);
    return false;
  }
};

const clearOldData = () => {
  const keysToCheck = ['bdoMessages', 'bdoNotifications', 'bdoTransactions'];
  
  keysToCheck.forEach(key => {
    try {
      const data = localStorage.getItem(key);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          // Keep only the last 50 items
          const trimmed = parsed.slice(-50);
          localStorage.setItem(key, JSON.stringify(trimmed));
        }
      }
    } catch (error) {
      console.warn(`Error clearing ${key}:`, error);
    }
  });
};

export const compressImage = (file: File, maxWidth = 200, quality = 0.7): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxWidth) {
            width = (width * maxWidth) / height;
            height = maxWidth;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);
        
        const compressedUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedUrl);
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
 