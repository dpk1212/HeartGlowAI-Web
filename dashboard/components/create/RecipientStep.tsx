import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { firebase } from '../../lib/firebase';

interface RecipientStepProps {
  onNext: (data: any) => void;
  initialData?: any;
}

const RecipientStep = ({ onNext, initialData }: RecipientStepProps) => {
  const { user } = useAuth();
  const [recipientType, setRecipientType] = useState<'new' | 'existing'>('new');
  const [connections, setConnections] = useState([]);
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    relationship: '',
    customRelationship: ''
  });

  useEffect(() => {
    if (user && recipientType === 'existing') {
      loadConnections();
    }
  }, [user, recipientType]);

  const loadConnections = async () => {
    const connectionsRef = firebase.firestore()
      .collection('users')
      .doc(user.uid)
      .collection('connections');
    
    const snapshot = await connectionsRef.get();
    const loadedConnections = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setConnections(loadedConnections);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (recipientType === 'existing' && selectedConnection) {
      onNext({
        recipient: {
          id: selectedConnection.id,
          name: selectedConnection.name,
          relationship: selectedConnection.relationship
        }
      });
    } else {
      onNext({
        recipient: {
          name: formData.name,
          relationship: formData.relationship,
          customRelationship: formData.customRelationship
        }
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Who are you writing to?
      </h2>

      <div className="mb-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setRecipientType('new')}
            className={`px-4 py-2 rounded-lg ${
              recipientType === 'new'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            New Recipient
          </button>
          <button
            onClick={() => setRecipientType('existing')}
            className={`px-4 py-2 rounded-lg ${
              recipientType === 'existing'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            Select Existing
          </button>
        </div>
      </div>

      {recipientType === 'existing' ? (
        <div className="space-y-4">
          <select
            value={selectedConnection?.id || ''}
            onChange={(e) => {
              const connection = connections.find(c => c.id === e.target.value);
              setSelectedConnection(connection);
            }}
            className="w-full p-2 border rounded-lg"
          >
            <option value="">Select a connection</option>
            {connections.map(connection => (
              <option key={connection.id} value={connection.id}>
                {connection.name} ({connection.relationship})
              </option>
            ))}
          </select>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recipient's Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-2 border rounded-lg"
              placeholder="First name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Relationship
            </label>
            <div className="space-y-2">
              {['Partner', 'Friend', 'Family', 'Colleague', 'Acquaintance', 'Other'].map((rel) => (
                <label key={rel} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="relationship"
                    value={rel}
                    checked={formData.relationship === rel}
                    onChange={(e) => setFormData(prev => ({ ...prev, relationship: e.target.value }))}
                    className="text-blue-600"
                  />
                  <span>{rel}</span>
                </label>
              ))}
            </div>
          </div>

          {formData.relationship === 'Other' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Custom Relationship
              </label>
              <input
                type="text"
                value={formData.customRelationship}
                onChange={(e) => setFormData(prev => ({ ...prev, customRelationship: e.target.value }))}
                className="w-full p-2 border rounded-lg"
                placeholder="Describe your relationship"
                required
              />
            </div>
          )}
        </form>
      )}

      <div className="mt-6">
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default RecipientStep; 