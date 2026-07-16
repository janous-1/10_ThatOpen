import { IProject, ProjectStatus, UserRole } from "./classes/Project"
import { ProjectsManager} from "./classes/ProjectsManager"

/*function showModal(id: string) {
  const modal = document.getElementById(id)
  if (modal && modal instanceof HTMLDialogElement) {
    modal.showModal()
  } else {
    console.warn("The provided modal wasn't found. ID: ", id)
  }
}

function closemodal(id: string) {
  const modal = document.getElementById(id)
  if (modal && modal instanceof HTMLDialogElement) {
    modal.close()
  } else {
    console.warn("The provided modal wasn't found. ID: ", id)
  }
}
*/
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

// This document object is provided by the browser, and its main purpose is to help us interact with the DOM.
const newProjectBtn = document.getElementById("new-project-btn")
if (newProjectBtn) {
  newProjectBtn.addEventListener("click", () => {toggleModal("new-project-modal")})
} else {
  console.warn("New projects button was not found")
}

const cancelProjectBtn = document.getElementById("cancel-project-btn")
if (cancelProjectBtn) {
  cancelProjectBtn.addEventListener("click", () => {
    toggleModal("new-project-modal")
  })
} else {
  console.warn("Cancel project button was not found")
}


const projectForm = document.getElementById("new-project-form")
if (projectForm && projectForm instanceof HTMLFormElement) {
  projectForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const formData = new FormData(projectForm)
    const projectData: IProject = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      status: formData.get("status") as ProjectStatus,
      userRole: formData.get("userRole") as UserRole,
      finishDate: new Date(formData.get("finishDate") as string)
    }  
    try {
      const project = projectsManager.newProject(projectData)
      console.log(project)
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
} else {
	console.warn("The project form was not found. Check the ID!")
}

const closeErrorBtn = document.getElementById("close-error-btn")
if (closeErrorBtn) {
  closeErrorBtn.addEventListener("click", () => {
    toggleModal("error-modal")
  })
} else {
  console.warn("Close error button was not found")
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
    if(!(projectPage && detailsPage)) {return}
    projectPage.style.display = "flex"
    detailsPage.style.display = "none"
  })
}