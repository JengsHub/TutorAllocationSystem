import baseApi from "./baseApi";

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

export const getAvailability = async (staffId: string) => {
  const res = await baseApi.get(`/availabilities/?staffId=${staffId}`);
  return res.data;
};
