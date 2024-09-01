import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Home = () => {
  const [todo, setTodo] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [detail, setDetail] = useState("");
  const [pokemon, setPokemon] = useState({});

  const navigate = useNavigate();

  const token = JSON.parse(window.localStorage.getItem("user"));

  useEffect(() => {
    fetchData(newTodo);
  }, [newTodo]);

  useEffect(() => {
      getPokemon();
  }, []);

  const handleOnClick = () => {
    window.localStorage.clear();
  };

  const fetchData = async (title?: string) => {
    console.log(title);

    const resp = await fetch(`http://localhost:3000/todo?title=${title}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => {
      return res.json();
    });

    setTodo(resp.data);
  };

  const handleCheckButton = async (data) => {
    await fetch(`http://localhost:3000/todo/${data.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        isDone: !data.isDone,
      }),
    }).then((res) => {
      return res.json();
    });

    fetchData();
  };

  const handleDeleteButton = async (id) => {
    await fetch(`http://localhost:3000/todo/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => {
      toast("success delete data");
      return res.json();
    });

    fetchData();
  };

  const handleAddButton = async () => {
    let resp = null;
    if (detail) {
      resp = await fetch(`http://localhost:3000/todo/${detail.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newTodo,
        }),
      }).then((res) => {
        return res.json();
      });
    } else {
      resp = await fetch(`http://localhost:3000/todo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newTodo,
        }),
      }).then((res) => {
        return res.json();
      });
    }

    if (resp.status === 201 || resp.status === 200) {
      toast(resp.message);
    }

    setDetail("");
    setNewTodo("");
    fetchData();
  };

  function getPokemon(id = Math.floor(Math.random() * 1000) + 1) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
      .then((response) => response.json())
      .then(function (data) {
        const result = {
          lnombre: data.name,
          url: data.sprites.other.dream_world.front_default,
        };
        setPokemon(result);
      });
  }

  return (
    <div className="flex justify-center items-center min-h-screen min-w-full bg-white">
      <div className="flex flex-col justify-center items-center gap-y-8 w-screen">
        <h1 className="text-8xl text-pink-400 text-center flex">
          Todos <img className="w-10" src={pokemon?.url} alt="" />
        </h1>
        <div className="flex flex-col gap-y-8 border p-8 w-1/3 rounded-md">
          <div className="flex justify-between items-center">
            <div>
              <label
                htmlFor="title"
                className="block mb-2 text-mdfont-medium text-gray-900"
              >
                Todo
              </label>
              <input
                type="text"
                id="title"
                value={newTodo}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-96 p-2.5"
                placeholder="Add new todo or search todo"
                onChange={(event) => setNewTodo(event.target.value)}
              />
            </div>
            <button
              className="bg-pink-500 px-8 py-2 rounded-xl text-white mt-6"
              onClick={() => handleAddButton()}
            >
              {detail ? "Update" : "Add"}
            </button>
          </div>
          <>
            {todo?.map((data, index) => (
              <div
                key={data.id}
                className="flex justify-between items-center gap-x-8"
              >
                <input
                  type="checkbox"
                  defaultChecked={data.isDone ? true : false}
                  onClick={() => {
                    handleCheckButton(data);
                  }}
                />
                <p
                  onClick={() => {
                    setDetail(data);
                    setNewTodo(data.title);
                  }}
                  className={
                    data.isDone === true ? "line-through" : "cursor-pointer"
                  }
                >
                  {data.title}
                </p>
                <button onClick={() => handleDeleteButton(data.id)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </>
        </div>
        <button
          className="bg-pink-500 px-8 py-2 rounded-xl text-white"
          onClick={() => {
            handleOnClick();
            navigate("/login");
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Home;
