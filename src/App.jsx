import { Fragment, useState, useRef, useEffect } from "react";
import "./App.css";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { io } from "socket.io-client";
import { Dialog, Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  Cog6ToothIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

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
  const onceRef = useRef(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setMessages([]);
    socket?.emit("join", currentRoom);
  }, [currentRoom]);

  useEffect(() => {
    if (onceRef.current) {
      return;
    }

    onceRef.current = true;

    const socket = io("ws://localhost:3000");
    setSocket(socket);

    socket.on("connect", () => {
      console.log("Connected to socket server");
      setName(`anon-${socket.id}`);
      setConnected(true);
      console.log("joining room", currentRoom);

      socket.emit("join", currentRoom);
    });

    socket.on("message", (msg) => {
      console.log("Message received", msg);
      msg.date = new Date(msg.date);
      setMessages((messages) => [...messages, msg]);
    });

    socket.on("messages", (msgs) => {
      console.log("Messages received", msgs);
      let messages = msgs.messages.map((msg) => {
        msg.date = new Date(msg.date);
        return msg;
      });
      setMessages(messages);
    });
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    socket?.emit("message", {
      text: input,
      room: currentRoom,
    });
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
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-50 lg:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button
                        type="button"
                        className="-m-2.5 p-2.5"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-ctp-base px-6 pb-4">
                    <div className="flex h-16 shrink-0 items-center">
                      <h1 className="text-2xl text-white font-bold py-4">
                        Rooms
                      </h1>
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <ul role="list" className="-mx-2 space-y-1">
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
                                  <p className="text-lg font-medium text-ctp-text">
                                    {room}
                                  </p>
                                  <ChevronRightIcon className="h-6 w-6 text-ctp-blue" />
                                </div>
                              </li>
                            ))}
                          </ul>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>
        <aside className="hidden lg:block lg:w-72 bg-ctp-crust p-4 pr-0">
          <div className="bg-ctp-base p-4 rounded-lg mb-4 h-full overflow-y-scroll">
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
        <div className="h-screen p-4 bg-ctp-crust flex flex-col flex-grow justify-end">
          <div className="bg-ctp-base rounded-t-lg flex-grow">
            <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-ctp-mantle px-2 sm:px-6 lg:hidden">
              <button
                type="button"
                className="-m-2.5 p-2.5 text-gray-400 lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>
              <div className="flex-1 text-sm font-semibold leading-6 text-white">
                <h1 className="text-2xl text-white font-bold py-4">
                  {currentRoom}
                </h1>
              </div>
            </div>

            <h1 className="hidden lg:block text-2xl text-center text-white font-bold my-4">
              {currentRoom}
            </h1>

            <ul className="p-4">
              {messages?.map((msg, index) => (
                <li
                  key={index}
                  className="flex w-full justify-start gap-x-4 mb-4 align-top"
                >
                  <div>
                    <div className="flex flex-row gap-x-6 items-center">
                      <p
                        className={classNames(
                          "text-sm font-semibold",
                          `text-${colorForName(msg.user)}`,
                        )}
                      >
                        {msg.user}
                      </p>
                      <p className="text-ctp-text text-sm">
                        {msg.date.toLocaleString()}
                      </p>
                    </div>
                    <p className="text-ctp-text mt-1 text-lg">{msg.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <form className="flex h-11" onSubmit={sendMessage}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 p-2 rounded-l-md bg-ctp-text text-ctp-base placeholder-ctp-subtext0"
              placeholder="Enter something englightened..."
            />
            <button
              type="submit"
              className="bg-ctp-blue px-6 font-bold text-ctp-base p-2 rounded-r-md"
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
