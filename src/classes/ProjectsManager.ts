import { IProject, Project } from "./Project"

export class ProjectsManager {
    list: Project[] = []
    currentProject: Project | null = null

    // Callbacks para comunicar la creación/eliminación a React y actualizar el estado
    onProjectCreated = (project: Project) => {}
    onProjectDeleted = () => {}

    constructor() {
        this.newProject({
            name: "Default Project",
            description: "This is just a default app project",
            status: "pending", 
            userRole: "architect", 
            finishDate: new Date(),
            todos: [
                {
                    id: "initial-todo",
                    text: "Make anything here as you want, even something longer.",
                    status: "Pending"
                }
            ]
        })
    }

    filterProjects(value: string) {
        const filteredProjects = this.list.filter((project) => {
        return project.name.includes(value)
        })
        return filteredProjects
    }

    newProject(data: IProject) {
        // 1. Validación de longitud mínima (Tu requerimiento)
        if (data.name.length < 5) {
            throw new Error("The project name must contain at least 5 characters.")
        }      
        
        // 2. Validación de nombres duplicados (Requerimiento del profesor)
        const projectNames = this.list.map((project) => project.name)
        const nameInUse = projectNames.includes(data.name)
        if (nameInUse) {
            throw new Error(`A project with the name "${data.name}" already exists`)
        }

        const project = new Project(data)
        this.list.push(project)
        
        // Notificamos a React para que actualice la interfaz
        this.onProjectCreated(project) 
        
        return project
    }

    getProject(id: string) {
        return this.list.find((p) => p.id === id)
    }

    getProjectByName(name: string) {
        return this.list.find((project) => project.name === name)
    }

    getTotalCost() {
        return this.list.reduce((total, project) => total + project.cost, 0)
    }

    deleteProject(id: string) {
        const project = this.getProject(id)
        if (!project) { return }
        
        const remaining = this.list.filter((project) => project.id !== id)
        this.list = remaining
        
        // Notificamos a React para que refresque la lista de tarjetas
        this.onProjectDeleted()
    }

    exportToJSON(fileName: string = "projects") {
        const json = JSON.stringify(this.list, null, 2)
        const blob = new Blob([json], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = fileName
        a.click()
        URL.revokeObjectURL(url)
    }
  
    importFromJSON() {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'application/json'
        const reader = new FileReader()
        reader.addEventListener("load", () => {
            const json = reader.result
            if (!json) { return }
            const projects: IProject[] = JSON.parse(json as string)
            for (const project of projects) {
                try {
                    this.newProject(project)
                } catch (error) {
                    console.error(error)
                }
            }
        })
        input.addEventListener('change', () => {
            const filesList = input.files
            if (!filesList || filesList.length === 0) { return }
            reader.readAsText(filesList[0])
        })
        input.click()
    }

    // --- Métodos auxiliares para la página de detalles y To-Dos ---
    // (Aún presentes mientras se migra la vista de detalle a componentes React)
    setDetailsPage(project: Project) {
        this.currentProject = project
        
        const elements = document.querySelectorAll("[data-project-info]")

        elements.forEach((element) => {
            const key = element.getAttribute("data-project-info")
            if (!key) return
            
            if (key === "finishDate") {
                const date = new Date(project[key])
                element.textContent = date.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric"
                })
            } else if (key === "progress" && element instanceof HTMLElement) {
                element.style.width = `${project.progress}%`
                element.textContent = `${project.progress}%`    
            } else if (key === "initials" && element instanceof HTMLElement) {
                element.style.backgroundColor = project.iconColor 
                element.textContent = project.getInitials()     
            } else if (key === "cost") {
                element.textContent = `$${project[key]}`
            } else if (project[key] !== undefined) {
                element.textContent = project[key]
            }
        })

        this.renderToDos(project)
    }

    renderToDos(project: Project) {
        const todoListContainer = document.getElementById("todo-list");
        if (!todoListContainer) return;
        
        todoListContainer.innerHTML = "";

        project.todos.forEach(todo => {
            const todoCard = document.createElement("div");
            todoCard.className = "todo-item";
            let iconColor = "#686868";
            if (todo.status === "Active") iconColor = "#facc15"; 
            if (todo.status === "Done") iconColor = "#4ade80";   
            todoCard.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid #404040;">
                    <div style="display: flex; column-gap: 15px; align-items: center;">
                        <span class="material-icons-round" style="padding: 10px; background-color: ${iconColor}; border-radius: 10px; color: #202124;">construction</span>
                        <p>${todo.text}</p>
                    </div>
                    <p style="font-size: 0.8em; color: ${iconColor}; font-weight: bold;">${todo.status}</p>
                </div>
            `;
            todoListContainer.appendChild(todoCard);
        });
    }
}