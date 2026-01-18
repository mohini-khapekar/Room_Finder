import { MapPin, DollarSign, Home, Users, Mail, Phone } from 'lucide-react';
import { Room } from '../../lib/supabase';

interface RoomCardProps {
  room: Room;
  onImageClick?: (imageUrl: string) => void;
}

export function RoomCard({ room, onImageClick }: RoomCardProps) {
  const defaultImage = 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=600';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-48 overflow-hidden cursor-pointer" onClick={() => onImageClick?.(room.image_url || defaultImage)}>
        <img
          src={room.image_url || defaultImage}
          alt={room.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
          ₹{room.rent_price.toLocaleString()}/mo
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
          {room.title}
        </h3>

        <div className="flex items-center text-gray-600 mb-3">
          <MapPin size={16} className="mr-1 flex-shrink-0" />
          <span className="text-sm line-clamp-1">{room.location}</span>
        </div>

        <p className="text-gray-700 text-sm mb-4 line-clamp-2">
          {room.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <Home size={14} className="mr-1" />
            {room.property_type}
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Users size={14} className="mr-1" />
            {room.tenant_preference}
          </span>
        </div>

        <div className="border-t pt-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-gray-900">Owner:</span>
            <span className="text-gray-700">{room.owner_name}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center text-gray-600">
              <Phone size={14} className="mr-1" />
              Contact:
            </span>
            <a
              href={`tel:${room.owner_contact}`}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {room.owner_contact}
            </a>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center text-gray-600">
              <Mail size={14} className="mr-1" />
              Email:
            </span>
            <a
              href={`mailto:${room.owner_email}`}
              className="text-blue-600 hover:text-blue-700 font-medium truncate ml-2"
            >
              {room.owner_email}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
