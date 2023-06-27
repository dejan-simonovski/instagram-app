import { Component, Input, EventEmitter, Output } from "@angular/core";

@Component({
    selector: 'post',
    templateUrl: './post.component.html',
    styleUrls: ['./post.component.css']
})
export class PostComponent {
    @Input() id: number = 0;
    @Input() title: string = '';
    @Input() url: string = '';
    @Input() thumbnailUrl: string = '';
    @Output() deletePostEvent = new EventEmitter<number>();
    @Output() imageUpdateEvent = new EventEmitter<{ id: number, url: string, title: string }>();

}
