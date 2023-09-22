function calculateAvailableTime(configData, specialConfigData, latestTime) {
    const baseTime = specialConfigData.jam_mulai_sp || configData.jam_mulai || '08:00';
  
    if (latestTime) {
      const latestTimeDate = new Date(`1970-01-01T${latestTime}`);
      latestTimeDate.setMinutes(latestTimeDate.getMinutes() + 30);
      return latestTimeDate.toTimeString().slice(0, 5);
    }
  
    return baseTime;
  }
  
  export default calculateAvailableTime;
  