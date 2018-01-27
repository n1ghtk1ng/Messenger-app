import {Message} from "./message.model";
import {Injectable, EventEmitter} from "@angular/core";
import {Http, Response, Headers} from "@angular/http";
import 'rxjs/Rx';
import {Observable} from "rxjs";
import {ErrorService} from "../../../errors/error.service";

@Injectable()

export class MessageService{
    private messages: Message[] = [];
    messageIsEdit = new EventEmitter<Message>();

    constructor(private http: Http, private errorService: ErrorService) {
    }

    addMessage (message: Message) {

        const body = JSON.stringify(message);
        const headers = new Headers({'Content-type': 'application/json'});
        const token = localStorage.getItem('token')?'?token='+localStorage.getItem('token'):'';

        return this.http.post('http://localhost:3000/message'+token,body, {headers: headers})
            .map((response: Response)=> {
                const result = response.json();
                const message = new Message(result.obj.content,result.obj.user.firstName,result.obj._id, result.obj.user._id);
                this.messages.push(message);
                return message;
            })
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json())
            });
    }

    getMessage(){
        return this.http.get('http://localhost:3000/message')
            .map((response: Response)=> {
                    const messages = response.json().obj;
                    let transformedmessages: Message[] = [];

                    for(let message of messages) {
                        transformedmessages.push(new Message(message.content,message.user.firstName,message._id,message.user._id));
                    }
                    this.messages = transformedmessages;
                    return transformedmessages;
                })
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json())
            });
    }
    editMessage(message: Message) { // used to load the message into the input box
        this.messageIsEdit.emit(message);
    }

    updateMessage(message: Message) {
        const body = JSON.stringify(message);
        const headers = new Headers({'Content-type': 'application/json'});
        const token = localStorage.getItem('token')?'?token='+localStorage.getItem('token'):'';
        // console.log(body);
        return this.http.patch('http://localhost:3000/message/'+ message.messageId+token,body, {headers: headers})
            .map((response: Response)=> response.json())
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json())
            });
    }

    deleteMessage(message: Message) {
        this.messages.splice(this.messages.indexOf(message),1);
        const token = localStorage.getItem('token')?'?token='+localStorage.getItem('token'):'';
        return this.http.delete('http://localhost:3000/message/'+ message.messageId+token)
            .map((response: Response)=> response.json())
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json())
            });
    }


}