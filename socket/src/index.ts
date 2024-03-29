import express, {NextFunction, Response, Request} from "express";
import {createServer} from "http";
import mongoose, {Schema} from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import {Server} from "socket.io";
import { instrument } from "@socket.io/admin-ui";


import sanitizedConfig from "./configs";
import {MessageModel as Message} from "./dataBase";

import {removeUser, addUser, users, getUser} from "./io.service";
import {messageController} from "./controller";
import {ISocketUser} from "./interfaces/socket";
import {IMessage, INotification} from "./interfaces/common";
import {createdNewReservation, newNotification} from "./const";
import {NotificationRouter} from "./routes";

require("dotenv").config({path: `../.env`});

const app = express();
const server = createServer(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(function (req, res, next) {
    res.setHeader('Content-Type', 'application/json;charset=UTF-8')
    res.setHeader('Access-Control-Allow-Credentials', "*")
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next();
})

const io = new Server(server,
    {
        cors: {
            origin: [sanitizedConfig.CLIENT_URL, "https://admin.socket.io"],
            credentials: true
        }
    }
)
io.on("connection", (socket) => {
    console.log('|--------------------------------------------------');
    console.log(`| New user by socket: ${socket.id}`)
    socket.on('addUser', (userId) => {
        addUser(userId, socket.id);
        console.log(`| A user connected by id: ${userId}`);
        io.emit("getUsers", users);
    });

    socket.on('updateListUsers', (role) => {
        if (role === 'admin') {
            io.emit("getUsers", users);
        }
    })
    console.log('|--------------------------------------------------');
// Прийняття події входу користувача в чат
    socket.on('joinChat', (chatId) => {
        socket.join(chatId);
    });

    socket.on("sendMessage", async ({sender, receiver, text, chatId, replyTo, createdAt}) => {
        try {
            const _id = await messageController.createMessage(sender, receiver, text, chatId, replyTo, createdAt);

            const receiverSocket = getUser(receiver) as ISocketUser;
            const senderSocket = getUser(sender) as ISocketUser;
            io.to(chatId).emit("getMessage", {
                sender,
                chatId,
                receiver,
                text,
                createdAt,
                _id,
                isSent: true,
                isError: false,
                isDelivered: false,
                isRead: false
            });
            io.to(chatId).emit("isSent", {
                sender,
                chatId,
                receiver,
                text,
                createdAt,
                _id,
                isSent: true,
                isError: false,
                isDelivered: false,
                isRead: false
            });
            io.to([receiverSocket?.socketId, senderSocket?.socketId]).emit("getLastMessage", {
                sender,
                chatId,
                text,
                receiver,
                createdAt,
                updatedAt: new Date(),
                _id,
                isSent: true,
                isError: false,
                isDelivered: false,
                isRead: false
            });
        } catch (e) {
            console.error('Failed to send message: ', e)
            const receiverSocket = getUser(receiver) as ISocketUser;
            const senderSocket = getUser(sender) as ISocketUser;
            io.to([receiverSocket?.socketId, senderSocket?.socketId]).emit("getMessage", {
                sender,
                chatId,
                text,
                isError: true, // Передаємо стан "помилка" до клієнта
            });
        }
    });

    socket.on('delivered', async ({isDelivered, sender, message}) => {
        try {
            const senderSocket = getUser(sender) as ISocketUser;

            io?.to(senderSocket?.socketId).emit('isDelivered', {
                isDelivered,
                sender,
                message
            })

            const currentMessage = await Message.findOne({_id: message?._id}) as IMessage;

            currentMessage.isDelivered = isDelivered;

            await currentMessage.save();

        } catch (e) {
            console.error('Failed to send message: ', e)
            const senderSocket = getUser(sender) as ISocketUser;
            io.to(senderSocket?.socketId).emit("getMessage", {
                sender,
                message,
                isError: true, // Передаємо стан "помилка" до клієнта
            });
        }
    });

    socket.on('typing', (isTyping: boolean, receiver: string, chatId: string) => {
        const receiverSocket = getUser(receiver) as ISocketUser;
        io.to(receiverSocket?.socketId).emit('isTyping', {isTyping});
    });

    socket.on(createdNewReservation, async ({userId, notification}: { userId: string | Schema.Types.ObjectId, notification: INotification }) => {
        try {
            const senderSocket = getUser(userId as string) as ISocketUser;
            if (senderSocket?.socketId) {
                io.to(senderSocket?.socketId).emit(newNotification, notification);
            }

        } catch (e) {
            console.log(e)
        }
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected!");
        removeUser(socket.id)
        io.emit('getUsers', users)
    });
});
instrument(io, {
    auth: false,
});
app.use(`/socket.io/api/v1/notification`, NotificationRouter);

app.use(cors(
    {
        origin: [sanitizedConfig.CLIENT_URL, "https://admin.socket.io"],
        credentials: true
    }
));
app.use('*', (req, res) => {
    res.status(404).json('Route not found');
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.log(err)
    res
        ?.status(err?.status || 500)
        ?.send({
            error: err?.message || 'Unknown Error',
            code: err?.status || 500
        });
});
mongoose?.connect(sanitizedConfig.MONGO_URL).then(() => {
    console.log("|-------------------------------------------")
    console.log('| Connect: success')
    server.listen(+sanitizedConfig.SOCKET_PORT, sanitizedConfig.HOST, () => {
        console.log(`| Socket started on port http://localhost:${sanitizedConfig.SOCKET_PORT}`);
        console.log("|___________________________________________")
    });
}).catch(err => {
    console.log(err)
    console.log('Socket connect: error')
})