import { Component, OnInit ,Input,Output,EventEmitter} from '@angular/core';
import {Todo} from 'src/app/component/models/todo.model'
import { from } from 'rxjs';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss']
})
export class TodoItemComponent implements OnInit {
  @Input() todo:Todo; 
  @Output() changeStatus : EventEmitter<Todo>=new EventEmitter<Todo>();
  isHovered = false;
  isEditing = false;
  constructor() { }

  ngOnInit(): void {
  }
  changeTodoStatus(){
    this.changeStatus.emit({...this.todo,isCompleted:!this.todo.isCompleted});
  }
}
