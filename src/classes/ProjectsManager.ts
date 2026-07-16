import { IProject, Project } from "./Project"

export class ProjectsManager {
    list: Project[] = []
    ui: HTMLElement

    constructor(container:HTMLElement) {
        this.ui = container
        this.newProject({
            name: "Default Project",
            description: "This is just a default app project",
            status: "Pending",
            userRole: "Engineer",
            finishDate: new Date()
        })
    }

    newProject(data: IProject) {
        const projectNames = this.list.map((project) => {
        return project.name
        })
        const nameInUse = projectNames.includes(data.name)
        if (nameInUse) {
            throw new Error(`A project with the name "${data.name}" already exists`)
        }
        const project = new Project(data)
        project.ui.addEventListener("click", () => {
            const projectsPage = document.getElementById("projects-page")
            const detailsPage = document.getElementById("project-details")
            if (!(projectsPage && detailsPage)) {return}
            projectsPage.style.display = "none"
            detailsPage.style.display = "flex"
            this.setDetailsPage(project)
        })
        this.ui.append(project.ui)
        this.list.push(project)
        return project
    }

    private setDetailsPage(project: Project) {
        const detailsPage = document.getElementById("project-details")
        if (!detailsPage) { return }

        const keys = [
            "name", 
            "description", 
            "status", 
            "userRole", 
            "finishDate", 
            "cost", 
            "progress",
            "initials"
        ]

        for (const key of keys) {
            const elements = detailsPage.querySelectorAll(`[data-project-info="${key}"]`)
            elements.forEach((element) => {
                switch (key) {
                    case "finishDate":
                        // Precaución con la fecha: formateo correcto
                        const date = project.finishDate instanceof Date 
                            ? project.finishDate 
                            : new Date(project.finishDate)
                        
                        element.textContent = date.toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })
                        break

                    case "progress":
                        element.textContent = `${project.progress}%`
                        
                        // Si el elemento es una barra de progreso visual (un DIV), actualizamos su ancho
                        if (element instanceof HTMLElement && element.tagName === "DIV") {
                            element.style.width = `${project.progress}%`
                        }
                        break

                    case "cost":
                        element.textContent = `$${project.cost.toLocaleString()}`
                        break

                    case "initials":
                        // Generamos las iniciales dinámicamente
                        const initials = project.name
                            .split(" ")
                            .map(word => word[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()
                        
                        element.textContent = initials
                        break

                    default:
                        // Para propiedades simples (name, description, status, userRole)
                        if (key in project) {
                            element.textContent = String(project[key as keyof Project])
                        }
                        break
                }
            })
        }
    }

    getProject(id: string) {
        const project = this.list.find((project) => {
            return project.id === id
        })
        return project
    }

    getProjectByName(name: string) {
        const project = this.list.find((project) => {
            return project.name == name
        })
        return project
    }

    getTotalCost() {
        return this.list.reduce((total , project) => total + project.cost, 0)
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
          
                }
            }
        })
        input.addEventListener('change', () => {
            const filesList = input.files
            if (!filesList) { return }
            reader.readAsText(filesList[0])
        })
        input.click()
    }
}