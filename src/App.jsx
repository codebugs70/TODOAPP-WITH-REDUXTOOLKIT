import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { addNewTodo, deleteTodo, editTodo } from "./redux/todoSlice";
import { IoSearch } from "react-icons/io5";

// SORT OPTIONS
const sortOption = ["All", "Completed", "Uncompleted", "Editted"];

function App() {
  const dispatch = useDispatch();
  const { todoList } = useSelector((state) => state.todo);
  const [value, setValue] = useState("");
  const [editedItemId, setEditedItemId] = useState(null);
  const [activeOption, setActiveOption] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  /* ADD & UPDATE TODO */
  const addTodo = () => {
    if (!value.trim()) return;

    if (editedItemId !== null) {
      const updatedTodo = todoList.find((item) => item.id === editedItemId);
      dispatch(
        editTodo({ ...updatedTodo, text: value, updatedAt: Date.now() })
      );
      toast.success("Todo updated!");
      setEditedItemId(null);
    } else {
      const newTodo = {
        id: uuidv4(),
        text: value,
        completed: false,
        createdAt: Date.now(),
      };

      dispatch(addNewTodo(newTodo));
      toast.success("New todo added!");
    }

    setValue("");
  };

  /* DELETE TODO */
  const deleteTodoItem = (todoId) => {
    dispatch(deleteTodo(todoId));
  };

  /* UPDATE TODO */
  const editTodoItem = (todoId) => {
    const editedTodo = todoList.find((item) => item.id === todoId);
    setValue(editedTodo.text);
    setEditedItemId(todoId);
  };

  /* CHECK TODO COMPLETED */
  const checkTodo = (todoId) => {
    const checkedTodo = todoList.find((item) => item.id === todoId);
    dispatch(editTodo({ ...checkedTodo, completed: !checkedTodo.completed }));
  };

  /* FILTER & SEARCH TODOS */
  const filteredTodos = todoList
    .filter((todo) => {
      if (activeOption === "Completed") {
        return todo.completed;
      } else if (activeOption === "Uncompleted") {
        return !todo.completed;
      } else if (activeOption === "Editted") {
        return todo.updatedAt !== undefined;
      } else {
        return true;
      }
    })
    .filter((todo) =>
      todo.text.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <section className="w-full max-w-[650px] mx-auto my-10 p-5 bg-white shadow-md rounded-lg">
      {/* TITLE */}
      <h1 className="text-center py-3 font-medium text-xl">
        TODO LIST WITH{" "}
        <span className="text-[#593D88] font-bold">REDUX TOOLKIT</span>
      </h1>

      {/* ADD NEW TODO BOX */}
      <div className="flex items-center gap-2 w-full ">
        <input
          className="w-full border-2 focus:border-blue-500 border-gray-300 outline-none p-4 rounded-lg"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Write something..."
        />
        <span
          onClick={addTodo}
          className="flex-shrink-0 cursor-pointer w-[57px] bg-blue-500 text-white h-[57px] flex items-center justify-center rounded-lg hover:bg-blue-600"
        >
          <FaPlus size={20} />
        </span>
      </div>

      {/* SORT TODO OPTIONS */}
      <div className="my-5 flex  gap-2 items-center">
        <span>Sort:</span>
        {sortOption.map((item) => (
          <span
            onClick={() => setActiveOption(item)}
            className={`${
              activeOption === item
                ? "bg-blue-500 text-white"
                : "bg-blue-50 border-blue-400 text-blue-500"
            } px-4 py-2 text-xs cursor-pointer  border font-medium  rounded-full`}
            key={item}
          >
            {item}
          </span>
        ))}
      </div>

      {/* SEARCH TODOS */}
      <div className="mb-5 relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <IoSearch size={20} />
        </div>
        <input
          className="w-full border-2 focus:border-blue-500 placeholder:text-sm border-gray-300 outline-none p-2 pl-10 rounded-lg"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Find your todo..."
        />
      </div>

      {/* RENDER TODOS */}
      <ul className="space-y-5 mt-5">
        {filteredTodos.length === 0 && (
          <div className="text-center opacity-80 font-medium">
            Not found any todos
          </div>
        )}

        {filteredTodos.map((item) => (
          <li
            key={item.id}
            className="w-full border border-gray-200 rounded-lg p-4 hover:bg-slate-100 flex items-center justify-between"
          >
            <input
              checked={item.completed}
              onChange={() => checkTodo(item.id)}
              type="checkbox"
              className="mr-3 w-6 h-6"
            />
            <div className={`${item.completed ? "line-through" : ""} flex-1`}>
              {item.text}
            </div>
            <div className="flex flex-shrink-0 items-center gap-4 font-medium">
              <span
                onClick={() => editTodoItem(item.id)}
                className="text-green-500 cursor-pointer"
              >
                Edit
              </span>
              <span
                onClick={() => deleteTodoItem(item.id)}
                className="text-red-500 cursor-pointer"
              >
                Delete
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default App;
