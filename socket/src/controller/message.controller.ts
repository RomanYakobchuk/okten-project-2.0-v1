import {MessageModel as Message} from "../dataBase";
import {IConversation} from "../interfaces/common";
import {ObjectId} from "mongoose";

class MessageController {
    createMessage = async (sender: ObjectId | string, receiver: string, text: string, chatId: string, replyTo: ObjectId | string, createdAt: Date) => {
        try {
            const chat = await Message.findById(chatId) as IConversation;
            if (!chat) {
                throw new Error("Chat not found");
            }

            const message = await Message.create({
                conversationId: chatId,
                sender,
                text,
                isSent: true,
                isError: false,
                isDelivered: false,
                isRead: false,
                createdAt
            });
            if (replyTo) {
                console.log('replyTo: ', replyTo)
                message.replyTo = replyTo as ObjectId;
                await message.save();
            }
            chat.lastMessage = {
                sender: sender as ObjectId,
                text: text,
                status: 'sent',
                updatedAt: new Date()
            };
            await chat.save({});

            return message?._id;
        } catch (e) {
            console.error('Failed to send message: ', e)
        }
    }
}

export default new MessageController();