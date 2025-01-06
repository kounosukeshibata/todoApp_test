package com.example.springboot;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

import org.springframework.scheduling.annotation.Async;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.example.springboot.model.Todo;
import com.example.springboot.model.TodoRepository;

@CrossOrigin( // CORS 設定：適切に修正してください。
    origins = "*", 
    methods = { RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE }
)
@RestController
@RequestMapping("/todos")
public class TodoController {

    private final TodoRepository _todoRepository;

    public TodoController(TodoRepository todoRepository) {
        _todoRepository = todoRepository;
    }

    // すべての ToDo アイテムを取得します。
    @GetMapping
    @Async public CompletableFuture<List<Todo>> getAllTodos() {
        List<Todo> todos = _todoRepository.findAll();
        return CompletableFuture.completedFuture(todos);
    }

    // 完了した ToDo アイテムを取得します。
    @GetMapping("/complete")
    @Async public CompletableFuture<List<Todo>> getCompleteTodos() {
        List<Todo> todos = _todoRepository.findByCompletedDateIsNotNull();
        return CompletableFuture.completedFuture(todos);
    }

    // ID で ToDo アイテムを取得します。
    @GetMapping("/{id}")
    @Async public CompletableFuture<Optional<Todo>> getTodo(@PathVariable String id) {
        Optional<Todo> todo = _todoRepository.findById(Long.parseLong(id));
        return CompletableFuture.completedFuture(todo);
    }

    // 新しい ToDo アイテムを追加します。
    @PostMapping
    @Async public CompletableFuture<Todo> createTodo(@RequestBody Todo todo) {
        todo.setCreatedDate(new Date());
        return CompletableFuture.completedFuture(_todoRepository.save(todo));
    }

    // 既存の ToDo アイテムを更新します。
    @PutMapping("/{id}")
    @Async public CompletableFuture<Todo> updateTodo(@PathVariable String id, @RequestBody Todo todo) {
        Optional<Todo> exist = _todoRepository.findById(Long.parseLong(id));
        if (exist.isPresent()) {
            Todo target = exist.get();
            target.setContent(todo.getContent());
            target.setCompletedDate(todo.getCompletedDate());
            return CompletableFuture.completedFuture(_todoRepository.save(target));
        }
        return CompletableFuture.completedFuture(null);
    }

    // ID で ToDo アイテムを削除します。
    @DeleteMapping("/{id}")
    @Async public CompletableFuture<Void> deleteTodo(@PathVariable String id) {
        _todoRepository.deleteById(Long.parseLong(id));
        return CompletableFuture.completedFuture(null);
    }
}
