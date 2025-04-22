import React, { useState } from 'react';
// Removed Headless UI imports

// Import shadcn/ui components
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose, // Import DialogClose for cancel button
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from 'lucide-react'; // For loading spinner

// Props adjusted - isOpen and onClose are typically handled by DialogTrigger/Dialog in the parent
interface NewConnectionModalProps {
  onSave: (name: string, relationship: string) => Promise<void>;
  // We might need a way to programmatically close after save, passed from parent if needed
  // Or parent state controls the <Dialog open> prop
}

const NewConnectionModal: React.FC<NewConnectionModalProps> = ({
  onSave,
}) => {
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent default form submission
    // Basic validation
    if (!name.trim()) {
      setError('Name is required.');
      return;
    }
    console.log('Save clicked', { name, relationship });
    setIsSaving(true);
    setError(null);
    try {
      await onSave(name, relationship);
      // How to close? Parent needs to control 'open' state or we use DialogClose
      // For now, assume success means it should close (logic might need adjustment later)
      // We can't directly call handleClose/onClose anymore.
      // Resetting state here might be premature if close fails. Best handled on unmount/reopen.
    } catch (err: any) {
      console.error("Error saving connection:", err);
      setError(err.message || 'Failed to save connection.');
    } finally {
      setIsSaving(false);
    }
  };

  // Reset state when the component might re-render due to closing/opening
  // This is tricky without controlling open state directly. Let's clear on successful save for now.
  // Proper reset should happen when the dialog *actually* closes or opens.
  // For simplicity, let's just clear state within handleSave success for now.

  // handleClose logic is removed as DialogClose/overlay handles it.
  // State reset needs reconsideration - maybe on successful save or via parent effect.

  // Use shadcn DialogContent instead of Headless UI Dialog.Panel
  return (
    <DialogContent className="sm:max-w-[425px] bg-gray-800 border-gray-700 text-gray-100">
      <DialogHeader>
        <DialogTitle className="text-gray-100">Add New Connection</DialogTitle>
        <DialogDescription className="text-gray-400">
          Enter the details for your new connection. Click save when you're done.
        </DialogDescription>
      </DialogHeader>
      {/* Form for input fields */}
      <form onSubmit={handleSave}>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="connection-name" className="text-right text-gray-300">
              Name
            </Label>
            <Input
              id="connection-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3 bg-gray-700 border-gray-600 text-gray-100 focus-visible:ring-pink-500"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="connection-relationship" className="text-right text-gray-300">
              Relationship
            </Label>
            <Input
              id="connection-relationship"
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              placeholder="(e.g., Partner, Mentor)"
              className="col-span-3 bg-gray-700 border-gray-600 text-gray-100 focus-visible:ring-pink-500"
            />
          </div>
        </div>

        {error && (
           <p className="mb-4 text-sm text-red-400 text-center">Error: {error}</p>
        )}

        {/* Buttons using shadcn Button */}
        <DialogFooter>
          {/* DialogClose handles closing the dialog */}
          <DialogClose asChild>
             <Button type="button" variant="outline">Cancel</Button>
          </DialogClose>
          <Button 
            type="submit" 
            disabled={isSaving || !name.trim()}
            className="bg-pink-600 hover:bg-pink-700"
          >
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isSaving ? 'Saving...' : 'Save Connection'}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default NewConnectionModal; 