import { Injectable } from '@angular/core';
import {Todo} from '../models/todo.model';
import {BehaviorSubject,Observable, from} from 'rxjs';
import {Filter} from '../models/filtering.model';
import { LocalStorageService } from './local-storage.service';
@Injectable({
  providedIn: 'root'
})
export class TodoService {

  private static readonly TodoStorageKey='todo';
  private todos: Todo[];
  private filteredTodos:Todo[];
  private lengthSubject : BehaviorSubject<number>=new BehaviorSubject<number>(0);
  private displayTodoSubject: BehaviorSubject<Todo[]>=new BehaviorSubject<Todo[]>([]);
  private  currentFilter:Filter=Filter.All;
  todos$:Observable<Todo[]>=this.displayTodoSubject.asObservable();
  length$: Observable<number>=this.lengthSubject.asObservable();
  constructor(private storageService:LocalStorageService) { }
  fetchFromLocalStorage(){
    this.todos=this.storageService.getValue<Todo[]>(TodoService.TodoStorageKey)||[];
    this.filteredTodos=[...this.todos];
    this.updateTodosData();
  }
  updateToLocalStorage(){
    this.storageService.setObject(TodoService.TodoStorageKey,this.todos);
    this.filterTodos(this.currentFilter,false);
    this.updateTodosData();
  }
  addTodo(content : string){
    const date=new Date(Date.now()).getTime();
    const newTodo=new Todo(date,content);
    this.todos.unshift(newTodo);
    this.updateToLocalStorage();
  }
  changeTodoStatus(id:number,isCompleted:boolean){
    const index=this.todos.findIndex(t=>t.id===id);
    const todo=this.todos[index];
    todo.isCompleted=isCompleted;
    this.todos.splice(index,1,todo);
    this.updateToLocalStorage();

  }
  editTodo(id:number ,content : string){
    const index=this.todos.findIndex(t=>t.id===id);
    const todo=this.todos[index];
    todo.content=content;
    this.todos.splice(index,1,todo);
    this.updateToLocalStorage();

  }
  deleteTodo(id:number){
    const index=this.todos.findIndex(t=>t.id===id);
    this.todos.splice(index,1);
    this.updateToLocalStorage();
  }
  toggleAll(){
    this.todos=this.todos.map(todo=>{
      return{
        ...todo,
        isCompleted:!this.todos.every(t=>t.isCompleted)
      };
    });
    this.updateToLocalStorage();
  }
  clearCompleted(){
    this.todos=this.todos.filter(todo=>!todo.isCompleted);
    this.updateToLocalStorage();
  }
  filterTodos(filter:Filter,isFiltering:boolean=true){
    this.currentFilter=filter;
    switch(filter){
      case Filter.Active:
        this.filteredTodos=this.todos.filter(todo=>!todo.isCompleted);
        break;
        case Filter.Completed:
          this.filteredTodos=this.todos.filter(todo=>todo.isCompleted);
          break;
        case Filter.All:
          this.filteredTodos=[...this.todos];
          break;
    }
    if(isFiltering){
      this.updateTodosData();
    }
  }
  private updateTodosData(){
    this.displayTodoSubject.next(this.filteredTodos);
    this.lengthSubject.next(this.todos.length);
  }
}
