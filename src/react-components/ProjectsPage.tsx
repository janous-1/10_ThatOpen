import * as React from "react"
import * as Router from 'react-router-dom';
import { IProject, Project, ProjectStatus, UserRole } from "../classes/Project"
import { ProjectsManager } from "../classes/ProjectsManager";
import { ProjectCard } from "./ProjectCard"
import { SearchBox } from "./SearchBox";

interface Props {
  projectsManager: ProjectsManager
}

export function ProjectsPage(props : Props) {
    // 1. Instanciamos el manager 
    const [projects, setProjects] = React.useState<Project[]>(props.projectsManager.list)
    
    // 1.1 Crear un estado para el Error
    const [errorMessage, setErrorMessage] = React.useState("Error message goes here.")
    // NOTA: Revisa en tu archivo ProjectsManager.ts si definiste estos métodos 
    // con minúscula (onProjectCreated) o mayúscula (OnProjectCreated). 
    // Usa la que coincida con tu clase para evitar errores de TypeScript.
    props.projectsManager.onProjectCreated = () => {setProjects([...props.projectsManager.list])}
    props.projectsManager.onProjectDeleted = () => {setProjects([...props.projectsManager.list])}

    const projectCards = projects.map((project) => {
        return (
            <Router.Link to={`/project/${project.id}`} key={project.id}>
                <ProjectCard project={project}  />
            </Router.Link>
        )
    })       

    React.useEffect(() => {
        console.log("Projects state updated", projects)
    }, [projects])


    // 2. Función para abrir/cerrar modales (¡Conservamos tu función, es excelente y muy limpia!)
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

    // 3. Controladores de eventos (Event Handlers)
    const onNewProjectClick = () => {
        toggleModal("new-project-modal")
    }

    const onCancelProjectClick = () => {
        toggleModal("new-project-modal")
    }

    const onCloseErrorClick = () => {
        toggleModal("error-modal")
    }

    // 4. Controlador para enviar el formulario (Fusionado con la lógica del profe)
    const onProjectFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Evita que la página se recargue
        const form = e.currentTarget;
        const formData = new FormData(form);
        
        // Formateamos los datos exactamente como exige TypeScript e IProject
        const projectData: IProject = {
            name: formData.get("name") as string,
            description: formData.get("description") as string,
            status: formData.get("status") as ProjectStatus,
            userRole: formData.get("userRole") as UserRole,
            finishDate: new Date(formData.get("finishDate") as string)
        };
        
        try {
            props.projectsManager.newProject(projectData)
            form.reset()
            toggleModal("new-project-modal")
        } catch (err) {
            if (err instanceof Error) {
                setErrorMessage(err.message) // <-- Estilo React puro
            } else {
                setErrorMessage("Ocurrió un error al crear el proyecto.")
            }
            toggleModal("error-modal")
        }
    }

    // 5. Lógica para Exportar
    const onExportProjectsClick = () => {
        props.projectsManager.exportToJSON()
    }

    // 6. Lógica para Importar 
    const onImportProjectsClick = () => {
        props.projectsManager.importFromJSON()
    }

    const onProjectSearch = (value: string) => {
        setProjects(props.projectsManager.filterProjects(value))
    }

    return (
        <div className="page" id="projects-page">
            <dialog id="new-project-modal">
                <form id="new-project-form" onSubmit={onProjectFormSubmit}>
                    <h2>New Project</h2>
                    <div className="input-list">
                        <div className="form-field-container">
                            <label><span className="material-icons-round">apartment</span>Name</label>
                            <input name="name" id="name" type="text" placeholder="Project's name" />
                            <p style={{ color: "gray", fontSize: "var(--font-sm)", marginTop: 5, fontStyle: "italic" }}>TIP: Give it a short name</p>
                        </div>
                        <div className="form-field-container">
                            <label><span className="material-icons-round">subject</span>Description</label>
                            <textarea name="description" id="description" cols={30} rows={5} placeholder="Give your project a nice description! So people is jealous about it."></textarea>
                        </div>
                        <div className="form-field-container">
                            <label><span className="material-icons-round">person</span>Role</label>
                            <select name="userRole" id="userRole">
                                <option value="architect">Architect</option>
                                <option value="engineer">Engineer</option>
                                <option value="developer">Developer</option>
                            </select>
                        </div>
                        <div className="form-field-container">
                            <label><span className="material-icons-round">not_listed_location</span>Status</label>
                            <select name="status" id="status">
                                <option value="pending">Pending</option>
                                <option value="active">Active</option>
                                <option value="finished">Finished</option>
                            </select>
                        </div>
                        <div className="form-field-container">
                            <label><span className="material-icons-round">calendar_month</span>Finish Date</label>
                            <input name="finishDate" id="finishDate" type="date" />
                        </div>
                        <div style={{ display: "flex", margin: "10px 0px 10px auto", columnGap: 10 }}>
                            <button type="button" id="cancel-project-btn" className="btn-secondary" onClick={onCancelProjectClick}>
                                Cancel
                            </button>
                            <button type="submit" id="accept-project-btn">
                                Accept
                            </button>
                        </div>
                    </div>
                </form>
            </dialog>

            <dialog id="error-modal">
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
                    <span className="material-icons-round icon-red" style={{ fontSize: 48, marginBottom: 15 }}>
                        error_outline
                    </span>
                    <h2 style={{ marginBottom: 10 }}>Oops!</h2>
                    <p id="error-message">{errorMessage}</p>
                    <div style={{ display: "flex", justifyContent: "center", marginTop: 25 }}>
                        <button type="button" id="close-error-btn" className="btn-secondary" onClick={onCloseErrorClick}>
                            Close
                        </button>
                    </div>
                </div>
            </dialog>

            <header>
                <h2>Projects</h2>
                <SearchBox onChange={(value) => onProjectSearch(value)}/>
                <div style={{ display: "flex", alignItems: "center", columnGap: 15 }}>
                    <span id="import-projects-btn" className="material-icons-round action-icon" onClick={onImportProjectsClick}>
                        file_upload
                    </span>
                    <span id="export-projects-btn" className="material-icons-round action-icon" onClick={onExportProjectsClick}>
                        file_download
                    </span>
                    <button id="new-project-btn" onClick={onNewProjectClick}>
                        <span className="material-icons-round">add</span>New Project
                    </button>
                </div>
            </header>
            <div id="projects-list">
                { projects.length > 0 ? (
                    <div id="projects-list">{projectCards}</div>
                ) : (
                    <div 
                        style={{ 
                            display: "flex", 
                            flexDirection: "column", 
                            alignItems: "center", 
                            justifyContent: "center", 
                            padding: "50px", 
                            backgroundColor: "#202124", 
                            borderRadius: "10px", 
                            border: "2px dashed #404040",
                            marginTop: "20px"
                        }}
                    >
                        <span 
                            className="material-icons-round" 
                            style={{ fontSize: "48px", color: "#969696", marginBottom: "15px" }}
                        >
                            apartment
                        </span>
                        <p style={{ color: "#969696", fontSize: "18px", fontWeight: "bold" }}>
                            There are no projects to display!
                        </p>
                        <p style={{ color: "gray", fontSize: "14px", marginTop: "5px" }}>
                            Click on "+ New Project" to get started.
                        </p>
                    </div>
                )}
            </div>
        </div>        
    )
}