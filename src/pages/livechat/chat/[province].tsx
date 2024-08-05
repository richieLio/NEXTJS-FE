import React, {
  useEffect,
  useState,
  useRef,
  FormEvent,
  useContext,
} from "react";
import { io, Socket } from "socket.io-client";
import { Button, Input, Avatar } from "@nextui-org/react";
import { useRouter } from "next/router";
import { db } from "../../../../firebaseConfig"; // Import Firestore
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  DocumentData,
} from "firebase/firestore"; // Import Firestore functions
import { UserContext } from "../../../components/UserContext";

const socket: Socket = io("http://localhost:4000"); // Corrected address of the server

interface Message {
  userId: string;
  name: string;
  message: string;
  province: string;
  createdAt: { seconds: number; nanoseconds: number }; // Adjust according to Firestore Timestamp
}

const Chat: React.FC = () => {
  const context = useContext(UserContext);

  // Ensure context is not undefined
  if (!context) {
    throw new Error("UserContext is not available");
  }

  const { user } = context;
  const router = useRouter();
  const { province } = router.query;

  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!province) return; // Ensure province is available

    socket.emit("join-room", province);

    socket.on("user-chat", (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    const fetchMessages = async () => {
      try {
        const q = query(
          collection(db, "messages"),
          where("province", "==", province),
          orderBy("createdAt", "asc")
        );
        const querySnapshot = await getDocs(q);
        const fetchedMessages: Message[] = querySnapshot.docs.map(
          (doc) => doc.data() as Message
        );
        setMessages(fetchedMessages);
      } catch (error) {
        console.error("Error fetching messages: ", error);
      }
    };

    fetchMessages(); // Fetch messages on component mount

    return () => {
      socket.off("user-chat");
    };
  }, [province]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // Auto-scroll on messages update

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      return;
    }

    const newMessage: Message = {
      userId: user.userId,
      name: user.fullName, // Correctly reference user's full name
      message,
      province: province as string, // Cast province to string
      createdAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 },
    };

    // Save message to Firestore
    try {
      await addDoc(collection(db, "messages"), newMessage);
      console.log(messages);
    } catch (error) {
      console.error("Error adding document: ", error);
    }

    socket.emit("on-chat", newMessage);
    setMessage("");
  };

  const formatDate = (timestamp: { seconds: number; nanoseconds: number }) => {
    if (!timestamp) return "";
    const date = new Date(
      timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
    );
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZoneName: "short",
    };
    const dateString = date.toLocaleString("en-GB", options).replace(/,/, "");
    return dateString.replace(/ GMT.*$/, "");
  };

  return (
    <div className="max-w-2xl mx-auto p-5 flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto pt-16 pb-20">
        <ul className="list-none p-0 mb-15">
          {messages.map((msg, index) => (
            <li
              key={index}
              className={`flex items-start mb-2 p-2 rounded-lg ${
                msg.userId === user.userId ? "self-end" : "self-start"
              } ${
                msg.name === user.fullName ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <Avatar
                isBordered
                radius="full"
                showFallback
                src="https://images.unsplash.com/broken"
                className={`w-10 h-10 mr-2 ${msg.name === user.fullName ? "ml-2" : ""} ${
                  msg.name === user.fullName ? "ml-2" : "mr-2"
                }`}
              />
              <div
                className={`flex flex-col ${
                  msg.userId === user.userId ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`text-xs mb-1 ${
                    msg.name === user.fullName ? "text-right" : ""
                  }`}
                >
                  {msg.userId !== user.userId && msg.name}
                </div>
                <div
                  className={`bg-${
                    msg.userId === user.userId ? "primary" : "white"
                  } p-2 rounded-lg text-sm ${
                    msg.userId === user.userId ? "text-white" : "text-gray-800"
                  } max-w-[50%] break-words shadow-md ${
                    msg.userId === user.userId ? "ml-auto" : "mr-auto"
                  }`}
                >
                  {msg.message}
                  <div
                    className={`text-xs ${
                      msg.userId === user.userId
                        ? "text-white"
                        : "text-gray-600"
                    } mt-1 text-right`}
                  >
                    {formatDate(msg.createdAt)}
                  </div>
                </div>
              </div>
            </li>
          ))}
          <div ref={messagesEndRef} />
        </ul>
      </div>
      <div className="mt-auto">
        <form
          onSubmit={sendMessage}
          className="flex w-full"
        >
          <Input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            variant="flat"
            size="sm"
            className="flex-1 mr-2"
          />
          <Button type="submit" color="success" size="sm">
            Send
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
