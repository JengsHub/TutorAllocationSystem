export const getCandidatePreference = async (activityId: string) => {
  const res = await fetch(
    "http://localhost:8888/activities/" + activityId + "/candidates/lecturer"
  );
  return res.json();
};

export const getActivity = async (activityId: string) => {
  const res = await fetch("http://localhost:8888/activities/" + activityId);
  return res.json();
};
