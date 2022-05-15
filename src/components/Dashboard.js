import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { firebaseapi } from "../firebase/firebaseapi";
import { todoAction } from "../redux/actions/todoAction";

export function Dashboard() {
  const [todoList, setTodoList] = useState("");
  const [categoryList, setCategoryList] = useState("");
  const [error, setError] = useState("");
  const [listId, setListId] = useState("");
  const [errorValidation, setErrorValidation] = useState({
    todolist: "",
    categorylist: "",
  });
  const dispatch = useDispatch();
  const getdata = useSelector((state) => state.todolist);

  // Get the list of todo lists
  useEffect(() => {
    let fireData = [];
    (async () => {
      try {
        const response = await fetch(`${firebaseapi}/todolist.json`);
        const data = await response.json();
        Object.keys(data).map((key) => {
          fireData.push({
            id: key,
            todolist: data[key].todoList,
            categorylist: data[key].categoryList,
          });
        });
        //console.log(fireData);
        dispatch(todoAction(fireData));
      } catch (error) {
        console.log(error);
      }
    })();
  }, [getdata]);

  // add todo list function
  const addTodoList = async () => {
    if (todoList === "")
      return setErrorValidation({
        ...errorValidation,
        todolist: "Todo list is required",
      });
    if (categoryList === "")
      return setErrorValidation({
        ...errorValidation,
        categorylist: "Category list is required",
      });

    const res = await fetch(`${firebaseapi}/todolist.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        todoList,
        categoryList,
      }),
    });
    if (res.status === 200) {
      setError("");
      setTodoList("");
      setCategoryList("");
      setErrorValidation({
        todolist: "",
        categorylist: "",
      });
    } else {
      setError("Something went wrong");
    }
  };

  // update todo list function
  const updateTodoList = async () => {
    try {
      const res = await fetch(`${firebaseapi}/todolist/${listId}.json`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          todoList,
          categoryList,
        }),
      });
      if (res.status === 200) {
        setError("");
        setTodoList("");
        setCategoryList("");
        setErrorValidation({
          todolist: "",
          categorylist: "",
        });
      } else {
        setError("Something went wrong");
      }
      console.log("Update To Do List");
    } catch (error) {
      console.log(error);
    }
  };

  //delete function
  const handleDelete = async (id) => {
    const deleteData = await fetch(`${firebaseapi}/todolist/${id}.json`, {
      method: "DELETE",
    });
  };

  // edit function
  const handleEdit = (data) => {
    setListId(data.id);
    setTodoList(data.todolist);
    setCategoryList(data.categorylist);
  };

  return (
    <div>
      <Container>
        <Row>
          <Col xs={6} className="mx-auto mt-3">
            <Form>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>To-Do</Form.Label>
                <Form.Control
                  type="text"
                  isInvalid={!!errorValidation.todolist}
                  placeholder="To-Do List"
                  value={todoList}
                  onChange={(e) => setTodoList(e.target.value)}
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Category</Form.Label>
                <Form.Select
                  onChange={(e) => setCategoryList(e.target.value)}
                  value={categoryList}
                  aria-label="Default select example"
                  isInvalid={!!errorValidation.categorylist}
                >
                  <option value="Today’s Tasks">Today’s Tasks</option>
                  <option value="Pending">Pending</option>
                  <option value="Abandon">Abandon</option>
                  <option value="Completed">Completed</option>
                  <option value="Inprogress">Inprogress</option>
                </Form.Select>
              </Form.Group>
            </Form>
            <Button
              variant="primary"
              onClick={listId ? updateTodoList : addTodoList}
            >
              {listId ? "Update" : "Add"}
            </Button>
            {error ? <p className="text-danger mt-3">{error}</p> : null}

            <Table striped bordered hover className="mt-5">
              <thead>
                <tr>
                  <th>#</th>
                  <th>To-Do</th>
                  <th>Category</th>
                  <th>Action</th>
                </tr>
              </thead>
                  <tbody>
                      {getdata.map((item, index) => (
                      <tr>
                        <td>{index + 1}</td>
                        <td>{item.todolist}</td>
                        <td>{item.categorylist}</td>
                        <td>
                          <Button
                            variant="primary"
                            className="btn btn-sm"
                            onClick={() => handleEdit(item)}
                          >
                            Edit
                          </Button>
                          &nbsp;
                          <Button
                            variant="danger"
                            className="btn btn-sm"
                            onClick={() => handleDelete(item.id)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                    </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
