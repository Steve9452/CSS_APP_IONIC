<template>
    
    <div id="main-content">
        <div v-if="loading"  class="flex-center my-4">
                <ion-spinner  name="crescent" color="primary"></ion-spinner>
            </div>
        <ion-grid>
            <!-- <ion-refresher slot="fixed" :pull-factor="0.5" :pull-min="100" :pull-max="200" @ionRefresh="handleRefresh($event)">
              <ion-refresher-content></ion-refresher-content>
            </ion-refresher> -->
            
            <ion-row>
                <!--ion-col size="auto">
                    <ion-searchbar class="custom" placeholder="Nombre" show-clear-button="focus"></ion-searchbar>
                </ion-col> 
                -->
                <ion-col size="6">
                    <ion-chip class="large-chip" size="large" :outline="true">
                        <ion-icon :icon="searchOutline" color="secundary"></ion-icon>
                        <ion-input @ionInput="inputHandler" placeholder="Buscar"></ion-input>
                    </ion-chip>
                </ion-col>
                <ion-col size="3">
                    <ion-chip @click="presentActionSheetFilter(presentActionSheetFilterFacultad, faculties, presentActionSheetFilterCarreras, careers, handleFilter, handleFilterId)">
                        <ion-icon :icon="filterOutline" color="secundary"></ion-icon>
                        <ion-label>Filtro</ion-label>
                    </ion-chip>
                </ion-col>

                <ion-col size="3">
                    <ion-chip @click="presentActionSheetOrder(handleOrder)">
                        <ion-icon :icon="swapVerticalOutline" color="secundary"></ion-icon>
                        <ion-label>Orden</ion-label>
                    </ion-chip>
                </ion-col>


            </ion-row>

        </ion-grid>
        
        <ion-refresher slot="fixed" :pull-factor="0.5" :pull-min="100" :pull-max="200" @ionRefresh="handleRefresh($event)">
            <ion-refresher-content></ion-refresher-content>
          </ion-refresher>
        <div class="mt-3" v-if="projects.length > 0">
            <!-- <show-project v-for="project in projects" :key="project.idProyecto" :project-data="project"
                :show-unapply="false" v-on:dataUpdated="getAllProjects()">
            </show-project> -->

            <!--TODO: ANIMATION FOR LOADING-->
            
            <ion-list class="mt-3">
                <show-project v-for="project in projects" :key="project.idProyecto" :project-data="project"
                    :apply-permission="false" :active-project="false" :show-unapply="false"
                    :historyProject="false" v-on:dataUpdated="resetData()">    
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

        <div class="container" v-if="!loading && projects.length == 0">
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
import { filterOutline, swapVerticalOutline, searchOutline } from 'ionicons/icons';

import {
    IonChip, actionSheetController, IonList,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonRefresher,
    IonInput,
    IonSpinner,
    IonRefresherContent
} from '@ionic/vue';

export default {
    components: {
        ShowProject, IonChip, IonList,
        // IonItem, 
        IonInfiniteScroll,
        IonInfiniteScrollContent,
        IonRefresher,
        IonInput,
        IonSpinner,
        IonRefresherContent
    },
    data: function () {
        return {
            apiToken: '',
            searchOutline,
            loading: true,
            filterOutline,
            swapVerticalOutline,
            projects: [],
            careers: [],
            faculties: [],
            nombreABuscar: "",
            filtrarPor: "carrera",
            filtroId: "-1",
            orderBy: "recientes",
            page: 1,
            carrersAndFaculties: {},
            applyPermission: null,
            activeProject: null,
            actionSheetButtons: null
        };
    },
    async created() {
        this.apiToken = await this.getApiToken();
        
        this.carrersAndFaculties = await this.getCarrersAndFaculties();
        
        this.careers = this.carrersAndFaculties.data.carreras
        
        this.faculties = this.carrersAndFaculties.data.facultades

        this.loadData();
    },
    methods: {

        async getCarrersAndFaculties() {
            const API_ENDOINT = this.getAPIEndpoint();
            const request = await fetch(API_ENDOINT + `/getCarrerasYFacultades`, {

                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                    'Authorization': 'Bearer ' + this.apiToken
                }
            });
            const data = await request.json();
            if (request.status !== 200) {
                this.showErrorToast('Ups! Algo salió mal.');
            }
            return data;
        },

        async fetchData(resetPage = false) {
            this.page = resetPage ? 1 : this.page;
            this.loading = true;
            const API_ENDOINT = this.getAPIEndpoint();
            const request = await fetch(API_ENDOINT + `/admin/getAllProjects?page=${this.page}&nombre=${this.nombreABuscar}&orden=${this.orderBy}&filtro=${this.filtrarPor}&id=${this.filtroId}`, {

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

            this.loading = false
            return data;
        },
        async getAllProjects(ev = null) {
            // // console.log(ev)

            try {
                // const request = await fetch(API_ENDOINT + '/getProyectosDisponibles', {
                const data = await this.fetchData();
                if (this.page === data.pagination.lastPage) {
                    // console.log("No hay más proyectos")
                    return;
                }
                this.projects = this.projects.concat(data.proyectos.data);

                // // console.log(">>>>>>>>>>data: ")
                // // console.log(data);

                if (ev) {
                    ev.target.complete();
                }
            }
            catch (error) {
                // console.log("Error: " + error);
            }
        },
        async loadData(resetPage) {
            // const API_ENDOINT = this.getAPIEndpoint();
            try {
                const data = await this.fetchData(resetPage);
                // // console.log(">>>>>>>>>>data:")
                // // console.log(data);
                this.projects = data.proyectos.data;
                // if (request.status === 200) {
                //     this.page++;
                // } else {
                //     this.showErrorToast('Ups! Algo salió mal.');
                // }
               
            }
            catch (error) {
                // console.log("Error: " + error);
            }
        },
        async handleRefresh(event) {
            this.loadData(true).finally(() => {
                event.target.complete();
            }
            );
            // event.target.complete();
        },
        resetData() {
            this.page = 1
            this.loadData()
        },
        inputHandler(ev) {
            this.nombreABuscar = ev.target.value;
            this.resetData()
        },
        handleOrder(order) {
            this.orderBy = order;
            this.resetData()
        },
        handleFilter(filter) {
            this.filtrarPor = filter;
        },
        handleFilterId(id) {
            this.filtroId = id;
            this.resetData()
        },
        presentActionSheetFilter: async (actionFaculty, faculties, actionCareer, careers, handleFilter, handleFilterId) => {
            const actionSheet = await actionSheetController.create({
                htmlAttributes: {class: "custom-alert"},
                header: 'Filtrar por: ',
                buttons: [
                    {
                        text: 'Facultad',
                        role: 'destructive',
                        handler: () => {
                            handleFilter("facultad")
                            actionFaculty(faculties, handleFilterId)
                        }
                    },
                    {
                        text: 'Carrera',
                        role: 'destructive',
                        handler: () => {
                            handleFilter("carrera")
                            actionCareer(careers, handleFilterId)

                        }
                    },{
                        text: "Sin filtros",
                        role: 'destructive',
                        handler: () => {
                            handleFilter("carrera")
                            handleFilterId(-1)
                        },
                    } 
                ],
            });

            await actionSheet.present();
        },

        presentActionSheetOrder: async (handleOrder) => {
            const actionSheet = await actionSheetController.create({
                header: "Ordenar por",
                buttons: [
                    {
                        text: 'Recientes',
                        role: 'destructive',
                        handler: () => {
                            handleOrder('recientes')
                        }
                    },
                    {
                        text: 'Antiguos',
                        role: 'destructive',
                        handler: () => {
                            handleOrder('antiguos')
                        }
                    },
                    {
                        text: 'Mas cupos libres',
                        role: 'destructive',
                        handler: () => {
                            handleOrder('mas_cupos')
                        }
                    },
                    {
                        text: 'Menos cupos libres',
                        role: 'destructive',
                        handler: () => {
                            handleOrder('menos_cupos')
                        }
                    },
                    {
                        text: 'Número Solicitudes',
                        role: 'destructive',
                        handler: () => {
                            handleOrder('n_solicitudes')
                        }
                    },

                ],
            });

            await actionSheet.present();
        },

        presentActionSheetFilterCarreras: async (careers, handleFilterId) => {

            const actionSheet = await actionSheetController.create({
                header: 'Carrera: ',
                buttons: careers.map(c => {
                    return {
                        text: c.nombre,
                        role: 'destructive',
                        handler: () => {
                            handleFilterId(c.idCarrera)
                        },
                    }
                })
            });

            await actionSheet.present();

        },

        presentActionSheetFilterFacultad: async (faculties, handleFilterId) => {
            const actionSheet = await actionSheetController.create({
                header: 'Carrera: ',
                buttons: faculties.map(f => {
                    return {
                        text: f.nombre,
                        role: 'destructive',
                        handler: () => {
                            handleFilterId(f.idFacultad)
                        },
                    }
                }) 
            });

            await actionSheet.present();

        }

    }
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