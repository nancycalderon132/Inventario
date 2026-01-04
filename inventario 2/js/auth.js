// Manejo de autenticación
document.addEventListener('DOMContentLoaded', function() {
    // Formulario de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
        
        // Cargar usuarios de prueba
        loadSampleUsers();
    }
    
    // Formulario de registro
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // Cerrar modales de error/éxito
    const closeModalButtons = document.querySelectorAll('.close-modal, .close');
    closeModalButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });
});

// Cargar usuarios de ejemplo
function loadSampleUsers() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Si no hay usuarios, crear algunos de ejemplo
    if (users.length === 0) {
        const sampleUsers = [
            {
                id: 1,
                name: "Administrador",
                email: "admin@inventario.com",
                password: "admin123",
                role: "admin",
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                name: "Usuario Demo",
                email: "usuario@inventario.com",
                password: "user123",
                role: "user",
                createdAt: new Date().toISOString()
            }
        ];
        
        localStorage.setItem('users', JSON.stringify(sampleUsers));
    }
}

// Manejar login
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    
    // Validar campos
    if (!email || !password || !role) {
        showErrorModal('Por favor, complete todos los campos');
        return;
    }
    
    // Obtener usuarios desde localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Buscar usuario
    const user = users.find(u => u.email === email && u.password === password && u.role === role);
    
    if (user) {
        // Guardar usuario actual
        const currentUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        };
        
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Redirigir al dashboard
        window.location.href = 'dashboard.html';
    } else {
        showErrorModal('Credenciales incorrectas. Por favor, verifique su email, contraseña y rol.');
    }
}

// Manejar registro
function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const role = document.getElementById('role').value;
    
    // Validar campos
    if (!name || !email || !password || !confirmPassword || !role) {
        showErrorModal('Por favor, complete todos los campos');
        return;
    }
    
    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
        showErrorModal('Las contraseñas no coinciden');
        return;
    }
    
    // Validar longitud de contraseña
    if (password.length < 6) {
        showErrorModal('La contraseña debe tener al menos 6 caracteres');
        return;
    }
    
    // Obtener usuarios desde localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Verificar si el usuario ya existe
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        showErrorModal('Este correo electrónico ya está registrado');
        return;
    }
    
    // Crear nuevo usuario
    const newUser = {
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
        name: name,
        email: email,
        password: password,
        role: role,
        createdAt: new Date().toISOString()
    };
    
    // Agregar usuario a la lista
    users.push(newUser);
    
    // Guardar en localStorage
    localStorage.setItem('users', JSON.stringify(users));
    
    // Mostrar modal de éxito
    showSuccessModal();
}

// Mostrar modal de error
function showErrorModal(message) {
    const errorModal = document.getElementById('errorModal');
    const errorMessage = document.getElementById('errorMessage');
    
    if (errorModal && errorMessage) {
        errorMessage.textContent = message;
        errorModal.style.display = 'flex';
    }
}

// Mostrar modal de éxito
function showSuccessModal() {
    const successModal = document.getElementById('successModal');
    
    if (successModal) {
        successModal.style.display = 'flex';
        
        // Configurar redirección después de cerrar el modal
        const closeButton = successModal.querySelector('.close-modal');
        if (closeButton) {
            closeButton.onclick = function() {
                window.location.href = 'index.html';
            };
        }
    }
}

// Cerrar sesión
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}