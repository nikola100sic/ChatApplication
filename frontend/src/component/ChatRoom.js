import React, { useEffect, useState } from "react";
import { over } from "stompjs";
import SockJS from "sockjs-client";
import {
  Avatar,
  ChatBox,
  ChatContent,
  ChatMessages,
  ChatRoomContainer,
  InputMessage,
  InputUsername,
  Member,
  MemberList,
  Message,
  MessageData,
  NotificationBadge,
  Register,
  RegisterButton,
  SendButton,
  SendMessage,
} from "./ChatRoom.styled";
import { toast } from "react-toastify";

var stompClient = null;

const ChatRoom = () => {
  const [privateChats, setPrivateChats] = useState(new Map());
  const [publicChats, setPublicChats] = useState([]);
  const [tab, setTab] = useState("CHATROOM");
  const [userData, setUserData] = useState({
    username: "",
    receivername: "",
    connected: false,
    message: "",
  });
  const [newMessages, setNewMessages] = useState(new Map());

  useEffect(() => {
    console.log(userData);
  }, [userData]);

  const connect = () => {
    let Sock = new SockJS("http://localhost:8080/ws");
    stompClient = over(Sock);
    stompClient.connect({}, onConnected, onError);
  };

  const onConnected = () => {
    setUserData({ ...userData, connected: true });
    stompClient.subscribe("/chatroom/public", onMessageReceived);
    stompClient.subscribe(
      "/user/" + userData.username + "/private",
      onPrivateMessage
    );
    userJoin();
  };

  const userJoin = () => {
    var chatMessage = {
      senderName: userData.username,
      message: `${userData.username} has joined the chat!`,
      status: "JOIN",
    };
    stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
  };

  const onMessageReceived = (payload) => {
    var payloadData = JSON.parse(payload.body);
    switch (payloadData.status) {
      case "JOIN":
        if (!privateChats.get(payloadData.senderName)) {
          privateChats.set(payloadData.senderName, []);
          setPrivateChats(new Map(privateChats));
        }
        publicChats.push({
          senderName: "System",
          message: payloadData.message,
          status: "SYSTEM",
        });
        setPublicChats([...publicChats]);
        break;
      case "MESSAGE":
        if (tab !== "CHATROOM") {
          publicChats.push(payloadData);
          setPublicChats([...publicChats]);
        } else {
          publicChats.push(payloadData);
          setPublicChats([...publicChats]);

          if (tab !== "CHATROOM") {
            setNewMessages((prevMessages) => {
              const updatedMessages = new Map(prevMessages);
              const count = updatedMessages.get("CHATROOM") || 0;
              updatedMessages.set("CHATROOM", count + 1);
              return updatedMessages;
            });
          }
        }
        break;
    }
  };

  const onPrivateMessage = (payload) => {
    var payloadData = JSON.parse(payload.body);

    const senderName = payloadData.senderName;

    if (privateChats.get(senderName)) {
      privateChats.get(senderName).push(payloadData);
      setPrivateChats(new Map(privateChats));
    } else {
      let list = [payloadData];
      privateChats.set(senderName, list);
      setPrivateChats(new Map(privateChats));
    }

    if (tab !== senderName) {
      setNewMessages((prevMessages) => {
        const updatedMessages = new Map(prevMessages);
        const count = updatedMessages.get(senderName) || 0;
        updatedMessages.set(senderName, count + 1);
        return updatedMessages;
      });
    }
  };

  const onError = (err) => {
    console.log(err);
  };

  const handleMessage = (event) => {
    const { value } = event.target;
    setUserData({ ...userData, message: value });
  };

  const sendValue = () => {
    if (!userData.message.trim()) {
      toast.warning("Please enter text");
      return;
    }
    if (stompClient) {
      var chatMessage = {
        senderName: userData.username,
        message: userData.message,
        status: "MESSAGE",
      };
      stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
      setUserData({ ...userData, message: "" });
    }
  };

  const sendPrivateValue = () => {
    if (!userData.message.trim()) {
      toast.warning("Please enter text");
      return;
    }
    if (stompClient) {
      var chatMessage = {
        senderName: userData.username,
        receiverName: tab,
        message: userData.message,
        status: "MESSAGE",
      };

      if (userData.username !== tab) {
        privateChats.get(tab).push(chatMessage);
        setPrivateChats(new Map(privateChats));
      }
      stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
      setUserData({ ...userData, message: "" });
      setNewMessages(new Map(newMessages.set(tab, false)));
    }
  };

  const handleUsername = (event) => {
    const { value } = event.target;
    setUserData({ ...userData, username: value });
  };

  const registerUser = () => {
    if (!userData.username.trim()) {
      toast.warning("Please enter your username!");
      return;
    }
    connect();
  };

  return (
    <ChatRoomContainer>
      {userData.connected ? (
        <ChatBox>
          <MemberList>
            <ul>
              <Member
                onClick={() => setTab("CHATROOM")}
                active={tab === "CHATROOM"}
              >
                Public chatroom
                {newMessages.get("CHATROOM") > 0 && (
                  <NotificationBadge>
                    {newMessages.get("CHATROOM")}
                  </NotificationBadge>
                )}
              </Member>
              {[...privateChats.keys()].map((name, index) => (
                <Member
                  key={index}
                  onClick={() => {
                    setTab(name);
                    if (newMessages.has(name)) {
                      setNewMessages(new Map(newMessages.set(name, 0)));
                    }
                  }}
                  active={tab === name}
                >
                  {name}
                  {newMessages.get(name) > 0 && (
                    <NotificationBadge>
                      {newMessages.get(name)}
                    </NotificationBadge>
                  )}
                </Member>
              ))}
            </ul>
          </MemberList>
          <ChatContent>
            <ChatMessages>
              {tab === "CHATROOM"
                ? publicChats.map((chat, index) => (
                    <Message
                      key={index}
                      self={chat.senderName === userData.username}
                    >
                      {chat.senderName !== userData.username && (
                        <Avatar>
                          {chat.senderName.charAt(0).toUpperCase()}
                        </Avatar>
                      )}
                      <MessageData self={chat.senderName === userData.username}>
                        {chat.message}
                      </MessageData>
                      {chat.senderName === userData.username && (
                        <Avatar>
                          {chat.senderName.charAt(0).toUpperCase()}
                        </Avatar>
                      )}
                    </Message>
                  ))
                : privateChats.get(tab).map((chat, index) => (
                    <Message
                      key={index}
                      self={chat.senderName === userData.username}
                    >
                      {chat.senderName !== userData.username && (
                        <Avatar>
                          {chat.senderName.charAt(0).toUpperCase()}
                        </Avatar>
                      )}
                      <MessageData self={chat.senderName === userData.username}>
                        {chat.message}
                      </MessageData>
                      {chat.senderName === userData.username && (
                        <Avatar>
                          {chat.senderName.charAt(0).toUpperCase()}
                        </Avatar>
                      )}
                    </Message>
                  ))}
            </ChatMessages>
            <SendMessage>
              <InputMessage
                type="text"
                placeholder="Write a message..."
                value={userData.message}
                onChange={handleMessage}
              />
              <SendButton
                onClick={tab === "CHATROOM" ? sendValue : sendPrivateValue}
              >
                Send
              </SendButton>
            </SendMessage>
          </ChatContent>
        </ChatBox>
      ) : (
        <Register>
          <InputUsername
            placeholder="Enter your name"
            value={userData.username}
            onChange={handleUsername}
          />
          <RegisterButton onClick={registerUser}>Register</RegisterButton>
        </Register>
      )}
    </ChatRoomContainer>
  );
};

export default ChatRoom;
