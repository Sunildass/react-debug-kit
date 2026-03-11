import { useState } from "react";

interface Todo {
  id: number;
  text: string;
  done: boolean;
}

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: "Try hover highlight", done: false },
    { id: 2, text: "Click a component", done: false },
    { id: 3, text: "Inspect props & state", done: false },
  ]);

  const toggle = (id: number) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  return (
    <div style={{
      background: "#ffffff",
      border: "1px solid #e5e7eb",
      borderRadius: "12px",
      padding: "20px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    }}>
      <h3 style={{ margin: "0 0 12px 0", fontSize: "16px", color: "#1a1a2e" }}>Todo List</h3>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {todos.map((todo) => (
          <li
            key={todo.id}
            onClick={() => toggle(todo.id)}
            style={{
              padding: "8px 0",
              borderBottom: "1px solid #f3f4f6",
              cursor: "pointer",
              fontSize: "14px",
              textDecoration: todo.done ? "line-through" : "none",
              color: todo.done ? "#9ca3af" : "#1a1a2e",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "18px",
              height: "18px",
              borderRadius: "4px",
              border: todo.done ? "none" : "1.5px solid #d1d5db",
              background: todo.done ? "#3b82f6" : "transparent",
              color: "#fff",
              fontSize: "11px",
            }}>
              {todo.done ? "✓" : ""}
            </span>
            {todo.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
