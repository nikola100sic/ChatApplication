import React, { useState } from "react";
import {
  ChatRoomContainer,
  InputUsername,
  Register,
  RegisterButton,
} from "./ChatRoom.styled";
import { over } from "stompjs";
import SockJS from "sockjs-client";

var stompClient = null;

const ChatRoom = () => {
  const [publicChats, setPublicChats] = useState([]);
  const [privateMessage, setPrivateMessage] = useState(new Map());
  const [userData, setUserData] = useState({
    username: "",
    recievername: "",
    connected: false,
    message: "",
  });

  const handleUsername = (event) => {
    const { value } = event.target;
    setUserData({ ...userData, username: value });
  };

  const registerUser = () => {
    connect();
  };

  const connect = () => {
    let Sock = new SockJS("http://localhost:8080/ws");
    stompClient = over(Sock);
    stompClient.connect({}, onConnected, onError);
  };

  const onConnected = () => {
    setUserData({ ...userData, connected: true });
    stompClient.subscribe("/chatroom/public", onPublicMessageRecieved);
    stompClient.subscribe(
      "/user/" + userData.username + "/private",
      onPrivateMessageRecieved
    );
  };

  const onPublicMessageRecieved = (payload) => {
    let payloadData = JSON.parse(payload.body);
    switch (payloadData.status) {
      case "JOIN":
        break;
      case "MESSAGE":
        publicChats.push(payloadData);
        setPublicChats([...publicChats]);
        break;
    }
  };

  const onPrivateMessageRecieved = (payload) => {
    let payloadData = JSON.parse(payload);
  };

  const onError = (error) => {
    console.log(error);
  };
  return (
    <ChatRoomContainer>
      {userData.connected ? (
        <div></div>
      ) : (
        <Register>
          <InputUsername
            placeholder="Enter your username"
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
