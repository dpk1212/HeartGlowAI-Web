import React from 'react';
import { cn } from "@/lib/utils"; // Import cn utility
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// TODO: Define actual Connection type (perhaps import from a types file)
// Assuming Connection type includes name and relationship
type Connection = { 
  id: string; 
  name: string; 
  relationship?: string; 
};

// Helper function for initials (can be moved to utils later)
const getInitials = (name: string): string => {
  if (!name) return '?';
  const names = name.split(' ');
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
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

  // No outer div needed, ScrollArea is in parent
  return (
    <div className="space-y-1"> {/* Add slight space between buttons */} 
      {connections.length > 0 ? (
        connections.map((conn) => (
          <Button
            key={conn.id}
            variant="ghost" // Use ghost variant for list items
            onClick={() => onSelect(conn.id)}
            className={cn(
              "w-full justify-start h-auto p-3 text-left", // Base styles: full width, left align, auto height, padding
              selectedConnectionId === conn.id ? 
                "bg-gradient-to-r from-[#382554]/90 to-[#1F1F30]/90 hover:from-[#3D2961]/90 hover:to-[#232335]/90 shadow-sm" : // Enhanced selected style
                "hover:bg-[#1E1E2D]/70" // Enhanced hover style for non-selected
            )}
          >
            <div className="flex items-center space-x-3">
              <Avatar className="h-9 w-9 border-2 border-transparent shadow-md"> {/* Slightly larger and add shadow */} 
                {/* <AvatarImage src="/path/to/image.jpg" /> */}
                <AvatarFallback className="bg-gradient-to-br from-heartglow-pink to-heartglow-violet text-white font-medium"> {/* Use gradient */} 
                  {getInitials(conn.name)}
                </AvatarFallback>
              </Avatar>
              <div className="overflow-hidden"> {/* Prevent text overflow */} 
                <p className={cn(
                  "font-medium truncate text-base", // Slightly larger text 
                  selectedConnectionId === conn.id ? 'text-white' : 'text-white/90' // More vibrant text
                  )}>
                  {conn.name || 'Unnamed Connection'}
                </p>
                {conn.relationship && (
                  <p className={cn(
                    "text-xs truncate",
                    selectedConnectionId === conn.id ? 'text-[#E2E2E2]' : 'text-[#C8C8D0]' // Brighter muted text
                    )}>
                    {conn.relationship}
                  </p>
                )}
              </div>
            </div>
          </Button>
        ))
      ) : (
        <p className="text-white/80 text-center py-4 text-sm">No connections found.</p>
      )}
    </div>
  );
};

export default ConnectionList; 