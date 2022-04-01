import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ApiContext } from '../../utils/api_context';
import { AuthContext } from '../../utils/auth_context';
import { RolesContext } from '../../utils/roles_context';
import { Button } from '../common/button';
import { Ping } from './ping';

export const Home = () => {
  const [, setAuthToken] = useContext(AuthContext);
  const api = useContext(ApiContext);
  const roles = useContext(RolesContext);

  const navigate = useNavigate();

  const [chatRoomName, setChatRoomName] = useState('');
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const [location, setLocation] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(async () => {
    const res = await api.get('/users/me');
    setUser(res.user);
    const { chatRooms } = await api.get('/chat_rooms');
    setChatRooms(chatRooms);
    setLoading(false);

    navigator.geolocation.getCurrentPosition(
      (location) => {
        console.log(location);
        setLocation({
          lat: parseFloat(location.coords.latitude),
          lon: parseFloat(location.coords.longitude),
        });
      },
      (err) => {
        setErrorMessage(err.message);
      },
    );
  }, []);

  const logout = async () => {
    const res = await api.del('/sessions');
    if (res.success) {
      setAuthToken(null);
    }
  };

  const createChatRoom = async () => {
    if (!chatRoomName) return;
    const body = {
      name: chatRoomName,
      lat: location.lat,
      lon: location.lon,
    };
    const { chatRoom } = await api.post('/chat_rooms', body);
    navigate(`/chat_room/${chatRoom.id}`);
  };

  const redirect = (id) => {
    navigate(`/chat_room/${id}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <div className="text-red-700">{errorMessage}</div>
      <h1>Welcome {user.firstName}</h1>
      <Button type="button" onClick={logout}>
        Logout
      </Button>
      {roles.includes('admin') && (
        <Button type="button" onClick={() => navigate('/admin')}>
          Admin
        </Button>
      )}
      {/* <section>
        <Ping />
      </section> */}
      <div className="mt-4 mb-4">
        <input
          type="text"
          className="border-2 border-gray-700 p-2 rounded mr-2"
          value={chatRoomName}
          onChange={(e) => setChatRoomName(e.target.value)}
        />
        <Button onClick={createChatRoom}>Create Chat Room</Button>
      </div>
      <div>
        <p>Current Location</p>
        Latitude: {location && (Math.floor(location.lat * 100) / 100).toString()}
        &nbsp; Longitude: {location && (Math.floor(location.lon * 100) / 100).toString()}
      </div>
      {chatRooms.map((chatRoom) =>
        Math.abs(chatRoom.lat - location.lat) <= 2 && Math.abs(chatRoom.lon - location.lon) <= 2 ? (
          <div key={chatRoom.id}>
            <button
              className="block w-1/2 h-10 my-2 bg-blue-700 border-gray-700 border-2 rounded text-white"
              onClick={() => redirect(chatRoom.id)}
            >
              {chatRoom.name}
            </button>
          </div>
        ) : null,
      )}
    </div>
  );
};
