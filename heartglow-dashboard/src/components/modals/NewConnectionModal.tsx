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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from 'lucide-react'; // For loading spinner
import { RELATIONSHIP_OPTIONS } from '../../utils/constants'; // Import relationship options

// Props adjusted - isOpen and onClose are typically handled by DialogTrigger/Dialog in the parent
interface NewConnectionModalProps {
  onSave: (name: string, relationship: string, specificRelationship?: string, goal?: string, notes?: string) => Promise<void>;
  // We might need a way to programmatically close after save, passed from parent if needed
  // Or parent state controls the <Dialog open> prop
}

const NewConnectionModal: React.FC<NewConnectionModalProps> = ({
  onSave,
}) => {
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState(RELATIONSHIP_OPTIONS[0]);
  const [specificRelationship, setSpecificRelationship] = useState('');
  const [relationshipGoal, setRelationshipGoal] = useState('');
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent default form submission
    // Basic validation
    if (!name.trim()) {
      setError('Name is required.');
      return;
    }
    console.log('Save clicked', { name, relationship, specificRelationship, relationshipGoal, notes });
    setIsSaving(true);
    setError(null);
    try {
      await onSave(
        name, 
        relationship, 
        specificRelationship.trim(), 
        relationshipGoal.trim(), 
        notes.trim()
      );
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
    <DialogContent className="sm:max-w-[500px] bg-gray-800 border-gray-700 text-gray-100">
      <DialogHeader>
        <DialogTitle className="text-gray-100">Add New Connection</DialogTitle>
        <DialogDescription className="text-gray-400">
          Enter the details for your new connection. Click save when you're done.
        </DialogDescription>
      </DialogHeader>
      {/* Form for input fields */}
      <form onSubmit={handleSave} className="space-y-5">
        <div className="space-y-4">
          {/* Name Field - Required */}
          <div className="space-y-2">
            <Label htmlFor="connection-name" className="text-gray-300">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="connection-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-gray-700 border-gray-600 text-gray-100 focus-visible:ring-pink-500"
              required
            />
          </div>
          
          {/* Relationship Dropdown - Required */}
          <div className="space-y-2">
            <Label htmlFor="connection-relationship" className="text-gray-300">
              Relationship <span className="text-red-500">*</span>
            </Label>
            <Select 
              value={relationship} 
              onValueChange={setRelationship}
              required
            >
              <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-100">
                <SelectValue placeholder="Select relationship type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600 text-gray-100">
                {RELATIONSHIP_OPTIONS.map(option => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Specific Relationship Field - Optional */}
          <div className="space-y-2">
            <Label htmlFor="specific-relationship" className="text-gray-300">
              Specific Relationship (Optional)
            </Label>
            <Input
              id="specific-relationship"
              value={specificRelationship}
              onChange={(e) => setSpecificRelationship(e.target.value)}
              placeholder="E.g. Brother, Boss, Best friend"
              className="bg-gray-700 border-gray-600 text-gray-100 focus-visible:ring-pink-500"
            />
          </div>
          
          {/* Relationship Goal Field - Optional */}
          <div className="space-y-2">
            <Label htmlFor="relationship-goal" className="text-gray-300">
              Relationship Goal (Optional)
            </Label>
            <Textarea
              id="relationship-goal"
              value={relationshipGoal}
              onChange={(e) => setRelationshipGoal(e.target.value)}
              placeholder="What do you hope to achieve in this relationship?"
              className="bg-gray-700 border-gray-600 text-gray-100 focus-visible:ring-pink-500 resize-none min-h-[80px]"
            />
          </div>
          
          {/* Notes Field - Optional */}
          <div className="space-y-2">
            <Label htmlFor="relationship-notes" className="text-gray-300">
              Notes (Optional)
            </Label>
            <Textarea
              id="relationship-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any other details about this person you'd like to remember"
              className="bg-gray-700 border-gray-600 text-gray-100 focus-visible:ring-pink-500 resize-none min-h-[80px]"
            />
          </div>
        </div>

        {error && (
           <p className="text-sm text-red-400 text-center">Error: {error}</p>
        )}

        {/* Buttons using shadcn Button */}
        <DialogFooter className="mt-6">
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