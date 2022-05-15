// create action
export const todoAction = (todolist) => {
    return {
        type: 'TODO',
        payload: todolist
    }
}