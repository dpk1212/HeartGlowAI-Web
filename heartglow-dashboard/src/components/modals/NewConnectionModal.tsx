import React, { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

interface NewConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  // TODO: Add onSave prop: onSave: (name: string, relationship: string) => Promise<void>;
}

const NewConnectionModal: React.FC<NewConnectionModalProps> = ({
  isOpen,
  onClose,
  // onSave,
}) => {
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    // Basic validation
    if (!name.trim()) {
      setError('Name is required.');
      return;
    }
    // TODO: Implement actual save logic
    console.log('Save clicked', { name, relationship });
    // try {
    //   setIsSaving(true);
    //   setError(null);
    //   await onSave(name, relationship);
    //   handleClose(); // Close on success
    // } catch (err) {
    //   console.error("Error saving connection:", err);
    //   setError(err.message || 'Failed to save connection.');
    // } finally {
    //   setIsSaving(false);
    // }
    handleClose(); // Temporarily close on click
  };

  // Reset state when modal closes
  const handleClose = () => {
    if (isSaving) return; // Don't close while saving
    setName('');
    setRelationship('');
    setError(null);
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        {/* Overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-100 mb-4"
                >
                  Add New Connection
                </Dialog.Title>
                
                {/* Form Fields */}
                <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="connection-name" className="block text-sm font-medium text-gray-300 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        id="connection-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 rounded-md bg-gray-700 border border-gray-600 text-gray-100 focus:ring-pink-500 focus:border-pink-500 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="connection-relationship" className="block text-sm font-medium text-gray-300 mb-1">
                        Relationship (e.g., Partner, Mentor, Colleague)
                      </label>
                      <input
                        type="text"
                        id="connection-relationship"
                        value={relationship}
                        onChange={(e) => setRelationship(e.target.value)}
                        className="w-full px-3 py-2 rounded-md bg-gray-700 border border-gray-600 text-gray-100 focus:ring-pink-500 focus:border-pink-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {error && (
                     <p className="mt-3 text-sm text-red-400">Error: {error}</p>
                  )}

                  {/* Action Buttons */}
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={handleClose}
                      disabled={isSaving}
                      className="inline-flex justify-center rounded-md border border-gray-600 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit" // Changed to submit
                      disabled={isSaving || !name.trim()} // Disable if no name or saving
                      className="inline-flex justify-center rounded-md border border-transparent bg-pink-600 px-4 py-2 text-sm font-medium text-white hover:bg-pink-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSaving ? 'Saving...' : 'Save Connection'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default NewConnectionModal; 