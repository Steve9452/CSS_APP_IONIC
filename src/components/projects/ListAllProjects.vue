<template>
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
            <!-- <show-project v-for="project in projects" :key="project.idProyecto" :project-data="project"
                :show-unapply="false" v-on:dataUpdated="getAllProjects()">
            </show-project> -->

            <ion-list>
                <show-project  v-for="project in projects" :key="project.idProyecto" :project-data="project"
                :apply-permission="applyPermission" :active-project="activeProject" :show-unapply="false"
                v-on:dataUpdated="getAvailableProjects()">
            </show-project>
            </ion-list>

            <!-- <show-project  v-for="project in projects" :key="project.idProyecto" :project-data="project"
                :apply-permission="applyPermission" :active-project="activeProject" :show-unapply="false"
                v-on:dataUpdated="getAvailableProjects()">
            </show-project> -->

            <ion-infinite-scroll threshold="100px" @ionInfinite="getAllProjects($event)">
                <ion-infinite-scroll-content loadingSpinner="bubbles" loadingText="Cargando más proyectos...">
                </ion-infinite-scroll-content>
            </ion-infinite-scroll>

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

import { IonActionSheet, IonChip, actionSheetController, IonList,
        IonInfiniteScroll,
        IonInfiniteScrollContent, } from '@ionic/vue';

export default {
    components: {
        ShowProject, IonActionSheet, IonChip,IonList,
        // IonItem,
        IonInfiniteScroll,
        IonInfiniteScrollContent,
    },
    data: function () {
        return {
            apiToken: '',
            searchOutline,
            filterOutline,
            swapVerticalOutline,
            projects: [],
            page: 1,
        };
    },
    async created() {
        this.apiToken = await this.getApiToken();
        this.loadData();
    },
    methods: {

        async fetchData(){
            const API_ENDOINT = this.getAPIEndpoint();
            const request = await fetch(API_ENDOINT + `/getAllProjects?page=${this.page}`, {

            headers: {
                "Content-type": "application/json; charset=UTF-8",
                'Authorization': 'Bearer ' + this.apiToken
            }
            });
            const data = await request.json();
            if (request.status === 200) {
                this.page++;
            } else {
                this.showErrorToast('Ups! Algo salió mal.');
            }
            return data;
        },
        async getAllProjects(ev = null) {
            // console.log(ev)
            
            try{
                // const request = await fetch(API_ENDOINT + '/getProyectosDisponibles', {
                const data = await this.fetchData();
                if(this.page === data.pagination.lastPage){
                    console.log("No hay más proyectos")
                    return;
                }
                data.proyectos.data.forEach(project => {
                    this.projects.push(project);
                });
            // console.log(">>>>>>>>>>data: ")
            // console.log(data);
            
            if (ev) {
                ev.target.complete();
            }
            }
            catch (error) {
                console.log("Error: " + error);
            }
        },
        async loadData() {
        // const API_ENDOINT = this.getAPIEndpoint();
        try{
            const data = await this.fetchData();
            // console.log(">>>>>>>>>>data:")
            // console.log(data);
            this.projects =data.proyectos.data;
            // if (request.status === 200) {
            //     this.page++;
            // } else {
            //     this.showErrorToast('Ups! Algo salió mal.');
            // }

            }
            catch (error) {
                console.log("Error: " + error);
            }
    },

    },
    setup() {
        const presentActionSheetFilter = async () => {
            const actionSheet = await actionSheetController.create({
                htmlAttributes: {class: "custom-alert"},
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