import baseApi from "./baseApi";

//this file contains const that gets data from the database to the front-end
export const getCandidatePreference = async (activityId: string) => {
  const res = await baseApi.get(
    `/activities/${activityId}/candidates/lecturer`
  );
  return res.data;
};

export const getActivity = async (activityId: string) => {
  const res = await baseApi.get(`/activities/${activityId}`);
  return res.data;
};

export const getStaffPreference = async (staffId: string) => {
  const res = await baseApi.get(`/staffPreferences/?staffId=${staffId}`);
  return res.data;
};

export const getAvailability = async (staffId: string, year: string) => {
  const res = await baseApi.get(
    `/availabilities/monToFriAvai/${year}/?staffId=${staffId}`
  );
  return res.data;
};
