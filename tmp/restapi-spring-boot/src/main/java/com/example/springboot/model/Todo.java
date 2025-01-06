package com.example.springboot.model;

import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.Transient;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

// ToDo エンティティを表すクラス
@Data
@Entity @Table(name="todos")
public class Todo {
    // RDBMS 本来の int 型のキー：API 入出力の JSON にはマッピングしない
    @JsonIgnore
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Id @Column(name="id", unique=true) Long _rdbms_id;

    // string 型の ID を定義：RDBMS 側にはマッピングしない
    @Transient String id;
    public String getId() { return Long.toString(_rdbms_id); }
    public void setId(String id) { _rdbms_id = Long.parseLong(id); }

    @JsonProperty("content")
    @Column(name="content") String content;

    @JsonProperty("created_date")
    @Column(name="created_date") 
    @Temporal(TemporalType.TIMESTAMP) Date createdDate;

    @JsonProperty("completed_date")
    @Column(name="completed_date") 
    @Temporal(TemporalType.TIMESTAMP) Date completedDate;
}
