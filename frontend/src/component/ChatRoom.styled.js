import styled from "styled-components";

export const ChatRoomContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  margin-top: 15px;
`;

export const ChatBox = styled.div`
  display: flex;
  width: 80%;
  height: 90%;
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  overflow: hidden;
`;

export const MemberList = styled.div`
  display: flex;
  background-color: #0d8df2;
  color: white;
  padding: 10px;
  flex-wrap: wrap;

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
`;

export const Member = styled.li`
  padding: 10px;
  margin-bottom: 5px;
  border-radius: 4px;
  cursor: pointer;
  background-color: ${({ active }) => (active ? "#44bd32" : "transparent")};
  font-weight: ${({ newMessage }) => (newMessage ? "bold" : "normal")};
  &:hover {
    background-color: #44bd32;
  }
`;

export const ChatContent = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #f7f9fc;
`;

export const ChatMessages = styled.ul`
  list-style: none;
  margin: 0;
  padding: 15px;
  overflow-y: auto;
  flex-grow: 1;
`;

export const Message = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  justify-content: ${({ self }) => (self ? "flex-end" : "flex-start")};
`;

export const Avatar = styled.div`
  width: 40px;
  height: 40px;
  background-color: #59b4dd;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  margin: 0 10px;
`;

export const MessageData = styled.div`
  background-color: ${({ self }) => (self ? "#44bd32" : "#dcdde1")};
  padding: 10px 15px;
  border-radius: 20px;
  color: ${({ self }) => (self ? "white" : "black")};
`;

export const SendMessage = styled.div`
  display: flex;
  padding: 10px;
  background-color: #ffffff;
`;

export const InputMessage = styled.input`
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #dcdde1;
  border-radius: 4px;
  margin-right: 10px;
  font-size: 16px;
`;

export const SendButton = styled.button`
  background-color: #44bd32;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  &:hover {
    background-color: #3d9946;
  }
`;

export const Register = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
`;

export const InputUsername = styled.input`
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #dcdde1;
  border-radius: 4px;
  font-size: 16px;
`;

export const RegisterButton = styled.button`
  background-color: #44bd32;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  &:hover {
    background-color: #3d9946;
  }
`;

export const NotificationBadge = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: #e84118;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 12px;
  font-weight: bold;
  margin-left: 10px;
`;
