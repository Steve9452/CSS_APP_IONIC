<template>
	<ion-page>
		<ion-content fullscreen>			
			<div style="height: 95%;" class="d-flex flex-column justify-content-between mx-4 mt-3">
				<div>
					<img v-if="user.gender === 'M'" src="/assets/img/male-avatar.jpg" class="img-fluid d-block w-50 my-3 mx-auto">
					<img v-else src="/assets/img/female-avatar.jpg" class="img-fluid d-block w-50 my-3 mx-auto">
					<div class="my-3">
						<h1 class="font-weight-bolder">
							{{ user.fname }} {{ user.lname }}
						</h1>
					</div>
					<div class="my-3">
						<ion-text>
							<small class="d-block text-muted font-weight-bold">
								<i class="fas fa-envelope-open-text"></i>&nbsp;Correo
							</small>
							<p>
								{{ user.email }}
							</p>
						</ion-text>
					</div>

					<div v-if="user.rol === 2">
						<ion-text>
							<small class="d-block text-muted font-weight-bold ">
								<i class="fas fa-university"></i>&nbsp;Facultad
							</small>
							<p>
								{{ user.faculty }}
							</p>
						</ion-text>
					</div>

					<div v-if="user.rol === 2">
						<ion-text>
							<small class="d-block text-muted font-weight-bold ">
								<i class="fas fa-graduation-cap"></i>&nbsp;Carrera
							</small>
							<p>
								{{ user.collegeCareer }}
							</p>
						</ion-text>
					</div>

					<div v-if="user.rol === 2 && !showModal">
						<ion-text>
							<small class="d-block text-muted font-weight-bold ">
								<i class="far fa-id-badge"></i>&nbsp;Perfil
							</small>
							<p>
								{{ user.profile }}
							</p>
						</ion-text>
					</div>

					<div v-if="user.rol === 2 && showModal" class="w-100 justify-content-center align-content-center"
						expand="block" full>
						<ion-select expand="block" class="w-100" placeholder="Seleccionar " v-model="newProfile" full
							on>
							<ion-select-option value="1">Primer año</ion-select-option>
							<ion-select-option value="2">Segundo año</ion-select-option>
							<ion-select-option value="3">Tercer año</ion-select-option>
							<ion-select-option value="4">Cuarto año</ion-select-option>
							<ion-select-option value="5">Quinto año</ion-select-option>
							<ion-select-option value="6">Egresado</ion-select-option>

						</ion-select>
					</div>
					

				</div>

				
				<div>
					<ion-button class="mt-2" v-if="user.rol === 2 && !showModal" expand="block" full color="tertiary"
					@click="setShowModal(true)" fill="outline">
						Editar perfil
					</ion-button>
					<div class="" v-if="showModal">
						<ion-button class="mt-2" expand="block" color="medium" @click="updateProfile()" :disabled="loading">
							Cambiar
						</ion-button>
						<ion-button class="mt-2" expand="block" color="tertiary" @click="cancelUpdateProfile()" fill="outline" :disabled="loading">
							Cancelar
						</ion-button>
					</div>
					<ion-button class="mt-4" expand="block" color="primary" @click="signMeOut()">
							Cerrar sesion
					</ion-button>
				</div>
			</div>
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
			data: {},
			user: {
				fname: '',
				lname: '',
				gender: 'F',
				rol: '',
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
		await this.setUser();
		this.apiToken = await this.getApiToken();
	},
	methods: {
		async signMeOut() {
			await this.signout()
			this.$router.push("/login")
		},
		async setUser() {
			this.data = await this.getAuthenticatedUser();
			console.log("data from local storage")
			console.log(this.data)
			if (this.data) {
				this.user.fname = this.data.nombres;
				this.user.lname = this.data.apellidos;
				this.user.gender = this.data.genero;
				this.user.rol = this.data.rol.idRol;
				this.user.email = this.data.correo;
				this.user.profile = this.data.perfil ? this.data.perfil.descripcion : '';
				this.user.faculty = this.data.carrera ? this.data.carrera.facultad.nombre : '';
				this.user.collegeCareer = this.data.carrera ? this.data.carrera.nombre : '';
				// this.user.profileId = data.idPerfil ? data.idPerfil : '';
				this.newProfile = this.data.idPerfil ? this.data.idPerfil.toString() : '';
				this.user.idUsuario = this.data.idUser;
			}
		},
		setShowModal(value) {
			this.showModal = value;
		},
		async cancelUpdateProfile() {
			this.setShowModal(false);
			return;
		},
		async updateProfile() {
			if (this.newProfile === this.data.idPerfil.toString()) {
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
			if (response) {
				this.showModal = false;
				this.data.idPerfil = parseInt(response.idPerfil) ? parseInt(response.idPerfil) : 1;
				this.data.perfil = response.perfil;
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