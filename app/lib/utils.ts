

export function formatSize(bytes: number): string {
  if (bytes === 0) return '0 bytes';
  const k = 1024;
  const sizes  = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];

  // Determine the appropriate unit by calculating the log
  const i  = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k , i )).toFixed(2)) + ' ' + sizes[i];
}

export const generateUUID = () => crypto.randomUUID()