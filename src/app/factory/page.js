'use client';
import { useState } from 'react';

export default function SimpleTable() {
  const [data, setData] = useState([
    { id: 1, name: 'John Doe', role: 'Developer' },
  ]);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [editingId, setEditingId] = useState(null);

  const handleSave = () => {
    if (editingId) {
      // Update existing item
      setData(data.map(item => item.id === editingId ? { ...item, name, role } : item));
      setEditingId(null);
    } else {
      // Add new item
      setData([...data, { id: Date.now(), name, role }]);
    }
    setName('');
    setRole('');
  };

  const handleDelete = (id) => {
    setData(data.filter(item => item.id !== id));
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setName(item.name);
    setRole(item.role);
  };

  return (
    <div className="bg-white" style={{ padding: '20px' }}>
      <h1>User Table</h1>

      <div style={{ marginBottom: '20px' }}>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{ margin: '0 10px' }}
        />
        <button onClick={handleSave}>
          {editingId ? 'Update' : 'Add'}
        </button>
      </div>

      <table border="1" cellPadding="10" >
        <thead>
          <tr className='bg-gray-50 gap-34'>
            <th>Name</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.role}</td>
              <td>
                <button onClick={() => startEdit(item)}>Edit</button>
                <button onClick={() => handleDelete(item.id)} style={{ marginLeft: '5px' }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}