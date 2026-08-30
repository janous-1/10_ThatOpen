import * as React from "react";
import { Project } from '../classes/Project';

interface Props {
  project: Project;
}

export function ProjectCard(props: Props) {
    
    // 1. Lógica para obtener las iniciales dinámicamente
    let initials = "DP"; // Valor por defecto
    if (props.project.name) {
        // Limpiamos los espacios en blanco a los lados y dividimos el texto por espacios
        const words = props.project.name.trim().split(" ");
        
        if (words.length >= 2) {
            // Si tiene 2 o más palabras
            initials = words[0].charAt(0) + words[1].charAt(0);
        } else if (words.length === 1) {
            // Si tiene 1 sola palabra
            initials = words[0].slice(0, 2);
        }
    }

    return (
        <div className="project-card">
            <div className="card-header">
                <p
                style={{
                    backgroundColor: "#fcba03",
                    padding: 10,
                    borderRadius: 8,
                    aspectRatio: 1,
                    textTransform: "uppercase" // Esto garantiza que siempre se renderice en mayúsculas
                }}
                >
                {/* 2. Reemplazamos el string estático por nuestra variable dinámica */}
                {initials}
                </p>
                <div>
                <h5>{ props.project.name }</h5>
                <p>{ props.project.description }</p>
                </div>
            </div>
            <div className="card-content">
                <div className="card-property">
                <p style={{ color: "#969696" }}>Status</p>
                <p>{ props.project.status }</p>
                </div>
                <div className="card-property">
                <p style={{ color: "#969696" }}>Role</p>
                <p>{ props.project.userRole }</p>
                </div>
                <div className="card-property">
                <p style={{ color: "#969696" }}>Cost</p>
                <p>$ { props.project.cost }</p>
                </div>
                <div className="card-property">
                <p style={{ color: "#969696" }}>Estimated Progress</p>
                <p> { props.project.progress } %</p>
                </div>
            </div>
        </div>
    )
}