const prod = {
  url: {
    API_URL:
      "https://api.monash-tas.tk",
  },
};

const dev = {
  url: {
    API_URL:
      "http://localhost:8888",
  },
};

export const config = process.env.NODE_ENV === "development" ? dev : prod;

console.log(config);
