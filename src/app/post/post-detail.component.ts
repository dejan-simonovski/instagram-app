import { Component, Inject, EventEmitter, Output } from '@angular/core';
import { IFeed } from '../feed/feed';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    templateUrl: './post-detail.component.html',
    styleUrls: [`./post-detail.component.css`]
})

export class PostDetailComponent {
    
    post: IFeed | undefined;
    @Output() deletePostEvent = new EventEmitter<number>();
    @Output() imageUpdateEvent = new EventEmitter<{ id: number, url: string }>();
    isEditing: boolean = false;
    
    constructor(
      @Inject(MAT_DIALOG_DATA) public data: any
    ) {}
    
    deletePost(): void {
      const confirmation = confirm('Are you sure you want to delete this post?');
      if (confirmation) {
        const postId = this.data.post.id;
        this.deletePostEvent.emit(postId);
      }
    }
  
    toggleEdit(): void{
      this.isEditing = !this.isEditing;
    }

    saveEdit(): void {
      const eventData = {
        id: this.data.post.id,
        url: this.data.post.url,
        title: this.data.post.title
      };
      this.imageUpdateEvent.emit(eventData);
    }

    handleUpdate(event: any): void {
      const file = event.target.files[0];
      const reader = new FileReader();
  
      reader.onload = (e: any) => {
        const base64Image = e.target.result;
        this.data.post.url = base64Image;
      };
  
      reader.readAsDataURL(file);
    }
}