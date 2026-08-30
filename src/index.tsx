import * as THREE from "three"
import * as React from "react"
import * as ReactDOM from "react-dom/client"
import * as Router from "react-router-dom"
import { Sidebar } from "./react-components/Sidebar"
import { ProjectsPage } from "./react-components/ProjectsPage"
import { ProjectDetailsPage } from "./react-components/ProjectDetailsPage"
import { UsersPage } from "./react-components/UsersPage"
import { ProjectsManager } from "./classes/ProjectsManager"

const projectManager = new ProjectsManager()

const rootElement = document.getElementById("app") as HTMLDivElement
const appRoot = ReactDOM.createRoot(rootElement)
appRoot.render(
  <>
  <Router.BrowserRouter>
    <Sidebar />
    <Router.Routes>
        <Router.Route path="/" element={<ProjectsPage  projectsManager={projectManager}/>}></Router.Route>
        <Router.Route path="/project/:id" element={<ProjectDetailsPage projectsManager={projectManager}/>}></Router.Route>
        <Router.Route path="/users" element={<UsersPage />} />
    </Router.Routes>
  </Router.BrowserRouter>
  </>
)



// const projectNavBtn = document.getElementById("projects-nav-btn")
// if (projectNavBtn) {
//   projectNavBtn.addEventListener("click", e => {
//     const projectPage = document.getElementById("projects-page")
//     const detailsPage = document.getElementById("project-details")
//     if (projectPage && detailsPage) {
//       projectPage.style.display = "flex"
//       detailsPage.style.display = "none"
//     }
//   })
// }

// // --- CONEXIÓN DE MODALES PARA TO-DOS (Desafío 6) ---
// const addTodoBtn = document.getElementById("add-todo-btn")
// if (addTodoBtn) {
//     addTodoBtn.addEventListener("click", () => {
//         toggleModal("new-todo-modal")
//     })
// }

// const cancelTodoBtn = document.getElementById("cancel-todo-btn")
// if (cancelTodoBtn) {
//     cancelTodoBtn.addEventListener("click", () => {
//         toggleModal("new-todo-modal")
//     })
// }

// const newToDoForm = document.getElementById("new-todo-form")
// if (newToDoForm && newToDoForm instanceof HTMLFormElement) {
//     newToDoForm.addEventListener("submit", (e) => {
//         e.preventDefault()
//         const formData = new FormData(newToDoForm)

//         if (!projectsManager.currentProject) {
//             console.warn("No active project selected.")
//             return
//         }

//         const newToDo = {
//             id: Math.random().toString(36).substr(2, 9),
//             text: formData.get("todo-text") as string,
//             status: formData.get("todo-status") as ToDoStatus
//         }

//         if (!projectsManager.currentProject.todos) {
//             projectsManager.currentProject.todos = []
//         }

//         // Agregar To-Do al proyecto seleccionado
//         projectsManager.currentProject.todos.push(newToDo)
        
//         // Volver a renderizar la lista en pantalla
//         projectsManager.renderToDos(projectsManager.currentProject)
//         toggleModal("new-todo-modal")
//         newToDoForm.reset()
        
//     })
// }

// const editProjectBtn = document.getElementById("edit-project-btn"); // Asegúrate de tener este ID en tu panel de detalles
// const editModal = document.getElementById("edit-project-modal") as HTMLDialogElement;
// const editForm = document.getElementById("edit-project-form") as HTMLFormElement;

// editProjectBtn?.addEventListener("click", () => {
//     if (!projectsManager.currentProject) return;

//     // Rellenamos el formulario con los datos actuales
//     const formData = new FormData(editForm);
//     editForm["name"].value = projectsManager.currentProject.name;
//     editForm["description"].value = projectsManager.currentProject.description;
//     editForm["status"].value = projectsManager.currentProject.status;
//     editForm["userRole"].value = projectsManager.currentProject.userRole;
//     editForm["finishDate"].value = projectsManager.currentProject.finishDate;
    
//     editModal.showModal();
// });

// // 2. Lógica de guardado
// editForm?.addEventListener("submit", (e) => {
//     e.preventDefault();
//     if (!projectsManager.currentProject) return;

//     // Aquí creamos el objeto para leer los datos del formulario
//     const formData = new FormData(editForm);
    
//     // AQUÍ ESTÁ LA SOLUCIÓN: Usamos formData.get() para asignar los valores
//     // Asegúrate de que los nombres coincidan con el atributo "name" en tu HTML
//     const newName = formData.get("name") as string;
//     const newDescription = formData.get("description") as string;
//     const newStatus = formData.get("status") as ProjectStatus;
//     const newUserRole = formData.get("userRole") as UserRole;
//     const finishDateStr = formData.get("finishDate") as string;
//     const newFinishDate = new Date(finishDateStr.replace(/-/g, '\/'));
//     const newCost = Number(formData.get("cost"));
//     const newProgress = Number(formData.get("progress"));

// projectsManager.currentProject.finishDate = newFinishDate;
//     // Ahora actualizamos el objeto (esto es lo que hace que formData "se use")
//     projectsManager.currentProject.name = newName;
//     projectsManager.currentProject.description = newDescription;
//     projectsManager.currentProject.status = newStatus;
//     projectsManager.currentProject.userRole = newUserRole;
//     projectsManager.currentProject.finishDate = newFinishDate;
//     projectsManager.currentProject.cost = newCost;
//     projectsManager.currentProject.progress = newProgress;
    
//     projectsManager.currentProject.setUI(); 
//     projectsManager.setDetailsPage(projectsManager.currentProject);
    
//     editModal.close();
// });

// const cancelEditBtn = document.getElementById("cancel-edit-btn");
// if (cancelEditBtn) {
//     cancelEditBtn.addEventListener("click", () => {
//         toggleModal("edit-project-modal"); // Usa el id de tu modal de edición
//     });
// }

// function showPage(pageId: string) {
//     // Capturamos todos los contenedores de página
//     const projectsPage = document.getElementById("projects-page");
//     const projectDetails = document.getElementById("project-details");
//     const usersPage = document.getElementById("users-page"); // ⚠️ Asegúrate de que este sea el ID de tu página de usuarios
    
//     // Ocultamos todas las páginas por defecto
//     if (projectsPage) projectsPage.style.display = "none";
//     if (projectDetails) projectDetails.style.display = "none";
//     if (usersPage) usersPage.style.display = "none";

//     // Mostramos únicamente la página que queremos
//     const targetPage = document.getElementById(pageId);
//     if (targetPage) {
//         targetPage.style.display = "flex"; // Usamos flex como indica el estándar de las "pages"
//     }
// }

// // 2. Capturamos los botones del sidebar
// const usersNavBtn = document.getElementById("users-nav-btn");
// const projectsNavBtn = document.getElementById("projects-nav-btn");

// // 3. Asignamos los eventos de clic
// if (usersNavBtn) {
//     usersNavBtn.addEventListener("click", () => {
//         showPage("users-page"); 
//     });
// }

// if (projectsNavBtn) {
//     projectsNavBtn.addEventListener("click", () => {
//         showPage("projects-page");
//     });
// }


//ThreeJS viewer
//const scene = new THREE.Scene()

//const viewerContainer = document.getElementById("viewer-container") as HTMLElement

//const camera = new THREE.PerspectiveCamera(75)
//camera.position.z = 5

//const renderer = new THREE.WebGLRenderer({alpha: true, antialias: true})
//viewerContainer.append(renderer.domElement)

//function resizeViewer() {
//  const containerDimensions = viewerContainer.getBoundingClientRect()
//  renderer.setSize(containerDimensions.width, containerDimensions.height)
//  const aspectRatio = containerDimensions.width / containerDimensions.height
//  camera.aspect = aspectRatio
//  camera.updateProjectionMatrix()
//}

// window.addEventListener("resize", resizeViewer)

// resizeViewer()

// // ThreeJS objeto simple
// const boxGeometry = new THREE.BoxGeometry()
// const material = new THREE.MeshStandardMaterial()
// const cube = new THREE.Mesh(boxGeometry , material)

// //ThreeJS luces del viewer
// const directionalLight = new THREE.DirectionalLight()

// const ambientLight = new THREE.AmbientLight()
// ambientLight.intensity = 0.4

// const lightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)

// const spotLight = new THREE.SpotLight(0xffffff, 10)
// spotLight.position.set(0, 8, 3)
// spotLight.angle = Math.PI / 4     // Apertura del cono de luz
// spotLight.penumbra = 0.3         // Suavidad de las orillas del cono
// spotLight.distance = 20          // Alcance máximo de la luz

// const spotLightHelper = new THREE.SpotLightHelper(spotLight)

// scene.add(directionalLight, ambientLight, lightHelper, spotLight, spotLightHelper)

// const cameraControls = new OrbitControls(camera, viewerContainer)

// // funcion para actualizar fotograma
// function renderScene() {
//   lightHelper.update()
//   spotLightHelper.update()
//   renderer.render(scene, camera)
//   requestAnimationFrame(renderScene)
// }

// renderScene()

// const axes = new THREE.AxesHelper()
// const grid = new THREE.GridHelper()
// grid.material.transparent = true
// grid.material.opacity = 0.4
// grid.material.color = new THREE.Color("#808080")


// scene.add(axes, grid)

// const gui = new GUI()

// //const cubeControls = gui.addFolder("Cube")


// //cubeControls.add(cube.position, "x", -10, 10, 1)
// //cubeControls.add(cube.position, "y", -10, 10, 1)
// //cubeControls.add(cube.position, "z", -10, 10, 1)
// //cubeControls.add(cube, "visible")
// //cubeControls.addColor(cube.material, "color")


// const lightsControls = gui.addFolder("Lights")
// lightsControls.add(directionalLight.position, "x", -10,10,1)
// lightsControls.add(directionalLight.position, "y", -10,10,1)
// lightsControls.add(directionalLight.position, "z", -10,10,1)
// lightsControls.add(directionalLight, "intensity", 0, 100, 1)
// lightsControls.addColor(directionalLight, "color")
// lightsControls.add(lightHelper, "visible")

// const objLoader = new OBJLoader()
// const mtlLoader = new MTLLoader()

// //mtlLoader.load("../assets/Gear/Gear1.mtl", (materials) => {
//   //materials.preload()
//   //objLoader.setMaterials(materials)
//   //objLoader.load("../assets/Gear/Gear1.obj", (mesh) => {
//     //scene.add(mesh)
//   //})
// //})

// // Controles GUI para la SpotLight
// const spotFolder = gui.addFolder("SpotLight")
// spotFolder.add(spotLight.position, "x", -10, 10, 0.5)
// spotFolder.add(spotLight.position, "y", 0, 20, 0.5)
// spotFolder.add(spotLight.position, "z", -10, 10, 0.5)
// spotFolder.add(spotLight, "intensity", 0, 50, 1)
// spotFolder.add(spotLight, "angle", 0, Math.PI / 2, 0.05).name("Cono (Angle)")
// spotFolder.add(spotLight, "penumbra", 0, 1, 0.05).name("Suavidad (Penumbra)")
// spotFolder.addColor(spotLight, "color")
// spotFolder.add(spotLightHelper, "visible").name("Show Spot Helper")


// //Cargar Modelo GLTF
// const gltfLoader = new GLTFLoader()

// gltfLoader.load(
//   "../assets//models/LightsPunctualLamp.glb", // Reemplaza por la ruta de tu archivo dentro de la carpeta public
//   (gltf) => {
//     const loadedModel = gltf.scene
    
//     loadedModel.position.set(0, 0, 0)
//     loadedModel.scale.set(1, 1, 1)

//     scene.add(loadedModel)
//     //console.log("¡Modelo GLTF cargado correctamente!", gltf)
//   },
//   (progress) => {
//     const percent = ((progress.loaded / progress.total) * 100).toFixed(0)
//     //console.log(`Cargando modelo GLTF: ${percent}%`)
//   },
//   (error) => {
//     //console.error("Error al cargar el archivo GLTF:", error)
//   }
// )