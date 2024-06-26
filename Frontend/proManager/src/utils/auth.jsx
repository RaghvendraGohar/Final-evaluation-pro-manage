export const getLoggedInUserId = () => {
    // Logic to get the logged-in user's ID
    // This might involve reading from local storage, cookies, or a global state
    return localStorage.getItem("userId"); // Example using localStorage
  };