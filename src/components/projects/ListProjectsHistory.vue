<!-- eslint-disable @typescript-eslint/camelcase -->
<template>
<div>
    <div v-if="projects.length > 0">
        <ion-list>

            <show-project 
                v-for="project in projects"
                :key="project.idProyecto"
                :project-data="project"
                :show-unapply="false"
                :historyProject="true"
                v-on:dataUpdated="getProjectsHistory()">
            </show-project>
        </ion-list>
        <ion-infinite-scroll threshold="100px" @ionInfinite="getProjectsHistory($event)">
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
    import { IonInfiniteScroll,
        IonInfiniteScrollContent,
    } from '@ionic/vue';

	export default {
		components: {
			ShowProject,
            IonInfiniteScroll,
            IonInfiniteScrollContent,
		},
        data: function () {
            return {
                apiToken: '',
                projects: [],
                page: 1,
            };
        },
        async created() {
            this.apiToken = await this.getApiToken();
            this.getProjectsHistory();
        },
        methods: {
            async getProjectsHistory(ev = null) {
                
                try {
                    // const request = await fetch(API_ENDOINT + '/getProyectosDisponibles', {
                        // eslint-disable-next-line @typescript-eslint/camelcase
                    const {data, last_page} = await this.fetchData();
                    // eslint-disable-next-line @typescript-eslint/camelcase
                    if (this.page === last_page) {
                        console.log("No hay más proyectos")
                    }
                    this.projects = this.projects.concat(data);

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
            async fetchData() {
                const API_ENDOINT = this.getAPIEndpoint();
                const request = await fetch(API_ENDOINT + `/admin/getHistorialDeProyectos?page=${this.page}`, {
                    headers: {
                        "Content-type": "application/json; charset=UTF-8",
                        'Authorization': 'Bearer ' + this.apiToken
                    }
                });

                const data = await request.json();

                if(request.status === 200) {
                    this.page++;
                } else {
                    this.showErrorToast('Ups! Algo salió mal.');
                }
                console.log(data)
                return data;
            }
        },
	}
</script>