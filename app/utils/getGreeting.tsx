export const getGreeting = () => {
  const hours = new Date().getHours();
  if (hours < 12) {
    return "Good morning";
  } else if (hours < 15) {
    return "Good afternoon";
  } else {
    return "Good evening";
  }
};
