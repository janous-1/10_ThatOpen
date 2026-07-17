import { IProject, Project, ToDoStatus } from "./Project"

export class ProjectsManager {
    list: Project[] = []
    ui: HTMLElement
    currentProject: Project | null = null

    constructor(container: HTMLElement) {
        this.ui = container
        this.newProject({
            name: "Default Project",
            description: "This is just a default app project",
            status: "Pending",
            userRole: "Engineer",
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

    newProject(data: IProject) {
        if (data.name.length < 5) {
            throw new Error("The project name must contain at least 5 characters.")
        }      
        
        const projectToUpdate = this.list.find(
            (project) => project.name.toLowerCase() === data.name.toLowerCase()
        )
        
        if (projectToUpdate) {
            projectToUpdate.name = data.name
            projectToUpdate.description = data.description
            projectToUpdate.status = data.status
            projectToUpdate.userRole = data.userRole
            projectToUpdate.finishDate = data.finishDate
            if (data.cost !== undefined) {
                projectToUpdate.cost = data.cost;
            }
            if (data.progress !== undefined) {
                projectToUpdate.progress = data.progress;
            }
            if (data.todos) {
                projectToUpdate.todos = data.todos
            }
            
            projectToUpdate.setUI()
            this.setDetailsPage(projectToUpdate) 
            
            return projectToUpdate
        }

        const project = new Project(data)
        project.ui.addEventListener("click", () => {
            const projectsPage = document.getElementById("projects-page")
            const detailsPage = document.getElementById("project-details")
            if (!(projectsPage && detailsPage)) { return }
            projectsPage.style.display = "none"
            detailsPage.style.display = "flex"
            this.setDetailsPage(project)
            this.renderToDos(project)
        })
        
        this.ui.append(project.ui)
        this.list.push(project)
        return project
    }

    getProject(id: string) {
        return this.list.find(p => p.id === id)
    }

    getProjectByName(name: string) {
        const project = this.list.find((project) => {
            return project.name === name
        })
        return project
    }

    getTotalCost() {
        return this.list.reduce((total, project) => total + project.cost, 0)
    }

    deleteProject(id: string) {
        const project = this.getProject(id)
        if (!project) { return }
        project.ui.remove()
        const remaining = this.list.filter((project) => {
            return project.id !== id
        })
        this.list = remaining
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

    // Agrega este método dentro de tu clase ProjectsManager
    renderToDos(project: Project) {
        const todoListContainer = document.getElementById("todo-list");
        if (!todoListContainer) return;
        
        // Limpiamos el contenedor antes de dibujar
        todoListContainer.innerHTML = "";

        // Iteramos sobre los To-Dos y creamos el HTML para cada uno
        project.todos.forEach(todo => {
            const todoCard = document.createElement("div");
            todoCard.className = "todo-item";
            let iconColor = "#686868"; // Por defecto (Pending)
            if (todo.status === "Active") iconColor = "#facc15"; // Amarillo
            if (todo.status === "Done") iconColor = "#4ade80";   // Verde
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