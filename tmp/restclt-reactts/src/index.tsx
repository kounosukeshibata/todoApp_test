import './styles.scss';

import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from "react-dom/client"; // 'react-dom/client'からインポート

// ToDo アイテムのインターフェイス
interface Todo {
    id: string;
    content: string;
    created_date: string | null;
    completed_date: string | null;
    editing: boolean;
    editContent: string;
}

// メインコンポーネント
function App() {
    const _apiUrl: string | undefined  = process.env.API_URL; // API の URL
    const [_todos, setTodos]: [Todo[], React.Dispatch<React.SetStateAction<Todo[]>>] = useState<Todo[]>([]); // ToDo の一覧を管理するステート変数
    const _inputAdd: React.MutableRefObject<HTMLInputElement | null> = useRef<HTMLInputElement | null>(null); // 新規追加の input 要素の参照

    // コンポーネントがマウントされたときに実行される副作用フック
    useEffect(() => {
        fetchAndRender(); // データの取得と表示
    }, []);

    // データの取得と表示
    const fetchAndRender = async (): Promise<void> => {
        try {
            const response: Response = await fetch(`${_apiUrl}/todos`);
            if (!response.ok) { alert(`Fetch failed with status: ${response.status}`); return; }
            const data: Array<Todo> = await response.json();
            const filtered: Array<Todo> = data.filter((elem: Todo) => elem.completed_date === null);
            const updated: Array<Todo> = filtered.map((elem: Todo) => ({ // ToDo データに編集関連の情報を追加して新しい配列を作成
                ...elem, // 全ての要素を引継ぎ
                editing: false, // 編集フラグは OFF
                editContent: elem.content, // 元のテキストをコピー
            }));
            setTodos(updated); // 新しい配列をセットして ToDo データを更新
        } catch (error) { alert(`Error fetching todos: ${error}`); }
    };

    // 新規追加ボタンのクリックイベントハンドラ
    const handleButtonAddClick = async (): Promise<void> => {
        try {
            if (_inputAdd.current === null) { return; }
            const content: string = _inputAdd.current.value.trim();
            if (content === "") { return; }
            if (confirm("アイテムを新規追加しますか?")) {
                const response: Response = await fetch(`${_apiUrl}/todos`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ content: content })
                });
                if (!response.ok) { alert(`Fetch failed with status: ${response.status}`); }
                fetchAndRender();
                _inputAdd.current.value = "";
            }
        } catch (error) { alert(`Error adding todos: ${error}`); }
    };

    // 完了ボタンのクリックイベントハンドラ
    const handleButtonCompleteClick = (todo: Todo) => async (): Promise<void> => {
        try {
            if (confirm("このアイテムを完了にしますか?")) {
                const response: Response = await fetch(`${_apiUrl}/todos/${todo.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        content: todo.content,
                        completed_date: new Date().toISOString()
                    })
                });
                if (!response.ok) { alert(`Update failed with status: ${response.status}`); }
                fetchAndRender();
            }
        } catch (error) { alert(`Error updating todos: ${error}`); }
    };

    // テキスト要素のクリックイベントハンドラ
    const handleContentClick = (todo: Todo) => (): void => {
        setTodos((state: Todo[]) => state.map((elem: Todo) =>
            ({ ...elem, editing: false }) // すべて編集フラグは OFF
        ));
        setTodos((state: Todo[]) => state.map((elem: Todo) =>
            elem.id === todo.id
                ? { ...elem, editing: true } // id が一致したら編集フラグは ON
                : elem // 一致しなければそのまま
        ));
    };

    // テーブル行テキストのチェンジイベントハンドラ
    const handleRowContentChange = (todo: Todo, value: string) => {
        setTodos((state: Todo[]) => state.map((elem: Todo) =>
            elem.id === todo.id
                ? { ...elem, editContent: value } // id が一致したら編集テキストに適用
                : elem // 一致しなければそのまま
        ));
    };

    // 更新ボタンのクリックイベントハンドラ
    const handleButtonUpdateClick = (todo: Todo) => async (): Promise<void>  => {
        try {
            const updatedContent: string = todo.editContent.trim();
            if (updatedContent === "") { return; }
            if (confirm("このアイテムを更新しますか?")) {
                const response: Response = await fetch(`${_apiUrl}/todos/${todo.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ content: updatedContent })
                });
                if (!response.ok) { alert(`Fetch failed with status: ${response.status}`); }
                fetchAndRender();
            }
        } catch (error) { alert(`Error updating todos: ${error}`); }
    };

    // 削除ボタンのクリックイベントハンドラ
    const handleButtonDeleteClick = (todo: Todo) => async (): Promise<void> => {
        try {
            if (confirm("このアイテムを削除しますか?")) {
                const response: Response = await fetch(`${_apiUrl}/todos/${todo.id}`, {
                    method: "DELETE",
                });
                if (!response.ok) { alert(`Delete failed with status: ${response.status}`); }
                fetchAndRender();
            }
        } catch (error) { alert(`Error deleting todos: ${error}`); }
    };

    // JSX レンダリング部分
    return (
        <div className="div-container">
            <h1>ToDo リスト</h1>
            <div className="div-add">
                <input
                    type="text" placeholder="新規アイテムを追加"
                    ref={_inputAdd}
                    onClick={handleContentClick({ id: '_dummy', content: '', created_date: null, completed_date: null, editing: false, editContent: '' })}
                />
                <button id="button-add" onClick={handleButtonAddClick}>
                    新規追加
                </button>
            </div>
            <div className="div-table" id="div-todo-list">
                {_todos.map((todo) => (
                    <div key={todo.id} className="div-row">
                        <div className="div-content">
                            {/* 編集中の場合は input を表示、そうでなければ div を表示 */}
                            {todo.editing ? (
                                <input
                                    type="text"
                                    className="input-edit"
                                    value={todo.editContent}
                                    onChange={(e) => handleRowContentChange(todo, e.target.value)}
                                />
                            ) : (
                                <div onClick={handleContentClick(todo)}>
                                    {todo.content}
                                </div>
                            )}
                        </div>
                        <div className="div-buttons">
                            <button
                                className="button-complete"
                                onClick={handleButtonCompleteClick(todo)}
                            >
                                完了
                            </button>
                            <button
                                className="button-update"
                                onClick={handleButtonUpdateClick(todo)}
                                disabled={!todo.editing}
                            >
                                更新
                            </button>
                            <button
                                className="button-delete"
                                onClick={handleButtonDeleteClick(todo)}
                            >
                                削除
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// アプリケーションをレンダリング
const root = ReactDOM.createRoot(document.getElementById("app")!); // createRootを使う
root.render(<App />);