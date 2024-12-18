package com.chatApplication.chatApplication.model;

import com.chatApplication.chatApplication.enumeration.Status;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class Message {

    private String senderName;

    private String receiverName;

    private String message;

    private String date;

    private Status status;
}
