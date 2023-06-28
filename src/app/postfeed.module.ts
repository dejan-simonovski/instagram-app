import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { FeedComponent } from './feed/feed.component';
import { PostComponent } from './post/post.component';
import { PostDetailComponent } from './post/post-detail.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    FeedComponent,
    PostComponent,
    PostDetailComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forChild([
      { path: 'post/:id', component: PostDetailComponent },
    ])
  ],
  exports: [
    FeedComponent,
    PostComponent,
    PostDetailComponent,
  ]
})
export class PostfeedModule { }
