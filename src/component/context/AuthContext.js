import React, { createContext, useContext, useState } from 'react';

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const [selectedRole, setSelectedRole] = useState('');
  const [email, setEmail] = useState('');
  const [visible, setvisible] = useState('');
  return (
    <RoleContext.Provider value={{ selectedRole, setSelectedRole,email, setEmail,visible, setvisible }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);
