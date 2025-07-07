package com.example.projectschedulehaircutserver.service.chatbot;

import com.example.projectschedulehaircutserver.exeption.LoginException;

public interface ChatBotService {
    String processMessage(String message) throws LoginException;


}
