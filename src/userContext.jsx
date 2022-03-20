import React from "react";
import reactDom from "react-dom";

// initializing context
const UserContext = React.createContext();

// creating provider and consumer
const Provider = UserContext.Provider;
const Consumer = UserContext.Consumer;

export { Provider, Consumer };
export default UserContext;
