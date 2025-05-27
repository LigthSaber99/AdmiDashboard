document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');

  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Obtener datos del formulario
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Obtener o iniciar lista de usuarios
    let users = JSON.parse(localStorage.getItem('users')) || [];

    // Verificar si ya existe un usuario con ese email
    if (users.some(user => user.email === email)) {
      alert('Este correo ya está registrado.');
      return;
    }

    // Crear nuevo usuario con rol por defecto: 'client'
    const newUser = {
      name,
      email,
      password,
      role: 'client',
      photo: '/assets/1.jpg'
    };

    // Agregar y guardar
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    alert('Registro exitoso. Ahora puedes iniciar sesión.');

    // Redirigir al login
    window.location.href = 'index.html';
  });
});
