import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, of, tap, throwError } from 'rxjs';
import { IFeed } from './feed';

@Injectable({
  providedIn: 'root'
})
export class FeedService {
  private feedUrl = 'http://jsonplaceholder.typicode.com/photos';
  private posts: IFeed[] = []; // Added posts array

  constructor(private http: HttpClient) {}

  private canLoad: boolean = true;

  getFeed(page: number, itemsPerPage: number): Observable<IFeed[]> {
    if (!this.canLoad && this.posts.length > 0) {
      return of(this.posts); // Return the existing posts array as an observable
    } else {
      // Set the flag to false after the first load
      this.canLoad = false;
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const url = `${this.feedUrl}?_start=${startIndex}&_end=${endIndex}`;
      return this.http.get<IFeed[]>(url).pipe(
        tap((posts) => {
          this.posts = posts; // Update the posts array
          console.log('Loaded');
        }),
        catchError(this.handleError)
      );
    }
  }

  private handleError(err: HttpErrorResponse) {
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Server returned code: ${err.status}, error message is ${err.message}`;
    }
    return throwError(() => errorMessage);
  }

  deletePost(postId: number): Observable<void> {
    const url = `${this.feedUrl}/${postId}`;
    return this.http.delete<void>(url).pipe(
      tap(() => {
        const index = this.posts.findIndex((post) => post.id === postId);
        if (index !== -1) {
          this.posts.splice(index, 1); // Remove the post from the posts array
          console.log(`Post ${postId} deleted`);
        }
      }),
      catchError(this.handleError)
    );
  }

  getPost(postId: number): Observable<IFeed> {
    const post = this.posts.find((post) => post.id === postId);
    if (post) {
      return of(post); // Return the post from the local posts array if it exists
    } else {
      const url = `${this.feedUrl}/${postId}`;
      return this.http.get<IFeed>(url).pipe(
        tap((fetchedPost) => {
          this.posts.push(fetchedPost); // Add the fetched post to the local posts array
          console.log(`Post ${postId} retrieved`);
        }),
        catchError(this.handleError)
      );
    }
  }

  updatePost(postId: number, postData: IFeed): Observable<IFeed> {
    const postToUpdate = this.posts.find((post) => post.id === postId);
    if (postToUpdate) {
      // Update local post if id is found
      postToUpdate.thumbnailUrl = postData.thumbnailUrl;
      postToUpdate.url = postData.url;
      postToUpdate.title = postData.title;
      return of(postToUpdate);
    } else {
      const url = `${this.feedUrl}/${postId}`;
      return this.http.put<IFeed>(url, postData).pipe(
        tap((updatedPost) => {
          const index = this.posts.findIndex((post) => post.id === postId);
          if (index !== -1) {
            this.posts[index] = updatedPost; 
          }
          console.log(`Post ${postId} updated`);
        }),
        catchError(this.handleError)
      );
    }
  }

  toggleLoad() {
    this.canLoad = !this.canLoad;
  }

  getPosts(): IFeed[] {
    return this.posts;
  }

  countPages(totalPosts: number, itemsPerPage: number): number {
    return Math.ceil(totalPosts / itemsPerPage);
  }
  
  addPost(newPost: IFeed): Observable<IFeed> {
    return this.http.post<IFeed>(this.feedUrl, newPost).pipe(
      tap((addedPost) => {
        this.posts.push(newPost); // Add the new post to the posts array
        console.log('Post added successfully');
      }),
      catchError(this.handleError)
    );
  }
    
}
