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
  return (
    <div className="space-y-1.5"> 
      {connections.length > 0 ? (
        connections.map((conn) => (
          <Button
            key={conn.id}
            variant="ghost"
            onClick={() => onSelect(conn.id)}
            className={cn(
              "w-full justify-start h-auto py-3 px-3 text-left rounded-xl transition-all duration-200", 
              selectedConnectionId === conn.id 
                ? "bg-gradient-to-r from-[#382554]/95 to-[#1F1F30]/95 hover:from-[#3D2961]/95 hover:to-[#232335]/95 shadow-lg border border-[#4A3270]/20" 
                : "hover:bg-[#1E1E2D]/80 border border-transparent"
            )}
          >
            <div className="flex items-center space-x-3">
              <Avatar className={cn(
                "h-10 w-10 shadow-md transition-all duration-300",
                selectedConnectionId === conn.id 
                  ? "border-2 border-[#9161FC]/30 ring-2 ring-[#FF4F81]/10" 
                  : "border border-[#3A3A5C]/40"
              )}>
                <AvatarFallback 
                  className={cn(
                    "text-sm font-medium transition-all duration-200",
                    selectedConnectionId === conn.id
                      ? "bg-gradient-to-br from-heartglow-pink to-heartglow-violet text-white" 
                      : "bg-gradient-to-br from-[#2A2A45] to-[#1A1A30] text-gray-200"
                  )}
                > 
                  {getInitials(conn.name)}
                </AvatarFallback>
              </Avatar>
              <div className="overflow-hidden"> 
                <p className={cn(
                  "font-medium truncate text-base", 
                  selectedConnectionId === conn.id 
                    ? 'text-white' 
                    : 'text-white/80'
                )}>
                  {conn.name || 'Unnamed Connection'}
                </p>
                {conn.relationship && (
                  <p className={cn(
                    "text-xs truncate transition-all duration-200",
                    selectedConnectionId === conn.id 
                      ? 'text-[#E2E2E2]' 
                      : 'text-[#C8C8D0]/70'
                  )}>
                    {conn.relationship}
                  </p>
                )}
              </div>
            </div>
          </Button>
        ))
      ) : (
        <div className="text-white/70 text-center py-4 text-sm bg-[#1A1A2E]/50 rounded-lg border border-[#2A2A40]/30 px-3 mt-2">
          No connections found.
          <p className="text-xs text-white/50 mt-1">Add your first connection to get started.</p>
        </div>
      )}
    </div>
  );
};

export default ConnectionList; 