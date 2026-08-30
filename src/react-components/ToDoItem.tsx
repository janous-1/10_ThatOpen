import * as React from "react";
import { IToDo } from "../classes/Project"; // Asegúrate de ajustar la ruta si es distinta

interface Props {
    todo: IToDo;
}

export function ToDoItem({ todo }: Props) {
    // Asignamos colores según el estado, tal como lo hacías en Vanilla JS
    let iconColor = "#686868"; // Pending
    if (todo.status === "Active") iconColor = "#facc15"; 
    if (todo.status === "Done") iconColor = "#4ade80";   

    return (
        <div className="todo-item">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", columnGap: 15, alignItems: "center" }}>
                    <span
                        className="material-icons-round"
                        style={{
                            padding: 10,
                            backgroundColor: iconColor,
                            borderRadius: 10,
                            color: "#202124"
                        }}
                    >
                        construction
                    </span>
                    <p>{todo.text}</p>
                </div>
                <p style={{ textWrap: "nowrap", marginLeft: 10, color: iconColor, fontWeight: "bold" }}>
                    {todo.status}
                </p>
            </div>
        </div>
    );
}