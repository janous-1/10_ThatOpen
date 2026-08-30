import * as React from "react"
import * as Router from 'react-router-dom';
import { ProjectsManager } from '../classes/ProjectsManager';
import { ToDoItem } from "./ToDoItem";
import { ThreeViewer } from './ThreeViewer';

interface Props {
  projectsManager: ProjectsManager
}

export function ProjectDetailsPage(props: Props) {

    const routeParams = Router.useParams<{id: string}>()
    
    // Estado local para forzar el re-renderizado cuando editamos algo
    const [update, setUpdate] = React.useState(0);

    if (!routeParams.id) {return (<p>Project ID is needed to see this page</p>)}
    const project = props.projectsManager.getProject(routeParams.id)
    if (!project) {return (<p>The project with ID {routeParams.id} wasn't found.</p>)}

    // --- LÓGICA DE INICIALES ---
    let initials = "DP"; 
    if (project.name) {
        const words = project.name.trim().split(" ");
        if (words.length >= 2) {
            initials = words[0].charAt(0) + words[1].charAt(0);
        } else if (words.length === 1) {
            initials = words[0].slice(0, 2);
        }
    }

    // --- MANEJO DE MODALES ---
    function toggleModal(id: string) {
        const modal = document.getElementById(id);
        if (modal && modal instanceof HTMLDialogElement) {
            if (modal.open) {
                modal.close();
            } else {
                modal.showModal();
            }
        } else {
            console.warn("The provided modal wasn't found. ID:", id)
        }
    }

    // --- MANEJADORES DE EVENTOS ---
    const onEditClick = () => toggleModal("edit-project-modal");
    const onAddToDoClick = () => toggleModal("new-todo-modal");

    const onEditProjectSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        
        project.name = formData.get("name") as string;
        project.description = formData.get("description") as string;
        project.userRole = formData.get("userRole") as any;
        project.status = formData.get("status") as any;
        project.cost = Number(formData.get("cost"));
        project.progress = Number(formData.get("progress")) / 100;
        
        const dateInput = formData.get("finishDate") as string;
        if (dateInput) {
            project.finishDate = new Date(dateInput);
        }

        toggleModal("edit-project-modal");
        setUpdate(prev => prev + 1); // Fuerza actualización visual
    };

    const onToDoFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        
        const newToDo = {
            id: Math.random().toString(36).substring(2, 9),
            text: formData.get("todo-text") as string,
            status: formData.get("todo-status") as any
        };

        if (!project.todos) project.todos = [];
        project.todos.push(newToDo);

        e.currentTarget.reset();
        toggleModal("new-todo-modal");
        setUpdate(prev => prev + 1); // Fuerza actualización visual
    };

    return (
        <div className="page" id="project-details">
            
            {/* --- MODAL: NEW TO-DO --- */}
            <dialog id="new-todo-modal">
                <form id="new-todo-form" onSubmit={onToDoFormSubmit}>
                    <h2>Add New To-Do</h2>
                    <div className="input-list">
                        <div className="form-field-container">
                            <label>
                                <span className="material-icons-round">description</span>Task
                            </label>
                            <input
                                name="todo-text"
                                type="text"
                                required
                                placeholder="What needs to be done?"
                            />
                        </div>
                        <div className="form-field-container">
                            <label>
                                <span className="material-icons-round">not_listed_location</span>
                                Status
                            </label>
                            <select name="todo-status">
                                <option value="Pending">Pending</option>
                                <option value="Active">Active</option>
                                <option value="Done">Done</option>
                            </select>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                margin: "10px 0px 10px auto",
                                columnGap: 10
                            }}
                        >
                            <button
                                type="button"
                                onClick={() => toggleModal("new-todo-modal")}
                                style={{ backgroundColor: "transparent" }}
                            >
                                Cancel
                            </button>
                            <button type="submit">Add To-Do</button>
                        </div>
                    </div>
                </form>
            </dialog>

            {/* --- MODAL: EDIT PROJECT --- */}
            <dialog id="edit-project-modal">
                <form id="edit-project-form" onSubmit={onEditProjectSubmit}>
                    <h2>Edit Project</h2>
                    <div className="input-list">
                        <div className="form-field-container">
                            <label>
                                <span className="material-icons-round">apartment</span>Name
                            </label>
                            <input name="name" type="text" defaultValue={project.name} required />
                            <p
                                style={{
                                    color: "gray",
                                    fontSize: "var(--font-sm)",
                                    marginTop: 5,
                                    fontStyle: "italic"
                                }}
                            >
                                TIP: Give it a short name
                            </p>
                        </div>
                        <div className="form-field-container">
                            <label>
                                <span className="material-icons-round">subject</span>Description
                            </label>
                            <textarea
                                name="description"
                                cols={30}
                                rows={5}
                                placeholder="Give your project a nice description! So people is jealous about it."
                                defaultValue={project.description}
                                required
                            />
                        </div>
                        <div className="form-field-container">
                            <label>
                                <span className="material-icons-round">person</span>Role
                            </label>
                            <select name="userRole" defaultValue={project.userRole}>
                                <option value="architect">Architect</option>
                                <option value="engineer">Engineer</option>
                                <option value="developer">Developer</option>
                            </select>
                        </div>
                        <div className="form-field-container">
                            <label>
                                <span className="material-icons-round">not_listed_location</span>
                                Status
                            </label>
                            <select name="status" defaultValue={project.status}>
                                <option value="pending">Pending</option>
                                <option value="active">Active</option>
                                <option value="finished">Finished</option>
                            </select>
                        </div>
                        <div className="form-field-container">
                            <label>
                                <span className="material-icons-round">payments</span>Cost
                            </label>
                            <input name="cost" type="number" min={0} defaultValue={project.cost} required />
                        </div>
                        <div className="form-field-container">
                            <label>
                                <span className="material-icons-round">trending_up</span>Progress (%)
                            </label>
                            <input
                                name="progress"
                                type="number"
                                min={0}
                                max={100}
                                defaultValue={project.progress * 100}
                                required
                            />
                        </div>
                        <div className="form-field-container">
                            <label htmlFor="finishDate">
                                <span className="material-icons-round">calendar_month</span>Finish Date
                            </label>
                            <input name="finishDate" type="date" defaultValue={project.finishDate ? new Date(project.finishDate).toISOString().split('T')[0] : ""} required />
                        </div>
                        <div
                            style={{
                                display: "flex",
                                margin: "10px 0px 10px auto",
                                columnGap: 10
                            }}
                        >
                            <button
                                type="button"
                                onClick={() => toggleModal("edit-project-modal")}
                                style={{ backgroundColor: "transparent" }}
                            >
                                Cancel
                            </button>
                            <button type="submit" style={{ backgroundColor: "rgb(18, 145, 18)" }}>
                                Save Changes
                            </button>
                        </div>
                    </div>
                </form>
            </dialog>

            {/* --- HEADER --- */}
            <header>
                <div>
                    <h2>{project.name}</h2>
                    <p style={{ color: "#969696" }}>
                        {project.description}
                    </p>
                </div>
            </header>

            {/* --- MAIN CONTENT --- */}
            <div className="main-page-content">
                <div style={{ display: "flex", flexDirection: "column", rowGap: 30 }}>
                    
                    {/* DASHBOARD CARD 1: Detalles del Proyecto */}
                    <div className="dashboard-card" style={{ padding: "30px 0" }}>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: "0px 30px",
                                marginBottom: 30
                            }}
                        >
                            <p
                                style={{
                                    fontSize: 20,
                                    backgroundColor: project.iconColor || "#ca8134",
                                    aspectRatio: 1,
                                    borderRadius: "100%",
                                    padding: 12,
                                    textTransform: "uppercase"
                                }}
                            >
                                {initials}
                            </p>
                            <button className="btn-secondary" onClick={onEditClick}>
                                <p style={{ width: "100%" }}>Edit</p>
                            </button>
                        </div>
                        <div style={{ padding: "0 30px" }}>
                            <div>
                                <h5>{project.name}</h5>
                                <p>{project.description}</p>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    columnGap: 30,
                                    padding: "30px 0px",
                                    justifyContent: "space-between"
                                }}
                            >
                                <div>
                                    <p style={{ color: "#969696", fontSize: "var(--font-sm)" }}>Status</p>
                                    <p>{project.status}</p>
                                </div>
                                <div>
                                    <p style={{ color: "#969696", fontSize: "var(--font-sm)" }}>Cost</p>
                                    <p>${project.cost}</p>
                                </div>
                                <div>
                                    <p style={{ color: "#969696", fontSize: "var(--font-sm)" }}>Role</p>
                                    <p>{project.userRole}</p>
                                </div>
                                <div>
                                    <p style={{ color: "#969696", fontSize: "var(--font-sm)" }}>Finish Date</p>
                                    <p>{project.finishDate ? new Date(project.finishDate).toDateString() : ""}</p>
                                </div>
                            </div>
                            
                            {/* Barra de Progreso */}
                            <div
                                style={{
                                    backgroundColor: "#404040",
                                    borderRadius: 9999,
                                    overflow: "hidden"
                                }}
                            >
                                <div
                                    style={{
                                        width: `${project.progress * 100}%`,
                                        backgroundColor: "green",
                                        padding: "4px 0",
                                        textAlign: "center",
                                        transition: "width 0.3s ease"
                                    }}
                                >
                                    {project.progress * 100}%
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* DASHBOARD CARD 2: To-Do List */}
                    <div className="dashboard-card" style={{ flexGrow: 1 }}>
                        <div
                            style={{
                                padding: "20px 30px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between"
                            }}
                        >
                            <h4>To-Do</h4>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "end",
                                    columnGap: 20
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "center", columnGap: 10 }}>
                                    <span className="material-icons-round">search</span>
                                    <input
                                        type="text"
                                        placeholder="Search To-Do's by name"
                                        style={{ width: "100%" }}
                                    />
                                </div>
                                <span
                                    className="material-icons-round"
                                    onClick={onAddToDoClick}
                                    style={{
                                        cursor: "pointer",
                                        backgroundColor: "var(--primary)",
                                        padding: 5,
                                        borderRadius: 4
                                    }}
                                >
                                    add
                                </span>
                            </div>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                padding: "10px 30px",
                                rowGap: 20
                            }}
                        >
                            
                            {/* Renderizamos la lista dinámica de To-Dos */}
                            {project.todos && project.todos.length > 0 ? (
                                project.todos.map((todo: any) => (
                                    <ToDoItem key={todo.id} todo={todo} />
                                ))
                            ) : (
                                <p style={{ color: "gray", fontStyle: "italic" }}>No To-Do's found for this project.</p>
                            )}

                        </div>
                    </div>
                </div>
                <ThreeViewer />
            </div>
        </div>
    );
}