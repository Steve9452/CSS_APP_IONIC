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
			<ion-card-content>

				<ion-item>
					<ion-label class="text-center">
						<p class="text-muted text-uppercase">
							{{ user.email }}
						</p>
						<small class="d-block text-muted font-weight-light text-uppercase">
							<i class="fas fa-envelope-open-text"></i>&nbsp;Correo
						</small>
					</ion-label>
				</ion-item>

				<ion-item v-if="user.rol === 2">
					<ion-label class="text-center">
						<p class="text-muted text-uppercase">
							{{ user.faculty }}
						</p>
						<small class="d-block text-muted font-weight-light text-uppercase">
							<i class="fas fa-university"></i>&nbsp;Facultad
						</small>
					</ion-label>
				</ion-item>


				<ion-item v-if="user.rol === 2">
					<ion-label class="text-center">
						<p class="text-muted text-uppercase">
							{{ user.collegeCareer }}
						</p>
						<small class="d-block text-muted font-weight-light text-uppercase">
							<i class="fas fa-graduation-cap"></i>&nbsp;Carrera
						</small>
					</ion-label>
				</ion-item>


				<ion-item v-if="user.rol === 2 && !showModal">
					<ion-label class="text-center">
						<p class="text-muted text-uppercase">
							{{ user.profile }}
						</p>
						<small class="d-block text-muted font-weight-light text-uppercase">
							<i class="far fa-id-badge"></i>&nbsp;Perfil
						</small>
					</ion-label>
				</ion-item>

				<ion-item v-if="user.rol === 2 && showModal" class="w-100 justify-content-center align-content-center" expand="block" full>
					<ion-select expand="block" class="w-100" placeholder="Seleccionar " v-model="newProfile" full on>
						<ion-select-option value="1">Primer año</ion-select-option>
						<ion-select-option value="2">Segundo año</ion-select-option>
						<ion-select-option value="3">Tercer año</ion-select-option>
						<ion-select-option value="4">Cuarto año</ion-select-option>
						<ion-select-option value="5">Quinto año</ion-select-option>
						<ion-select-option value="6">Egresado</ion-select-option>

					</ion-select>
				</ion-item>						
						

				<ion-button class="mt-2" v-if="!showModal" expand="block" full color="success" @click="setShowModal(true)" fill="outline">
					<ion-icon name="create-outline"></ion-icon>EDITAR PERFIL
				</ion-button>
				<ion-button v-if="showModal" class="mt-2" expand="block" full color="success" @click="updateProfile()" :disabled="loading">
					<ion-icon name="create-outline"></ion-icon>GUARDAR CAMBIOS
				</ion-button>

				<ion-button class="mt-4" expand="block" color="primary" @click="signout()">
					<ion-icon name="bag-add-outline"></ion-icon>CERRAR SESIÓN
				</ion-button>

			</ion-card-content>
		</ion-card>

		<ion-modal :is-open="false">
			<ion-header>
				<ion-toolbar>
					<ion-title>Editar Perfil 2</ion-title>
					<ion-buttons slot="end">
						<ion-button @click="setShowModal(false)">
							<ion-icon slot="icon-only" name="close"></ion-icon>
						</ion-button>
					</ion-buttons>
				</ion-toolbar>
			</ion-header>
			<ion-content class="ion-padding">
				<p>
				Lorem ipsum 
				</p>
			</ion-content>
		</ion-modal>
		
	</ion-content>
</ion-page>

</template>

<script>
	import { IonModal, IonContent } from '@ionic/vue';
	export default {
		components: {
			IonModal,
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
				apiToken: '',
				loading: false
			}
		},
		async created() {
			this.setUser();
			this.apiToken = await this.getApiToken();
		},
		methods: {
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
					this.user.faculty = this.data.user.carrera ? this.data.user.carrera.facultad.nombre : '';
					this.user.collegeCareer = this.data.user.carrera ? this.data.user.carrera.nombre : '';
					// this.user.profileId = data.user.idPerfil ? data.user.idPerfil : '';
					this.newProfile = this.data.user.idPerfil ? this.data.user.idPerfil.toString() : '';
					this.user.idUsuario = this.data.user.idUser;
				}
			},
			setShowModal(value) {
				this.showModal = value;
			},
			async updateProfile(){
				if(this.newProfile === this.data.user.idPerfil.toString()) {
					this.setShowModal(false);
					return;
				}
				this.loading = true;
				const API_ENDOINT = this.getAPIEndpoint();
				const request = await fetch(`${API_ENDOINT}/estudiante/actualizar/perfil`, {
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
					console.log(response)
					localStorage.setItem('user', JSON.stringify(this.data));
					this.setUser();

					this.showSuccessToast('Perfil actualizado correctamente');
					this.loading = false;
				}
				this.setShowModal(false);
			},
		}
	}
</script>