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
  Register,
  RegisterButton,
  SendButton,
  SendMessage,
} from "./ChatRoom.styled";

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
        break;
      case "MESSAGE":
        publicChats.push(payloadData);
        setPublicChats([...publicChats]);
        break;
    }
  };

  const onPrivateMessage = (payload) => {
    var payloadData = JSON.parse(payload.body);
    if (privateChats.get(payloadData.senderName)) {
      privateChats.get(payloadData.senderName).push(payloadData);
      setPrivateChats(new Map(privateChats));
    } else {
      let list = [];
      list.push(payloadData);
      privateChats.set(payloadData.senderName, list);
      setPrivateChats(new Map(privateChats));
    }
    if (tab !== payloadData.senderName) {
      setNewMessages(new Map(newMessages.set(payloadData.senderName, true)));
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
    connect();
  };

  const Member = ({ active, onClick, children, newMessage }) => {
    return (
      <div
        className={`member ${active ? "active" : ""} ${
          newMessage ? "new-message" : ""
        }`}
        onClick={onClick}
      >
        {children}
      </div>
    );
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
              </Member>
              {[...privateChats.keys()].map((name, index) => (
                <Member
                  key={index}
                  onClick={() => setTab(name)}
                  active={tab === name}
                  newMessage={newMessages.has(name) && newMessages.get(name)}
                >
                  {name}
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
