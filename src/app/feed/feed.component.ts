import { Component, Input, OnInit } from '@angular/core';
import { IFeed } from './feed';
import { FeedService } from './feed.service';
import { SharedService } from '../shared/shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'feed',
  templateUrl: './feed.component.html',
  styles: [`
    .postContainer {
      display: inline-block;
    }

    #buttons{
      display: flex;
      justify-content: center;
    }

    .postButton{
      padding: 10px;
      margin: 5px;
    }
    
    #addButton{
      display: flex;
      justify-content: center;
    }
  `]
})
export class FeedComponent implements OnInit {
  errorMessage: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 15;
  posts: IFeed[] = [];
  totalPages: number = 0;

  constructor(
    private feedService: FeedService,
    private sharedService: SharedService,
    private router: Router
  ) {}

  totalPagesArray: number[] = [];

  loadPosts(): void {
    this.feedService.getFeed(this.currentPage, this.itemsPerPage).subscribe({
      next: (posts) => {
        this.posts = posts;
        this.feedService.getTotalPosts().subscribe((totalPosts) => {
          this.calculateTotalPages(totalPosts, this.itemsPerPage);
        });
      },
      error: (err) => (this.errorMessage = err)
    });
  }
  
  ngOnInit(): void {
    this.sharedService.deletePostEvent.subscribe((postId: number) => {
      this.onPostDelete(postId);
    });

    this.sharedService.imageUpdateEvent.subscribe((eventData) => {
      this.feedService.updatePost(eventData.id, {
        id: eventData.id,
        albumId: eventData.albumId,
        title: eventData.title,
        url: eventData.url,
        thumbnailUrl: eventData.url
      }).subscribe(
        (response) => {
          const postToUpdate = this.posts.find((post) => post.id === eventData.id);
          if (postToUpdate) {
            postToUpdate.thumbnailUrl = eventData.url;
            postToUpdate.url = eventData.url;
            postToUpdate.title = eventData.title;
          }
        },
        (error) => {
          this.errorMessage = error;
        }
      );
    });

    this.loadPosts();
  }

  onPostDelete(postId: number): void {
    this.feedService.deletePost(postId).subscribe(
      (response) => {
        const index = this.posts.findIndex((post) => post.id === postId);
        if (index !== -1) {
          this.posts.splice(index, 1);
        }
      },
      (error) => {
        this.errorMessage = error;
      }
    );
  }

  loadPrevious(): void {
    this.currentPage--;
    this.feedService.toggleLoad();
    this.loadPosts();
  }

  loadNext(): void {
    this.currentPage++;
    this.feedService.toggleLoad();
    this.loadPosts();
  }

  addPost(): void {
    const newPost: IFeed = {
      id: this.generateUniqueId(),
      albumId: 1,
      title: 'Untitled',
      url: ' Enter Photo ',
      thumbnailUrl: ' Enter Photo '
    };
    
    this.feedService.addPost(newPost).subscribe(
      (response) => {
        this.router.navigate(['/post', newPost.id]);
      },
      (error) => {
        this.errorMessage = error;
      }
    );
  }
  generateUniqueId(): number {
    return Date.now();
  }

  loadPage(): void {
    this.feedService.toggleLoad();
    this.loadPosts();
  }
  
  calculateTotalPages(totalPosts: number, itemsPerPage: number): void {
    this.totalPages = this.feedService.countPages(totalPosts, itemsPerPage);
    this.totalPagesArray = Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }
  

}
