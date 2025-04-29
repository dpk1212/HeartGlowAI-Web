  if (connectionsError) {
    // Render the error string directly
    return <div className="text-red-500 p-4">Error loading connections: {connectionsError}</div>;
  }
  // TODO: Handle messagesError appropriately (e.g., toast within ChatWindow) 