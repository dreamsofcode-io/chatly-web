import { useState, useEffect } from "react";
import "./App.css";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { io } from "socket.io-client";

const classNames = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

const colorForName = (name) => {
  const colors = [
    "ctp-green",
    "ctp-pink",
    "ctp-red",
    "ctp-peach",
    "ctp-blue",
    "ctp-teal",
  ];

  name = name.toLowerCase();

  let sum = 0;
  for (let i = 0; i < name.length; i++) {
    sum += name.charCodeAt(i);
  }
  let index = sum % colors.length;

  return colors[index];
};

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [currentRoom, setCurrentRoom] = useState("General");
  const [name, setName] = useState(null);
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = io("ws://localhost:3000");
    setSocket(socket);

    socket.on("connect", () => {
      setName(`anon-${socket.id}`);
      setConnected(true);
    });
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    let msg = {
      text: input,
      user: name,
      date: new Date(),
    };
    setMessages([...messages, msg]);
    setInput("");
  };

  const rooms = [
    "General",
    "C++",
    "Rust",
    "Go",
    "Python",
    "Java",
    "JavaScript",
  ];

  return (
    <>
      <main className="h-screen w-screen flex text-ctp-text">
        <aside className="w-96 bg-ctp-crust p-4">
          <div className="bg-ctp-base p-4 rounded-lg mb-4 h-full">
            <h1 className="text-2xl text-center text-white font-bold mb-4">
              Rooms
            </h1>
            <ul className="mt-4">
              {rooms?.map((room, index) => (
                <li
                  key={room}
                  className={classNames(
                    "relative flex justify-between gap-x-6 px-4 py-5 hover:bg-ctp-mantle sm:px-6 w-full rounded-md cursor-pointer",
                    currentRoom === room ? "bg-ctp-mantle" : "",
                  )}
                  onClick={() => setCurrentRoom(room)}
                >
                  <div className="flex flex-row justify-between w-full align-middle">
                    <p className="text-lg font-medium text-ctp-text">{room}</p>
                    <ChevronRightIcon className="h-6 w-6 text-ctp-blue" />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
        <div className="h-screen p-4 pl-0 bg-ctp-crust flex flex-col flex-grow justify-end">
          <div className="bg-ctp-base p-4 rounded-lg mb-4 flex-grow">
            <h1 className="text-2xl text-center text-white font-bold mb-4">
              {currentRoom}
            </h1>

            <ul className="">
              {messages?.map((msg, index) => (
                <li
                  key={index}
                  className="flex w-full justify-start gap-x-4 mb-4 align-top"
                >
                  <div>
                    <div className="flex flex-row gap-x-2 items-center">
                      <p
                        className={classNames(
                          "text-sm font-semibold",
                          `text-${colorForName(msg.user)}`,
                        )}
                      >
                        {msg.user}
                      </p>
                    </div>
                    <p className="text-ctp-text mt-1 text-lg">{msg.text}</p>
                  </div>
                  <p className="text-ctp-text text-sm">
                    {msg.date.toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <form className="flex" onSubmit={sendMessage}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 p-2 rounded-l-md bg-ctp-text text-ctp-base"
            />
            <button
              type="submit"
              className="bg-ctp-blue text-ctp-base p-2 rounded-r-md"
            >
              Send
            </button>
          </form>
        </div>
      </main>
    </>
  );
}

export default App;
