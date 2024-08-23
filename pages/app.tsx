import { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faEdit } from "@fortawesome/free-solid-svg-icons";
import DeleteConfirmModal from "@/components/Users/DeleteConfirmModal";
import AddTaskModal from "@/components/Users/AddTaskModal";
import EditTaskModal from "@/components/Users/EditTaskModal";
import Image from "next/image";
import { parseCookies, destroyCookie } from "nookies";

interface User {
  id: string;
  username: string;
}

interface Data {
  title: string;
  created_at: string;
  created_by: User;
  description: string;
  id: string;
  updated_at: string;
}

export default function App() {
  const router = useRouter();
  const [todos, setTodos] = useState<Data[]>([]);
  const [newTodo, setNewTodo] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    const checkAuth = async () => {
      const cookies = parseCookies();
      const getToken = cookies.token;

      if (!getToken) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch("/api/todo", {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            access_token: getToken,
          },
        });

        if (response.ok) {
          const res = await response.json();
          setToken(getToken);
          setTodos(res.data);
          // console.log(res.data)
        } else {
          console.error("fetch error");
          console.log(response);
        }
      } catch (error) {
        console.error(error);
      }
    };

    checkAuth();
  }, [router]);

  const addTodo = async () => {
    try {
      const response = await fetch("/api/create", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          access_token: token,
        },
        body: JSON.stringify({ title: newTodo, description }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      // console.log(result)
      if (result.isSuccess) {
        const newTodoItem = result.data;
        setTodos([
          ...todos,
          {
            title: newTodoItem.title,
            description: newTodoItem.description,
            created_at: newTodoItem.created_at,
            updated_at: newTodoItem.updated_at,
            id: newTodoItem.id,
            created_by: newTodoItem.created_by,
          },
        ]);
        setNewTodo("");
        setDescription("");
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error creating todo:", error);
    }
  };

  const confirmDelete = async () => {
    const index = todos[currentItem];

    try {
      const response = await fetch(`/api/delete/${index.id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          access_token: token,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete todo");
      }

      const result = await response.json();
      // console.log(result)

      if (result.isSuccess) {
        setTodos((prevTodos) => prevTodos.filter((_, i) => i !== currentItem));
        closeDeleteModal();
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const editTodo = async () => {
    const index = todos[currentItem];
    // console.log(index);

    try {
      const response = await fetch(`/api/update/${index.id}`, {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          access_token: token,
        },
        body: JSON.stringify({
          title: newTodo,
          description: description,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update todo");
      }

      const result = await response.json();
      // console.log(result);

      if (result.isSuccess) {
        setTodos((prevTodos) =>
          prevTodos.map((todo, i) =>
            i === currentItem
              ? {
                  ...todo,
                  title: newTodo,
                  description: description,
                  updated_at: new Date().toISOString(),
                }
              : todo
          )
        );
        closeEditModal();
      }
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const signOut = async () => {
    destroyCookie(null, "token");
    router.push("/login");
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewTodo(e.target.value);
  };

  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openDeleteModal = (index: number) => {
    setCurrentItem(index);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCurrentItem(null);
  };

  const openEditModal = (index: number) => {
    setCurrentItem(index);
    setNewTodo(todos[index].title);
    setDescription(todos[index].description);
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setCurrentItem(null);
    setNewTodo("");
    setDescription("");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <button
        onClick={openModal}
        className="bg-gradient-to-r from-indigo-700 to-red-400 rounded-xl font-bold text-xl text-white py-2 px-3 flex items-center justify-center"
      >
        + Add task
      </button>
      <AddTaskModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onAdd={addTodo}
        title={newTodo}
        description={description}
        onInputChange={handleInputChange}
        onDescriptionChange={handleDescriptionChange}
      />

      {todos.length === 0 ? (
        <div>
          <h2 className="text-semibold text-gray-400 mt-7 text-center">
            Empty task <br />
            Press + Add task to create new Task
          </h2>
          <Image
            src="/image/job-done.png"
            alt="job-done"
            width={400}
            height={267}
          />
        </div>
      ) : (
        <div className="w-full max-w-md mt-8 space-y-3 overflow-y-auto max-h-[50vh] hide-scrollbar">
          {todos.map((todo: any, index: any) => (
            <div
              key={index}
              className="bg-gradient-to-r from-indigo-700 to-red-400 p-[4px] rounded-full"
            >
              <div className="flex items-center  px-4 py-5 bg-white rounded-full justify-between hover:bg-gray-200">
                <div className="flex-grow max-w-xs pl-10">
                  <h3 className="font-bold text-xl pt-2 truncate ">
                    {todo.title}
                  </h3>
                  <div className="mt-2">
                    <p className="break-words text-sm text-gray-600">
                      {todo.description}
                    </p>
                  </div>
                </div>
                <div className="flex-shrink-0 flex space-x-4 ml-4 items-center ">
                  <button
                    onClick={(e) => {
                      openEditModal(index);
                    }}
                    className="text-blue-500"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <EditTaskModal
                    isOpen={isEditModalOpen}
                    onClose={closeEditModal}
                    title={newTodo}
                    description={description}
                    onInputChange={handleInputChange}
                    onDescriptionChange={handleDescriptionChange}
                    onAdd={editTodo}
                  />
                  <button
                    onClick={(e) => {
                      openDeleteModal(index);
                    }}
                    className="text-red-500"
                  >
                    <FontAwesomeIcon icon={faX} />
                  </button>
                  <DeleteConfirmModal
                    isOpen={isDeleteModalOpen}
                    onClose={closeDeleteModal}
                    onConfirm={confirmDelete}
                    title={todos[currentItem]?.title}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 text-center">
        <button
          onClick={signOut}
          className="bg-transparent  font-medium text-md py-2 px-3 flex items-center justify-center text-blue-600 hover:text-blue-500"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
