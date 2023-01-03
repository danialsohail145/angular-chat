import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  doc,
  Firestore,
  getDoc,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { concatMap, map, Observable, take } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private firestore: Firestore) { }

  get myChats$(): Observable<any[]> {
    const ref = collection(this.firestore, 'chats');
    const myQuery = query(
      ref,
      where('userIds', 'array-contains', 'one')
    );
    return collectionData(myQuery, { idField: 'id' }) as Observable<any[]>;
  }

  createChat() {
    const ref = collection(this.firestore, 'chats');
     addDoc(ref,{
      userIds: ["one","two"],
          users: [
            {
              displayName: 'user',
            },
            {
              displayName: 'user2',
            },
          ],
    })
  }

  isExistingChat(): Observable<string | null> {
    return this.myChats$.pipe(
      take(1),
      map((chats) => {
        for (let i = 0; i < chats.length; i++) {
          if (chats[i].userIds.includes('one')) {
            return chats[i].id;
          }
        }
        return null;
      })
    );
  }

  addChatMessage(chatId: string, message: string) {
    const ref = collection(this.firestore, 'chats', chatId, 'messages');
    const chatRef = doc(this.firestore, 'chats', chatId);
    const today = Timestamp.fromDate(new Date());
    addDoc(ref, {
      text: message,
      senderId: 'two',
      sentDate: today,
    })
    updateDoc(chatRef, { lastMessage: message, lastMessageDate: today })
  
  }

  getChatMessages$(chatId: string): Observable<any[]> {
    const ref = collection(this.firestore, 'chats', chatId, 'messages');
    const queryAll = query(ref, orderBy('sentDate', 'asc'));
    return collectionData(queryAll) as Observable<any[]>;
  }


  
}
