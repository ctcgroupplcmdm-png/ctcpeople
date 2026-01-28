export const msalConfig = {
  auth: {
    clientId: "9370acb0-2914-4445-84f2-120e196ef5b8",
    authority: "https://ctcppl.b2clogin.com/ctcppl.onmicrosoft.com/B2C_1_SignIn",
    knownAuthorities: ["ctcppl.b2clogin.com"],
    redirectUri: "https://nice-smoke-0583ee103.2.azurestaticapps.net",
    postLogoutRedirectUri: "https://nice-smoke-0583ee103.2.azurestaticapps.net",
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
};

export const loginRequest = {
  scopes: ["openid", "profile", "offline_access"],
};
