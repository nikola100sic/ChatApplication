package com.chatApplication.chatApplication.controller;

import com.chatApplication.chatApplication.model.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/message")//    app/message
    @SendTo("/chatroom/public")
    public Message RecievePublicMessage(@Payload Message message) {
        return message;
    }

    @MessageMapping("/private-message")
    public Message RecievePrivateMessage(@Payload Message message) {
        simpMessagingTemplate.convertAndSendToUser(message.getReceiverName(), "/private", message); //  user/Nikola/private
        return message;
    }
}
