import { Component, OnInit } from '@angular/core';
import {TodoService} from 'src/app/component/services/todo.service'
import {Observable} from 'rxjs';
import {Todo} from 'src/app/component/models/todo.model';
import { trigger, state, style } from '@angular/animations';
@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
 
})
export class TodoListComponent implements OnInit {

  todo$ : Observable <Todo[]>;
  constructor(private todoService: TodoService) { }

  ngOnInit(): void {
    this.todo$=this.todoService.todos$;
  }
  onChangeTodoStatus(todo:Todo){
    this.todoService.changeTodoStatus(todo.id,todo.isCompleted);
  }
  onEditTodo(todo:Todo){
    this.todoService.editTodo(todo.id,todo.content);
  }
  onDeleteTodo(todo:Todo){
    this.todoService.deleteTodo(todo.id);
  }
}
