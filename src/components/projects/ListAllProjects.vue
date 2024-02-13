<template>
    <ion-menu side="end" content-id="main-content">
        <ion-text>
        </ion-text>
        <ion-content class="ion-padding">
            <ion-item>
                <h2> Filtros: </h2>
            </ion-item>
            <ion-list>
                <div style="width: 100%;">
                    <label>
                        Filtar por:
                    </label>
                </div>
                <ion-item>

                    <ion-select interface="action-sheet" label="Default label" placeholder="Favorite Fruit">
                        <ion-select-option value="apple">Apple</ion-select-option>
                        <ion-select-option value="banana">Banana</ion-select-option>
                        <ion-select-option value="orange">Orange</ion-select-option>
                    </ion-select>
                </ion-item>
            </ion-list>
        </ion-content>
    </ion-menu>
    <div id="main-content">
        <ion-grid>

            <ion-row>
                <!--ion-col size="auto">
                    <ion-searchbar class="custom" placeholder="Nombre" show-clear-button="focus"></ion-searchbar>
                </ion-col> 
                -->



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

                <ion-col size="3">
                    <ion-chip @click="presentActionSheetOrder">
                        <ion-icon :icon="swapVerticalOutline" color="secundary"></ion-icon>
                        <ion-label>Orden</ion-label>
                    </ion-chip>
                    <ion-action-sheet trigger="open-action-sheet" header="Actions"
                        :buttons="actionSheetButtons"></ion-action-sheet>
                </ion-col>


            </ion-row>

        </ion-grid>
        <div v-if="projects.length > 0">
            <show-project v-for="project in projects" :key="project.idProyecto" :project-data="project"
                :show-unapply="false" v-on:dataUpdated="getAllProjects()">
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

import { IonActionSheet, IonChip, actionSheetController } from '@ionic/vue';

export default {
    components: {
        ShowProject, IonActionSheet, IonChip
    },
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
        this.getAllProjects();
    },
    methods: {
        async getAllProjects() {
            const API_ENDOINT = this.getAPIEndpoint();
            const request = await fetch(API_ENDOINT + '/admin/getTodosLosProyectos', {
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
                        text: 'Facultad',
                        role: 'destructive',
                        data: {
                            action: 'delete',
                        },
                    },
                    {
                        text: 'Carrera',
                        data: {
                            action: 'share',
                        },
                    },
                ],
            });

            await actionSheet.present();
        };

        const presentActionSheetOrder = async () => {
            const actionSheet = await actionSheetController.create({
                buttons: [
                    /*header: 'Ordenar por:',
                        {
                        text: 'Horas Internas',
                        role: 'destructive',
                        data: {
                            action: 'delete',
                        },
                        },
                        {
                        text: 'Horas Externas',
                        role: 'destructive',
                        data: {
                            action: 'delete',
                        },
                        },
                        */
                    {
                        text: 'Recientes',
                        data: {
                            action: 'share',
                        },
                    },
                    {
                        text: 'Mas cupos libres',
                        data: {
                            action: 'share',
                        },
                    },
                    {
                        text: 'Menos cupos libres',
                        data: {
                            action: 'share',
                        },
                    },
                    {
                        text: 'Número Solicitudes',
                        data: {
                            action: 'share',
                        },
                    },

                ],
            });

            await actionSheet.present();
        };

        return { presentActionSheetFilter, presentActionSheetOrder };
    },
}
</script>

<style scoped>
ion-searchbar.custom {
    padding-top: 16px;
    padding-bottom: 0px;
    padding-left: 0px;
    padding-right: 0px;
    margin: 0px;
    width: 100%;
    max-height: 3em;
    font-size: 0.5em;
    --border-radius: 4px;
}

.large-chip {
    min-width: 100%;
}

ion-col {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}

ion-icon {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 1em;
}
</style>