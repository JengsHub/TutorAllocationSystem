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
