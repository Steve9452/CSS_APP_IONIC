<template>
<ion-page>
	<ion-content fullscreen>
		<img v-if="user.gender === 'M'" src="/assets/img/male-avatar.jpg" class="img-fluid d-block w-50 my-3 mx-auto">
		<img v-else src="/assets/img/female-avatar.jpg" class="img-fluid d-block w-50 my-3 mx-auto">

		<ion-card color="primary" class="mt-3">
			<ion-card-content>
				<ion-card-title color="primary" class="text-center font-weight-bolder">
					{{ user.fname }} {{ user.lname }}
				</ion-card-title>

				<div class="d-block text-center mt-2 font-weight-light">
					<ion-badge v-if="user.rol === 1" class="text-center mx-1" color="dark"><small>ADMIN</small></ion-badge>
					<ion-badge v-if="user.rol === 2" class="text-center mx-1" color="dark"><small>ESTUDIANTE</small></ion-badge>

					<ion-badge class="text-center mx-1" color="dark"><small>VERIFICADO</small></ion-badge>
					
				</div>
			</ion-card-content>
		</ion-card>

		<ion-card class="mt-3">
			<ion-card-content class="card-content">
				<ion-item  class="card-item" lines="full">
					<ion-label class="text-center">
						<p class="text-muted text-uppercase">
							{{ user.email }}
						</p>
						<small class="d-block text-muted font-weight-light text-uppercase">
							<i class="fas fa-envelope-open-text"></i>&nbsp;Correo
						</small>
					</ion-label>
				</ion-item>

				<ion-item v-if="user.rol === 2" lines="full">
					<ion-label class="text-center">
						<p class="text-muted text-uppercase">
							{{ user.faculty }}
						</p>
						<small class="d-block text-muted font-weight-light text-uppercase">
							<i class="fas fa-university"></i>&nbsp;Facultad
						</small>
					</ion-label>
				</ion-item>


				<ion-item v-if="user.rol === 2 && !showModal" lines="full">
					<ion-label class="text-center">
						<p class="text-muted text-uppercase">
							{{ user.collegeCareer }}
						</p>
						<small class="d-block text-muted font-weight-light text-uppercase">
							<i class="fas fa-graduation-cap"></i>&nbsp;Carrera
						</small>
					</ion-label>
				</ion-item>

				<ion-item v-if="user.rol === 2 && showModal" class="item-select" lines="full">
					<ion-select class="w-100"  v-model="newCareer" full on interface="action-sheet">
						<ion-select-option v-for="career in careers" :key="career.idCarrera" :value="career.idCarrera">{{ career.nombre }}</ion-select-option>
					</ion-select>
				</ion-item>



				<ion-item v-if="user.rol === 2 && !showModal" lines="full">
					<ion-label class="text-center">
						<p class="text-muted text-uppercase">
							{{ user.profile }}
						</p>
						<small class="d-block text-muted font-weight-light text-uppercase">
							<i class="far fa-id-badge"></i>&nbsp;Perfil
						</small>
					</ion-label>
				</ion-item>

				<ion-item v-if="user.rol === 2 && showModal" class="item-select " expand="block" full lines="full">
					<ion-select expand="block" class="w-100" placeholder="Seleccionar " v-model="newProfile" full on>
						<ion-select-option value="1">Primer año</ion-select-option>
						<ion-select-option value="2">Segundo año</ion-select-option>
						<ion-select-option value="3">Tercer año</ion-select-option>
						<ion-select-option value="4">Cuarto año</ion-select-option>
						<ion-select-option value="5">Quinto año</ion-select-option>
						<ion-select-option value="6">Egresado</ion-select-option>

					</ion-select>
				</ion-item>						
						


				<ion-button class="mt-2" v-if="user.rol === 2 && !showModal" expand="block" full color="success" @click="setShowModal(true)" fill="outline">
					<ion-icon name="create-outline"></ion-icon>EDITAR PERFIL
				</ion-button>
				<ion-button v-if="showModal" class="mt-2" expand="block" full color="success" @click="update()" :disabled="loading">
					<ion-icon name="create-outline"></ion-icon>GUARDAR CAMBIOS
				</ion-button>

				<ion-button class="mt-4" expand="block" color="primary" @click="signout()">
					<ion-icon name="bag-add-outline"></ion-icon>CERRAR SESIÓN
				</ion-button>

			</ion-card-content>
		</ion-card>

		
	</ion-content>
</ion-page>

</template>

<script>
	import { IonContent } from '@ionic/vue';
	export default {
		components: {
			IonContent
		},
		data: function () {
			return {
				data:{},
				user: {
					fname: '',
					lname: '',
					gender: 'F',
					rol : '',
					email: '',
					faculty: '',
					collegeCareer: '',
					profile: '',
					profileId: 1,
					idUsuario: ''
				},
				showModal: false,
				newProfile: '',
				newCareer: 0,
				apiToken: '',
				loading: false,
				careers: []
			}
		},
		async created() {
			this.setUser();
			this.apiToken = this.getApiToken();
			this.getCarrers();
			
		},
		methods: {
			getCarrers(){
				const API_ENDPOINT = this.getAPIEndpoint();
				fetch(`${API_ENDPOINT}/getCarreras`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json'
			}}).then(response => response.json())
			.then(data => {
				this.careers = data;
			})
			.catch((error) => {
				console.error('Error:', error);
			});
			},
			async setUser() {
				this.data = await this.getAuthenticatedUser(); 
				console.log("data from local storage")
				console.log(this.data)
				if(this.data.user) {
					this.user.fname = this.data.user.nombres;
					this.user.lname = this.data.user.apellidos;
					this.user.gender = this.data.user.genero;
					this.user.rol = this.data.user.rol.idRol;
					this.user.email = this.data.user.correo;
					this.user.profile = this.data.user.perfil ? this.data.user.perfil.descripcion : '';
					this.user.faculty = this.data.user.carrera.facultad ? this.data.user.carrera.facultad.nombre : '';
					this.user.collegeCareer = this.data.user.carrera ? this.data.user.carrera.nombre : '';
					// this.user.profileId = data.user.idPerfil ? data.user.idPerfil : '';
					this.newProfile = this.data.user.idPerfil ? this.data.user.idPerfil.toString() : '';
					this.user.idUsuario = this.data.user.idUser;
					this.newCareer = this.data.user.idCarrera ? this.data.user.idCarrera : 0;
				}
			},
			setShowModal(value) {
				this.showModal = value;
			},
			async update(){
				
				// Prevent user from updating the same career and profile
				if(this.newCareer !== this.data.user.idCarrera) {
					await this.updateCareer();
				}

				if(this.newProfile !== this.data.user.idPerfil.toString()) {
					await this.updateProfile();
				}
				
				// fetch user from local storage
				this.setUser();
				this.setShowModal(false);
			},
			async updateProfile(){

				this.loading = true;
				const API_ENDPOINT = this.getAPIEndpoint();
				const request = await fetch(`${API_ENDPOINT}/estudiante/actualizar/perfil`, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${this.apiToken}`
					},
					body: JSON.stringify({
						idPerfil: this.newProfile,
						idUsuario: this.user.idUsuario
					},
					)
				});
				const response = await request.json();
				if(response) {
					this.showModal = false;
					this.data.user.idPerfil = parseInt(response.idPerfil) ? parseInt(response.idPerfil) : 1;
					this.data.user.perfil = response.perfil;
					// console.log("data local storage")
					// console.log(this.data)
					console.log("profile response")
					console.log(response)

					// update user data
					// this.setUser();

					// fetch user from local storage
					localStorage.setItem('user', JSON.stringify(this.data));


					this.showSuccessToast('Perfil actualizado correctamente');
					this.loading = false;
				}
				
			},
			async updateCareer(){
				// if(this.newCareer === this.data.user.idCarrera) {
				// 	this.setShowModal(false);
				// 	return;
				// }
				this.loading = true;
				const API_ENDPOINT = this.getAPIEndpoint();
				const request = await fetch(`${API_ENDPOINT}/estudiante/actualizar/carrera`, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${this.apiToken}`
					},
					body: JSON.stringify({
						idCarrera: this.newCareer,
						idUsuario: this.user.idUsuario
					},
					)
				});
				const response = await request.json();
				if(response) {
					this.showModal = false;
					this.data.user.idCarrera = parseInt(response.idCarrera) ? parseInt(response.idCarrera) : 1;
					this.data.user.carrera = response.carrera;
					// console.log("data local storage")
					// console.log(this.data)\
					console.log("career response")
					console.log(response)
					localStorage.setItem('user', JSON.stringify(this.data));
					

					this.showSuccessToast('Carrera actualizada correctamente');
					this.loading = false;
				}
				// this.setShowModal(false);

			}
		}
	}
</script>
<style>
.item-select {
	width: 100%;
	height: 62px;
}

.card-content {
	padding: 0;

}
.card-item {
	padding: 0;
	width: 100%;
}
</style>