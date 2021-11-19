import React from "react";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = React.useState();
  const [demoMode, setDemoMode] = React.useState(false);

  return (
    <AuthContext.Provider value={{ auth, setAuth, demoMode, setDemoMode }}>
      {children}
    </AuthContext.Provider>
  );
};
