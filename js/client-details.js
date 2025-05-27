document.addEventListener('DOMContentLoaded', () => {
    // Obtener el email del cliente seleccionado desde localStorage
    const selectedClientEmail = localStorage.getItem('selectedClientEmail');

    // Si no hay cliente seleccionado, alertar y redirigir al dashboard
    if (!selectedClientEmail) {
        alert('No se ha seleccionado ningún cliente.');
        window.location.href = 'dashboard.html';
        return;
    }

    // Cargar la lista de usuarios desde localStorage o inicializar array vacío
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Buscar el cliente cuyo email coincide con el seleccionado
    const client = users.find(u => u.email === selectedClientEmail);

    if (client) {
        // Mostrar los detalles del cliente en el HTML
        document.getElementById('clientNameDetail').textContent = client.name;
        document.getElementById('clientEmailDetail').textContent = client.email;
        document.getElementById('clientWeightDetail').textContent = client.weight || 'N/A';
        document.getElementById('clientHeightDetail').textContent = client.height || 'N/A';
        document.getElementById('clientNutritionalPlanDetail').textContent = client.nutritionalPlan || 'N/A';
        document.getElementById('clientObjectiveDetail').textContent = client.objective || 'N/A';
        document.getElementById('clientSubscriptionDetail').textContent = client.subscription || 'N/A';

        // Añadir clase CSS basada en la suscripción para estilos específicos
        const subscriptionSpan = document.getElementById('clientSubscriptionDetail');
        if (client.subscription) {
            subscriptionSpan.classList.add(`subscription-${client.subscription.toLowerCase()}`);
        }

    } else {
        // Si no se encuentra el cliente, alertar y redirigir al dashboard
        alert('Cliente no encontrado.');
        window.location.href = 'dashboard.html';
    }
});
