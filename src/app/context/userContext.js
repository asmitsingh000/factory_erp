"use client"

import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext({ profile: {} });

export function UserProvider({ children }) {
  const [profile, setProfile] = useState({});

  useEffect(() => {
  }, []);

  const value = { profile, setProfile };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  return useContext(UserContext) || { profile: {} };
}

export default UserContext;
