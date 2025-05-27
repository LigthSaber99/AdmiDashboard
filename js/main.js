document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    // Usuarios predefinidos para pruebas
    const adminUser = {
        name: 'Nazareth',
        email: 'admin@gym.com',
        password: 'admin',
        role: 'admin',
        photo: 'https://via.placeholder.com/60/007bff/ffffff?text=AD' // Foto azul para Admin
    };

    const coachUser = {
        name: 'Coach Juan',
        email: 'coach@gym.com',
        password: 'coach',
        role: 'coach',
        photo: 'https://via.placeholder.com/60/28a745/ffffff?text=CH' // Foto verde para Coach
    };

    // Obtener o iniciar el arreglo de usuarios
    let users = JSON.parse(localStorage.getItem('users')) || [];

    /**
     * Agrega o actualiza un usuario en localStorage
     * @param {Object} userToAdd
     */
    const addOrUpdateUser = (userToAdd) => {
        const index = users.findIndex(u => u.email === userToAdd.email);
        if (index === -1) {
            users.push(userToAdd);
        } else {
            users[index] = { ...users[index], ...userToAdd };
        }
    };

    // Garantizar que admin y coach estén presentes
    addOrUpdateUser(adminUser);
    addOrUpdateUser(coachUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Manejo del login
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        // Buscar usuario válido
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            // Usuario registrado: guardar sesión
            localStorage.setItem('currentUser', JSON.stringify(user));
        } else {
            // Usuario no registrado: crear uno "invitado" con acceso libre
            const guestUser = {
                name: 'Usuario Invitado',
                email: email,
                role: 'admin', // Puedes cambiar a 'coach' si prefieres
                photo: 'https://via.placeholder.com/60/6c757d/ffffff?text=IN' // Gris para Invitado
            };
            localStorage.setItem('currentUser', JSON.stringify(guestUser));
        }

        // Redirigir al dashboard
        window.location.href = 'dashboard.html';
    });
});
