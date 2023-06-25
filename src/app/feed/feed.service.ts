import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { IFeed } from './feed';

@Injectable({
  providedIn: 'root'
})
export class FeedService {
  private feedUrl = 'http://jsonplaceholder.typicode.com/photos';

  constructor(private http: HttpClient) {}

  getFeed(page: number, itemsPerPage: number): Observable<IFeed[]> {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const url = `${this.feedUrl}?_start=${startIndex}&_end=${endIndex}`;
    return this.http.get<IFeed[]>(url).pipe(
      tap(data => console.log('Loaded')),
      catchError(this.handleError)
    );
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
      tap(() => console.log(`Post ${postId} deleted`)),
      catchError(this.handleError)
    );
  }

  updatePost(postId: number, postData: IFeed): Observable<IFeed> {
    const url = `${this.feedUrl}/${postId}`;
    return this.http.put<IFeed>(url, postData).pipe(
      tap(() => console.log(`Post ${postId} updated`)),
      catchError(this.handleError)
    );
  }

}
