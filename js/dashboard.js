document.addEventListener('DOMContentLoaded', () => {
    // Obtener usuario actual de localStorage y verificar permisos
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'coach')) {
        alert('Acceso no autorizado. Por favor, inicie sesión como administrador o coach.');
        window.location.href = 'index.html'; // Redirigir a login
        return;
    }

    // Mostrar nombre y rol en el sidebar (sin foto)
    document.getElementById('adminName').textContent = currentUser.name;
    document.getElementById('adminRole').textContent = `Rol: ${currentUser.role === 'admin' ? 'Administrador' : 'Coach'}`;

    // Elementos del DOM para manipular
    const clientList = document.getElementById('clientList');
    const registerClientForm = document.getElementById('registerClientForm');
    const uploadVideoForm = document.getElementById('uploadVideoForm');
    const videoList = document.getElementById('videoList');
    const sidebarLinks = document.querySelectorAll('.list-group-item[data-section]');
    const dashboardSections = document.querySelectorAll('.dashboard-section');
    const currentSectionTitle = document.getElementById('currentSectionTitle');

    // Cargar usuarios y videos desde localStorage o inicializar arrays vacíos
    let users = JSON.parse(localStorage.getItem('users')) || [];
    let videos = JSON.parse(localStorage.getItem('videos')) || [];

    /**
     * Renderiza la lista de clientes en la UI
     */
    const renderClients = () => {
        const clients = users.filter(user => user.role === 'client');
        clientList.innerHTML = ''; // Limpiar lista previa

        if (clients.length === 0) {
            clientList.innerHTML = '<li class="list-group-item text-center">No hay clientes registrados aún.</li>';
        } else {
            clients.forEach(client => {
                const li = document.createElement('li');
                li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
                li.innerHTML = `
                    <div class="d-flex align-items-center">
                        <!-- Foto removida, solo nombre -->
                        <span>${client.name}</span>
                    </div>
                    <button class="btn btn-sm view-details-btn" data-email="${client.email}">Ver Detalles</button>
                `;
                clientList.appendChild(li);
            });
        }
    };

    /**
     * Renderiza la lista de videos motivacionales en la UI
     */
    const renderVideos = () => {
        videoList.innerHTML = ''; // Limpiar lista previa
        if (videos.length === 0) {
            videoList.innerHTML = '<div class="list-group-item text-center">No hay videos motivacionales subidos aún.</div>';
            return;
        }
        videos.forEach((video, index) => {
            const videoItem = document.createElement('div');
            videoItem.classList.add('list-group-item', 'mb-2', 'd-flex', 'justify-content-between', 'align-items-center');
            videoItem.innerHTML = `
                <div>
                    <h5>${video.title}</h5>
                    <p class="mb-1"><a href="${video.url}" target="_blank">${video.url}</a></p>
                    <small class="text-muted">${video.description || 'Sin descripción'}</small>
                </div>
                <button class="btn btn-danger btn-sm delete-video-btn" data-index="${index}">Eliminar</button>
            `;
            videoList.appendChild(videoItem);
        });
    };

    // Renderizar inicialmente clientes y videos
    renderClients();
    renderVideos();

    // Delegar evento para botón "Ver Detalles" en la lista de clientes
    clientList.addEventListener('click', (e) => {
        if (e.target.classList.contains('view-details-btn')) {
            const clientEmail = e.target.dataset.email;
            localStorage.setItem('selectedClientEmail', clientEmail);
            window.location.href = 'client-details.html';
        }
    });

    // Manejar envío de formulario para registrar cliente (sin contraseña)
    registerClientForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Obtener valores de inputs
        const name = document.getElementById('clientName').value;
        const email = document.getElementById('clientEmail').value;
        const weight = document.getElementById('clientWeight').value;
        const height = document.getElementById('clientHeight').value;
        const nutritionalPlan = document.getElementById('clientNutritionalPlan').value;
        const objective = document.getElementById('clientObjective').value;
        const subscription = document.getElementById('clientSubscription').value;

        // Validar email único
        if (users.some(u => u.email === email)) {
            alert('Este correo electrónico ya está registrado.');
            return;
        }

        // Crear nuevo cliente sin password
        const newClient = {
            name,
            email,
            role: 'client',
            weight: parseFloat(weight),
            height: parseInt(height),
            nutritionalPlan,
            objective,
            subscription
        };

        // Añadir cliente y guardar en localStorage
        users.push(newClient);
        localStorage.setItem('users', JSON.stringify(users));
        alert('Cliente registrado exitosamente!');
        registerClientForm.reset();

        // Actualizar UI y mostrar sección clientes
        renderClients();
        showSection('clients');
    });

    // Manejar envío de formulario para subir videos
    uploadVideoForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const title = document.getElementById('videoTitle').value;
        const url = document.getElementById('videoUrl').value;
        const description = document.getElementById('videoDescription').value;

        const newVideo = { title, url, description };
        videos.push(newVideo);
        localStorage.setItem('videos', JSON.stringify(videos));
        alert('Video guardado exitosamente!');
        uploadVideoForm.reset();
        renderVideos();
    });

    // Delegar evento para eliminar videos
    videoList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-video-btn')) {
            const indexToDelete = parseInt(e.target.dataset.index);
            if (confirm('¿Estás seguro de que quieres eliminar este video?')) {
                videos.splice(indexToDelete, 1);
                localStorage.setItem('videos', JSON.stringify(videos));
                renderVideos();
            }
        }
    });

    /**
     * Función para mostrar la sección seleccionada y ocultar las demás
     * @param {string} sectionId - ID de la sección a mostrar
     */
    const showSection = (sectionId) => {
        dashboardSections.forEach(section => {
            section.classList.add('d-none'); // Ocultar todas las secciones
        });
        document.getElementById(`${sectionId}-section`).classList.remove('d-none'); // Mostrar la seleccionada

        // Actualizar estado activo en links del sidebar
        sidebarLinks.forEach(link => link.classList.remove('active'));
        document.querySelector(`.list-group-item[data-section="${sectionId}"]`).classList.add('active');

        // Actualizar título de la sección
        const sectionMapping = {
            'clients': 'Lista de Clientes',
            'register-client': 'Registrar Nuevo Cliente',
            'upload-videos': 'Subir Videos Motivacionales'
        };
        currentSectionTitle.textContent = sectionMapping[sectionId] || 'Dashboard';
    };

    // Navegación sidebar: cambiar sección visible al hacer click
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = e.target.dataset.section;
            showSection(sectionId);
        });
    });

    // Toggle para mostrar/ocultar sidebar en pantallas pequeñas
    const sidebarToggle = document.getElementById('sidebarToggle');
    const wrapper = document.getElementById('wrapper');
    if (sidebarToggle && wrapper) {
        sidebarToggle.addEventListener('click', (e) => {
            e.preventDefault();
            wrapper.classList.toggle('toggled');
        });
    }

    // Logout: eliminar sesión y redirigir a login
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('selectedClientEmail');
        window.location.href = 'index.html';
    });
});
