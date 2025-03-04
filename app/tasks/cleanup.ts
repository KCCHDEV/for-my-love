export async function cleanupTask() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/cleanup`, {
      method: 'GET'
    });
    const data = await response.json();
    console.log('Cleanup completed:', data);
  } catch (error) {
    console.error('Cleanup failed:', error);
  }
}

// Run cleanup every 24 hours
setInterval(cleanupTask, 24 * 60 * 60 * 1000);
