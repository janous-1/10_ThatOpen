import { IProject, ProjectStatus, UserRole, ToDoStatus } from "./classes/Project"
import { ProjectsManager} from "./classes/ProjectsManager"

function toggleModal(id: string) {
  const modal = document.getElementById(id);
  if (modal && modal instanceof HTMLDialogElement) {
    if (modal.open) {
      modal.close();
    } else {
      modal.showModal();
    }
  } else {
    console.warn("The provide modal wasn't found. ID:", id)
  }
}

const projectsListUI = document.getElementById("projects-list") as HTMLElement
const projectsManager = new ProjectsManager(projectsListUI)

const newProjectBtn = document.getElementById("new-project-btn")
if (newProjectBtn) {
  newProjectBtn.addEventListener("click", () => {
    toggleModal("new-project-modal")
  })
}

const cancelProjectBtn = document.getElementById("cancel-project-btn")
if (cancelProjectBtn) {
  cancelProjectBtn.addEventListener("click", () => {
    toggleModal("new-project-modal")
  })
}

const projectForm = document.getElementById("new-project-form")
if (projectForm && projectForm instanceof HTMLFormElement) {
  projectForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const formData = new FormData(projectForm)
    
    // Desafío 4: Fecha por defecto si no se ingresa
    const finishDateInput = formData.get("finishDate") as string
    const finishDate = finishDateInput ? new Date(finishDateInput.replace(/-/g, '\/')) : new Date()

    const projectData: IProject = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      status: formData.get("status") as ProjectStatus,
      userRole: formData.get("userRole") as UserRole,
      finishDate: finishDate,
      cost: Number(formData.get("cost")),
      progress: Number(formData.get("progress"))
    }
    
    try {
      const project = projectsManager.newProject(projectData)
      projectForm.reset()
      toggleModal("new-project-modal")
    } catch (err) {
      const errorMessage = document.getElementById("error-message")
      if (errorMessage) {
        if (err instanceof Error) {
          errorMessage.textContent = err.message
        } else {
          errorMessage.textContent = String(err)
        }
      }
      toggleModal("error-modal")
    }
  })
}

const closeErrorBtn = document.getElementById("close-error-btn")
if (closeErrorBtn) {
  closeErrorBtn.addEventListener("click", () => {
    toggleModal("error-modal")
  })
}

const exportProjectsBtn= document.getElementById("export-projects-btn")
if (exportProjectsBtn) {
  exportProjectsBtn.addEventListener("click", () => {
    projectsManager.exportToJSON()
  })
}

const importProjectsBtn = document.getElementById("import-projects-btn")
if (importProjectsBtn) {
  importProjectsBtn.addEventListener("click", () => {
    projectsManager.importFromJSON()
  })
}

const projectNavBtn = document.getElementById("projects-nav-btn")
if (projectNavBtn) {
  projectNavBtn.addEventListener("click", e => {
    const projectPage = document.getElementById("projects-page")
    const detailsPage = document.getElementById("project-details")
    if (projectPage && detailsPage) {
      projectPage.style.display = "flex"
      detailsPage.style.display = "none"
    }
  })
}

// --- CONEXIÓN DE MODALES PARA TO-DOS (Desafío 6) ---
const addTodoBtn = document.getElementById("add-todo-btn")
if (addTodoBtn) {
    addTodoBtn.addEventListener("click", () => {
        toggleModal("new-todo-modal")
    })
}

const cancelTodoBtn = document.getElementById("cancel-todo-btn")
if (cancelTodoBtn) {
    cancelTodoBtn.addEventListener("click", () => {
        toggleModal("new-todo-modal")
    })
}

const newToDoForm = document.getElementById("new-todo-form")
if (newToDoForm && newToDoForm instanceof HTMLFormElement) {
    newToDoForm.addEventListener("submit", (e) => {
        e.preventDefault()
        const formData = new FormData(newToDoForm)

        if (!projectsManager.currentProject) {
            console.warn("No active project selected.")
            return
        }

        const newToDo = {
            id: Math.random().toString(36).substr(2, 9),
            text: formData.get("todo-text") as string,
            status: formData.get("todo-status") as ToDoStatus
        }

        if (!projectsManager.currentProject.todos) {
            projectsManager.currentProject.todos = []
        }

        // Agregar To-Do al proyecto seleccionado
        projectsManager.currentProject.todos.push(newToDo)
        
        // Volver a renderizar la lista en pantalla
        projectsManager.renderToDos(projectsManager.currentProject)
        toggleModal("new-todo-modal")
        newToDoForm.reset()
        
    })
}

const editProjectBtn = document.getElementById("edit-project-btn"); // Asegúrate de tener este ID en tu panel de detalles
const editModal = document.getElementById("edit-project-modal") as HTMLDialogElement;
const editForm = document.getElementById("edit-project-form") as HTMLFormElement;

editProjectBtn?.addEventListener("click", () => {
    if (!projectsManager.currentProject) return;

    // Rellenamos el formulario con los datos actuales
    const formData = new FormData(editForm);
    editForm["name"].value = projectsManager.currentProject.name;
    editForm["description"].value = projectsManager.currentProject.description;
    editForm["status"].value = projectsManager.currentProject.status;
    editForm["userRole"].value = projectsManager.currentProject.userRole;
    editForm["finishDate"].value = projectsManager.currentProject.finishDate;
    
    editModal.showModal();
});

// 2. Lógica de guardado
editForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!projectsManager.currentProject) return;

    // Aquí creamos el objeto para leer los datos del formulario
    const formData = new FormData(editForm);
    
    // AQUÍ ESTÁ LA SOLUCIÓN: Usamos formData.get() para asignar los valores
    // Asegúrate de que los nombres coincidan con el atributo "name" en tu HTML
    const newName = formData.get("name") as string;
    const newDescription = formData.get("description") as string;
    const newStatus = formData.get("status") as ProjectStatus;
    const newUserRole = formData.get("userRole") as UserRole;
    const finishDateStr = formData.get("finishDate") as string;
    const newFinishDate = new Date(finishDateStr.replace(/-/g, '\/'));
    const newCost = Number(formData.get("cost"));
    const newProgress = Number(formData.get("progress"));

projectsManager.currentProject.finishDate = newFinishDate;
    // Ahora actualizamos el objeto (esto es lo que hace que formData "se use")
    projectsManager.currentProject.name = newName;
    projectsManager.currentProject.description = newDescription;
    projectsManager.currentProject.status = newStatus;
    projectsManager.currentProject.userRole = newUserRole;
    projectsManager.currentProject.finishDate = newFinishDate;
    projectsManager.currentProject.cost = newCost;
    projectsManager.currentProject.progress = newProgress;
    
    projectsManager.currentProject.setUI(); 
    projectsManager.setDetailsPage(projectsManager.currentProject);
    
    editModal.close();
});

const cancelEditBtn = document.getElementById("cancel-edit-btn");
if (cancelEditBtn) {
    cancelEditBtn.addEventListener("click", () => {
        toggleModal("edit-project-modal"); // Usa el id de tu modal de edición
    });
}

function showPage(pageId: string) {
    // Capturamos todos los contenedores de página
    const projectsPage = document.getElementById("projects-page");
    const projectDetails = document.getElementById("project-details");
    const usersPage = document.getElementById("users-page"); // ⚠️ Asegúrate de que este sea el ID de tu página de usuarios
    
    // Ocultamos todas las páginas por defecto
    if (projectsPage) projectsPage.style.display = "none";
    if (projectDetails) projectDetails.style.display = "none";
    if (usersPage) usersPage.style.display = "none";

    // Mostramos únicamente la página que queremos
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.style.display = "flex"; // Usamos flex como indica el estándar de las "pages"
    }
}

// 2. Capturamos los botones del sidebar
const usersNavBtn = document.getElementById("users-nav-btn");
const projectsNavBtn = document.getElementById("projects-nav-btn");

// 3. Asignamos los eventos de clic
if (usersNavBtn) {
    usersNavBtn.addEventListener("click", () => {
        showPage("users-page"); 
    });
}

if (projectsNavBtn) {
    projectsNavBtn.addEventListener("click", () => {
        showPage("projects-page");
    });
}
