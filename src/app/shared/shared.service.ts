import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  deletePostEvent: EventEmitter<number> = new EventEmitter<number>();
  imageUpdateEvent: EventEmitter<{ id: number; albumId: number; url: string; title: string }> = new EventEmitter<{ id: number; albumId: number; url: string; title: string }>();

  deletePost(postId: number) {
    this.deletePostEvent.emit(postId);
  }

  updatePost(eventData: { id: number; albumId: number; url: string; title: string }): void {
    this.imageUpdateEvent.emit(eventData);
  }

  
}