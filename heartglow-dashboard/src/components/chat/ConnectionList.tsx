import React from 'react';

// TODO: Define actual Connection type (perhaps import from a types file)
type Connection = { 
  id: string; 
  name: string; 
  relationship?: string; // Optional field example
  lastMessageSnippet?: string; // Optional field example
  lastMessageTimestamp?: any; // For sorting or display
};

interface ConnectionListProps {
  connections: Connection[];
  selectedConnectionId: string | null;
  onSelect: (connectionId: string) => void;
}

const ConnectionList: React.FC<ConnectionListProps> = ({
  connections,
  selectedConnectionId,
  onSelect,
}) => {
  // Optional: Sort connections, e.g., by last message timestamp
  // const sortedConnections = [...connections].sort((a, b) => ...);

  return (
    <div className="overflow-y-auto flex-grow space-y-2 pr-1">
      {connections.length > 0 ? (
        connections.map((conn) => (
          <div
            key={conn.id}
            onClick={() => onSelect(conn.id)}
            className={`
              p-3 rounded-lg cursor-pointer transition duration-150 ease-in-out 
              hover:bg-gray-700 
              focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50
              ${
                selectedConnectionId === conn.id
                  ? 'bg-gradient-to-r from-pink-800/50 to-purple-800/40 border border-pink-600/80 shadow-md' // Enhanced selected style
                  : 'bg-gray-700/60' // Standard item style
              }
            `}
          >
            <p className="font-semibold text-gray-100 truncate text-sm">
              {conn.name || 'Unnamed Connection'}
            </p>
            {conn.relationship && (
              <p className="text-xs text-gray-400 truncate mt-1">
                {conn.relationship}
              </p>
            )}
             {/* Optional: Display last message snippet */}
             {/* {conn.lastMessageSnippet && (
              <p className="text-xs text-gray-400 truncate mt-1">
                {conn.lastMessageSnippet}
              </p>
            )} */}
          </div>
        ))
      ) : (
        <p className="text-gray-400 text-center py-4">No connections found.</p>
      )}
    </div>
  );
};

export default ConnectionList; 