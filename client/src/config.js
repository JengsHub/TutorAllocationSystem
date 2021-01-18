const prod = {
  url: {
    API_URL:
      "http://EC2Co-EcsEl-8SACJ3Q3NOYD-1731678902.ap-southeast-2.elb.amazonaws.com",
  },
};

const dev = {
  url: {
    API_URL:
      "http://EC2Co-EcsEl-8SACJ3Q3NOYD-1731678902.ap-southeast-2.elb.amazonaws.com",
  },
};

export const config = process.env.NODE_ENV === "development" ? dev : prod;

console.log(config);
