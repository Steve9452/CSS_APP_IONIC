<template>
<div>
    <div >
        <p v-if="!applyPermission" class="alert alert-warning" role="alert">
            No es posible aplicar a un nuevo proyecto.
        </p>
        <p v-if="!applyPermission" class="alert alert-warning" role="alert">
            Ha excedido la cantidad de solicitudes diarias. Inténtelo nuevamente mañana. 
        </p>

    </div>

    <div v-if="activeProject" class="alert alert-warning" role="alert">
        Ya se encuentra inscrito en un proyecto activo. Le invitamos a revisar el estado de la solicitud en proyectos aplicados.
    </div>

    <div v-if="projects.length > 0">
        <show-project 
            v-for="project in projects"
            :key="project.idProyecto"
            :project-data="project"
            :apply-permission="applyPermission"
            :active-project="activeProject"
            :show-unapply="false"
            v-on:dataUpdated="getAvailableProjects()">
        </show-project>
    </div>

    <div class="container" v-else>
        <div class="row justify-content-center align-items-center">
            <div class="col">
                <img src="/assets/img/success.svg" class="img-fluid d-block mx-auto mt-5" style="width:50%;">
                <h1 class="text-primary text-center font-weight-bolder">
                    Hmmm
                </h1>
                <p class="text-muted text-center">
                    Parece ser que no se encontraron registros.
                </p>
            </div>
        </div>
    </div>
</div>
</template>

<script>
    import ShowProject from './ShowProject.vue'

	export default {
		components: {
			ShowProject
		},
        props: ['applyPermission', 'activeProject'	],
        data: function () {
            return {
                apiToken: '',
                projects: []
            };
        },
        async created() {
            this.apiToken = await this.getApiToken();
            this.getAvailableProjects();
        },
        methods: {
            async getAvailableProjects() {
                const API_ENDOINT = this.getAPIEndpoint();
                const request = await fetch(API_ENDOINT + '/getProyectosDisponibles', {
                    headers: {
                        "Content-type": "application/json; charset=UTF-8",
                        'Authorization': 'Bearer ' + this.apiToken
                    }
                });
                const data = await request.json();

                if(request.status === 200) {
                    this.projects = data;
                } else {
                    this.showErrorToast('Ups! Algo salió mal.');
                }
            },
        },
	}
</script>