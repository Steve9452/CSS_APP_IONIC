<template>
    <div>
        <div>
            <p v-if="!applyPermission" class="alert alert-warning" role="alert">
                No es posible aplicar a un nuevo proyecto.
            </p>
            <p v-if="!applyPermission" class="alert alert-warning" role="alert">
                Ha excedido la cantidad de solicitudes diarias. Inténtelo nuevamente mañana.
            </p>

        </div>

        <div v-if="activeProject" class="alert alert-warning" role="alert">
            Ya se encuentra inscrito en un proyecto activo. Le invitamos a revisar el estado de la solicitud en proyectos
            aplicados.
        </div>

            <ion-grid>
                <ion-col size="6">
                    <ion-chip class="large-chip" size="large" :outline="true">
                        <ion-icon :icon="searchOutline" color="secundary"></ion-icon>
                        <ion-input placeholder="Buscar"></ion-input>
                    </ion-chip>
                </ion-col>
                <ion-col size="3">
                    <ion-chip @click="presentActionSheetFilter">
                        <ion-icon :icon="filterOutline" color="secundary"></ion-icon>
                        <ion-label>Filtro</ion-label>
                    </ion-chip>
                </ion-col>
            </ion-grid>

        <div v-if="projects.length > 0">
            <show-project v-for="project in projects" :key="project.idProyecto" :project-data="project"
                :apply-permission="applyPermission" :active-project="activeProject" :show-unapply="false"
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

import { filterOutline, swapVerticalOutline, searchOutline } from 'ionicons/icons';

import { IonChip, actionSheetController } from '@ionic/vue';
export default {
    components: {
        ShowProject,
        IonChip,
    },
    props: ['applyPermission', 'activeProject'],
    data: function () {
        return {
            apiToken: '',
            searchOutline,
            filterOutline,
            swapVerticalOutline,
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

            if (request.status === 200) {
                this.projects = data;
            } else {
                this.showErrorToast('Ups! Algo salió mal.');
            }
        },
    },
    setup() {
        const presentActionSheetFilter = async () => {
            const actionSheet = await actionSheetController.create({
                header: 'Filtrar por: ',
                buttons: [
                    {
                        text: 'Horas externas',
                        role: 'destructive',
                        data: {
                            action: 'delete',
                        },
                    },
                    {
                        text: 'Horas internas',
                        data: {
                            action: 'share',
                        },
                    },
                ],
            });

            await actionSheet.present();
        }

        return { presentActionSheetFilter };

    }

}
</script>


<ion-col size="6">
    <ion-chip class="large-chip" size="large" :outline="true">
        <ion-icon :icon="searchOutline" color="secundary"></ion-icon>
        <ion-input placeholder="Buscar"></ion-input>
    </ion-chip>
</ion-col>
<ion-col size="3">
    <ion-chip @click="presentActionSheetFilter">
        <ion-icon :icon="filterOutline" color="secundary"></ion-icon>
        <ion-label>Filtro</ion-label>
    </ion-chip>
</ion-col>