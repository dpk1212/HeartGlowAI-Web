import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { addConnection } from '../../firebase/db'; // Assuming db.ts is in firebase folder
import { RELATIONSHIP_OPTIONS } from '../../utils/constants'; // Import from new location
import { PersonIcon } from '@radix-ui/react-icons'; // Corrected icon import

interface AddConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (connectionId: string) => void; // Pass back new ID if needed
}

const AddConnectionModal: React.FC<AddConnectionModalProps> = ({ isOpen, onClose, onSave }) => {
  const { currentUser } = useAuth();
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState(RELATIONSHIP_OPTIONS[0]); // Default to first option
  const [otherRelationship, setOtherRelationship] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !name.trim() || (relationship === 'Other' && !otherRelationship.trim())) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const connectionData = {
        name: name.trim(),
        relationship: relationship === 'Other' ? otherRelationship.trim() : relationship,
        // Add other default fields if needed by the Connection type in db.ts
        // e.g., notes: '', communicationStyle: '', etc.
      };
      
      // We need to assert the type more strictly based on the Omit in addConnection
      const result = await addConnection(currentUser, connectionData as any); // Use `as any` for now, refine type later
      console.log('Connection saved:', result);
      onSave(result.id); // Pass back the new ID
      // Clear form and close modal happens in onSave/onClose
    } catch (err: any) {
      console.error('Error saving connection:', err);
      setError(err.message || 'Failed to save connection.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-md m-4 border border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSave} className="space-y-5">
          <div className="flex items-center justify-center flex-col text-center mb-2">
            <div className="p-3 bg-gradient-to-br from-heartglow-pink/20 to-heartglow-violet/20 rounded-full mb-3">
              <PersonIcon className="w-7 h-7 text-heartglow-pink" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Add Your First Connection</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Save their details to easily send messages later.</p>
          </div>
          
          <div>
            <label htmlFor="conn-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Name</label>
            <input 
              type="text"
              id="conn-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-heartglow-pink focus:border-transparent dark:bg-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
              required
            />
          </div>

          <div>
            <label htmlFor="conn-relationship" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Relationship</label>
            <select
              id="conn-relationship"
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-heartglow-pink focus:border-transparent dark:bg-gray-700 dark:text-gray-100 appearance-none pr-10 bg-no-repeat bg-right-[0.75rem] bg-center bg-[url('data:image/svg+xml,%3csvg xmlns=&apos;http://www.w3.org/2000/svg&apos; fill=&apos;none&apos; viewBox=&apos;0 0 24 24&apos; stroke-width=&apos;1.5&apos; stroke=&apos;%236b7280&apos;%3e%3cpath stroke-linecap=&apos;round&apos; stroke-linejoin=&apos;round&apos; d=&apos;M19.5 8.25l-7.5 7.5-7.5-7.5&apos; /%3e%3c/svg%3e')] dark:bg-[url('data:image/svg+xml,%3csvg xmlns=&apos;http://www.w3.org/2000/svg&apos; fill=&apos;none&apos; viewBox=&apos;0 0 24 24&apos; stroke-width=&apos;1.5&apos; stroke=&apos;%239ca3af&apos;%3e%3cpath stroke-linecap=&apos;round&apos; stroke-linejoin=&apos;round&apos; d=&apos;M19.5 8.25l-7.5 7.5-7.5-7.5&apos; /%3e%3c/svg%3e')]"
            >
              {RELATIONSHIP_OPTIONS.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          {relationship === 'Other' && (
            <div>
              <label htmlFor="conn-other-relationship" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Please specify</label>
              <input 
                type="text"
                id="conn-other-relationship"
                value={otherRelationship}
                onChange={(e) => setOtherRelationship(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-heartglow-pink focus:border-transparent dark:bg-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                required
              />
            </div>
          )}

          {error && (
            <p className="text-sm text-red-500 dark:text-red-400">Error: {error}</p>
          )}

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 pt-3">
            <button 
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="w-full sm:w-auto mt-2 sm:mt-0 px-5 py-2.5 border border-gray-300 dark:border-gray-500 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isSaving}
              className="w-full sm:w-auto px-6 py-2.5 border border-transparent rounded-lg shadow-md text-sm font-bold text-white bg-heartglow-pink hover:bg-heartglow-violet focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-heartglow-pink dark:focus:ring-offset-gray-800 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSaving ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
              ) : null}
              {isSaving ? 'Saving...' : 'Save Connection'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddConnectionModal; 