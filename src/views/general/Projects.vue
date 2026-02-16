<template>
  <ion-page>
    <ion-content>

      <ion-toolbar>
        <ion-segment :value="view">

          <!-- ADMIN -->
          <ion-segment-button value="all" @click="view = 'all'" v-if="userRol === 1">
            <ion-label><small>Todos</small></ion-label>
          </ion-segment-button>

          <ion-segment-button value="history" @click="view = 'history'" v-if="userRol === 1">
            <ion-label><small>Historial</small></ion-label>
          </ion-segment-button>

          <ion-segment-button value="add" @click="openNuevoOptions" v-if="userRol === 1">
            <ion-label><small>Nuevo</small></ion-label>
          </ion-segment-button>

          <!-- STUDENT -->
          <ion-segment-button value="available" @click="view = 'available'" v-if="userRol === 2">
            <ion-label><small>Disponibles</small></ion-label>
          </ion-segment-button>

          <ion-segment-button value="applied" @click="view = 'applied'" v-if="userRol === 2">
            <ion-label><small>Aplicados</small></ion-label>
          </ion-segment-button>

        </ion-segment>
      </ion-toolbar>

      <!-- ADMIN -->
      <list-all-projects
        v-if="view === 'all'"
        ref="listAll"
      />
      <list-projects-history v-if="view === 'history'" />
      <create-project v-if="view === 'add'" />
      <import-excel v-if="view === 'import'"
        @import-complete="handleImportComplete"
      />


      <!-- STUDENT -->
      <list-available-projects
        v-if="view === 'available'"
        @getPermissions="getApplyPermission"
        :applyPermission="applyPermission && !timeout"
        :timeout="timeout"
        :activeProject="activeProject"
        :error="error"
        :loading="loading"
      />

      <list-applied-projects
        v-if="view === 'applied'"
        @getPermissions="getApplyPermission"
        :applyPermission="applyPermission"
      />

    </ion-content>
  </ion-page>
</template>

<script>
import { actionSheetController } from '@ionic/vue'
import { addOutline, documentOutline, closeOutline } from 'ionicons/icons'

import ListAllProjects from '../../components/projects/ListAllProjects.vue'
import ListProjectsHistory from '../../components/projects/ListProjectsHistory.vue'
import CreateProject from '../../components/projects/CreateProject.vue'
import ImportExcel from '../../components/projects/ImportExcel.vue'
import ListAvailableProjects from '../../components/projects/ListAvailableProjects.vue'
import ListAppliedProjects from '../../components/projects/ListAppliedProjects.vue'

export default {
  components: {
    ListAllProjects,
    ListProjectsHistory,
    CreateProject,
    ImportExcel,
    ListAvailableProjects,
    ListAppliedProjects,
  },

  data() {
    return {
      applyPermission: null,
      timeout: null,
      activeProject: null,
      apiToken: '',
      userRol: '',
      view: '',
      error: false,
      loading: true,
    }
  },

  async created() {
    this.userRol = await this.getUserRolId()
    this.apiToken = await this.getApiToken()
    this.getApplyPermission()

    if (this.userRol === 1) {
      this.view = 'all'
    } else {
      this.view = 'available'
    }
  },

  methods: {

    // ActionSheet mejorado
async openNuevoOptions() {
  const actionSheet = await actionSheetController.create({
    header: 'Crear nuevo proyecto',
    buttons: [
      {
        text: 'Agregar un Proyecto ',
        icon: addOutline,
        handler: () => {
          this.view = 'add'
        }
      },
      {
        text: 'Importar Excel',
        icon: documentOutline,
        handler: () => {
          this.view = 'import'
        }
      },
      {
        text: 'Cancelar',
        role: 'cancel',
        icon: closeOutline
      }
    ]
  })

  await actionSheet.present()
},

    async getApplyPermission() {
      const API_ENDPOINT = this.getAPIEndpoint()

      this.loading = true

      fetch(API_ENDPOINT + '/getPermisoAplicar', {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          'Authorization': 'Bearer ' + this.apiToken
        }
      })
      .then(response => {
        if (!response.ok) {
          this.error = true
          throw new Error('La solicitud no pudo ser completada')
        }
        return response.json()
      })
      .then(data => {
        this.applyPermission = data.permiso === 1
        this.activeProject = data.proyectoActivo !== 0

        try {
          this.timeout = new Date(data.timeout).getTime() > Date.now()
        } catch {
          this.timeout = false
        }
      })
      .catch(() => {
        this.error = true
      })
      .finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>
ion-icon {
  font-size: 19px;
}
</style>
