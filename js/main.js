document.addEventListener('DOMContentLoaded', () => {
    // Obtener el formulario de login
    const loginForm = document.getElementById('loginForm');

    // Usuario administrador simulado para pruebas
    const adminUser = {
        name: 'Nazareth',
        email: 'admin@gym.com',
        password: 'admin',
        role: 'admin',
        photo: 'https://via.placeholder.com/60/007bff/ffffff?text=AD' // Foto placeholder admin
    };

    // Usuario coach simulado para pruebas
    const coachUser = {
        name: 'Coach Juan',
        email: 'coach@gym.com',
        password: 'coach',
        role: 'coach',
        photo: 'https://via.placeholder.com/60/28a745/ffffff?text=CH' // Foto placeholder coach
    };

    // Cargar usuarios almacenados en localStorage o iniciar con array vacío
    let users = JSON.parse(localStorage.getItem('users')) || [];

    /**
     * Función para agregar o actualizar un usuario en el array de usuarios
     * @param {Object} userToAdd - Usuario a agregar o actualizar
     */
    const addOrUpdateUser = (userToAdd) => {
        const existingUserIndex = users.findIndex(u => u.email === userToAdd.email);
        if (existingUserIndex === -1) {
            // Si no existe, agregar nuevo usuario
            users.push(userToAdd);
        } else {
            // Si ya existe, actualizar sus datos
            users[existingUserIndex] = { ...users[existingUserIndex], ...userToAdd };
        }
    };

    // Asegurar que el usuario admin y coach existan en el localStorage
    addOrUpdateUser(adminUser);
    addOrUpdateUser(coachUser);

    // Guardar usuarios actualizados en localStorage
    localStorage.setItem('users', JSON.stringify(users));

    // Evento para cuando se envíe el formulario de login
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Evitar envío tradicional y recarga

        // Obtener valores ingresados
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        // Buscar usuario que coincida con email y contraseña
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            // Validar que el usuario tenga rol permitido para acceder
            if (user.role === 'admin' || user.role === 'coach') {
                // Guardar usuario actual en localStorage para sesión
                localStorage.setItem('currentUser', JSON.stringify(user));
                // Redirigir al dashboard
                window.location.href = 'dashboard.html';
            } else {
                // Usuario con rol no autorizado
                alert('Acceso no autorizado para este tipo de usuario. Por favor, inicie sesión como administrador o coach.');
            }
        } else {
            // Credenciales incorrectas
            alert('Credenciales incorrectas. Por favor, intente de nuevo.');
        }
    });
});
