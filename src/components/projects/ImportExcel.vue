<template>
  <ion-page>
    <ion-content class="ion-padding">

      <div class="import-container">
        <ion-card class="import-card">

          <ion-card-header>
            <ion-card-title class="title">
              Importar Proyectos
            </ion-card-title>
          </ion-card-header>

          <ion-card-content>

            <ion-button expand="block" color="primary" @click="triggerFileInput">
              Seleccionar archivo Excel
            </ion-button>

            <input
              type="file"
              ref="fileInput"
              hidden
              accept=".xlsx,.xls"
              @change="handleFileUpload"
            />

            <ion-text v-if="fileName">
              <p class="file-name">{{ fileName }}</p>
            </ion-text>

            <div v-if="fileName" class="buttons-container">

              <ion-button color="success" @click="processFile">
                Subir
              </ion-button>

              <ion-button fill="outline" color="medium" @click="cancelUpload">
                Cancelar
              </ion-button>

            </div>

          </ion-card-content>
        </ion-card>
      </div>

    </ion-content>
  </ion-page>
</template>

<script>
import axios from 'axios'
import { alertController } from '@ionic/vue'

export default {
  name: 'ImportExcel',

  data() {
    return {
      file: null,
      fileName: ''
    }
  },

  methods: {

    triggerFileInput() {
      this.$refs.fileInput.click()
    },

    handleFileUpload(event) {
      const file = event.target.files[0]
      if (!file) return

      this.file = file
      this.fileName = file.name
    },

    async processFile() {

      if (!this.file) {
        await this.presentAlert("Seleccione un archivo primero")
        return
      }

      const formData = new FormData()
      formData.append('archivo', this.file)

      try {

        const API_ENDPOINT = this.$parent.getAPIEndpoint()
        const token = await this.$parent.getApiToken()

        const response = await axios.post(
          `${API_ENDPOINT}/admin/importar-excel`,
          formData,
          {
            headers: {
              'Authorization': 'Bearer ' + token,
              'Content-Type': 'multipart/form-data'
            }
          }
        )

        if (response.data.success && response.data.type === 'import_ok') {

          await this.presentAlert(
            response.data.message || "Los proyectos se importaron correctamente",
            "Importación Exitosa"
          )

          this.$emit('import-complete')
        }

        this.cancelUpload()

      } catch (error) {

        if (error.response) {

          const errorData = error.response.data

          if (errorData.type === 'empty_excel') {
            await this.presentAlert(
              errorData.error || 
              "El archivo Excel está vacío o no contiene datos válidos.",
              "Excel Vacío"
            )
          }

          else if (errorData.type === 'invalid_template') {
            await this.presentAlert(
              `
              <div style="text-align:left;">
                <p>${errorData.message || "La plantilla no es válida."}</p>
                <p><strong>Por favor:</strong></p>
                <ul>
                  <li>Descargue la plantilla oficial</li>
                  <li>No modifique los nombres de las columnas</li>
                  <li>Mantenga el formato de los datos</li>
                </ul>
              </div>
              `,
              "Plantilla Incorrecta"
            )
          }

          else if (
            errorData.message &&
            errorData.message.includes('No se especificó ninguna carrera')
          ) {
            await this.presentAlert(
              `
              <div style="text-align:left;">
                <p>${errorData.message}</p>
                <p><strong>Debe:</strong></p>
                <ul>
                  <li>Especificar al menos una carrera en las columnas carrera_1 a carrera_5</li>
                  <li>O marcar "SI" en "aplicar_todas_carreras"</li>
                </ul>
              </div>
              `,
              "Error en Carreras"
            )
          }

          else {
            await this.presentAlert(
              errorData.message || 
              errorData.error || 
              "Ha ocurrido un error al importar el archivo.",
              "Error en Importación"
            )
          }

        } else {

          await this.presentAlert(
            "No se pudo conectar con el servidor. Verifique su conexión a internet.",
            "Error de Conexión"
          )

        }

        this.cancelUpload()
      }

    },

    cancelUpload() {
      this.file = null
      this.fileName = ''
      this.$refs.fileInput.value = ''
    },
async handleImportComplete() {

  this.view = 'all'

  this.$nextTick(() => {
    if (this.$refs.listAll && this.$refs.listAll.loadProjects) {
      this.$refs.listAll.loadProjects()
    }
  })
},

    async presentAlert(message, header = "Información") {
      const alert = await alertController.create({
        header,
        message,
        buttons: ['Entendido']
      })
      await alert.present()
    }
  }
}
</script>

<style scoped>
.import-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.import-card {
  width: 100%;
  max-width: 520px;
  border-radius: 16px;
}

.title {
  text-align: center;
  font-weight: 600;
}

.file-name {
  text-align: center;
  margin-top: 12px;
  font-weight: 500;
}

.buttons-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 12px;
}
</style>
