import * as React from "react";

// 1. Definimos la estructura de un Usuario
interface User {
    cid: string;
    name: string;
    email: string;
    status: string;
    created: string;
    lector: string;
    editor: string;
    admin: string;
}

export function UsersPage() {
    // 2. Inicializamos el estado con los usuarios estáticos de tu HTML
    const [users, setUsers] = React.useState<User[]>([
        {
            cid: "816",
            name: "Pedro Perez",
            email: "pedro.perezl@example.com",
            status: "Active",
            created: "2 days ago",
            lector: "permiso",
            editor: "no-aplica",
            admin: "no-aplica"
        },
        {
            cid: "426",
            name: "Juan Perez",
            email: "juan.perez@example.com",
            status: "Active",
            created: "5 days ago",
            lector: "permiso",
            editor: "no-aplica",
            admin: "no-aplica"
        },
        {
            cid: "561",
            name: "Diego Perez",
            email: "diego.perez@example.com",
            status: "Active",
            created: "2 months ago",
            lector: "no-permiso",
            editor: "permiso",
            admin: "permiso"
        }
    ]);

    // 3. Función para abrir/cerrar el modal
    function toggleModal(id: string) {
        const modal = document.getElementById(id);
        if (modal && modal instanceof HTMLDialogElement) {
            if (modal.open) {
                modal.close();
            } else {
                modal.showModal();
            }
        } else {
            console.warn("The provided modal wasn't found. ID:", id);
        }
    }

    // 4. Manejadores de Eventos
    const onNewUserClick = () => toggleModal("new-user-modal");

    const onNewUserSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        
        // Creamos un nuevo usuario capturando los datos del formulario
        const newUser: User = {
            cid: Math.floor(Math.random() * 1000).toString(), // Generamos un CID aleatorio de 3 dígitos
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            status: "Active",
            created: "Just now",
            lector: formData.get("lector") as string,
            editor: formData.get("editor") as string,
            admin: formData.get("admin") as string,
        };

        // Actualizamos la tabla
        setUsers(prev => [...prev, newUser]);
        
        // Limpiamos y cerramos
        e.currentTarget.reset();
        toggleModal("new-user-modal");
    };

    // 5. Función auxiliar para renderizar íconos según permiso
    const renderPermissionIcon = (permission: string) => {
        if (permission === "permiso") return <span className="material-icons-round icon-green" style={{ color: "green" }}>check_circle</span>;
        if (permission === "no-aplica") return <span className="material-icons-round icon-yellow" style={{ color: "#facc15" }}>schedule</span>;
        if (permission === "no-permiso") return <span className="material-icons-round icon-red" style={{ color: "red" }}>cancel</span>;
        return null;
    };

    return (
        <div className="page" id="users-page">
            
            {/* --- MODAL: NEW USER --- */}
            <dialog id="new-user-modal">
                <form id="new-user-form" onSubmit={onNewUserSubmit}>
                    <h2>New User</h2>
                    <div className="input-list">
                        <div className="form-field-container">
                            <label><span className="material-icons-round">badge</span>Name</label>
                            <input name="name" type="text" placeholder="Ej. Nombre Apellido" required />
                        </div>
                        <div className="form-field-container">
                            <label><span className="material-icons-round">email</span>Email</label>
                            <input name="email" type="email" placeholder="correo@ejemplo.com" required />
                        </div>
                        
                        <div className="form-field-container">
                            <label><span className="material-icons-round">visibility</span>Lector</label>
                            <select name="lector" defaultValue="no-aplica">
                                <option value="permiso">Permiso</option>
                                <option value="no-aplica">No Aplica</option>
                                <option value="no-permiso">No Permiso</option>
                            </select>
                        </div>
                        
                        <div className="form-field-container">
                            <label><span className="material-icons-round">edit</span>Editor</label>
                            <select name="editor" defaultValue="no-aplica">
                                <option value="permiso">Permiso</option>
                                <option value="no-aplica">No Aplica</option>
                                <option value="no-permiso">No Permiso</option>
                            </select>
                        </div>

                        <div className="form-field-container">
                            <label><span className="material-icons-round">admin_panel_settings</span>Admin</label>
                            <select name="admin" defaultValue="no-aplica">
                                <option value="permiso">Permiso</option>
                                <option value="no-aplica">No Aplica</option>
                                <option value="no-permiso">No Permiso</option>
                            </select>
                        </div>
                        
                        <div style={{ display: "flex", margin: "10px 0px 10px auto", columnGap: 10 }}>
                            <button type="button" onClick={() => toggleModal("new-user-modal")} style={{ backgroundColor: "transparent" }}>
                                Cancel
                            </button>
                            <button type="submit" style={{ backgroundColor: "rgb(18, 145, 18)" }}>
                                Accept
                            </button>
                        </div>
                    </div>
                </form>
            </dialog>

            {/* --- HEADER --- */}
            <header>
                <h2>Users</h2>
                <div>
                    <button onClick={onNewUserClick}>
                        <span className="material-icons-round">person_add</span>New User
                    </button>
                </div>
            </header>

            {/* --- MAIN CONTENT (TABLE) --- */}
            <div className="users-list-container">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>CID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>Created</th>
                            <th style={{ textAlign: "center" }} title="Lector">Lector</th>
                            <th style={{ textAlign: "center" }} title="Editor">Editor</th>
                            <th style={{ textAlign: "center" }} title="Administrador">Admin</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Iteramos sobre el estado de React para dibujar las filas dinámicamente */}
                        {users.map((user) => (
                            <tr key={user.cid}>
                                <td>{user.cid}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td className="status-active">{user.status}</td>
                                <td>{user.created}</td>
                                <td style={{ textAlign: "center" }}>{renderPermissionIcon(user.lector)}</td>
                                <td style={{ textAlign: "center" }}>{renderPermissionIcon(user.editor)}</td>
                                <td style={{ textAlign: "center" }}>{renderPermissionIcon(user.admin)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}