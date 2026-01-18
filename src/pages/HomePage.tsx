import { useEffect, useState } from 'react';
import { SearchFilters } from '../components/Search/SearchFilters';
import { RoomCard } from '../components/Room/RoomCard';
import { ImageViewer } from '../components/Room/ImageViewer';
import { Room, supabase } from '../lib/supabase';
import { Loader2 } from 'lucide-react';

export function HomePage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<{ url: string; title: string } | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    city: '',
    minPrice: '',
    maxPrice: '',
    propertyType: 'All',
    tenantPreference: 'All',
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, rooms]);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('is_available', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRooms(data || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...rooms];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (room) =>
          room.title.toLowerCase().includes(searchLower) ||
          room.location.toLowerCase().includes(searchLower) ||
          room.city.toLowerCase().includes(searchLower) ||
          room.description.toLowerCase().includes(searchLower)
      );
    }

    if (filters.city) {
      const cityLower = filters.city.toLowerCase();
      filtered = filtered.filter((room) =>
        room.city.toLowerCase().includes(cityLower)
      );
    }

    if (filters.minPrice) {
      filtered = filtered.filter(
        (room) => room.rent_price >= parseInt(filters.minPrice)
      );
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(
        (room) => room.rent_price <= parseInt(filters.maxPrice)
      );
    }

    if (filters.propertyType !== 'All') {
      filtered = filtered.filter(
        (room) => room.property_type === filters.propertyType
      );
    }

    if (filters.tenantPreference !== 'All') {
      filtered = filtered.filter(
        (room) => room.tenant_preference === filters.tenantPreference
      );
    }

    setFilteredRooms(filtered);
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
      <SearchFilters filters={filters} onFilterChange={setFilters} />

      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Available Rooms {filteredRooms.length > 0 && `(${filteredRooms.length})`}
        </h2>
      </div>

      {filteredRooms.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow-md text-center">
          <p className="text-gray-600 text-lg">
            No rooms found matching your criteria.
          </p>
          <p className="text-gray-500 mt-2">Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onImageClick={(imageUrl) => setSelectedImage({ url: imageUrl, title: room.title })}
            />
          ))}
        </div>
      )}

      {selectedImage && (
        <ImageViewer
          isOpen={!!selectedImage}
          imageUrl={selectedImage.url}
          roomTitle={selectedImage.title}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
}
