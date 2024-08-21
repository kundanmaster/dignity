"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import DashboardLayout from '@/components/server/user/dashboard/DashboardLayout'
import { useAuth } from "@/hooks/auth/authContext";
import SearchableSelect from "@/components/client/common/SearchableSelect";
import Image from "next/image";
import { IoSendOutline } from "react-icons/io5";
import { ClipLoader } from "react-spinners";

const MessagePage = () => {
  const [newMessage, setNewMessage] = useState(false);
  const [chatRoomVisible, setChatRoomVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [users, setUsers] = useState([]);
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get("/apiRoutes/messages");
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get("/apiRoutes/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchMessages();
    fetchUsers();
  }, []);

  const handleNewMessage = () => {
    setNewMessage(true);
    setChatRoomVisible(false);
  };

  const handleSendMessage = async (recipient, content) => {
    console.log(recipient, content);
    if (!recipient || !content) {
      console.error("Recipient and message content are required");
      return;
    }

    try {
      const newMessageData = {
        sender_id: user?.id,
        receiver_id: recipient,
        content,
        sent_at: new Date().toISOString(),
      };
      const response = await axios.post("/apiRoutes/messages", newMessageData);
      setMessages([...messages, response.data]);
      setNewMessage(false);
      setCurrentChatId(response.data.conversation_id);
      setChatRoomVisible(true);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleChatSelect = (chatId) => {
    setLoading(true);
    setCurrentChatId(chatId);
    setChatRoomVisible(true);
    setMessageInput(""); // Clear message input when selecting a new chat
    setNewMessage(false); // Close the new message form when a chat is selected
    setLoading(false); // Set loading to false after fetching messages
  };

  const handleSendMessageInChat = async () => {
    if (!currentChatId || !messageInput.trim()) return; // Exit if no chat selected or message is empty

    try {
      const newMessageData = {
        sender_id: user.id,
        receiver_id: messages.find(
          (msg) => msg.conversation_id === currentChatId
        ).receiver_id,
        content: messageInput,
        sent_at: new Date().toISOString(),
      };
      const response = await axios.post("/apiRoutes/messages", newMessageData);
      setMessages([...messages, response.data]);
      setMessageInput("");
    } catch (error) {
      console.error("Error sending message in chat:", error);
    }
  };

  const getCurrentChatMessages = () => {
    return messages.filter((msg) => msg.conversation_id === currentChatId);
  };

  return (
    <DashboardLayout>
      <div className="flex bg-white rounded-md shadow-md">
        <div className="w-1/4 p-4 border-r">
          <button onClick={handleNewMessage} className="btn-design-1">
            <span className="btn-background"></span>
            <span className="relative">New Message</span>
          </button>

          <ChatList messages={messages} loading={loading} onSelect={handleChatSelect} />
        </div>
        <div className="w-3/4 p-4">
          {newMessage && (
            <MessageForm
              onSendMessage={handleSendMessage}
              users={users}
              onCloseForm={() => setNewMessage(false)}
            />
          )}
          {chatRoomVisible && currentChatId && (
            <ChatRoom
              user={user}
              chatMessages={getCurrentChatMessages()}
              messageInput={messageInput}
              setMessageInput={setMessageInput}
              onSendMessage={handleSendMessageInChat}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

const MessageForm = ({ onSendMessage, users, onCloseForm }) => {
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(
          "/apiRoutes/manage-instructor"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch students");
        }
        const data = await response.json();
        setStudents(data.users);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);
  console.log("students", students);

  const handleSelectChange = (value) => {
    setRecipient(value);
  };

  const handleSend = () => {
    onSendMessage(recipient?.value, message);
    setMessage("");
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Write new messages</h2>
      <div className="mb-4">
        <label className="block mb-1">Recipient</label>
        <div className="md:w-1/2">
          <SearchableSelect
            options={students.map((student) => ({
              label:
                student.id + " - " + student.firstname + " " + student.lastname,
              value: student.id,
            }))}
            onSelect={(value) => handleSelectChange(value)}
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="block mb-1">Type your message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="block w-full p-2 border rounded"
        />
      </div>
      <button onClick={handleSend} className="btn-design-1">
          <span className="btn-background"></span>
          <span className="relative"><IoSendOutline /></span>
        </button>

      <button
        onClick={onCloseForm} // Close form button
        className="ml-2 bg-gray-300 text-gray-800 hover:bg-gray-400 p-2 rounded-md"
      >
        Cancel
      </button>
    </div>
  );
};

const ChatRoom = ({
  user,
  chatMessages,
  messageInput,
  setMessageInput,
  onSendMessage,
}) => {
  if (!chatMessages || chatMessages.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <h2 className="text-xl font-semibold mb-4">Chat</h2>
        <div className="flex-grow overflow-y-auto border p-2 rounded mb-4">
          <p>No messages</p>
        </div>
        <div className="flex">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            className="flex-grow p-2 border rounded"
            placeholder="Enter your text"
          />
          <button onClick={onSendMessage} className="btn-design-1">
          <span className="btn-background"></span>
          <span className="relative"><IoSendOutline /></span>
        </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-semibold mb-4">
        Chat with{" "}
        {chatMessages[0]?.receiver_id === user?.id
          ? chatMessages[0]?.sender_id
          : chatMessages[0]?.receiver_id}
      </h2>
      <div className="flex-grow overflow-y-auto border p-2 rounded mb-4 h-[47rem]">
        {chatMessages.map((msg, index) => {
          const messageDate = new Date(msg.sent_at);
          const formattedDate = messageDate.toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });
          const formattedTime = messageDate.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "numeric",
          });

          return (
            <div
              key={index}
              className={`flex mb-2 ${
                msg.sender_id === user?.id ? "justify-end" : "justify-start"
              }`}
            >
              {msg.sender_id === user?.id ? (
                <>
                  <div className="flex flex-col">
                    <div className="bg-amber-100 p-2 rounded-lg max-w-xs min-w-fit relative">
                      <div className="font-semibold">You</div>
                      <div>{msg.content}</div>
                    </div>
                    <div className="text-xs text-right text-gray-500 mt-1  bottom-[-1.5rem] right-0">
                      {formattedDate}, {formattedTime}
                    </div>
                  </div>
                  <Image
                    src="/images/logo.png"
                    alt={`Avatar of ${user.id}`}
                    width={30}
                    height={30}
                    className="ring-2 ring-primarygold rounded-full h-8 w-8 ml-2"
                  />
                </>
              ) : (
                <>
                  <Image
                    src="/images/logo.png"
                    alt={`Avatar of ${msg.sender_id}`}
                    width={20}
                    height={20}
                    className="ring-2 ring-primarygold rounded-full h-8 w-8 mr-2"
                  />
                  <div className="flex flex-col">
                    <div className="bg-gray-200 p-2 rounded-lg max-w-xs min-w-fit relative">
                      <div className="font-semibold">{msg.sender_id}</div>
                      <div>{msg.content}</div>
                    </div>
                    <div className="text-xs text-left text-gray-500 mt-1 bottom-[-1.5rem] left-0">
                      {formattedDate}, {formattedTime}
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex">
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          className="flex-grow p-2 border rounded"
          placeholder="Enter your text"
        />

        <button onClick={onSendMessage} className="btn-design-1">
          <span className="btn-background"></span>
          <span className="relative"><IoSendOutline /></span>
        </button>
      </div>
    </div>
  );
};

const ChatList = ({ messages, onSelect,loading }) => {
  const [activeConversationId, setActiveConversationId] = useState(null);
  const conversations = [
    ...new Set(messages.map((msg) => msg.conversation_id)),
  ];

  const handleSelect = (conversationId) => {
    setActiveConversationId(conversationId);
    onSelect(conversationId);
  };

  return (
    <>
    {loading ? (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader size={50} color={"#F27B21"} />
      </div>
    ) : (
    <div className="mt-4">
      {conversations.map((conversationId) => (
        <div
          key={conversationId}
          className={`flex items-center p-2 cursor-pointer gap-4 mt-2 rounded-lg ${
            activeConversationId === conversationId
              ? "bg-orange-200 border-orange-200"
              : "hover:bg-orange-200 hover:border-orange-200"
          }`}
          onClick={() => handleSelect(conversationId)}
        >
          <div className="rounded-full bg-orange-200 border-2 border-orange-200 px-2">
            {conversationId}
          </div>
          Conversation
        </div>
      ))}
    </div>
    )}
    </>
  );
};

export default MessagePage;
