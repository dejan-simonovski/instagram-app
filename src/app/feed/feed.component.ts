import { Component, Input, OnInit } from '@angular/core';
import { IFeed } from './feed';
import { FeedService } from './feed.service';

@Component({
  selector: 'feed',
  templateUrl: './feed.component.html',
  styles: [`
    .postContainer {
      display: inline-block;
    }

    #loadMore{
      display: flex;
      justify-content: center;
    }

    #loadMore button{
      padding: 10px 100px 10px 100px;
      margin: 30px 0 50px 0;
    }
  `]
})
export class FeedComponent implements OnInit {
  errorMessage: string = '';
  posts: IFeed[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 50; // Set the number of items to load per page

  constructor(
    private feedService: FeedService,
  ) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.feedService.getFeed(this.currentPage, this.itemsPerPage).subscribe({
      next: (posts) => {
        this.posts = [...this.posts, ...posts]; // add new posts to existing posts
      },
      error: (err) => (this.errorMessage = err)
    });
  }

  onPostDelete(postId: number): void {
    this.feedService.deletePost(postId).subscribe(() => {
      const index = this.posts.findIndex((post) => post.id === postId);
      if (index !== -1) {
        this.posts.splice(index, 1);
      }
    },
    (error) => {
      this.errorMessage = error;
    });
  }

  loadMorePosts(): void {
    this.currentPage++;
    this.loadPosts();
  }

  updateUrl(eventData: { id: number; url: string; title: string }): void {
    this.feedService.updatePost(eventData.id, {
      id: eventData.id,
      thumbnailUrl: eventData.url,
      url: eventData.url,
      title: eventData.title
    }).subscribe(() => {
      const postToUpdate = this.posts.find((post) => post.id === eventData.id);
      if (postToUpdate) {
        postToUpdate.thumbnailUrl = eventData.url;
        postToUpdate.url = eventData.url;
        postToUpdate.title = eventData.title;
      }
    },
    (error) => {
      this.errorMessage = error;
    });
  }

}
