import { useEffect, useState, useRef } from "react";
import { fetchTodos, deleteTodo, createTodo, updateTodo } from "../service/api";

function Todo() {
  const [todo, setTodo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newTodo, setNewTodo] = useState({
    title: "",
    description: "",
    completed: false,
  });
  const spanRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetchTodos();
        console.log("Response data:", response.data);
        setTodo(response.data);
      } catch (error) {
        setError(error.message || "An error occurred while fetching todos");
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 m-4">
        {error}
      </div>
    );
  async function handleDelete(id) {
    if (!id) return;
    try {
      await deleteTodo(id);
      setTodo(todo.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Delete error:", error);
    }
  }
  async function handleAddTodo(e) {
    e.preventDefault();
    setError("");
    if (!newTodo.title || !newTodo.description) {
      setError("Title and description are required");
      return;
    }
    try {
      const response = await createTodo(newTodo);
      setTodo([...todo, response.data]);
      setNewTodo({ title: "", description: "", completed: false });
    } catch (error) {
      console.error("Add error:", error);
    }
  }
  const handleBlur = (e, field, id, currentItem) => {
    const newValue = e.target.innerText.trim();
    if (field === 'title' || field === 'description') {
      handleUpdate(
        id,
        field === 'title' ? newValue : currentItem.title,
        field === 'description' ? newValue : currentItem.description,
        currentItem.completed
      );
    }
  };
  const handleUpdate = async(id,title,description,completed) => {
    try {
      const updateData = {};
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (completed !== undefined) {
        updateData.completed = completed === true || completed === 'true';
      }
   
      const response = await updateTodo(id, updateData);
      
      setTodo(todo.map(item => 
        item._id === id ? { ...item, ...response.data } : item
      ));
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-10 text-center drop-shadow-lg hover:scale-105 transition-transform duration-300">
        TODO List
      </h1>
      <div>
        <form
          onSubmit={handleAddTodo}
          className="my-8 p-6 bg-white rounded-lg shadow-md"
        >
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Completed</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <input
                    type="text"
                    placeholder="Title"
                    value={newTodo.title}
                    onChange={(e) =>
                      setNewTodo({ ...newTodo, title: e.target.value })
                    }
                    className="border p-2 rounded w-full"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Description"
                    value={newTodo.description}
                    onChange={(e) =>
                      setNewTodo({ ...newTodo, description: e.target.value })
                    }
                    className="border p-2 rounded w-full"
                  />
                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={newTodo.completed}
                    onClick={() =>
                      setNewTodo({ ...newTodo, completed: !newTodo.completed })
                    }
                    className="form-checkbox m-6 h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                </td>

                <td>
                  <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors duration-300">
                    Add Todo
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
      {Array.isArray(todo) && todo.length > 0 ? (
        <div className="grid gap-4">
          {todo.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Completed
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <span
                        ref={spanRef}
                        contentEditable
                        suppressContentEditableWarning={true}
                        onBlur={(e)=>handleBlur(e,'title',item._id,item)}
                        className=" p-2 rounded w-4"
                      >
                        {item.title}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span
                        ref={spanRef}
                        contentEditable
                        suppressContentEditableWarning={true}
                        onBlur={(e)=>handleBlur(e,'description',item._id,item)}
                        className=" p-2 rounded w-4"
                      >
                        {item.description}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <input
                        type="checkbox"   
                        checked={item.completed}
                        onChange={(e)=>handleUpdate(item._id,item.title,item.description,!item.completed)}                  
                        className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </td>
                    <td>
                      <button
                        onClick={() => handleUpdate(item._id,item.title,item.description,item.completed)}
                        className="bg-blue-500 text-white m-1 px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300">
                        Update
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors duration-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">No todos available</p>
        </div>
      )}
    </div>
  );
}

export default Todo;
