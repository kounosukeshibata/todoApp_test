package com.example.springboot.model;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

// ToDo エンティティに対する Repository インタフェース
public interface TodoRepository extends JpaRepository<Todo, Long> {
    List<Todo> findByCompletedDateIsNotNull();
}
