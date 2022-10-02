/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/browser-apis/
 */
import React, { useEffect } from "react";
import Web3ContextProvider, { Updater as Web3ContextUpdater } from "./src/context/Web3"

function AppContexts({ children }) {
  return (
    <Web3ContextProvider>
      {children}
    </Web3ContextProvider>
  );
}

function AppUpdaters() {
  useEffect(() => {
  }, []);

  return (
    <>
      <Web3ContextUpdater />
    </>
  );
}

export const wrapRootElement = ({ element }) => {
  return (
    <AppContexts>
      <AppUpdaters />
      {element}
    </AppContexts>
  )
}

