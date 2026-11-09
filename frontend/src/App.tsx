// src/App.tsx
import { useState, useEffect } from 'react';
import type { Task } from './types';
import * as api from './services/api';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [search, setSearch] = useState<string>('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');

  // Estados para la edición
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const completedParam = filter === 'completed' ? true : filter === 'pending' ? false : undefined;
      const data = await api.getTasks(completedParam, search);
      setTasks(data);
    } catch (err) {
      setError('Error al cargar las tareas de la API');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchTasks();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [search, filter]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    
    try {
      await api.createTask({ title: newTitle, description: newDescription });
      setNewTitle('');
      setNewDescription('');
      fetchTasks();
    } catch (err) {
      setError('Error al crear la tarea');
    }
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      await api.updateTask(task.id, { completed: !task.completed });
      fetchTasks();
    } catch (err) {
      setError('Error al actualizar el estado');
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await api.deleteTask(id);
      fetchTasks();
    } catch (err) {
      setError('Error al eliminar la tarea');
    }
  };

  const startEditing = (task: Task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description || '');
  };

  const handleUpdateTask = async (id: number) => {
    if (!editTitle.trim()) return;
    try {
      await api.updateTask(id, { title: editTitle, description: editDescription });
      setEditingId(null);
      fetchTasks();
    } catch (err) {
      setError('Error al actualizar la tarea');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 font-sans">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">TODO List</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}

        {/* Formulario de Creación */}
        <form onSubmit={handleCreateTask} className="mb-8 bg-gray-50 p-4 rounded-lg border">
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Título de la tarea..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="text"
              placeholder="Descripción (opcional)..."
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button type="submit" className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition">
              Añadir Tarea
            </button>
          </div>
        </form>

        {/* Filtros y Búsqueda */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <input
            type="text"
            placeholder="Buscar tareas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 border rounded w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <div className="flex gap-2 w-full md:w-auto">
            {(['all', 'pending', 'completed'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-1 md:flex-none px-4 py-2 rounded capitalize transition ${
                  filter === f ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {f === 'all' ? 'Todas' : f === 'pending' ? 'Pendientes' : 'Completadas'}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de Tareas */}
        {loading ? (
          <div className="text-center text-gray-500 py-4">Cargando tareas...</div>
        ) : (
          <ul className="space-y-3">
            {tasks.length === 0 ? (
              <li className="text-center text-gray-500 py-4">No se encontraron tareas.</li>
            ) : (
              tasks.map((task) => (
                <li key={task.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded hover:bg-gray-50 transition gap-4">
                  {editingId === task.id ? (
                    // Vista de Edición
                    <div className="flex flex-col flex-1 gap-2">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="p-1 border rounded w-full"
                      />
                      <input
                        type="text"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="p-1 border rounded w-full text-sm"
                        placeholder="Descripción..."
                      />
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => handleUpdateTask(task.id)} className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">Guardar</button>
                        <button onClick={() => setEditingId(null)} className="bg-gray-400 text-white px-3 py-1 rounded text-sm hover:bg-gray-500">Cancelar</button>
                      </div>
                    </div>
                  ) : (
                    // Vista Normal
                    <>
                      <div className="flex items-start gap-4 overflow-hidden flex-1">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => handleToggleComplete(task)}
                          className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                        />
                        <div className="flex flex-col">
                          <span className={`font-semibold ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                            {task.title}
                          </span>
                          {task.description && (
                            <span className={`text-sm ${task.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                              {task.description}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0 mt-2 md:mt-0">
                        <button onClick={() => startEditing(task)} className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-2 rounded transition text-sm">Editar</button>
                        <button onClick={() => handleDeleteTask(task.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded transition text-sm">Eliminar</button>
                      </div>
                    </>
                  )}
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;