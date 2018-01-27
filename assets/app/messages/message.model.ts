/**
 * Created by Aman on 1/2/2018.
 */


export class Message{
    content: string;
    username: string;
    messageId?: string;
    userId?: string;

    constructor(content: string,username: string, messageid?: string, userId?: string) {
        this.content = content;
        this.username = username;
        this.messageId = messageid;
        this.userId = userId;
    }
}