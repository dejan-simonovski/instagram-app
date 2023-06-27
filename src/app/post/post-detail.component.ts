import { Component, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IFeed } from '../feed/feed';
import { FeedService } from '../feed/feed.service';
import { SharedService } from '../shared/shared.service';

@Component({
  templateUrl: './post-detail.component.html',
  styles: [`
  .postDetails{
    display: flex;
    justify-content: center;
  }
  
  #postDetailBack{
    position: relative;
    right: 50px;
    top: 20px;
  }

  .details{
    width: 500px;
    height: 20px;
    overflow: scroll;
  }
  
  .imageDetails{
    max-width: 100%;
    max-height: 400px; 
  }
  `]
})
export class PostDetailComponent {
  post: IFeed | undefined;
  isEditing: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sharedService: SharedService,
    private feedService: FeedService) {
      this.route.params.subscribe((params) => {
        const postId = +params['id'];
        this.feedService.getPost(postId).subscribe(
          (post) => {
            this.post = post;
          },
          (error) => {
            console.log('Error retrieving post:', error);
          }
        );
      });
  }

  deletePost(): void {
    const confirmation = confirm('Are you sure you want to delete this post?');
    if (confirmation && this.post?.id) {
      this.sharedService.deletePost(this.post.id);
    }
    this.router.navigate(['/home']);
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  saveEdit(): number {
    if (this.post) {
      const eventData = {
        id: this.post.id,
        albumId: this.post.albumId,
        url: this.post.url,
        title: this.post.title
      };
      this.sharedService.updatePost(eventData);
    }
    return 1;
  }

  handleUpdate(event: any): void {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const base64Image = e.target.result;
      if (this.post) {
        this.post.url = base64Image;
      }
    };

    reader.readAsDataURL(file);
  }
}
