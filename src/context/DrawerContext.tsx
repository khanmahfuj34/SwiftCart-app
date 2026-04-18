import React, { createContext, ReactNode, useContext, useState } from "react";

interface DrawerContextType {
  drawerVisible: boolean;
  setDrawerVisible: (visible: boolean) => void;
}

const DrawerContext = createContext<DrawerContextType | undefined>(undefined);

export const DrawerProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [drawerVisible, setDrawerVisible] = useState(false);

  return (
    <DrawerContext.Provider value={{ drawerVisible, setDrawerVisible }}>
      {children}
    </DrawerContext.Provider>
  );
};

export const useDrawer = (): DrawerContextType => {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error("useDrawer must be used within DrawerProvider");
  }
  return context;
};
