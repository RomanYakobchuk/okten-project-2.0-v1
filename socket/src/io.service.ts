import {ISocketUser} from "./interfaces/socket";

global.onlineUsers = new Map();
global.onlineInstitution = new Map();


let users: ISocketUser[] = [];
let institutions = new Map();

const addUser = (userId: string, socketId: string) => {
    if (!users.some(user => user.userId === userId)) {
        users?.filter((user) => user?.userId !== userId);
        users.push({userId, socketId});
    } else {
        users.push({userId, socketId});
    }
};

const addInstitution = (institutionId = '', socketId: string) => {
    const institutionSockets = institutions.get(institutionId) || [];
    institutionSockets.push(socketId);
    institutions.set(institutionId, institutionSockets);
};

const removeUser = (socketId: string) => {
    users = users.filter(user => user.socketId !== socketId)
};


const getUser = (userId: string) => {
    return users.find(user => user.userId === userId)
}

export {
    addInstitution,
    addUser,
    getUser,
    removeUser,
    institutions,
    users
}