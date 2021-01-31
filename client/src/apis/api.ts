import baseApi from "./baseApi";

// API functions to retrieve data

// Get candidates for a particular activity
export const getCandidatePreference = async (activityId: string) => {
  const res = await baseApi.get(
    `/activities/${activityId}/candidates/lecturer`
  );
  return res.data;
};

// Get activity by ID
export const getActivity = async (activityId: string) => {
  const res = await baseApi.get(`/activities/${activityId}`);
  return res.data;
};

// Get staff preference by staff ID
export const getStaffPreference = async (staffId: string) => {
  const res = await baseApi.get(`/staffPreferences/?staffId=${staffId}`);
  return res.data;
};

// Get availability by staff ID and year
export const getAvailability = async (staffId: string, year: string) => {
  const res = await baseApi.get(
    `/availabilities/monToFriAvai/${year}/?staffId=${staffId}`
  );
  return res.data;
};
