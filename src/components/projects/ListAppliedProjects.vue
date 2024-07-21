<template>
    <div>
        <div class="mt-3" v-if="projects.length > 0">
            <show-project v-for="project in projects" :key="project.idProyecto" :project-data="project"
                :apply-permission="applyPermission" :show-unapply="true" v-on:dataUpdated="getMyProjects()">
            </show-project>
        </div>

        <div class="container" v-else-if="loaded">
            <div class="row justify-content-center align-items-center">
                <div class="col">
                    <img src="/assets/img/success.svg" class="img-fluid d-block mx-auto mt-5" style="width:50%;">

                    <p class="text-muted text-center">
                        Parece ser que no se encontraron projectos.
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
    data: function () {
        return {
            apiToken: '',
            projects: [],
            loaded: false
        };
    },
    props: ['applyPermission', 'timeout'],
    async created() {
        this.apiToken = await this.getApiToken();
        this.getMyProjects();
    },
    methods: {
        async getMyProjects() {
            this.loaded = false
            const API_ENDOINT = this.getAPIEndpoint();
            const request = await fetch(API_ENDOINT + '/getMisProyectos', {
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                    'Authorization': 'Bearer ' + this.apiToken
                }
            });

            const data = await request.json();
            if (request.status === 200) {
                this.$emit("getPermissions")
                this.projects = data;
            } else {
                this.showErrorToast('Ups! Algo salió mal.');
            }
            this.loaded = true
        }
    },
    
}
</script>