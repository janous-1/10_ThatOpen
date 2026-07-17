import { v4 as uuidv4 } from 'uuid'

export type ProjectStatus = "Pending" | "Active" | "Finished"
export type UserRole = "Architect" | "Engineer" | "Developer"
export type ToDoStatus = "Pending" | "Active" | "Done"

export interface IToDo {
    id: string
    text: string
    status: ToDoStatus
}

export interface IProject {
    name: string
    description: string
    status: ProjectStatus
    userRole: UserRole
    finishDate: Date
    cost?: number
    progress?: number
    todos?: IToDo[] // Desafío 7: Hacemos compatible la importación
}

export class Project implements IProject {
    name: string
    description: string
    status: ProjectStatus
    userRole: UserRole
    finishDate: Date
    todos: IToDo[] = [] // Inicializamos array de To-Dos

    // Class internals
    ui!: HTMLDivElement
    cost: number = 0
    progress: number = 0
    id: string
    iconColor: string

    constructor(data: IProject) {
        for (const key in data) {
            if (key === "ui") continue;
            this[key] = data[key]
        }
        if (typeof this.finishDate === "string") {
            this.finishDate = new Date(this.finishDate);
        }
        this.id = uuidv4()
        if (data.todos) {
            this.todos = data.todos
        }
        if (!this.ui || !(this.ui instanceof HTMLDivElement)) {
            this.ui = document.createElement("div");
            this.ui.className = "project-card";
        }
        const colors = ["#B1BBD8", "#7284B8", "#46578B", "#D8B1C5", "#B87296", "#8B466A"]
        this.iconColor = colors[Math.floor(Math.random() * colors.length)]
        this.setUI()
    }


    getInitials() {
        const trimmedName = this.name.trim()
        const words = trimmedName.split(/\s+/).filter(word => word.length > 0)
        let initials = ""

        if (words.length >= 2) {
            initials = words[0].charAt(0) + words[1].charAt(0)
        } else if (words.length === 1) {
            initials = words[0].slice(0, 2)
        }
        return initials
    }
    // Creates or updates the project card UI
    setUI() {
        if (!this.ui) {
            this.ui = document.createElement("div")
            this.ui.className = "project-card"
        }

        // Desafíos 1 y 2: Selección de color aleatorio y mayúsculas en CSS
        const colors = ["#B1BBD8", "#7284B8", "#46578B", "#D8B1C5", "#B87296", "#8B466A"]
        const randomColor = colors[Math.floor(Math.random() * colors.length)]

        const trimmedName = this.name.trim()
        const words = trimmedName.split(/\s+/).filter(word => word.length > 0)
        let initials = ""

        if (words.length >= 2) {
            initials = words[0].charAt(0) + words[1].charAt(0)
        } else if (words.length === 1) {
            initials = words[0].slice(0, 2)
        }

        this.ui.innerHTML = `
        <div class="card-header">
            <p style="background-color: ${this.iconColor}; padding: 10px; border-radius: 8px; aspect-ratio: 1; text-transform: uppercase;">${this.getInitials()}</p>
            <div>
                <h5>${this.name}</h5>
                <p>${this.description}</p>
            </div>
        </div>
        <div class="card-content">
            <div class="card-property">
                <p style="color: #969696;">Status</p>
                <p>${this.status}</p>
            </div>
            <div class="card-property">
                <p style="color: #969696;">Role</p>
                <p>${this.userRole}</p>
            </div>
            <div class="card-property">
                <p style="color: #969696;">Cost</p>
                <p>$${this.cost}</p>
            </div>
            <div class="card-property">
                <p style="color: #969696;">Estimated Progress</p>
                <p>${this.progress}%</p>
            </div>
        </div>`
    }
}