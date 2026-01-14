/**
 * Office Add-in Auth Simulation
 * 
 * Lógica pura en JavaScript para manejar la navegación entre "vistas"
 * y simular procesos asíncronos de un backend inexistente.
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- State Management simple ---
    const state = {
        lastEmail: '' // Para recordar el email entre pasos (registro -> verificar)
    };

    // --- Navegación ---
    
    // Todas las vistas deben tener class="view" y un id único
    const views = document.querySelectorAll('.view');

    /**
     * Oculta todas las vistas y muestra la solicitada por ID
     * @param {string} viewId 
     */
    function navigateTo(viewId) {
        views.forEach(view => {
            if(view.id === viewId) {
                view.classList.remove('hidden');
                view.classList.add('active');
            } else {
                view.classList.add('hidden');
                view.classList.remove('active');
            }
        });

        // Limpieza de errores o estados si fuera necesario
    }

    // Configurar listeners para todos los links de navegación (data-target)
    document.querySelectorAll('[data-target]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');
            navigateTo(targetId);
        });
    });


    // --- Utilidades de Formulario ---

    /**
     * Simula una petición de red con un spinner y delay
     * @param {HTMLFormElement} form 
     * @param {Function} onSuccess Callback a ejecutar tras el delay
     */
    function simulateSubmit(form, onSuccess) {
        const btn = form.querySelector('button[type="submit"]');
        const loader = form.querySelector('.loader');

        // Estado: Cargando
        btn.disabled = true;
        const originalText = btn.innerText;
        btn.innerText = "Procesando...";
        if(loader) loader.classList.remove('hidden');

        // Simular delay de API (1.5 segundos)
        setTimeout(() => {
            // Estado: Terminado
            btn.disabled = false;
            btn.innerText = originalText;
            if(loader) loader.classList.add('hidden');

            // Ejecutar lógica de éxito
            onSuccess();
        }, 1500);
    }


    /* =========================================
       HANDLERS DE FORMULARIOS ESPECÍFICOS
       ========================================= */

    // 1. LOGIN
    document.getElementById('form-login').addEventListener('submit', (e) => {
        e.preventDefault();
        // Aquí iría la lógica real de validación
        simulateSubmit(e.target, () => {
            // Éxito -> Ir al dashboard (view-success)
            navigateTo('view-success');
        });
    });

    // 2. REGISTRO
    document.getElementById('form-register').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const emailInput = document.getElementById('reg-email');
        state.lastEmail = emailInput.value; // Guardar email para mostrarlo

        simulateSubmit(e.target, () => {
            // Actualizar UI con el email
            document.getElementById('display-email-register').innerText = state.lastEmail || 'tu correo';
            // Ir a verificación
            navigateTo('view-verify-register');
        });
    });

    // 3. VERIFICAR REGISTRO
    document.getElementById('form-verify-register').addEventListener('submit', (e) => {
        e.preventDefault();
        simulateSubmit(e.target, () => {
            alert('¡Cuenta verificada! Ahora puedes iniciar sesión.');
            navigateTo('view-login');
        });
    });

    // 4. OLVIDÉ CONTRASEÑA (Solicitar código)
    document.getElementById('form-forgot').addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = document.getElementById('forgot-email');
        state.lastEmail = emailInput.value;

        simulateSubmit(e.target, () => {
             // Actualizar UI con el email
             document.getElementById('display-email-recovery').innerText = state.lastEmail || 'tu correo';
            navigateTo('view-verify-recovery');
        });
    });

    // 5. VERIFICAR RECUPERACIÓN
    document.getElementById('form-verify-recovery').addEventListener('submit', (e) => {
        e.preventDefault();
        simulateSubmit(e.target, () => {
            navigateTo('view-reset-password');
        });
    });

    // 6. RESTABLECER CONTRASEÑA
    document.getElementById('form-reset-password').addEventListener('submit', (e) => {
        e.preventDefault();
        const p1 = document.getElementById('new-pass').value;
        const p2 = document.getElementById('new-pass-confirm').value;

        if(p1 !== p2) {
            alert('Las contraseñas no coinciden');
            return;
        }

        simulateSubmit(e.target, () => {
            alert('Contraseña actualizada correctamente.');
            navigateTo('view-login');
        });
    });

});
