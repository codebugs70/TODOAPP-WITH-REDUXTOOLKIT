import { createSlice } from "@reduxjs/toolkit";

export const todoSlice = createSlice({
  name: "todo",
  initialState: {
    todoList: [],
  },
  reducers: {
    addNewTodo: (state, action) => {
      state.todoList.unshift(action.payload);
    },
    deleteTodo: (state, action) => {
      const todoId = action.payload;
      state.todoList = state.todoList.filter((item) => item.id !== todoId);
    },
    editTodo: (state, action) => {
      const updatedTodo = action.payload;
      state.todoList = state.todoList.map((item) =>
        item.id === updatedTodo.id ? updatedTodo : item
      );
    },
    checkTodo: (state, action) => {
      const checkedTodo = action.payload;
      state.todoList = state.todoList.map((item) =>
        item.id === checkedTodo.id ? checkedTodo : item
      );
    },
  },
});

export const { addNewTodo, deleteTodo, editTodo, checkTodo, sortTodoList } =
  todoSlice.actions;

export default todoSlice.reducer;
