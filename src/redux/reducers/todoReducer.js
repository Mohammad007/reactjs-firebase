const initState = {
  todolist: [],
};

export const todoReducer = (state = initState, action) => {
  switch (action.type) {
    case "TODO":
      return {
        ...state,
        todolist: action.payload,
      };
    default:
      return state;
  }
};
