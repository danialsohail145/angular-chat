import { Component } from '@angular/core';
import { ChatService } from './services/chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'chat-app';
  constructor(private chatService : ChatService){}

  ngOnInit(){
    this.chatService.isExistingChat().subscribe(res=>{
      console.log(res)
      if(res === null){
        
        console.log("created")
        this.chatService.createChat()

        

      }else{
        this.chatService.addChatMessage(res,"third MESSAGE")
        this.chatService.getChatMessages$(res).subscribe(resp=>{
          console.log(resp)
        })
        
      }
    })
  }
}
