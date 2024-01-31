import {NextFunction, Response} from "express";
import {ObjectId} from "mongoose";

import {MessageModel as Message, ConversationModel} from "../dataBase";
import {CustomRequest} from "../interfaces/func";

class MessageController {
    constructor() {
        this.createMessageWithFile = this.createMessageWithFile.bind(this);
        this.createMessage = this.createMessage.bind(this);
    }
    async createMessageWithFile(req: CustomRequest, res: Response, next: NextFunction) {
        const files = req.files?.files;
        try {
            const newFiles = [];

            if (files?.name) {
                const {url} = {url: ''};
            }
            console.log('req.body: ', req.body)
            console.log('req.files: ', req.files)
            res.status(200).json({message: 'Success'})
        } catch (e) {
            next(e);
        }
    }
    createMessage = async (sender: ObjectId | string, text: string, chatId: string, replyTo: ObjectId | string, createdAt: Date) => {
        try {
            const chat = await ConversationModel.findOne({_id: chatId});
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
            await chat.save();

            return message?._id;
        } catch (e) {
            console.error('Failed to send message: ', e)
        }
    }
}

export default new MessageController();