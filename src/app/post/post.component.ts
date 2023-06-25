import { Component, Input, EventEmitter, Output } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { PostDetailComponent } from "./post-detail.component";

@Component({
    selector: 'post',
    templateUrl: './post.component.html',
    styleUrls: ['./post.component.css']
})


export class PostComponent{
    @Input() id: number = 0;
    @Input() title: string = '';
    @Input() url: string = '';
    @Input() thumbnailUrl: string = '';
    @Output() deletePostEvent = new EventEmitter<number>;
    @Output() imageUpdateEvent = new EventEmitter<{ id: number, url: string, title: string }>();

    constructor(private dialogRef: MatDialog) {}

    openDialog(): void {
        const dialogRef = this.dialogRef.open(PostDetailComponent, {
          data: {
            post: {
              id: this.id,
              title: this.title,
              url: this.url,
              thumbnailUrl: this.thumbnailUrl
            }
          }
        });

        dialogRef.componentInstance.deletePostEvent.subscribe((postId: number) => {
          this.deletePost(postId);
          dialogRef.close();
        });

        dialogRef.componentInstance.imageUpdateEvent.subscribe((eventData: { id: number, url: string, title: string }) => {
          this.saveEdit(eventData);
          dialogRef.close();
        });
      }


      saveEdit(eventData: { id: number, url: string, title: string }): void {
        this.imageUpdateEvent.emit(eventData);
    }

      deletePost(postId: number): void {
        this.deletePostEvent.emit(postId);
      }
    
      
}