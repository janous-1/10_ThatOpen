import { v4 as uuidv4 } from 'uuid'

// 1. Alineamos los tipos con los del profesor (en minúsculas), 
// pero mantenemos tu tipo ToDoStatus tal como lo tienes para no romper tus To-Dos.
export type ProjectStatus = "pending" | "active" | "finished"
export type UserRole = "architect" | "engineer" | "developer"
export type ToDoStatus = "Pending" | "Active" | "Done"

// 2. Mantenemos tu interfaz de To-Do intacta
export interface IToDo {
    id: string
    text: string
    status: ToDoStatus
}

// 3. Fusionamos IProject. Mantenemos lo del profe y sumamos tus datos opcionales
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

// 4. Fusionamos la clase Project
export class Project implements IProject {
    // Satisfaciendo IProject
    name: string
    description: string
    status: ProjectStatus
    userRole: UserRole
    finishDate: Date
    
    // Tus extras para los To-Dos
    todos: IToDo[] = [] 

    // Class internals (Lo del profe + tu iconColor)
    cost: number = 0
    progress: number = 0
    id: string
    iconColor: string

    constructor(data: IProject) {
        // Asignación dinámica (Mantenemos tu validación "ui" por seguridad)
        for (const key in data) {
            if (key === "ui") continue;
            this[key] = data[key]
        }
        
        // Mantenemos tu parche para las fechas que vienen como string
        if (typeof this.finishDate === "string") {
            this.finishDate = new Date(this.finishDate);
        }
        
        // Generamos el UUID
        this.id = uuidv4()
        
        // Mantenemos tu carga de To-Dos
        if (data.todos) {
            this.todos = data.todos
        }
        
        // Mantenemos tu lógica de colores aleatorios
        const colors = ["#B1BBD8", "#7284B8", "#46578B", "#D8B1C5", "#B87296", "#8B466A"]
        this.iconColor = colors[Math.floor(Math.random() * colors.length)]
    }

    // Mantenemos tu función de iniciales.
    // (Aunque en React ya lo resolvimos en la ProjectCard, conservarlo aquí evita que 
    // cualquier otra parte de tu código antiguo se rompa).
    //getInitials() {
        //const trimmedName = this.name.trim()
        //const words = trimmedName.split(/\s+/).filter(word => word.length > 0)
        //let initials = ""

        //if (words.length >= 2) {
        //    initials = words[0].charAt(0) + words[1].charAt(0)
        //} else if (words.length === 1) {
        //    initials = words[0].slice(0, 2)
        //}
        //return initials
    //}
}