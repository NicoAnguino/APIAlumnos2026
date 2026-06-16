document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {
        email: document.getElementById("loginEmail").value,
        password: document.getElementById("loginPassword").value
    };
    const apiBase = `${linkApi}/auth`;

    try {

        fetch(`${apiBase}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error en la petición: ${response.status}`);
                }

                return response.json();
            })
            .then(result => {
                localStorage.setItem("token", result.token);
                localStorage.setItem("refreshToken", result.refreshToken);
                localStorage.setItem("email", data.email);

                window.location.href = "../index.html";
            })
            .catch(error => {
                console.error(error);
            });

    } catch (error) {
        //alert("No conecta: " + error.message);
        document.getElementById("tokenOutput").textContent = "No conecta a la API";
    }
});

function getToken() {
    return localStorage.getItem("token");
}

async function Migrar() {
    const apiBase = `${linkApi}/auth`;
    const response = await fetch(`${apiBase}`);
    const result = await response.json();
    console.log(result);
}

