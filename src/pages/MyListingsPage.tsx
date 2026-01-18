import { useEffect, useState } from 'react';
import { Room, supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Trash2, Edit2, Loader2 } from 'lucide-react';

export function MyListingsPage() {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchMyRooms();
    }
  }, [user]);

  const fetchMyRooms = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('owner_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRooms(data || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (roomId: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;

    setDeleting(roomId);
    try {
      const { error } = await supabase.from('rooms').delete().eq('id', roomId);

      if (error) throw error;

      setRooms(rooms.filter((room) => room.id !== roomId));
    } catch (error) {
      console.error('Error deleting room:', error);
      alert('Failed to delete room');
    } finally {
      setDeleting(null);
    }
  };

  const toggleAvailability = async (room: Room) => {
    try {
      const { error } = await supabase
        .from('rooms')
        .update({ is_available: !room.is_available })
        .eq('id', room.id);

      if (error) throw error;

      setRooms(
        rooms.map((r) =>
          r.id === room.id ? { ...r, is_available: !r.is_available } : r
        )
      );
    } catch (error) {
      console.error('Error updating room:', error);
      alert('Failed to update room');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          My Listings {rooms.length > 0 && `(${rooms.length})`}
        </h2>
        <p className="text-gray-600 mt-1">Manage your room listings</p>
      </div>

      {rooms.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow-md text-center">
          <p className="text-gray-600 text-lg">You haven't added any listings yet.</p>
          <p className="text-gray-500 mt-2">Click "Add Room" to create your first listing.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-64 h-48 md:h-auto">
                  <img
                    src={
                      room.image_url ||
                      'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=600'
                    }
                    alt={room.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{room.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">{room.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">
                        ₹{room.rent_price.toLocaleString()}
                      </p>
                      <p className="text-gray-500 text-sm">per month</p>
                    </div>
                  </div>

                  <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                    {room.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {room.property_type}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {room.tenant_preference}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        room.is_available
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {room.is_available ? 'Available' : 'Not Available'}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => toggleAvailability(room)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Mark as {room.is_available ? 'Unavailable' : 'Available'}
                    </button>

                    <button
                      onClick={() => handleDelete(room.id)}
                      disabled={deleting === room.id}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium disabled:bg-gray-400 flex items-center"
                    >
                      {deleting === room.id ? (
                        <>
                          <Loader2 size={16} className="animate-spin mr-1" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 size={16} className="mr-1" />
                          Delete
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
