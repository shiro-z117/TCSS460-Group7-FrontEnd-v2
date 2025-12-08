'use client';

import { useState, useEffect } from 'react';
import { userDbApi, Avatar } from '@/services/userDbApi';

interface AvatarPickerProps {
  currentAvatarId?: number;
  userId: number;
  onAvatarChange: () => void;
  onClose: () => void;
}

export default function AvatarPicker({
  currentAvatarId,
  userId,
  onAvatarChange,
  onClose
}: AvatarPickerProps) {
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [selectedAvatarId, setSelectedAvatarId] = useState<number | undefined>(currentAvatarId);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch all available avatars
  useEffect(() => {
    const fetchAvatars = async () => {
      try {
        setIsLoading(true);
        const response = await userDbApi.getAllAvatars();
        const avatarData = Array.isArray(response.data) ? response.data : [];
        setAvatars(avatarData);
      } catch (err: any) {
        console.error('Error fetching avatars:', err);
        setError(err?.message || 'Failed to load avatars');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvatars();
  }, []);

  const handleAvatarSelect = (avatarId: number) => {
    setSelectedAvatarId(avatarId);
  };

  const handleSave = async () => {
    if (!selectedAvatarId || selectedAvatarId === currentAvatarId) {
      onClose();
      return;
    }

    try {
      setIsUpdating(true);
      setError(null);
      await userDbApi.updateUserAvatar(userId, { avatar_id: selectedAvatarId });
      onAvatarChange();
      onClose();
    } catch (err: any) {
      console.error('Error updating avatar:', err);
      setError(err?.response?.data?.error || 'Failed to update avatar');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl border border-purple-500/30 max-w-2xl w-full p-8 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-white">Choose Your Avatar</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-2xl w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-700"
            disabled={isUpdating}
          >
            ×
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-4 gap-4 mb-6">
              {avatars.map((avatar) => (
                <button
                  key={avatar.avatar_id}
                  onClick={() => handleAvatarSelect(avatar.avatar_id)}
                  className={`relative aspect-square rounded-xl overflow-hidden transition-all transform hover:scale-105 ${
                    selectedAvatarId === avatar.avatar_id
                      ? 'ring-4 ring-purple-500 shadow-lg shadow-purple-500/50'
                      : 'ring-2 ring-gray-600 hover:ring-purple-400'
                  }`}
                  disabled={isUpdating}
                >
                  <img
                    src={avatar.avatar_url}
                    alt={avatar.avatar_name || `Avatar ${avatar.avatar_id}`}
                    className="w-full h-full object-cover"
                  />
                  {selectedAvatarId === avatar.avatar_id && (
                    <div className="absolute inset-0 bg-purple-500/20 flex items-center justify-center">
                      <div className="bg-purple-500 rounded-full p-2">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all"
                disabled={isUpdating}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isUpdating || selectedAvatarId === currentAvatarId}
              >
                {isUpdating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Updating...
                  </>
                ) : (
                  'Save'
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}