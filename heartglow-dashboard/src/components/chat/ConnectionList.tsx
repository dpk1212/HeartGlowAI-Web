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
    <div className="space-y-2"> 
      {connections.length > 0 ? (
        connections.map((conn) => (
          <Button
            key={conn.id}
            variant="ghost"
            onClick={() => onSelect(conn.id)}
            className={cn(
              "group w-full justify-start h-auto py-4 px-4 text-left rounded-xl transition-all duration-300 relative overflow-hidden", 
              selectedConnectionId === conn.id 
                ? "bg-gradient-to-r from-violet-500/20 to-purple-500/20 hover:from-violet-500/25 hover:to-purple-500/25 shadow-lg border border-violet-400/30 backdrop-blur-sm" 
                : "hover:bg-white/[0.03] border border-transparent hover:border-white/10 backdrop-blur-sm"
            )}
          >
            {/* Subtle shine effect for selected state */}
            {selectedConnectionId === conn.id && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
            )}
            
            <div className="flex items-center space-x-3 relative z-10">
              <Avatar className={cn(
                "h-11 w-11 shadow-lg transition-all duration-300 ring-2",
                selectedConnectionId === conn.id 
                  ? "ring-violet-400/30 shadow-violet-500/20" 
                  : "ring-white/10 shadow-black/20"
              )}>
                <AvatarFallback 
                  className={cn(
                    "text-sm font-semibold transition-all duration-300",
                    selectedConnectionId === conn.id
                      ? "bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-inner" 
                      : "bg-gradient-to-br from-slate-700 to-slate-800 text-white/80"
                  )}
                > 
                  {getInitials(conn.name)}
                </AvatarFallback>
              </Avatar>
              <div className="overflow-hidden flex-1"> 
                <p className={cn(
                  "font-semibold truncate text-base transition-all duration-300", 
                  selectedConnectionId === conn.id 
                    ? 'text-white' 
                    : 'text-white/90 group-hover:text-white'
                )}>
                  {conn.name || 'Unnamed Connection'}
                </p>
                {conn.relationship && (
                  <p className={cn(
                    "text-xs truncate transition-all duration-300 mt-1",
                    selectedConnectionId === conn.id 
                      ? 'text-white/80' 
                      : 'text-white/60 group-hover:text-white/70'
                  )}>
                    {conn.relationship}
                  </p>
                )}
              </div>
              
              {/* Status indicator for selected connection */}
              {selectedConnectionId === conn.id && (
                <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse"></div>
              )}
            </div>
          </Button>
        ))
      ) : (
        <div className="text-white/70 text-center py-6 text-sm bg-white/[0.02] backdrop-blur-sm rounded-xl border border-white/10 px-4 mt-4">
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
            <div className="w-6 h-6 text-white/40">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A2.007 2.007 0 0 0 18.06 7h-.72c-.8 0-1.54.5-1.85 1.26l-1.92 5.76c-.15.45.15.98.63.98H16v6h4zM12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zM5.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2zm2 16v-7H9.5l-2.54-7.63A2.007 2.007 0 0 0 5.06 6h-.72c-.8 0-1.54.5-1.85 1.26L.57 13.02c-.15.45.15.98.63.98H3v8h4.5z"/>
              </svg>
            </div>
          </div>
          <p className="font-medium text-white/80 mb-1">No connections yet</p>
          <p className="text-xs text-white/50">Create your first connection to start meaningful conversations.</p>
        </div>
      )}
    </div>
  );
};

export default ConnectionList; 